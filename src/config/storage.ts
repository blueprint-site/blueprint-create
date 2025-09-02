export const STORAGE_BUCKETS = {
  AVATARS: '67aee2b30000b9e21407', // User avatars and badge icons
  IMAGES: '67b478dd00221462624e', // General images
  SCHEMATICS_NBT: 'schematics-nbt', // NBT schematic files
  SCHEMATICS_PREVIEWS: 'schematics-previews', // Schematic preview images
  SCHEMATICS_FILES: 'schematics_bucket', // Legacy bucket (to be removed)
  SCHEMATICS: '67b2241e0032c25c8216', // Legacy mixed bucket (to be removed)
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
