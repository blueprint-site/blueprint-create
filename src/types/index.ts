// src/types/index.ts
import type { z } from 'zod';

export type {
  User,
  UserPreferences,
  BetaTesterPrefs,
  FeatureFlag,
  Schematic,
  Addon,
  Blog,
  BlogTag,
  BlogLink,
  RawBlog,
  SchematicTag,
} from '@/types/appwrite';

export type {
  AddonWithParsedFields,
  AddonCompatibilityData,
  AddonDependency,
  AddonVersion,
  IntegratedAddonData,
  VersionInfo,
  ExternalLink,
} from '@/types/addons/addon-details';

export type {
  EnvironmentCompatibilityProps,
  Dependencies,
  Dependency,
  DependencyTooltipProps,
  DependencyBadgeProps,
  DependencySectionProps,
} from '@/types/addons/dependencies';

import type {
  ScreenshotSchema,
  LinksSchema,
  CategorySchema,
  AuthorSchema,
  LogoSchema,
  HashSchema,
  SortableGameVersionSchema,
  ModuleSchema,
  LatestFilesIndexSchema,
  SocialLinkSchema,
  ServerAffiliationSchema,
  LatestFileSchema,
  LicenseSchema,
} from '@/schemas/addon.schema';

export type { CurseForgeRawObject } from '@/types/addons/curseforge';
export type {
  ModrinthRawObject,
  ModrinthVersionDependency,
  ModrinthVersion,
  ModrinthGalleryImage,
  ModrinthProject,
  ModrinthVersionsResponse,
  ModrinthDependenciesResponse,
  ModrinthUser,
  ModrinthUserProjects,
  CondensedModrinthProject,
} from '@/types/addons/modrinth';

export type Screenshot = z.infer<typeof ScreenshotSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type License = z.infer<typeof LicenseSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Hash = z.infer<typeof HashSchema>;
export type SortableGameVersion = z.infer<typeof SortableGameVersionSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type LatestFilesIndex = z.infer<typeof LatestFilesIndexSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type ServerAffiliation = z.infer<typeof ServerAffiliationSchema>;
export type LatestFile = z.infer<typeof LatestFileSchema>;

// These schemas are imported for Zod inference only
import type {
  BlogFormSchema,
  CreateBlogSchema,
  UpdateBlogSchema,
  BlogFilterSchema,
  SearchBlogPropsSchema,
} from '@/schemas/blog.schema';

// Blog types with schema-based validation
export type BlogFormValues = z.infer<typeof BlogFormSchema>;
export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type BlogFilter = z.infer<typeof BlogFilterSchema>;
export type SearchBlogProps = z.infer<typeof SearchBlogPropsSchema>;

import type {
  createSchematicSchema,
  schematicFormSchema,
  searchSchematicsPropsSchema,
} from '@/schemas/schematic.schema';

export type SearchSchematicsProps = z.infer<typeof searchSchematicsPropsSchema>;
export type SchematicFormValues = z.infer<typeof schematicFormSchema>;
export type CreateSchematic = z.infer<typeof createSchematicSchema>;

// Import search result types from meilisearch.ts
export type {
  SearchSchematicResult,
  SearchAddonResult,
  SearchBlogResult,
  MeiliSearchResult,
  MeiliBlogResponse,
  MeiliBlogHit,
  MeiliRawBlogResponse,
  MeiliRawBlogHit,
  MeiliAddonResponse,
  MeiliAddonHits,
  MeiliAddonHit,
  MeiliSchematicResponse,
  MeiliSchematicHits,
  MeiliSchematicHit,
  MeiliBlogHits,
  MeiliRawBlogHits,
} from '@/types/meilisearch.ts';

import type {
  CreateFeatureFlagSchema,
  UpdateFeatureFlagSchema,
  FeatureFlagKeySchema,
} from '@/schemas/featureFlag.schema';

export type CreateFeatureFlag = z.infer<typeof CreateFeatureFlagSchema>;
export type UpdateFeatureFlag = z.infer<typeof UpdateFeatureFlagSchema>;
export type FeatureFlagKey = z.infer<typeof FeatureFlagKeySchema>;

import type {
  GitHubUserSchema,
  ContributorStatsSchema,
  GitHubRepoSchema,
  GitHubContributorsResponseSchema,
} from '@/schemas/github.schema';

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
export type ContributorStats = z.infer<typeof ContributorStatsSchema>;
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;
export type GitHubContributorsResponse = z.infer<typeof GitHubContributorsResponseSchema>;

import type { AdminLogsSchema } from '@/schemas/adminLogs.schema.tsx';
export type AdminLogs = z.infer<typeof AdminLogsSchema>;

import type { OAuthProvidersSchema } from '@/schemas/OAuthProviders.schema.tsx';
export type OAuthProvidersType = z.infer<typeof OAuthProvidersSchema>;

import type { baseTagSchema, blogTagSchema, schematicTagSchema } from '@/schemas/tag.schema.ts';

export type TagFormValues = z.infer<typeof baseTagSchema>;
export type BlogTagFormValues = z.infer<typeof blogTagSchema>;
export type SchematicTagFormValues = z.infer<typeof schematicTagSchema>;
