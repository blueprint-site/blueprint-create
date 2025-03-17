// src/hooks/useDependencyProcessor.ts
import { useMemo } from 'react';
import { AddonVersion } from '@/components/features/addons/addon-details/sections/AddonVersionCompatibility';

export const useDependencyProcessor = () => {
  // Get Create mod dependencies
  const getCreateDependencies = useMemo(() => {
    return (version: AddonVersion) => {
      // Use the actual Create mod project IDs from Modrinth
      const CREATE_FORGE_ID = 'LNytGWDc';
      const CREATE_FABRIC_ID = 'Xbc0uyRg';

      return (
        version.dependencies?.filter(
          (dep) => dep.project_id === CREATE_FORGE_ID || dep.project_id === CREATE_FABRIC_ID
        ) || []
      );
    };
  }, []);

  // Helper function to map version IDs to human-readable version numbers
  const mapVersionIdToReadable = useMemo(() => {
    return (versionId: string, modName: string) => {
      // Common Create major versions to look for in strings
      const majorVersions = ['0.4', '0.5', '6.0'];

      // Try to extract a major version pattern from the string
      for (const majorVersion of majorVersions) {
        if (versionId.includes(majorVersion)) {
          // Extract the full version number (e.g. 0.5.1f from something like Create-0.5.1f.jar)
          const versionRegex = new RegExp(`${majorVersion}[\\d\\.\\w-]*`);
          const match = versionRegex.exec(versionId);
          if (match) return match[0];
        }
      }

      // Try more general version extraction if above failed
      // Look for typical version patterns: x.y.z, vx.y.z, etc.
      const versionRegex = /(?:v)?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i;
      const versionMatch = versionRegex.exec(versionId);
      if (versionMatch) return versionMatch[1];

      // For Create Fabric, sometimes version is in the format "for MC x.y.z" rather than Create version
      if (modName.includes('Fabric') && versionId.match(/for MC \d+\.\d+(?:\.\d+)?/)) {
        // If it's a Minecraft version reference, try to guess the Create version based on MC version
        const mcMatch = versionId.match(/for MC (\d+\.\d+(?:\.\d+)?)/);
        if (mcMatch) {
          const mcVersion = mcMatch[1];
          // Map Minecraft versions to likely Create Fabric versions
          if (mcVersion.startsWith('1.20')) return '0.5';
          if (mcVersion.startsWith('1.19')) return '0.5';
          if (mcVersion.startsWith('1.18')) return '0.4';
          return '0.5'; // Default to latest stable for unknown
        }
      }

      // If we still can't figure it out, return the original ID but truncated if it's very long
      return versionId.length > 15 ? `${versionId.substring(0, 12)}...` : versionId;
    };
  }, []);

  return {
    getCreateDependencies,
    mapVersionIdToReadable,
  };
};
