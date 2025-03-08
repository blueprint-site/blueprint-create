export const MINECRAFT_VERSIONS = [
  {
    value: 'All',
    label: 'All Versions',
    metadata: { compatibility: ['forge', 'fabric', 'neoforge', 'quilt'] },
  },
  {
    value: '1.14.4',
    label: '1.14.4',
    metadata: { compatibility: ['forge'] },
  },
  {
    value: '1.15.2',
    label: '1.15.2',
    metadata: { compatibility: ['forge'] },
  },
  {
    value: '1.16.5',
    label: '1.16.5',
    metadata: { compatibility: ['forge'] },
  },
  {
    value: '1.17.1',
    label: '1.17.1',
    metadata: { compatibility: ['forge'] },
  },
  {
    value: '1.18.2',
    label: '1.18.2',
    metadata: { compatibility: ['forge', 'fabric'] },
  },
  {
    value: '1.19.2',
    label: '1.19.2',
    metadata: { compatibility: ['forge', 'fabric'] },
  },
  {
    value: '1.20.1',
    label: '1.20.1',
    metadata: { compatibility: ['forge'] },
  },
] as const;

export type MinecraftVersions = (typeof MINECRAFT_VERSIONS)[number]['value'];
export type ModloaderCompatibility =
  (typeof MINECRAFT_VERSIONS)[number]['metadata']['compatibility'][number];
