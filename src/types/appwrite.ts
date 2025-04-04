import type { Models } from 'appwrite';

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
  categories: string[];
  downloads: number;
  icon: string;
  created_at: string | null;
  updated_at: string | null;
  curseforge_raw: string | null;
  modrinth_raw: string | null;
  sources: string[];
  isValid: boolean;
  loaders: string[] | null;
  isChecked: boolean;
  minecraft_versions: string[] | null;
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
 * BlogTag structure for parsed JSON tags
 * @internal This is used internally for parsing tags from JSON
 */
export interface BlogTag {
  $id: string; // Standardize on $id to match Appwrite
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
  // Define as the types components expect
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
 * Tag structure that extends Appwrite Document
 */
export interface Tag extends Models.Document {
  name: string;
  value: string;
  color: string;
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
  action: string;
  userEmail: string;
  userId: string;
  details: string;
  timestamp: string;
  targetId?: string;
  targetType?: string;
  status: 'success' | 'error' | 'warning';
}

/**
 * Feature flag structure that extends Appwrite Document
 */
export interface FeatureFlag extends Models.Document {
  key: string;
  enabled: boolean;
  users?: string[];
  groups?: string[];
  description?: string;
}
