// src/types/index.ts
import { z } from 'zod';

import {
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
} from '@/schemas/addon.schema';

export type Addon = z.infer<typeof AddonSchema>;
export type Screenshot = z.infer<typeof ScreenshotSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type Logo = z.infer<typeof LogoSchema>;
export type Hash = z.infer<typeof HashSchema>;
export type SortableGameVersion = z.infer<typeof SortableGameVersionSchema>;
export type Dependency = z.infer<typeof DependencySchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type LatestFilesIndex = z.infer<typeof LatestFilesIndexSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type ServerAffiliation = z.infer<typeof ServerAffiliationSchema>;
export type LatestFile = z.infer<typeof LatestFileSchema>;

import {
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

import {
  UserSchema,
  TargetSchema,
  UserPreferencesSchema,
  CreateUserSchema,
  UpdateUserProfileSchema,
  UpdateUserPreferencesSchema,
} from '@/schemas/user.schema';

export type User = z.infer<typeof UserSchema>;
export type Target = z.infer<typeof TargetSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof UpdateUserPreferencesSchema>;

import {
  createSchematicSchema,
  partialSchematicSchema,
  schematicFormSchema,
  schematicSchema,
  searchSchematicsPropsSchema,
  searchSchematicsResultSchema,
} from '@/schemas/schematic.schema';

export type SearchSchematicsProps = z.infer<typeof searchSchematicsPropsSchema>;
export type SchematicFormValues = z.infer<typeof schematicFormSchema>;
export type Schematic = z.infer<typeof schematicSchema>;
export type PartialSchematic = z.infer<typeof partialSchematicSchema>;
export type CreateSchematic = z.infer<typeof createSchematicSchema>;
export type SearchSchematicsResult = z.infer<typeof searchSchematicsResultSchema>;

import {
  GitHubUserSchema,
  ContributorStatsSchema,
  GitHubRepoSchema,
  GitHubContributorsResponseSchema,
} from '@/schemas/github.schema';

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
export type ContributorStats = z.infer<typeof ContributorStatsSchema>;
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;
export type GitHubContributorsResponse = z.infer<typeof GitHubContributorsResponseSchema>;

import { AdminLogsSchema } from '@/schemas/adminLogs.schema.tsx';

export type AdminLogs = z.infer<typeof AdminLogsSchema>;

// LoggedUserContext type
export interface LoggedUserContextType {
  user: User | null;
  preferences: UserPreferences | null;
  error: string | null;

  updatePreferences: (prefs: UserPreferences) => Promise<void>;

  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  handleOAuthLogin: (provider: 'google' | 'github' | 'discord') => void;
  handleOAuthCallback: () => Promise<void>;

  setError: (error: string | null) => void;
}
