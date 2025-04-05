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

export type {
  Author,
  License,
  Category,
  // ...other types you need
} from '@/types/addons/models';

// These schemas are imported for Zod inference only
import type { CreateBlogSchema, UpdateBlogSchema } from '@/schemas/blog.schema';
export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;

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

import type { OAuthProvidersSchema } from '@/schemas/OAuthProviders.schema.tsx';
export type OAuthProvidersType = z.infer<typeof OAuthProvidersSchema>;

import type { baseTagSchema, blogTagSchema, schematicTagSchema } from '@/schemas/tag.schema.ts';

export type TagFormValues = z.infer<typeof baseTagSchema>;
export type BlogTagFormValues = z.infer<typeof blogTagSchema>;
export type SchematicTagFormValues = z.infer<typeof schematicTagSchema>;
