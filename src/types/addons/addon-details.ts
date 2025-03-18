// src/types/addons/addon-details.ts
import { Dependencies } from './dependencies';

/**
 * Represents a version of an addon
 */
export interface AddonVersion {
  id: string;
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  dependencies?: Array<{
    project_id: string;
    version_id?: string;
    name?: string;
    slug?: string;
    dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded';
  }>;
  date_published: string;
  is_featured?: boolean;
}

/**
 * Processed version information for an addon
 */
export interface VersionInfo {
  versions: AddonVersion[];
  createVersions: string[]; // Human-readable Create version strings
  game_versions?: string[];
}

/**
 * Display features for version data
 */
export interface VersionDisplay {
  filteredMinecraftVersions: string[];
  uniqueLoaders: string[];
  uniqueCreateVersions: string[];
  sortedVersions: AddonVersion[];
  featuredVersion: AddonVersion | null;
  isCompatible: (mcVersion: string, loader: string) => boolean;
}

/**
 * External link with iconType
 */
export interface ExternalLink {
  iconType: string;
  label: string;
  url: string;
  id: string;
}

/**
 * Type for addon object from database
 */
export interface Addon {
  $id?: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  modrinth_raw?: string | Record<string, unknown> | null;
  curseforge_raw?: string | Record<string, unknown> | null;
  minecraft_versions?: string[];
  loaders?: string[];
  categories?: string[];
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

/**
 * Donation link type
 */
export interface DonationLink {
  id: string;
  platform: string;
  url: string;
}

/**
 * New comprehensive data structure for processed addon data
 */
export interface ProcessedAddonData {
  // Basic information
  basic: {
    id?: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    created_at: string | null;
    updated_at: string | null;
    categories: string[];
    loaders: string[];
  };

  // Version information with display features
  versions: {
    minecraft: string[];
    create: string[];
    loaders: string[];
    all: AddonVersion[];
    featured: AddonVersion | null;
    compatibility: {
      isCompatible: (mcVersion: string, loader: string) => boolean;
    };
  };

  // Gallery data
  gallery: {
    small: Array<string | Record<string, unknown>>;
    hd?: string[];
  } | null;

  // Stats and metadata
  metadata: {
    downloads: number;
    follows: number;
    clientSide?: string;
    serverSide?: string;
    bodyContent?: string;
    availablePlatforms: string[];
  };

  // External links
  links: {
    external: ExternalLink[];
    donation: DonationLink[];
  };

  // Dependencies (typed correctly)
  dependencies: Dependencies | null;
}
