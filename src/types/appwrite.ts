import type { Models } from 'appwrite';

/**
 * Type definitions for Appwrite document structures
 *
 * These interfaces extend Models.Document to include fields
 * specific to each collection in the database.
 */

/**
 * Feature flag document structure in Appwrite
 */
export interface FeatureFlag extends Models.Document {
  key: string;
  enabled: boolean;
  users?: string[];
  groups?: string[];
  description?: string;
}
