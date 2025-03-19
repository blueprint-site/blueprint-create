import { z } from 'zod';

export const ScreenshotSchema = z.object({
  id: z.number(),
  modId: z.number(),
  title: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  url: z.string(),
});

export const LinksSchema = z.object({
  websiteUrl: z.string(),
  wikiUrl: z.string().optional().nullable(),
  issuesUrl: z.string().nullable(),
  sourceUrl: z.string().nullable(),
});

export const CategorySchema = z.object({
  id: z.number(),
  gameId: z.number(),
  name: z.string(),
  slug: z.string(),
  url: z.string(),
  iconUrl: z.string(),
  dateModified: z.string(),
  isClass: z.boolean(),
  classId: z.number(),
  parentCategoryId: z.number(),
});

export const AuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  avatarUrl: z.string().optional().nullable(),
});

export const LogoSchema = z.object({
  id: z.number(),
  modId: z.number(),
  title: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  url: z.string(),
});

export const HashSchema = z.object({
  value: z.string(),
  algo: z.number(),
});

export const SortableGameVersionSchema = z.object({
  gameVersionName: z.string(),
  gameVersionPadded: z.string(),
  gameVersion: z.string(),
  gameVersionReleaseDate: z.string(),
  gameVersionTypeId: z.number(),
});

export const DependencySchema = z.object({
  modId: z.number(),
  relationType: z.number(),
});

export const ModuleSchema = z.object({
  name: z.string(),
  fingerprint: z.number(),
});

export const LatestFilesIndexSchema = z.object({
  gameVersion: z.string(),
  fileId: z.number(),
  filename: z.string(),
  releaseType: z.number(),
  gameVersionTypeId: z.number(),
  modLoader: z.number().optional().nullable(),
});

export const SocialLinkSchema = z.object({
  type: z.number(),
  url: z.string(),
});

export const ServerAffiliationSchema = z.object({
  isEnabled: z.boolean(),
  isDefaultBanner: z.boolean(),
  hasDiscount: z.boolean(),
  affiliationService: z.number(),
  defaultBannerCustomTitle: z.string().optional().nullable(),
  affiliationLink: z.string(),
});

export const LatestFileSchema = z.object({
  id: z.number(),
  gameId: z.number(),
  modId: z.number(),
  isAvailable: z.boolean(),
  displayName: z.string(),
  fileName: z.string(),
  releaseType: z.number(),
  fileStatus: z.number(),
  hashes: z.array(HashSchema),
  fileDate: z.string(),
  fileLength: z.number(),
  downloadCount: z.number(),
  downloadUrl: z.string().optional().nullable(),
  gameVersions: z.array(z.string()),
  sortableGameVersions: z.array(SortableGameVersionSchema),
  dependencies: z.array(DependencySchema),
  alternateFileId: z.number(),
  isServerPack: z.boolean(),
  fileFingerprint: z.number(),
  modules: z.array(ModuleSchema),
  fileSizeOnDisk: z.number().optional().nullable(),
  serverPackFileId: z.number().optional().nullable(),
});

export const AddonSchema = z.object({
  $id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  author: z.string(),
  categories: z.array(z.string()),
  downloads: z.number(),
  icon: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  curseforge_raw: z.string().nullable(),
  modrinth_raw: z.string().nullable(),
  sources: z.array(z.string()),
  isValid: z.boolean(),
  loaders: z.array(z.string()).nullable(),
  isChecked: z.boolean(),
  minecraft_versions: z.array(z.string()).optional().nullable(),
  create_versions: z.array(z.string()).optional().nullable(),
});
