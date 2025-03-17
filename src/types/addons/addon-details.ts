import { ReactNode } from 'react';
import { CurseForgeAddon, ModrinthAddon } from '@/types';
import { ModrinthVersions } from '@/api/endpoints/useModrinth';

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
 * Interface for the return value of useModrinthVersionInfo
 */
export interface ModrinthVersionInfo {
  dependencies: Record<string, unknown> | null;
  versions: ModrinthVersions[] | null;
  createVersions: string[];
}

/**
 * Props for the VersionProcessor hook
 */
export interface VersionProcessorProps {
  versionInfoData: {
    dependencies: Record<string, unknown>;
    versions: ModrinthVersions[] | null;
    createVersions: string[];
  } | null;
  allGameVersions?: Set<string>;
}

/**
 * External link configuration
 */
export interface ExternalLink {
  icon: ReactNode;
  label: string;
  url: string;
  id: string;
}

/**
 * Type for addon object
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
 * Props for the AddonData component
 */
export interface AddonDataProps {
  addon: Addon;
  modrinthData: ModrinthAddon | null;
  curseforgeData: CurseForgeAddon | null;
  modrinthProject: Record<string, unknown> | null;
  versionInfo: VersionInfo | null;
  isLoadingVersionInfo: boolean;
  slug?: string;
}

/**
 * Props for the AddonMetaProcessor component
 */
export interface AddonMetaProcessorProps {
  addon?: Addon;
  modrinthData: ModrinthAddon | null;
  curseforgeData: CurseForgeAddon | null;
  modrinthProject: Record<string, unknown> | null;
  versionInfo?: VersionInfo | null;
  slug?: string;
  children: (props: AddonMetaData) => React.ReactElement;
}

/**
 * Processed metadata for an addon
 */
export interface AddonMetaData {
  gallerySmall: Array<string | Record<string, unknown>>;
  galleryHD?: string[];
  totalDownload: number;
  dependencies: Record<string, unknown> | null;
  donationLinks: Array<Record<string, unknown>>;
  clientSide: string | undefined;
  serverSide: string | undefined;
  bodyContent: string | undefined;
  externalLinks: ExternalLink[];
  availableOn: string[];
}
