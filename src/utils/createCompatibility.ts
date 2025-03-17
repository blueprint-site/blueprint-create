import {
  CREATE_MOD_IDS,
  MINECRAFT_TO_CREATE_VERSIONS,
  extractCreateVersionFromText,
} from '@/data/createVersions';

/**
 * Interface for addon dependencies
 */
interface AddonDependency {
  project_id?: string;
  modId?: number;
  relationType?: number;
}

/**
 * Interface for the addon object with the properties used in compatibility detection
 */
interface AddonCompatibilityData {
  name?: string;
  description?: string;
  dependencies?: AddonDependency[];
  game_versions?: string[];
  minecraft_versions?: string[];
  modrinth_raw?: {
    versions?: string[];
  };
  curseforge_raw?: {
    latestFiles?: {
      gameVersions?: string[];
    }[];
  };
}

/**
 * Determines Create mod compatibility versions for an addon
 * Uses a multi-step approach:
 * 1. Checks for direct Create mod dependencies
 * 2. Uses Minecraft version compatibility to determine Create versions
 * 3. Extracts versions from addon name/description as fallback
 * 4. Uses Minecraft versions for final fallback
 *
 * @param addon The addon data object
 * @returns Array of normalized Create version strings (e.g. ["0.5", "6.0"])
 */
export function getAddonCreateCompatibility(
  addon: AddonCompatibilityData | null | undefined
): string[] {
  if (!addon) return [];

  // Initialize set to store unique Create versions
  const createVersions = new Set<string>();

  // STEP 1: Check for direct Create mod dependencies
  const hasDependency = addon.dependencies?.some(
    (dep: AddonDependency) =>
      dep.project_id === CREATE_MOD_IDS.FORGE || dep.project_id === CREATE_MOD_IDS.FABRIC
  );

  // STEP 2: If it has Create dependency, use Minecraft versions to determine compatibility
  const versionsToCheck = addon.game_versions || addon.minecraft_versions || [];

  if (hasDependency && Array.isArray(versionsToCheck)) {
    versionsToCheck.forEach((mcVersion: string) => {
      const compatVersions = MINECRAFT_TO_CREATE_VERSIONS[mcVersion];
      if (compatVersions) {
        compatVersions.forEach((version) => createVersions.add(version));
      }
    });
  }

  // STEP 3: If no versions found, try to extract from name/description
  if (createVersions.size === 0) {
    // Combine name, description and any other relevant text fields
    const combinedText = [
      addon.name || '',
      addon.description || '',
      // Use any other relevant fields if available
    ].join(' ');

    // Try to extract Create version mention
    const extractedVersion = extractCreateVersionFromText(combinedText);
    if (extractedVersion) {
      createVersions.add(extractedVersion);
    }
  }

  // STEP 4: If still no versions found, fall back to Minecraft version inference
  if (createVersions.size === 0 && Array.isArray(versionsToCheck)) {
    versionsToCheck.forEach((mcVersion: string) => {
      if (mcVersion.startsWith('1.18')) createVersions.add('0.4');
      if (mcVersion.startsWith('1.19')) createVersions.add('0.5');
      if (mcVersion.startsWith('1.20')) createVersions.add('0.5');
      if (mcVersion.startsWith('1.21')) createVersions.add('6.0');
    });
  }

  // STEP 5: Last resort - if still nothing, return all versions
  if (createVersions.size === 0) {
    return ['0.4', '0.5', '6.0'];
  }

  return Array.from(createVersions);
}

/**
 * Checks if a specific addon is compatible with a given Create version
 *
 * @param addon The addon data object
 * @param createVersion The Create version to check compatibility for
 * @returns True if compatible, false otherwise
 */
export function isCompatibleWithCreateVersion(
  addon: AddonCompatibilityData | null | undefined,
  createVersion: string
): boolean {
  const compatibleVersions = getAddonCreateCompatibility(addon);
  return compatibleVersions.includes(createVersion);
}
