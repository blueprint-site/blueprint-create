// src/hooks/useAddonDetails.ts

import { useMemo } from 'react';
import { useFetchAddon } from '@/api';
import { useModrinthProject, useModrinthVersionInfo } from '@/api/endpoints/useModrinth';
import {
  ProcessedAddonData,
  AddonVersion,
  ExternalLink,
  DonationLink,
} from '@/types/addons/addon-details';
import { Dependencies } from '@/types/addons/dependencies';
import { ModrinthDependenciesResponse, ModrinthDependencyProject } from '@/types/addons/modrinth';
import { getAddonCreateCompatibility, AddonCompatibilityData } from '@/utils/createCompatibility';

/**
 * Parse JSON safely with error handling
 */
function tryParseJson(jsonString: string | Record<string, unknown> | null) {
  if (!jsonString) return null;

  // If it's already an object, return it
  if (typeof jsonString !== 'string') return jsonString;

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse JSON', e);
    return null;
  }
}

/**
 * Get dependency projects from response data with type safety
 */
const getDependencyProjects = (
  dependencyData:
    | ModrinthDependenciesResponse
    | ModrinthDependencyProject[]
    | Record<string, unknown>
    | null
    | undefined
): ModrinthDependencyProject[] => {
  if (!dependencyData) return [];

  // If it's an array, assume it's already projects
  if (Array.isArray(dependencyData)) {
    return dependencyData as ModrinthDependencyProject[];
  }

  // If it has a projects property that's an array, use that
  if (
    typeof dependencyData === 'object' &&
    'projects' in dependencyData &&
    Array.isArray(dependencyData.projects)
  ) {
    return dependencyData.projects as ModrinthDependencyProject[];
  }

  return [];
};

/**
 * Extract dependency projects for a given dependency ID
 */
const findDependencyProject = (
  dependencies:
    | ModrinthDependenciesResponse
    | ModrinthDependencyProject[]
    | Record<string, unknown>
    | null
    | undefined,
  projectId: string
): ModrinthDependencyProject | undefined => {
  if (!dependencies) return undefined;

  const projects = getDependencyProjects(dependencies);
  return projects.find((p) => p.id === projectId);
};

/**
 * Unified hook that fetches and processes all addon data in one place
 */
export function useAddonDetails(slug?: string) {
  // 1. Fetch basic addon data from Appwrite
  const { data: addonData, isLoading: isLoadingAddon, error } = useFetchAddon(slug);

  // 2. Parse the raw Modrinth and CurseForge data (only once)
  const { modrinthIdentifier, parsedModrinthData, parsedCurseforgeData } = useMemo(() => {
    if (!addonData) {
      return {
        modrinthIdentifier: null,
        parsedModrinthData: null,
        parsedCurseforgeData: null,
      };
    }

    // Parse Modrinth data
    const parsedModrinthData = tryParseJson(addonData.modrinth_raw || null);

    // Extract the identifier for API calls
    const identifier =
      parsedModrinthData?.project_id || parsedModrinthData?.id || parsedModrinthData?.slug;

    // Parse CurseForge data
    const parsedCurseforgeData = tryParseJson(addonData.curseforge_raw || null);

    return {
      modrinthIdentifier: identifier,
      parsedModrinthData,
      parsedCurseforgeData,
    };
  }, [addonData]);

  // 3. Fetch additional Modrinth data if we have an identifier
  const { data: modrinthProject, isLoading: isLoadingProject } = useModrinthProject(
    modrinthIdentifier || null
  );

  const { data: versionInfo, isLoading: isLoadingVersions } = useModrinthVersionInfo(
    modrinthIdentifier || null
  );

  // 4. Process ALL data in one comprehensive step
  const processedData: ProcessedAddonData | null = useMemo(() => {
    if (!addonData) return null;

    // Ensure arrays exist
    const minecraftVersions = addonData.minecraft_versions || [];
    const loaders = addonData.loaders || [];
    const categories = addonData.categories || [];

    // Format the versions for UI display
    const formattedVersions: AddonVersion[] = [];

    // Process Modrinth versions if available
    if (versionInfo?.versions && Array.isArray(versionInfo.versions)) {
      versionInfo.versions.forEach((version) => {
        formattedVersions.push({
          id: version.id,
          name: version.name,
          version_number: version.version_number,
          game_versions: version.game_versions,
          loaders: version.loaders,
          dependencies: version.dependencies?.map((dep) => {
            // Find dependency info from projects
            const dependencyInfo = findDependencyProject(versionInfo.dependencies, dep.project_id);

            return {
              project_id: dep.project_id,
              version_id: dep.version_id ?? undefined,
              dependency_type: dep.dependency_type,
              name: dependencyInfo?.title,
              slug: dependencyInfo?.slug,
            };
          }),
          date_published: version.date_published,
          is_featured: version.featured,
        });
      });
    }

    // Sort versions by date (newest first)
    const sortedVersions = [...formattedVersions].sort((a, b) => {
      return new Date(b.date_published).getTime() - new Date(a.date_published).getTime();
    });

    // Get featured version
    const featuredVersion = sortedVersions.find((v) => v.is_featured) || sortedVersions[0] || null;

    // Extract game versions
    const gameVersions = new Set<string>();

    // Add from addon data
    minecraftVersions.forEach((version) => {
      if (/^\d+\.\d+(\.\d+)?$/.test(version)) {
        gameVersions.add(version);
      }
    });

    // Add from version data
    formattedVersions.forEach((version) => {
      version.game_versions.forEach((gameVersion) => {
        if (/^\d+\.\d+(\.\d+)?$/.test(gameVersion)) {
          gameVersions.add(gameVersion);
        }
      });
    });

    // Compatibility checker function
    const isCompatible = (mcVersion: string, loader: string) => {
      return formattedVersions.some(
        (version) => version.game_versions.includes(mcVersion) && version.loaders.includes(loader)
      );
    };

    // Get Create mod versions
    // Type assertion since addonData structure matches what the function expects
    const createVersions = getAddonCreateCompatibility(addonData as AddonCompatibilityData);
    // Log for debugging
    console.log('Create versions from utility:', createVersions);

    // Calculate total downloads
    const totalDownloads =
      (parsedModrinthData?.downloads || 0) + (parsedCurseforgeData?.downloadCount || 0);

    // Extract gallery images
    const gallery = (() => {
      const galleryArray = parsedModrinthData?.gallery || [];
      if (!Array.isArray(galleryArray) || galleryArray.length === 0) {
        return null;
      }

      // HD images from project data
      const hdImages =
        modrinthProject?.gallery && Array.isArray(modrinthProject.gallery)
          ? modrinthProject.gallery.map(
              (item: { raw_url?: string; url?: string }) => item.raw_url ?? item.url ?? ''
            )
          : undefined;

      return {
        small: galleryArray,
        hd: hdImages,
      };
    })();

    // Extract environment compatibility
    const clientSide =
      parsedModrinthData?.client_side || (modrinthProject?.client_side as string | undefined);

    const serverSide =
      parsedModrinthData?.server_side || (modrinthProject?.server_side as string | undefined);

    // Get donation links
    const donationLinks: DonationLink[] = Array.isArray(modrinthProject?.donation_urls)
      ? modrinthProject.donation_urls.map((link: Record<string, unknown>) => ({
          id: link.id || String(Math.random()),
          platform: link.platform || 'Donate',
          url: link.url || '#',
        }))
      : [];

    // Setup external links
    const links = parsedCurseforgeData?.links || {};

    // Extract link URLs with type safety
    const sourceUrl =
      typeof links === 'object' && links !== null && 'sourceUrl' in links
        ? (links.sourceUrl as string)
        : undefined;

    const issuesUrl =
      typeof links === 'object' && links !== null && 'issuesUrl' in links
        ? (links.issuesUrl as string)
        : undefined;

    const websiteUrl =
      typeof links === 'object' && links !== null && 'websiteUrl' in links
        ? (links.websiteUrl as string)
        : undefined;

    // For external links, store the icon type as a string to avoid React objects in data
    const createLink = (iconType: string, label: string, url?: string) => {
      return url ? { iconType, label, url, id: label.toLowerCase().replace(/\s+/g, '-') } : null;
    };

    const externalLinks = [
      createLink('github', 'Source Code', sourceUrl ?? ''),
      createLink('bug', 'Issue Tracker', issuesUrl ?? ''),
      createLink('globe', 'Website', websiteUrl),
    ].filter((link): link is ExternalLink => link !== null);

    // Available platforms
    const availablePlatforms: string[] = [];
    if (parsedCurseforgeData) availablePlatforms.push('curseforge');
    if (parsedModrinthData) availablePlatforms.push('modrinth');

    // Extract dependencies
    const dependencies = modrinthProject?.dependencies || null;

    // Format body content
    const bodyContent = modrinthProject?.body as string | undefined;

    // Return the fully processed data structure
    return {
      basic: {
        id: addonData.$id,
        name: addonData.name,
        description: addonData.description || '',
        slug: addonData.slug,
        icon: addonData.icon || '',
        created_at: addonData.created_at,
        updated_at: addonData.updated_at,
        categories: categories,
        loaders: loaders,
      },

      versions: {
        minecraft: Array.from(gameVersions),
        create: createVersions,
        loaders: loaders,
        all: formattedVersions,
        featured: featuredVersion,
        compatibility: {
          isCompatible,
        },
      },

      gallery,

      metadata: {
        downloads: totalDownloads,
        follows: parsedModrinthData?.follows || 0,
        clientSide,
        serverSide,
        bodyContent,
        availablePlatforms,
      },

      links: {
        external: externalLinks,
        donation: donationLinks,
      },

      dependencies: dependencies as unknown as Dependencies | null,
    };
  }, [addonData, modrinthProject, versionInfo, parsedModrinthData, parsedCurseforgeData]);

  // Calculate overall loading state
  const isLoading =
    isLoadingAddon || (!!modrinthIdentifier && (isLoadingProject || isLoadingVersions));

  return {
    data: processedData,
    isLoading,
    error,
  };
}
