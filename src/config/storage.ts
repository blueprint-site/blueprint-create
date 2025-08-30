export const STORAGE_BUCKETS = {
  AVATARS: '67aee2b30000b9e21407', // Keep this as you mentioned it's correct for the new project
  IMAGES: '67b478dd00221462624e',
  SCHEMATICS: '67b2241e0032c25c8216',
  SCHEMATICS_FILES: 'schematics_bucket',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
