// src/hooks/useCreateVersionProcessor.tsx

import { useMemo } from 'react';
import { IntegratedAddonData } from '@/hooks/useAddonData';
import { VersionInfo, AddonVersion } from '@/types/addons/addon-details';
import { ModrinthDependenciesResponse, ModrinthDependencyProject } from '@/types/addons/modrinth';
import { getAddonCreateCompatibility } from '@/utils/createCompatibility';
// import { sortVersions, filterValidVersions } from '@/data/createVersions';

/**
 * Get dependency projects from response data
 */
const getDependencyProjects = (
  dependencyData:
    | ModrinthDependenciesResponse
    | ModrinthDependencyProject[]
    | Record<string, unknown>
    | null
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
    | null,
  projectId: string
): ModrinthDependencyProject | undefined => {
  if (!dependencies) return undefined;

  const projects = getDependencyProjects(dependencies);
  return projects.find((p) => p.id === projectId);
};

/**
 * Simplified version processing hook that works directly with the integrated data structure
 */
export function useVersionProcessor(addon: IntegratedAddonData | null, gameVersions?: Set<string>) {
  return useMemo((): VersionInfo | null => {
    if (!addon) return null;

    // Get the Modrinth versions or return empty results if none available
    const modrinthVersions = addon.modrinth?.versions ?? [];
    if (!modrinthVersions.length) {
      return {
        versions: [],
        createVersions: [],
        game_versions: Array.from(gameVersions || []),
      };
    }

    // Format versions for the UI
    const formattedVersions: AddonVersion[] = modrinthVersions.map((version) => ({
      id: version.id,
      name: version.name,
      version_number: version.version_number,
      game_versions: version.game_versions,
      loaders: version.loaders,
      dependencies: version.dependencies?.map((dep) => {
        // Find dependency info from projects
        const dependencyInfo = findDependencyProject(addon.modrinth?.dependencies, dep.project_id);

        return {
          project_id: dep.project_id,
          version_id: dep.version_id || undefined,
          dependency_type: dep.dependency_type,
          name: dependencyInfo?.title,
          slug: dependencyInfo?.slug,
        };
      }),
      date_published: version.date_published,
      is_featured: version.featured,
    }));

    // Collect all game versions from the addon versions
    const allGameVersions = new Set<string>(gameVersions || []);
    modrinthVersions.forEach((version) => {
      version.game_versions.forEach((gameVersion) => {
        if (/^\d+\.\d+(\.\d+)?$/.test(gameVersion)) {
          allGameVersions.add(gameVersion);
        }
      });
    });

    // Use the dedicated Create compatibility function to get standardized Create versions
    const createVersions = getAddonCreateCompatibility(addon);

    return {
      versions: formattedVersions,
      createVersions: createVersions,
      game_versions: Array.from(allGameVersions),
    };
  }, [addon, gameVersions]);
}

/**
 * Hook for version display features like filtering, sorting, etc.
 */
export function useVersionDisplay(versionInfo: VersionInfo | null, loaders: string[] = []) {
  return useMemo(() => {
    if (!versionInfo) {
      return {
        filteredMinecraftVersions: [],
        uniqueLoaders: [],
        uniqueCreateVersions: [],
        sortedVersions: [],
        featuredVersion: null,
        isCompatible: () => false,
      };
    }

    // Filter valid Minecraft versions
    const filteredMinecraftVersions =
      versionInfo.game_versions?.filter((version) => /^\d+\.\d+(\.\d+)?$/.test(version)) || [];

    // Get unique loaders
    const uniqueLoaders = [...new Set(loaders.map((loader) => loader.toLowerCase()))];

    // Sort versions by date
    const sortedVersions = [...versionInfo.versions].sort((a, b) => {
      return new Date(b.date_published).getTime() - new Date(a.date_published).getTime();
    });

    // Get featured version
    const featuredVersion = sortedVersions.find((v) => v.is_featured) || sortedVersions[0] || null;

    // Compatibility checker function
    const isCompatible = (mcVersion: string, loader: string) => {
      return versionInfo.versions.some(
        (version) => version.game_versions.includes(mcVersion) && version.loaders.includes(loader)
      );
    };

    return {
      filteredMinecraftVersions,
      uniqueLoaders,
      uniqueCreateVersions: versionInfo.createVersions,
      sortedVersions,
      featuredVersion,
      isCompatible,
    };
  }, [versionInfo, loaders]);
}
