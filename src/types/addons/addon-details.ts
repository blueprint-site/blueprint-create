// src/types/addons/addon-details.ts
import type { Addon } from '@/types';
import type {
  CondensedModrinthProject,
  ModrinthRawObject,
  ModrinthVersionDependency,
} from './modrinth';
import type { CurseForgeRawObject } from './curseforge';
import type { ReactNode } from 'react';

/**
 * Represents a version of an addon
 */
export interface AddonVersion {
  id: string;
  name: string;
  version_number: string;
  game_versions: string[];
  loaders: string[];
  dependencies?: ModrinthVersionDependency[];
  date_published: string;
  featured?: boolean;
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
  icon: ReactNode;
  label: string;
  url: string;
  id?: string;
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
 * Integrated addon data with properly nested structure
 */
export interface IntegratedAddonData extends Omit<Addon, 'claimed_by'> {
  curseforgeObject?: CurseForgeRawObject;
  modrinthObject?: ModrinthRawObject;
  modrinth: CondensedModrinthProject;
  claimed_by?: string | null;
}

/**
 * Interface for addon dependencies
 */
export interface AddonDependency {
  project_id?: string;
  modId?: number;
  relationType?: number;
}

/**
 * Interface for the addon object with the properties used in compatibility detection
 */
export interface AddonCompatibilityData {
  name?: string;
  description?: string;
  dependencies?: AddonDependency[];
  minecraft_versions: string[];
  modrinth_raw?: {
    versions?: string[];
  };
  curseforge_raw?: {
    latestFiles?: {
      gameVersions?: string[];
    }[];
  };
}

/**
 * Extended Addon type that includes parsed JSON fields
 * This allows us to maintain type safety when working with parsed JSON data
 */
export interface AddonWithParsedFields extends Addon {
  /**
   * Parsed CurseForge data object
   */
  curseforge_raw_parsed?: CurseForgeRawObject | null;

  /**
   * Parsed Modrinth data object
   */
  modrinth_raw_parsed?: ModrinthRawObject | null;
}
