// src/hooks/useDependencyProcessor.ts
import { useMemo } from 'react';
import { AddonVersion } from '@/types/addons/addon-details';
import {
  CREATE_MOD_IDS,
  createForgeVersionMap,
  createFabricVersionMap,
} from '@/data/createVersions';
import { extractCreateVersionFromText } from '@/utils/createCompatibility';

/**
 * Hook for processing Create mod dependencies for version detail display
 *
 * Note: This hook is specifically for the version details view.
 * For computing overall addon Create compatibility, use
 * getAddonCreateVersionsFromVersions() from utils/createCompatibility.ts
 */
export const useDependencyProcessor = () => {
  /**
   * Returns Create mod dependencies from a version's dependency list
   */
  const getCreateDependencies = useMemo(() => {
    return (version: AddonVersion) => {
      return (
        version.dependencies?.filter(
          (dep) =>
            dep.project_id === CREATE_MOD_IDS.FORGE || dep.project_id === CREATE_MOD_IDS.FABRIC
        ) || []
      );
    };
  }, []);

  /**
   * Maps a version ID to a human-readable Create version number
   * Used for displaying dependency information in the UI
   */
  const mapVersionIdToReadable = useMemo(() => {
    return (versionId: string, modName: string) => {
      // First try the direct version mappings
      if (modName.includes('Fabric')) {
        if (versionId in createFabricVersionMap) {
          return createFabricVersionMap[versionId as keyof typeof createFabricVersionMap];
        }
      } else if (versionId in createForgeVersionMap) {
        return createForgeVersionMap[versionId as keyof typeof createForgeVersionMap];
      }

      // If no direct mapping, try to extract from the version ID
      const extractedVersion = extractCreateVersionFromText(versionId);
      if (extractedVersion) {
        return extractedVersion;
      }

      // Fallback: just use a truncated version of the raw ID
      return versionId.length > 15 ? `${versionId.substring(0, 12)}...` : versionId;
    };
  }, []);

  return {
    getCreateDependencies,
    mapVersionIdToReadable,
  };
};
