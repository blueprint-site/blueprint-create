export const CREATE_VERSIONS = [
  { value: 'All', label: 'All Versions' },
  { value: '0.6', label: '0.6' },
  { value: '0.5', label: '0.5' },
  { value: '0.4', label: '0.4' },
] as const;

export type CreateVersions = (typeof CREATE_VERSIONS)[number]['value'];
