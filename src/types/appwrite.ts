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
 * Blog structure that extends Appwrite Document
 */
export interface Blog extends Models.Document {
  title: string;
  content: string;
  slug: string;
  img_url: string;
  status: 'draft' | 'published' | 'archived';
  links: string | null; // Stored as JSON string in Appwrite
  tags: string | null; // Stored as JSON string in Appwrite
  blog_tags?: string[];
  likes: number;
  authors_uuid: string[];
  authors: string[];
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
 * User structure that extends Appwrite Document
 * Note: This extends the user structure from Appwrite's Account service
 */
export interface User extends Models.Document {
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: {
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
  };
  targets: Array<{
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    userId: string;
    providerId?: string;
    providerType: string;
    identifier: string;
  }>;
  accessedAt: string;
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
