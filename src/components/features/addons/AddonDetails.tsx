// src/components/features/addons/AddonDetails.tsx
import { useParams } from 'react-router';

import AddonDetailsError from './addon-details/AddonDetailsError';
import AddonDetailsLoading from './addon-details/AddonDetailsLoading';
import AddonDetailsView from './addon-details/AddonDetailsView';

import {
  useFetchAddonBySlug,
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
} from '@/api';

import type { IntegratedAddonData } from '@/types';
import { getAddonCreateVersionsFromVersions } from '@/utils/createCompatibility';

export default function AddonDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { data: addon, isLoading: isLoadingAddon, error: errorAddon } = useFetchAddonBySlug(slug);

  const {
    data: modrinthProject,
    isLoading: isLoadingModrinth,
    error: errorModrinth,
  } = useFetchModrinthProject(slug);

  const {
    data: versions,
    isLoading: isLoadingVersions,
    error: errorVersions,
  } = useFetchModrinthVersions(slug);

  const {
    data: dependencies,
    isLoading: isLoadingDependencies,
    error: errorDependencies,
  } = useFetchModrinthDependencies(slug);

  const error = errorAddon || errorModrinth || errorVersions || errorDependencies;

  if (error) return <AddonDetailsError error={error} />;

  const isLoading =
    isLoadingAddon || isLoadingModrinth || isLoadingVersions || isLoadingDependencies;

  if (isLoading || !addon || !modrinthProject || !versions || !dependencies) {
    return <AddonDetailsLoading />;
  }

  // Safely parse JSON objects with error handling
  let curseforgeObject = null;
  if (addon.curseforge_raw) {
    try {
      curseforgeObject = JSON.parse(addon.curseforge_raw);
    } catch (error) {
      console.error('Failed to parse curseforge_raw JSON:', error);
      curseforgeObject = null;
    }
  }

  let modrinthObject = null;
  if (addon.modrinth_raw) {
    try {
      // Skip processing if JSON appears to be truncated (exactly 256 chars is suspicious)
      if (addon.modrinth_raw.length === 256) {
        console.warn(
          'AddonDetails: Skipping modrinth_raw parsing - appears to be truncated at 256 characters'
        );
        modrinthObject = null;
      } else if (
        !addon.modrinth_raw.trim().endsWith('}') &&
        !addon.modrinth_raw.trim().endsWith(']')
      ) {
        // Check if the JSON string seems to be truncated
        console.warn('AddonDetails: Modrinth JSON appears to be truncated:', {
          length: addon.modrinth_raw.length,
          ending: addon.modrinth_raw.slice(-50),
        });
        modrinthObject = null;
      } else {
        modrinthObject = JSON.parse(addon.modrinth_raw);
      }
    } catch (error) {
      console.error('Failed to parse modrinth_raw JSON in AddonDetails:', {
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        jsonLength: addon.modrinth_raw.length,
        jsonStart: addon.modrinth_raw.substring(0, 100),
        jsonEnd: addon.modrinth_raw.substring(addon.modrinth_raw.length - 100),
        // Check for common JSON issues
        hasUnterminatedString:
          addon.modrinth_raw.includes('"') && !addon.modrinth_raw.endsWith('"'),
        lastChar: addon.modrinth_raw.slice(-1),
      });
      modrinthObject = null;
    }
  }
  const createVersions = getAddonCreateVersionsFromVersions(versions);

  // Build the integrated data object with proper types
  const data: IntegratedAddonData = {
    ...addon,
    curseforgeObject,
    modrinthObject,
    modrinth: {
      ...modrinthProject,
      versions: versions,
      dependencies: dependencies.projects || [],
    },
  };

  return <AddonDetailsView addon={data} createVersions={createVersions} />;
}
