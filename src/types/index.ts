// src/types/index.ts
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

export type { Author, License, Category } from '@/types/addons/models';

export type {
  SchematicFormValues,
  CreateSchematicFormValues,
  UpdateSchematicFormValues,
  SearchSchematicsProps,
} from '@/schemas/schematic.schema';

import type {
  FeaturedAddonSchema,
  updateFeaturedAddonSchema,
} from '@/schemas/featuredAddon.schema';

// Import canonical types from appwrite.ts
export type { FeaturedAddon } from '@/types/appwrite';

// Form validation types - NOT document types
export type FeaturedAddonFormValues = z.infer<typeof FeaturedAddonSchema>;
export type UpdateFeaturedAddonFormValues = z.infer<typeof updateFeaturedAddonSchema>;

export type { FeatureFlagKey } from '@/schemas/featureFlag.schema';

export type {
  GitHubUser,
  ContributorStats,
  GitHubRepo,
  GitHubContributorsResponse,
} from '@/types/github';

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

export type OAuthProvidersType = {
  name: string;
  icon: string;
  color: string;
  id: string;
};
