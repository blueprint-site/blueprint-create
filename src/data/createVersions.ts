/**
 * Create Version Compatibility Mapping
 * Maps Minecraft versions to compatible Create mod versions
 */

export interface CreateVersion {
  /** The Create version identifier (e.g. "0.5", "6.0") */
  value: string;
  /** Human-readable label for display (e.g. "Create 0.5", "Create 6.0") */
  label: string;
  /** Order for sorting (lower number means higher priority) */
  sortOrder: number;
}

export interface CreateModId {
  /** The Create mod ID on Modrinth */
  FORGE: string;
  /** The Create Fabric ID on Modrinth */
  FABRIC: string;
  /** The Flywheel dependency ID on Modrinth */
  FLYWHEEL: string;
}

/**
 * Create mod IDs on Modrinth
 */
export const CREATE_MOD_IDS: CreateModId = {
  FORGE: 'LNytGWDc', // Create (Forge/NeoForge)
  FABRIC: 'Xbc0uyRg', // Create Fabric
  FLYWHEEL: '5lpsZoRi', // Flywheel (dependency)
};

/**
 * Known Create versions and their display data
 */
export const CREATE_VERSIONS: Record<string, CreateVersion> = {
  '0.3': { value: '0.3', label: 'Create 0.3', sortOrder: 30 },
  '0.4': { value: '0.4', label: 'Create 0.4', sortOrder: 20 },
  '0.5': { value: '0.5', label: 'Create 0.5', sortOrder: 10 },
  '6.0': { value: '6.0', label: 'Create 6.0', sortOrder: 0 },
};

/**
 * Maps Minecraft versions to compatible Create versions
 * Key: Minecraft version
 * Value: Array of Create version strings
 */
export const MINECRAFT_TO_CREATE_VERSIONS: Record<string, string[]> = {
  '1.16.5': ['0.3'],
  '1.18.2': ['0.4', '0.5'],
  '1.19.2': ['0.5'],
  '1.20.1': ['0.5', '6.0'],
  '1.21.1': ['6.0'],
};

/**
 * Version-related regular expressions for extracting Create versions from text
 */
export const CREATE_VERSION_PATTERNS = [
  // Direct Create version mentions
  /create[\s-]*v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
  // "For Create X.Y"
  /for[\s-]*create[\s-]*v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
  // Create with something between (like "Create Fabric 0.5")
  /create[\s-]*[\w-]*[\s-]*(\d+\.\d+(?:\.\d+)?)/i,
];

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
