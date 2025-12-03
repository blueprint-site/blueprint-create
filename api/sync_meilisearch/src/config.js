import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// Load .env located in function root (one level up from src)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Configuration for all sync operations
 */
export const SYNC_CONFIG = [
  { indexName: 'addons', collectionId: process.env.APPWRITE_COLLECTION_ADDONS, hasObsoleteCleanup: false },
  { indexName: 'blogs', collectionId: process.env.APPWRITE_COLLECTION_BLOGS, hasObsoleteCleanup: true },
  { indexName: 'blog_tags', collectionId: process.env.APPWRITE_COLLECTION_BLOG_TAGS, hasObsoleteCleanup: true },
  { indexName: 'schematics', collectionId: process.env.APPWRITE_COLLECTION_SCHEMATICS, hasObsoleteCleanup: true },
  { indexName: 'schematics_tags', collectionId: process.env.APPWRITE_COLLECTION_SCHEMATICS_TAGS, hasObsoleteCleanup: true },
];

/**
 * Environment variables required for the sync function
 */
export const REQUIRED_ENV_VARS = [
  'APPWRITE_FUNCTION_API_ENDPOINT',
  'APPWRITE_FUNCTION_PROJECT_ID',
  'APPWRITE_FUNCTION_API_KEY',
  'MEILISEARCH_ENDPOINT',
  'MEILISEARCH_ADMIN_API_KEY',
  'MEILISEARCH_SEARCH_API_KEY',
  'APPWRITE_COLLECTION_ADDONS',
  'APPWRITE_COLLECTION_BLOGS',
  'APPWRITE_COLLECTION_BLOG_TAGS',
  'APPWRITE_COLLECTION_SCHEMATICS',
  'APPWRITE_COLLECTION_SCHEMATICS_TAGS',
  'APPWRITE_DATABASE_ID',
];

// brutalna walidacja
const missing = REQUIRED_ENV_VARS.filter(name => !process.env[name]);
if (missing.length) {
  throw new Error(`Env value not found: ${missing.join(', ')}`);
}

// Ensure env var for database is present
// Use default 'main' if APPWRITE_DATABASE_ID is not set
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'main';

