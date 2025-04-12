import {
  CREATE_MOD_IDS,
  CREATE_VERSION_PATTERNS,
  MINECRAFT_TO_CREATE_VERSIONS,
  createForgeVersionMap,
  createFabricVersionMap,
} from '@/data/createVersions';

import type { AddonCompatibilityData, AddonDependency, AddonVersion } from '@/types';
import type { ModrinthVersionDependency } from '@/types';

/**
 * Helper function to check if a version ID is valid and get its normalized Create version
 */
function getCreateVersionFromMap(
  versionId: string | null | undefined,
  versionMap: Record<string, string>
): string | null {
  if (!versionId || typeof versionId !== 'string') return null;
  return versionMap[versionId] || null;
}

/**
 * Determines Create mod compatibility versions for an addon from version dependencies
 * @param dependencies Array of version dependencies
 * @returns Array of normalized Create version strings (e.g. ["0.5", "6.0"])
 */
export function getAddonCreateVersionsFromDependencies(
  dependencies: ModrinthVersionDependency[] = []
): string[] {
  if (!dependencies || !Array.isArray(dependencies)) return [];

  const createVersions = new Set<string>();

  for (const dependency of dependencies) {
    // Check for Create Forge dependency
    if (dependency.project_id === CREATE_MOD_IDS.FORGE) {
      const version = getCreateVersionFromMap(dependency.version_id, createForgeVersionMap);
      if (version) createVersions.add(version);
    }

    // Check for Create Fabric dependency
    if (dependency.project_id === CREATE_MOD_IDS.FABRIC) {
      const version = getCreateVersionFromMap(dependency.version_id, createFabricVersionMap);
      if (version) createVersions.add(version);
    }
  }

  return Array.from(createVersions).sort((a, b) => a.localeCompare(b));
}

/**
 * Determines Create mod compatibility versions for an addon by examining versions
 * @param versions Array of addon versions with dependencies
 * @returns Array of normalized Create version strings (e.g. ["0.5", "6.0"])
 */
export function getAddonCreateVersionsFromVersions(versions: AddonVersion[] = []): string[] {
  if (!versions || !Array.isArray(versions) || versions.length === 0) return [];

  const createVersions = new Set<string>();

  // Check dependencies in all versions
  for (const version of versions) {
    if (version.dependencies && version.dependencies.length > 0) {
      const versionCompatibility = getAddonCreateVersionsFromDependencies(version.dependencies);
      versionCompatibility.forEach((v) => createVersions.add(v));
    }
  }

  // If no direct dependency found, fall back to Minecraft version mapping
  if (createVersions.size === 0) {
    // Collect all Minecraft versions
    const allGameVersions = new Set<string>();
    versions.forEach((v) => v.game_versions.forEach((gv) => allGameVersions.add(gv)));

    // Map Minecraft versions to Create versions
    Array.from(allGameVersions).forEach((mcVersion) => {
      const compatVersions = MINECRAFT_TO_CREATE_VERSIONS[mcVersion];
      if (compatVersions) {
        compatVersions.forEach((v) => createVersions.add(v));
      }
    });
  }

  return Array.from(createVersions).sort((a, b) => a.localeCompare(b));
}

/**
 * Determines Create mod compatibility versions for an addon
 * Uses a multi-step approach:
 * 1. Checks for direct Create mod dependencies in versions
 * 2. Uses Minecraft version compatibility to determine Create versions
 * 3. Falls back to text extraction if needed
 *
 * @param addon The addon data object
 * @param versions Optional array of addon versions with dependencies
 * @returns Array of normalized Create version strings (e.g. ["0.5", "6.0"])
 */
export function getAddonCreateCompatibility(
  addon: AddonCompatibilityData,
  versions?: AddonVersion[]
): string[] {
  if (!addon) return [];

  const createVersions = new Set<string>();

  // STEP 1: Check for specific version dependencies if versions are provided
  if (versions && versions.length > 0) {
    const versionCompatibility = getAddonCreateVersionsFromVersions(versions);
    versionCompatibility.forEach((v) => createVersions.add(v));
  }

  // STEP 2: If no versions found and we have addon dependencies, use them
  if (createVersions.size === 0 && addon.dependencies && addon.dependencies.length > 0) {
    // Check if there's a direct dependency on Create
    const hasCreateDependency = addon.dependencies.some(
      (dep: AddonDependency) =>
        dep.project_id === CREATE_MOD_IDS.FORGE || dep.project_id === CREATE_MOD_IDS.FABRIC
    );

    if (hasCreateDependency && Array.isArray(addon.minecraft_versions)) {
      // Use Minecraft versions to infer Create versions
      addon.minecraft_versions.forEach((mcVersion: string) => {
        const compatVersions = MINECRAFT_TO_CREATE_VERSIONS[mcVersion];
        if (compatVersions) {
          compatVersions.forEach((version) => createVersions.add(version));
        }
      });
    }
  }

  // STEP 3: If still no versions found, try to extract from name/description
  if (createVersions.size === 0) {
    const combinedText = [addon.name ?? '', addon.description ?? ''].join(' ');

    // Try to extract Create version mention
    const extractedVersion = extractCreateVersionFromText(combinedText);
    if (extractedVersion) {
      createVersions.add(extractedVersion);
    }
  }

  return Array.from(createVersions);
}

/**
 * Normalizes a Create version string to one of the standardized versions
 * For example: "0.5.1" -> "0.5", "6.0.3" -> "6.0"
 */
export function normalizeCreateVersion(version: string): string {
  const cleanVersion = version.replace(/^v/i, '');

  if (cleanVersion.startsWith('0.3')) return '0.3';
  if (cleanVersion.startsWith('0.4')) return '0.4';
  if (cleanVersion.startsWith('0.5')) return '0.5';
  if (cleanVersion.startsWith('6')) return '6.0';

  // If no match, return as-is
  return cleanVersion;
}

/**
 * Extracts Create version number from text using various patterns
 */
export function extractCreateVersionFromText(text: string): string | null {
  if (!text) return null;

  // Try all the specific Create version patterns first
  for (const pattern of CREATE_VERSION_PATTERNS) {
    const match = pattern.exec(text);
    if (match?.[1]) {
      return normalizeCreateVersion(match[1]);
    }
  }

  // Generic version pattern as fallback
  const genericPattern = /\b(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)\b/;
  const match = genericPattern.exec(text);
  if (match?.[1]) {
    return normalizeCreateVersion(match[1]);
  }

  return null;
}

/**
 * Sort versions in descending order (newest first)
 */
export function sortVersions(versions: string[]): string[] {
  return [...versions].sort((a, b) => {
    // Split versions into components
    const [majorA, minorA, patchA = 0] = a.split('.').map((part) => parseInt(part, 10) || 0);
    const [majorB, minorB, patchB = 0] = b.split('.').map((part) => parseInt(part, 10) || 0);

    // Compare major version first
    if (majorA !== majorB) return majorB - majorA;

    // Compare minor version
    if (minorA !== minorB) {
      // Special handling for pre-1.0 vs post-1.0 versions
      return majorB < 1 ? minorA - minorB : minorB - minorA;
    }

    // Compare patch version
    return patchB - patchA;
  });
}

/**
 * Filter versions to only include valid semantic versions
 */
export function filterValidVersions(versions: string[]): string[] {
  return versions.filter((v) => /^\d+\.\d+(?:\.\d+)?[a-z0-9-]*$/.test(v));
}

/**
 * Checks if a specific addon is compatible with a given Create version
 *
 * @param addon The addon data object
 * @param createVersion The Create version to check compatibility for
 * @returns True if compatible, false otherwise
 */
export function isCompatibleWithCreateVersion(
  addon: AddonCompatibilityData,
  createVersion: string
): boolean {
  const compatibleVersions = getAddonCreateCompatibility(addon);
  return compatibleVersions.includes(createVersion);
}
