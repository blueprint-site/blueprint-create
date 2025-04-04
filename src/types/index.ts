// src/types/index.ts
import type { z } from 'zod';

import type { Schematic } from '@/types/appwrite';

export type {
  User,
  UserPreferences,
  BetaTesterPrefs,
  FeatureFlag,
  Schematic,
} from '@/types/appwrite';

import type {
  AddonSchema,
  ScreenshotSchema,
  LinksSchema,
  CategorySchema,
  AuthorSchema,
  LogoSchema,
  HashSchema,
  SortableGameVersionSchema,
  DependencySchema,
  ModuleSchema,
  LatestFilesIndexSchema,
  SocialLinkSchema,
  ServerAffiliationSchema,
  LatestFileSchema,
  LicenseSchema,
} from '@/schemas/addon.schema';

export type Addon = z.infer<typeof AddonSchema>;
export type Screenshot = z.infer<typeof ScreenshotSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type License = z.infer<typeof LicenseSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Hash = z.infer<typeof HashSchema>;
export type SortableGameVersion = z.infer<typeof SortableGameVersionSchema>;
export type Dependency = z.infer<typeof DependencySchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type LatestFilesIndex = z.infer<typeof LatestFilesIndexSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type ServerAffiliation = z.infer<typeof ServerAffiliationSchema>;
export type LatestFile = z.infer<typeof LatestFileSchema>;

import type {
  BlogSchema,
  TagSchema,
  CreateBlogSchema,
  UpdateBlogSchema,
  BlogFilterSchema,
  SearchBlogPropsSchema,
  SearchBlogResultSchema,
} from '@/schemas/blog.schema';

export type Blog = z.infer<typeof BlogSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type BlogFilter = z.infer<typeof BlogFilterSchema>;
export type SearchBlogProps = z.infer<typeof SearchBlogPropsSchema>;
export type SearchBlogResult = z.infer<typeof SearchBlogResultSchema>;

import type {
  createSchematicSchema,
  schematicFormSchema,
  searchSchematicsPropsSchema,
} from '@/schemas/schematic.schema';

export type SearchSchematicsProps = z.infer<typeof searchSchematicsPropsSchema>;
export type SchematicFormValues = z.infer<typeof schematicFormSchema>;
export type CreateSchematic = z.infer<typeof createSchematicSchema>;
export type SearchSchematicsResult = Pick<
  UseQueryResult<unknown>,
  'isLoading' | 'isError' | 'error' | 'isFetching'
> & {
  data: Schematic[]; // Use the canonical Schematic type here
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalHits: number;
  page: number;
};

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
// Import UseQueryResult explicitly at the top
import type { UseQueryResult } from '@tanstack/react-query';

// Remove redundant import since we already have export type { Schematic } above

export type OAuthProvidersType = z.infer<typeof OAuthProvidersSchema>;
