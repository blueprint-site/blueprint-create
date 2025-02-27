// src/types/index.ts

// Re-export types from Addon schema
import {
  Addon,
  ModrinthAddon,
  CurseForgeAddon,
  Screenshot,
  Links,
  Category,
  Author,
  Logo,
  Hash,
  SortableGameVersion,
  Dependency,
  Module,
  LatestFilesIndex,
  SocialLink,
  ServerAffiliation,
  LatestFile,
} from '@/schemas/addon.schema';

export type {
  Addon,
  Screenshot,
  Links,
  Category,
  Author,
  Logo,
  Hash,
  SortableGameVersion,
  Dependency,
  Module,
  LatestFilesIndex,
  SocialLink,
  ServerAffiliation,
  LatestFile,
  CurseForgeAddon,
  ModrinthAddon,
};

// Re-export types from Schematic schema
import {
  Schematic,
  SchematicFormValues,
  PartialSchematic,
  CreateSchematic,
  SearchSchematicsResult
} from '@/schemas/schematic.schema';

export type {
  Schematic,
  SchematicFormValues,
  PartialSchematic,
  CreateSchematic,
  SearchSchematicsResult
};

// Re-export types from Blog schema
import {
  Blog,
  Tag,
  CreateBlogInput,
  UpdateBlogInput,
  BlogFilter
} from '@/schemas/blog.schema';

export type {
  Blog,
  Tag,
  CreateBlogInput,
  UpdateBlogInput,
  BlogFilter
};

// Re-export types from User schema
import {
  User,
  UserPreferences,
  Target,
  CreateUserInput,
  UpdateUserProfileInput,
  UpdateUserPreferencesInput
} from '@/schemas/user.schema';

export type {
  User,
  UserPreferences,
  Target,
  CreateUserInput,
  UpdateUserProfileInput,
  UpdateUserPreferencesInput
};

// Re-export GitHub related types
import {
  GitHubUser,
  ContributorStats,
  GitHubRepo,
  GitHubContributorsResponse
} from '@/schemas/github.schema';

export type {
  GitHubUser,
  ContributorStats,
  GitHubRepo,
  GitHubContributorsResponse
};

// Admin logs interface
export interface Admin_logs {
  id: string;
  type: string;
  content: string;
  category: string;
  created_at: string;
  user_uuid: string;
}

// LoggedUserContext type
export interface LoggedUserContextType {
  user: User | null;
  preferences: UserPreferences | null;
  error: string | null;

  // User preferences management
  updatePreferences: (prefs: UserPreferences) => Promise<void>;

  // Email/password authentication
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // OAuth authentication
  handleOAuthLogin: (provider: 'google' | 'github' | 'discord') => void;
  handleOAuthCallback: () => Promise<void>;

  // Error management
  setError: (error: string | null) => void;
}

// Search interfaces
export interface SearchSchematicsProps {
  query?: string;
  page?: number;
  category?: string;
  subCategory?: string;
  version?: string;
  loaders?: string;
  id?: string;
}
