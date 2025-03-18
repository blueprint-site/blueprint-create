/**
 * Comprehensive type definitions for Modrinth API responses
 */

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
  body?: string;
  status: ProjectStatus;
  requested_status?: ProjectStatus | null;
  additional_categories?: string[];
  issues_url?: string | null;
  source_url?: string | null;
  wiki_url?: string | null;
  discord_url?: string | null;
  donation_urls?: Array<{
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
  moderator_message?: {
    message: string;
    body?: string | null;
  } | null;
  published: string; // ISO date string
  updated: string; // ISO date string
  approved?: string; // ISO date string
  queued?: string; // ISO date string
  followers: number;
  game_versions?: string[];
  loaders?: string[];
  gallery?: ModrinthGalleryImage[];
  license?: {
    id: string;
    name: string;
    url?: string;
  };
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
  name: string;
  version_number: string;
  changelog?: string | null;
  dependencies?: ModrinthVersionDependency[];
  game_versions: string[];
  version_type: VersionType;
  loaders: string[];
  status: VersionStatus;
  requested_status?: VersionStatus | null;
  id: string;
  project_id: string;
  author_id: string;
  date_published: string; // ISO date string
  downloads: number;
  changelog_url?: string | null;
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
}

/**
 * Project dependencies as returned from GET /project/{id|slug}/dependencies
 */
export interface ModrinthDependenciesResponse {
  projects: ModrinthDependencyProject[];
  versions?: string[]; // Version IDs that directly depend on the project
}

/**
 * Project dependency information
 */
export interface ModrinthDependencyProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: SideSupport;
  server_side: SideSupport;
  project_type: ProjectType;
  downloads: number;
  icon_url?: string | null;
  color?: number | null;
  thread_id?: string;
  monetization_status?: string;
  team: string;
}
