// src/hooks/useVersionProcessor.ts
import { useMemo } from 'react';
import { AddonVersion } from '@/components/features/addons/addon-details/sections/AddonVersionCompatibility';
import { VersionInfo, VersionProcessorProps } from '@/types/addons/addon-details';
import { ModrinthVersions } from '@/api/endpoints/useModrinth';

/**
 * Normalizes a Create version to one of the major compatibility versions (0.4, 0.5, 6.0)
 */
export const normalizeCreateVersion = (version: string): string => {
  if (version.startsWith('0.4')) return '0.4';
  if (version.startsWith('0.5')) return '0.5';
  if (version.startsWith('6.0') || version.startsWith('6')) return '6.0';
  return version;
};

/**
 * Hook for display component - formats and processes versions for display
 */
export function useDisplayVersionProcessor({
  versions,
  minecraftVersions,
  loaders,
  createVersions = [],
}: {
  versions: AddonVersion[];
  minecraftVersions: string[];
  loaders: string[];
  createVersions?: string[];
}) {
  // Filter out any non-Minecraft version strings
  const filteredMinecraftVersions = useMemo(() => {
    return minecraftVersions.filter((version) =>
      // Most Minecraft versions follow patterns like: 1.20.1, 1.16.5, etc.
      /^\d+\.\d+(\.\d+)?$/.test(version)
    );
  }, [minecraftVersions]);

  // Get unique loaders from the passed data
  const uniqueLoaders = useMemo(() => {
    return [...new Set(loaders.map((loader) => loader.toLowerCase()))];
  }, [loaders]);

  // Process and normalize the Create versions
  const uniqueCreateVersions = useMemo(() => {
    // First normalize all versions to the major Create versions we care about (0.4, 0.5, 6.0)
    const normalizedVersions = createVersions.map((version) => {
      // Try to extract a semantic version
      const versionMatch = version.match(/(?:v)?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i);
      const extractedVersion = versionMatch ? versionMatch[1] : version;
      // Normalize to major version
      return normalizeCreateVersion(extractedVersion);
    });

    // Filter out duplicate versions and ensure they're valid
    const uniqueVersions = [...new Set(normalizedVersions)].filter((v) =>
      // Keep only versions that match semantic versioning pattern
      /^\d+\.\d+(?:\.\d+)?[a-z0-9-]*$/.test(v)
    );

    // Sort versions in descending order for better display
    return uniqueVersions.sort((a, b) => {
      // First compare major versions
      const majorA = parseInt(a.split('.')[0]);
      const majorB = parseInt(b.split('.')[0]);
      if (majorA !== majorB) return majorB - majorA;

      // Then compare minor versions
      const minorA = parseInt(a.split('.')[1]);
      const minorB = parseInt(b.split('.')[1]);
      if (minorA !== minorB) return majorB < 1 ? minorA - minorB : minorB - minorA; // Special logic for 0.x vs 6.x

      // Then compare patch versions if they exist
      const patchA = (() => {
        const match = /^(\d+)/.exec(a.split('.')[2] ?? '');
        return match ? match[1] : '0';
      })();
      const patchBMatch = /^(\d+)/.exec(b.split('.')[2] ?? '');
      const patchB = patchBMatch ? patchBMatch[1] : '0';
      return parseInt(patchB) - parseInt(patchA);
    });
  }, [createVersions]);

  // Sort versions from newest to oldest
  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => {
      const dateA = new Date(a.date_published);
      const dateB = new Date(b.date_published);
      return dateB.getTime() - dateA.getTime();
    });
  }, [versions]);

  // Get featured or latest version
  const featuredVersion = useMemo(() => {
    return sortedVersions.find((v) => v.is_featured) || sortedVersions[0];
  }, [sortedVersions]);

  // Helper function to determine if a specific MC version is compatible with a certain loader
  const isCompatible = useMemo(() => {
    return (mcVersion: string, loader: string) => {
      return versions.some(
        (version) => version.game_versions.includes(mcVersion) && version.loaders.includes(loader)
      );
    };
  }, [versions]);

  return {
    filteredMinecraftVersions,
    uniqueLoaders,
    uniqueCreateVersions,
    sortedVersions,
    featuredVersion,
    isCompatible,
  };
}

/**
 * Hook that processes version information from Modrinth API data
 */
export function useModrinthVersionProcessor({
  versionInfoData,
  allGameVersions = new Set(),
}: VersionProcessorProps): VersionInfo | null {
  // Process version information
  return useMemo((): VersionInfo | null => {
    // Handle the case where we have no data or no versions
    if (!versionInfoData || !versionInfoData.versions) return null;

    // Known project IDs for Create mod - these are the actual IDs from Modrinth
    const CREATE_FORGE_ID = 'LNytGWDc'; // Create mod Forge project ID on Modrinth
    const CREATE_FABRIC_ID = 'Xbc0uyRg'; // Create Fabric project ID on Modrinth

    // Initialize the createVersionMap at the beginning
    // Unused map removed

    // Map the versions to the format AddonVersionCompatibility expects
    const formattedVersions = versionInfoData.versions.map((version: ModrinthVersions) => {
      return {
        id: version.id,
        name: version.name,
        version_number: version.version_number,
        game_versions: version.game_versions,
        loaders: version.loaders,
        dependencies: version.dependencies?.map((dep) => {
          // Look for dependency information from dependencies data
          const dependencyInfo = Array.isArray(versionInfoData.dependencies?.projects)
            ? versionInfoData.dependencies.projects.find(
                (p: { id: string }) => p.id === dep.project_id
              )
            : undefined;

          return {
            project_id: dep.project_id,
            version_id: dep.version_id,
            dependency_type: dep.dependency_type,
            name: dependencyInfo?.title ?? undefined,
            slug: dependencyInfo?.slug ?? undefined,
          };
        }),
        date_published: version.date_published,
        is_featured: version.featured,
      };
    });

    // Get all game versions from all versions
    const gameVersions = new Set<string>(allGameVersions);
    versionInfoData.versions.forEach((version: ModrinthVersions) => {
      version.game_versions.forEach((gameVersion) => {
        if (/^\d+\.\d+(\.\d+)?$/.test(gameVersion)) {
          gameVersions.add(gameVersion);
        }
      });
    });

    // Extract Create version information
    const extractedCreateVersions: string[] = [];

    // Process dependencies from all versions to find Create versions
    versionInfoData.versions.forEach((version: ModrinthVersions) => {
      if (version.dependencies) {
        version.dependencies.forEach((dep) => {
          // Check if it's a Create dependency
          if (dep.project_id === CREATE_FORGE_ID || dep.project_id === CREATE_FABRIC_ID) {
            // First check for Create version in the version name
            let createVersion: string | null = null;

            // Try to extract standard version patterns from the version name or number
            // Looking for patterns like: Create 0.5.1, Create v0.5.1, 0.5.1f, etc.
            const standardPatterns = [
              // Match "Create 0.5.1" or "Create-0.5.1"
              /Create[- ]v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
              // Match just the version pattern "0.5.1"
              /\b(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)\b/,
            ];

            for (const pattern of standardPatterns) {
              const nameMatch = pattern.exec(version.name);
              const versionMatch = pattern.exec(version.version_number);

              if (nameMatch) {
                createVersion = nameMatch[1];
                break;
              } else if (versionMatch) {
                createVersion = versionMatch[1];
                break;
              }
            }

            // If we still haven't found a version, try to extract from version_id
            if (!createVersion && dep.version_id) {
              // First check for known major versions in the version_id
              const majorVersions = ['0.4', '0.5', '6.0'];

              for (const majorVersion of majorVersions) {
                if (dep.version_id.includes(majorVersion)) {
                  const versionRegex = new RegExp(`${majorVersion}[\\d\\.\\w-]*`);
                  const match = versionRegex.exec(dep.version_id);
                  if (match) {
                    createVersion = match[0];
                    break;
                  }
                }
              }

              // If still not found, try a more general pattern
              if (!createVersion) {
                const versionMatch = /(?:v)?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i.exec(dep.version_id);
                if (versionMatch) {
                  createVersion = versionMatch[1];
                }
              }
            }

            // If we found a version, add it to our collection
            if (createVersion) {
              // Normalize the version (strip "v" prefix if present)
              createVersion = createVersion.replace(/^v/i, '');

              // Only add versions that match our expected format and normalize to major version
              if (/^\d+\.\d+(?:\.\d+)?[a-z0-9-]*$/.test(createVersion)) {
                extractedCreateVersions.push(normalizeCreateVersion(createVersion));
              }
            }
          }
        });
      }
    });

    // Check if we have direct Create dependencies in the version data
    versionInfoData.versions.forEach((version: ModrinthVersions) => {
      if (version.dependencies) {
        version.dependencies.forEach((dep) => {
          if (dep.project_id === CREATE_FORGE_ID || dep.project_id === CREATE_FABRIC_ID) {
            // Get the loader type for this version (using directly when needed)

            // Try to extract Create version from various sources
            let createVersion: string | null = null;

            // Try to extract from version name first
            const versionNamePatterns = [
              /Create[- ]v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
              /\b(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)\b/,
            ];

            for (const pattern of versionNamePatterns) {
              const match = pattern.exec(version.name) || pattern.exec(version.version_number);
              if (match && match[1]) {
                createVersion = match[1].replace(/^v/i, '');
                break;
              }
            }

            // If not found in the version name, try the dependency version_id
            if (!createVersion && dep.version_id) {
              // Check for major versions in the id
              const majorVersions = ['0.4', '0.5', '6.0'];
              for (const majorVersion of majorVersions) {
                if (dep.version_id.includes(majorVersion)) {
                  const match = new RegExp(`${majorVersion}[\\d\\.\\w-]*`).exec(dep.version_id);
                  if (match) {
                    createVersion = match[0];
                    break;
                  }
                }
              }

              // If we still don't have a match, try general version pattern
              if (!createVersion) {
                const match = /(?:v)?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i.exec(dep.version_id);
                if (match) createVersion = match[1].replace(/^v/i, '');
              }
            }

            // If we found a Create version, normalize it and add to our collection
            if (createVersion && /^\d+\.\d+(?:\.\d+)?[a-z0-9-]*$/.test(createVersion)) {
              // Normalize to major version
              const normalizedVersion = normalizeCreateVersion(createVersion);
              extractedCreateVersions.push(normalizedVersion);
            }
          }
        });
      }
    });

    // If no versions were detected, try to infer based on Minecraft versions
    if (extractedCreateVersions.length === 0) {
      // Check which Minecraft versions this addon supports to guess Create versions
      const mcVersions = Array.from(gameVersions);

      if (mcVersions.some((v) => v.startsWith('1.20'))) {
        extractedCreateVersions.push('0.5');
      }
      if (mcVersions.some((v) => v.startsWith('1.19'))) {
        extractedCreateVersions.push('0.5');
      }
      if (mcVersions.some((v) => v.startsWith('1.18'))) {
        extractedCreateVersions.push('0.4');
      }
      if (mcVersions.some((v) => v.startsWith('1.21'))) {
        extractedCreateVersions.push('6.0');
      }
      // Note: For Minecraft 1.16-1.17, no specific Create version to map to

      // If no versions were identified, use the standard major versions
      if (extractedCreateVersions.length === 0) {
        extractedCreateVersions.push('0.4', '0.5', '6.0');
      }
    }

    // Remove duplicates - we've already normalized the versions, so we just need to deduplicate
    const uniqueCreateVersions = [...new Set(extractedCreateVersions)]
      .filter((v) => /^\d+\.\d+(?:\.\d+)?[a-z0-9-]*$/.test(v))
      .sort((a, b) => {
        // Compare major version first
        const majorA = parseInt(a.split('.')[0]);
        const majorB = parseInt(b.split('.')[0]);
        if (majorA !== majorB) return majorB - majorA;

        // Compare minor version
        const minorA = parseInt(a.split('.')[1]);
        const minorB = parseInt(b.split('.')[1]);
        if (minorA !== minorB) return majorB < 1 ? minorA - minorB : minorB - minorA; // Special logic for 0.x vs 6.x

        // Compare patch version if available
        const patchA = a.split('.')[2]?.match(/^(\d+)/)?.[1] ?? '0';
        const patchB = b.split('.')[2]?.match(/^(\d+)/)?.[1] ?? '0';
        return parseInt(patchB) - parseInt(patchA);
      });

    return {
      versions: formattedVersions,
      createVersions: uniqueCreateVersions,
      game_versions: Array.from(gameVersions),
    };
  }, [versionInfoData, allGameVersions]);
}

/**
 * Backward compatibility API - for existing components using the old hooks
 * Uses both processors but only returns the relevant results based on input format
 */
export function useVersionProcessor(props: {
  versionInfoData?: {
    dependencies?: Record<string, unknown>;
    versions?: ModrinthVersions[] | null;
    createVersions?: string[];
  } | null;
  versions?: AddonVersion[];
  minecraftVersions?: string[];
  loaders?: string[];
  createVersions?: string[];
  allGameVersions?: Set<string>;
}) {
  // Always call both hooks to maintain hook order consistency
  const modrinthResult = useModrinthVersionProcessor({
    versionInfoData: props.versionInfoData,
    allGameVersions: props.allGameVersions || new Set(),
  });

  const displayResult = useDisplayVersionProcessor({
    versions: props.versions || [],
    minecraftVersions: props.minecraftVersions || [],
    loaders: props.loaders || [],
    createVersions: props.createVersions || [],
  });

  // Return the appropriate result based on which props were passed
  return 'versionInfoData' in props ? modrinthResult : displayResult;
}
