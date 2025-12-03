// import { Query } from 'node-appwrite'; // Unused

/**
 * Get the last sync timestamp for a specific index
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} indexName - Name of the Meilisearch index
 * @param {Function} log - Logging function
 * @returns {string|null} Last sync timestamp or null if first time
 */
import { DATABASE_ID } from './config.js';
export async function getLastSyncTime(databases, indexName, log) {
  try {
    // Fetch metadata document by ID (using indexName as document ID)
    const doc = await databases.getDocument(DATABASE_ID, 'sync_metadata', indexName);
    const lastSync = doc.lastSync;
    log(`Last sync for ${indexName}: ${lastSync}`);
    return lastSync;
  } catch (error) {
    if (error.code === 404) {
      log(`No sync metadata for ${indexName}. Will create on first update.`);
    } else {
      log(`Error fetching last sync time: ${error.message}`);
    }
    return null;
  }
}

/**
 * Update the last sync timestamp for a specific index
 * @param {Object} databases - Appwrite Databases instance
 * @param {string} indexName - Name of the Meilisearch index
 * @param {string} timestamp - ISO timestamp of the sync
 * @param {Function} log - Logging function
 */
export async function updateLastSyncTime(databases, indexName, timestamp, log) {
  const payload = {
    collectionId: indexName,
    lastSync: timestamp,
  };
  try {
    // Try updating existing metadata by document ID
    await databases.updateDocument(DATABASE_ID, 'sync_metadata', indexName, payload);
    log(`Updated sync timestamp for ${indexName}`);
  } catch (error) {
    if (error.code === 404) {
      // Create new metadata record with required fields
      await databases.createDocument(DATABASE_ID, 'sync_metadata', indexName, payload);
      log(`Created sync metadata record for ${indexName}`);
    } else {
      log(`Error updating sync timestamp: ${error.message}`);
      throw error;
    }
  }
}
