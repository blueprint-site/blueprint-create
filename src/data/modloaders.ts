export const MODLOADER_OPTIONS = [
  { value: 'all', label: 'All Modloaders' },
  { value: 'forge', label: 'Forge' },
  { value: 'fabric', label: 'Fabric' },
  { value: 'quilt', label: 'Quilt' },
  { value: 'neoforge', label: 'NeoForge' },
] as const;

export type ModloaderType = (typeof MODLOADER_OPTIONS)[number]['value'];

/**
 * Standard display names for mod loaders to ensure consistent UI display
 */
export const STANDARD_LOADER_DISPLAY: Record<string, string> = {
  forge: 'Forge',
  fabric: 'Fabric',
  neoforge: 'NeoForge', // Preserve camel case
  quilt: 'Quilt',
};

/**
 * Normalizes a loader name to a standard format
 * e.g. "fabric" -> "Fabric", "FORGE" -> "Forge"
 */
export function normalizeLoaderName(loader: string): string {
  // First convert to lowercase
  const lowerLoader = loader.toLowerCase();

  // Use standard display name if available
  if (STANDARD_LOADER_DISPLAY[lowerLoader]) {
    return STANDARD_LOADER_DISPLAY[lowerLoader];
  }

  // Otherwise, capitalize first letter
  return lowerLoader.charAt(0).toUpperCase() + lowerLoader.slice(1);
}
