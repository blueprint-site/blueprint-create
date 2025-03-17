// src/hooks/useAddonData.tsx

import { useMemo } from 'react';
import { useFetchAddon } from '@/api';
import {
  useModrinthProject,
  useModrinthVersionInfo,
  ModrinthVersions,
} from '@/api/endpoints/useModrinth';
import { Addon } from '@/types/addons/addon-details';
import { ModrinthProject, ModrinthDependenciesResponse } from '@/types/addons/modrinth';

/**
 * Integrated addon data with properly nested structure
 */
export interface IntegratedAddonData extends Addon {
  modrinth?: {
    project: ModrinthProject | null;
    versions: ModrinthVersions[] | null;
    dependencies: ModrinthDependenciesResponse | null;
  };
}

/**
 * Enhanced hook that fetches and normalizes all addon data
 *
 * This hook:
 * 1. Fetches the basic addon data from Appwrite
 * 2. Parses the raw Modrinth data
 * 3. Fetches additional Modrinth data (project and versions)
 * 4. Returns a properly structured object with all data
 */
export function useAddonData(slug?: string) {
  // Fetch basic addon data from Appwrite
  const { data: addonData, isLoading: isLoadingAddon, error: addonError } = useFetchAddon(slug);

  // Parse the raw Modrinth data (only once)
  const { modrinthIdentifier } = useMemo(() => {
    if (!addonData?.modrinth_raw) {
      return { modrinthIdentifier: null };
    }

    // Parse the raw data if it's a string
    let parsedData = null;
    if (typeof addonData.modrinth_raw === 'string') {
      try {
        parsedData = JSON.parse(addonData.modrinth_raw);
      } catch (e) {
        console.error('Error parsing Modrinth data:', e);
        return { modrinthData: null, modrinthIdentifier: null };
      }
    } else {
      parsedData = addonData.modrinth_raw;
    }

    // Extract the identifier for API calls
    const identifier = parsedData?.project_id || parsedData?.id || parsedData?.slug;

    return { modrinthIdentifier: identifier };
  }, [addonData]);

  // Fetch additional Modrinth data if we have an identifier
  const { data: modrinthProject, isLoading: isLoadingProject } =
    useModrinthProject(modrinthIdentifier);

  const { data: versionInfo, isLoading: isLoadingVersions } =
    useModrinthVersionInfo(modrinthIdentifier);

  // Get game versions from addon data
  const gameVersions = useMemo(() => {
    const versions = new Set<string>();
    addonData?.minecraft_versions?.forEach((version: string) => {
      if (/^\d+\.\d+(\.\d+)?$/.test(version)) {
        versions.add(version);
      }
    });
    return versions;
  }, [addonData]);

  // Build the integrated data structure
  const integratedData: IntegratedAddonData | null = useMemo(() => {
    if (!addonData) return null;

    // Create the base addon with null safety
    const baseAddon: IntegratedAddonData = {
      ...addonData,
      // Ensure these are never null
      minecraft_versions: addonData.minecraft_versions || [],
      loaders: addonData.loaders || [],
      categories: addonData.categories || [],
    };

    // Add the Modrinth data if available
    if (modrinthIdentifier) {
      baseAddon.modrinth = {
        project: modrinthProject,
        versions: versionInfo?.versions || null,
        dependencies: versionInfo?.dependencies
          ? {
              projects: Array.isArray(versionInfo.dependencies)
                ? versionInfo.dependencies
                : versionInfo.dependencies.projects || [],
            }
          : null,
      };
    }

    return baseAddon;
  }, [addonData, modrinthProject, versionInfo, modrinthIdentifier]);

  // Calculate overall loading state
  const isLoading =
    isLoadingAddon || (!!modrinthIdentifier && (isLoadingProject || isLoadingVersions));

  return {
    data: integratedData,
    isLoading,
    error: addonError,
    gameVersions,
  };
}
