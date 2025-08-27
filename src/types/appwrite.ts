import type { Models } from 'appwrite';
import type { ModrinthRawObject } from './addons/modrinth';
import type { CurseForgeRawObject } from './addons/curseforge';
/**
 * Type definitions for Appwrite document structures
 *
 * These interfaces extend Models.Document to include fields
 * specific to each collection in the database.
 *
 * Note: All these interfaces inherit the following fields from Models.Document:
 * - $id: string
 * - $collectionId: string
 * - $databaseId: string
 * - $createdAt: string
 * - $updatedAt: string
 * - $permissions: string[]
 */

/**
 * Addon structure that extends Appwrite Document
 */
export interface Addon extends Models.Document {
  name: string;
  description: string;
  slug: string;
  author: string;
  categories: string[] | string | null;
  downloads: number;
  icon: string;
  created_at: string | null;
  updated_at: string | null;
  curseforge_raw: CurseForgeRawObject | string | null;
  modrinth_raw: ModrinthRawObject | string | null;
  sources: string[];
  isValid: boolean;
  loaders: string[] | string | null;
  isChecked: boolean;
  minecraft_versions: string[] | string | null;
  create_versions: string[] | null;
  claimed_by: string | null;
}

/**
 * Schematic structure that extends Appwrite Document
 */
export interface Schematic extends Models.Document {
  title: string;
  description: string;
  schematic_url: string;
  image_urls: string[];
  user_id: string;
  authors: string[];
  game_versions: string[];
  create_versions: string[];
  modloaders: string[];
  categories: string[];
  sub_categories?: string[];
  slug: string;
  downloads: number;
  status: 'draft' | 'published' | 'archived';
  likes: number;
}

/**
 * Blog-specific tags
 */
export interface BlogTag extends Models.Document {
  value: string;
  color: string;
}

/**
 * Schematic-specific tags
 */
export interface SchematicTag extends Models.Document {
  value: string;
  color: string;
}

/**
 * BlogLink structure for parsed JSON links
 */
export interface BlogLink {
  url: string;
  title: string;
}

/**
 * Blog structure that extends Appwrite Document
 *
 * Note: The 'tags' and 'links' fields are stored as JSON strings in Appwrite.
 * When retrieved via API hooks like useFetchBlog or useSearchBlogs,
 * these fields are automatically parsed to their respective object types.
 * When saving, they are automatically serialized back to strings.
 */
export interface Blog extends Models.Document {
  title: string;
  content: string;
  slug: string;
  img_url: string;
  status: 'draft' | 'published' | 'archived';
  tags: BlogTag[];
  links: BlogLink[] | null;
  blog_tags?: string[];
  likes: number;
  authors_uuid: string[];
  authors: string[];
}

/**
 * Type for documents with JSON fields still in string format (as stored in database)
 */
export interface RawBlog extends Omit<Blog, 'tags' | 'links'> {
  tags: string | null;
  links: string | null;
}

/**
 * User structure that extends Appwrite User
 */
export type User = Models.User<UserPreferences>;

/**
 * Beta tester preferences structure
 */
export interface BetaTesterPrefs {
  isActive: boolean;
  joinDate: string;
  features: string[]; // Features they have access to test
  group?: string; // For A/B testing or phased rollout
}

/**
 * Extended user preferences that build on Appwrite's Models.Preferences
 */
export interface UserPreferences extends Models.Preferences {
  theme?: 'light' | 'dark';
  language?: string;
  notificationsEnabled?: boolean;
  avatar?: string;
  bio?: string;
  roles?: string[];
  easterEggs?: {
    discovered: string[];
    enabled: Record<string, boolean>;
    lastDiscovery?: number;
  } | null;
  betaTester?: BetaTesterPrefs;
}

/**
 * Admin log structure that extends Appwrite Document
 */
export interface AdminLog extends Models.Document {
  type: string;
  content: string;
  category: string;
  user_uuid: string;
}

/**
 * Feature flag structure that extends Appwrite Document
 */
export interface FeatureFlag extends Models.Document {
  key: string;
  enabled: boolean;
  users?: string[];
  teams?: string[];
  description?: string;
}

/**
 * Featured Addon document from Appwrite
 */
export interface FeaturedAddon extends Models.Document {
  addon_id: string;
  title: string;
  description: string;
  image_url: string;
  banner_url: string;
  display_order: number;
  slug: string;
  active: boolean;
  category: string[] | null;
}
