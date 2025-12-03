import { syncWithCleanup, syncSimple } from './syncStrategies.js';

/**
 * Ensure Meilisearch index exists, create if it doesn't
 * @param {Object} meilisearch - MeiliSearch client instance
 * @param {string} indexName - Name of the index to check/create
 * @param {Function} log - Logging function
 * @returns {Object} Meilisearch index instance
 */
export async function ensureIndexExists(meilisearch, indexName, log) {
  try {
    await meilisearch.getIndex(indexName);
    log(`Index '${indexName}' already exists.`);
  } catch (error) {
    if (error.code === 'index_not_found') {
      log(`Index '${indexName}' not found. Creating...`);
      // Create index and wait for creation task to complete
      const { taskUid: createTask } = await meilisearch.createIndex(indexName, { primaryKey: 'id' });
      await meilisearch.waitForTask(createTask);
      log(`Index '${indexName}' created successfully.`);
    } else {
      throw error;
    }
  }
  
  // After ensuring index exists, ensure all fields are returned in full
  // Disable cropping and wait for settings update
  const settingsIndex = meilisearch.index(indexName);
  const { taskUid: settingsTask } = await settingsIndex.updateSettings({ displayedAttributes: ['*'] });
  await settingsIndex.waitForTask(settingsTask);
  return settingsIndex;
}

/**
 * Sync a single index based on configuration
 * @param {Object} databases - Appwrite Databases instance
 * @param {Object} meilisearch - MeiliSearch client instance
 * @param {Object} config - Sync configuration object
 * @param {Function} log - Logging function
 * @param {boolean} forceFullSync - Force full sync even if timestamp exists
 * @returns {Object} Sync results { synced, deleted }
 */
export async function syncIndex(databases, meilisearch, config, log, forceFullSync = false) {
  const { indexName, collectionId, hasObsoleteCleanup } = config;
  
  log(`Starting sync for ${indexName}...`);
  
  // Ensure index exists
  const index = await ensureIndexExists(meilisearch, indexName, log);
  // If full sync is forced, delete all existing documents in the index
  if (forceFullSync) {
    log(`🧹 Force full sync (wipe all) requested - deleting all existing documents`);
    await index.deleteAllDocuments();
  }

  if (hasObsoleteCleanup) {
    // Full sync with obsolete document cleanup
    return await syncWithCleanup(databases, index, collectionId, log, forceFullSync);
  } else {
    // Simple sync - just add/update documents
    return await syncSimple(databases, index, collectionId, log, forceFullSync);
  }
}
