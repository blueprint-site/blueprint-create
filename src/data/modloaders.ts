export const MODLOADER_OPTIONS = [
  { value: 'All', label: 'All Modloaders' },
  { value: 'forge', label: 'Forge' },
  { value: 'fabric', label: 'Fabric' },
  { value: 'quilt', label: 'Quilt' },
] as const;

export type ModloaderType = (typeof MODLOADER_OPTIONS)[number]['value'];
