import { License } from '..';

/**
 * User response from GET /user/{id|username}
 */
export interface ModrinthUser {
  username: string;
  name: string | null;
  email?: string | null; // Only displayed if requesting your own account
  bio: string;
  payout_data?: {
    balance: number;
    payout_wallet: 'paypal' | 'venmo';
    payout_wallet_type: 'email' | 'phone' | 'user_handle';
    payout_address: string;
  };
  id: string;
  avatar_url: string;
  created: string; // ISO date string
  role: 'admin' | 'moderator' | 'developer';
  badges: number; // Bitfield
  auth_providers?: string[] | null; // Only displayed if requesting your own account
  email_verified?: boolean | null; // Only displayed if requesting your own account
  has_password?: boolean | null; // Only displayed if requesting your own account
  has_totp?: boolean | null; // Only displayed if requesting your own account
  github_id?: number | null; // Deprecated
}

/**
 * User projects response from GET /user/{id|username}/projects
 */
export type ModrinthUserProjects = ModrinthProject[];

// Common Types
export type DependencyType = 'required' | 'optional' | 'incompatible' | 'embedded';
export type VersionType = 'release' | 'beta' | 'alpha';
export type ProjectStatus =
  | 'approved'
  | 'archived'
  | 'rejected'
  | 'draft'
  | 'unlisted'
  | 'processing'
  | 'withheld'
  | 'scheduled'
  | 'private'
  | 'unknown';
export type VersionStatus = 'listed' | 'archived' | 'draft' | 'unlisted' | 'scheduled' | 'unknown';
export type SideSupport = 'required' | 'optional' | 'unsupported' | 'unknown';
export type ProjectType = 'mod' | 'modpack' | 'resourcepack' | 'shader';

/**
 * Project response from GET /project/{id|slug}
 */
export interface ModrinthProject {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: SideSupport;
  server_side: SideSupport;
  body: string;
  status: ProjectStatus;
  requested_status?: ProjectStatus | null;
  additional_categories: string[];
  issues_url?: string | null;
  source_url?: string | null;
  wiki_url?: string | null;
  discord_url?: string | null;
  donation_urls: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  project_type: ProjectType;
  downloads: number;
  icon_url?: string | null;
  color?: number | null;
  id: string;
  team: string;
  body_url?: string | null;
  moderator_message: {
    message: string;
    body?: string | null;
  } | null;
  published: string; // ISO date string
  updated: string; // ISO date string
  approved?: string; // ISO date string
  queued?: string; // ISO date string
  followers: number;
  game_versions: string[];
  loaders: string[];
  gallery: ModrinthGalleryImage[];
  license?: License | null;
}

/**
 * Gallery Image as returned in project responses
 */
export interface ModrinthGalleryImage {
  url: string;
  raw_url: string;
  featured: boolean;
  title: string | null;
  description: string | null;
  created: string;
  ordering: number | null;
}

/**
 * Version dependency as returned in version responses
 */
export interface ModrinthVersionDependency {
  version_id?: string | null;
  project_id: string;
  file_name?: string | null;
  dependency_type: DependencyType;
}

/**
 * Version as returned from GET /project/{id|slug}/version
 */
export interface ModrinthVersion {
  game_versions: string[];
  loaders: string[];
  id: string;
  project_id: string;
  author_id: string;
  featured: boolean;
  name: string;
  version_number: string;
  changelog?: string | null;
  changelog_url?: string | null;
  date_published: string; // ISO date string
  downloads: number;
  version_type: VersionType;
  status: VersionStatus;
  requested_status?: VersionStatus | null;
  files: Array<{
    hashes?: {
      sha512?: string;
      sha1?: string;
    };
    url: string;
    filename: string;
    primary: boolean;
    size: number;
    file_type?: 'required-resource-pack' | 'optional-resource-pack' | null;
  }>;
  dependencies: ModrinthVersionDependency[];
}

/**
 * Project versions as returned from GET /project/{id|slug}/version
 */
export type ModrinthVersionsResponse = ModrinthVersion[];

/**
 * Project dependencies as returned from GET /project/{id|slug}/dependencies
 */
export interface ModrinthDependenciesResponse {
  projects: ModrinthProject[];
  versions?: string[];
}

export interface CondensedModrinthProject
  extends Omit<ModrinthProject, 'versions' | 'dependencies'> {
  versions: ModrinthVersion[] | null;
  dependencies: ModrinthProject[] | null;
}

// modrinth_raw object
export interface ModrinthRawObject {
  project_id: string;
  project_type: string;
  slug: string;
  author: string;
  title: string;
  description: string;
  categories: string[];
  display_categories: string[];
  versions: string[];
  downloads: number;
  follows: number;
  icon_url: string;
  date_created: string;
  date_modified: string;
  latest_version: string;
  license: License;
  client_side: 'optional' | 'required' | 'unsupported';
  server_side: 'optional' | 'required' | 'unsupported';
  gallery: string[];
  featured_gallery: string;
  color: number;
}
