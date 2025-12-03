/**
 * Configuration for real-time document synchronization
 */

/**
 * Mapping of Appwrite collections to Meilisearch indexes
 * Add new mappings here as needed
 */
export const COLLECTION_INDEX_MAPPING = {
  addons: 'addons',
  blogs: 'blogs',
  blog_tags: 'blog_tags',
  schematics: 'schematics',
  schematics_tags: 'schematics_tags',
};

/**
 * Environment variables required for the sync function
 */
export const REQUIRED_ENV_VARS = [
  'APPWRITE_FUNCTION_API_ENDPOINT',
  'APPWRITE_FUNCTION_PROJECT_ID',
  'MEILISEARCH_ENDPOINT',
  'MEILISEARCH_ADMIN_API_KEY',
];

/**
 * Maximum retry attempts for Meilisearch operations
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Delay between retry attempts (in milliseconds)
 */
export const RETRY_DELAY = 1000;
