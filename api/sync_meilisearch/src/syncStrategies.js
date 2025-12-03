import { Query } from 'node-appwrite';
import { DATABASE_ID } from './config.js';

/**
 * Perform a full sync with cleanup of obsolete documents
 * @param {Object} databases - Appwrite Databases instance
 * @param {Object} index - Meilisearch index instance
 * @param {string} collectionName - Appwrite collection name
 * @param {Function} log - Logging function
 * @param {boolean} forceFullSync - Force full sync even if timestamp exists
 * @returns {Object} Sync results { synced, deleted }
 */
export async function syncWithCleanup(databases, index, collectionId, log, forceFullSync = false) {
  // Always perform full sync with cleanup (metadata tracking removed)
  let totalSynced = 0;
  let totalDeleted = 0;
  log('Performing full sync with cleanup of obsolete documents');
  // Step 1: Get all IDs from Meilisearch
  const meiliIds = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const meilisearchDocuments = await index.getDocuments({ fields: ['$id'], limit, offset });
    if (meilisearchDocuments.results.length === 0) break;
    meiliIds.push(...meilisearchDocuments.results.map(doc => doc.$id));
    offset += limit;
  }
  // Step 2: Sync all documents from Appwrite
  let appwriteIds = [];
  let cursor = null;
  do {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const response = await databases.listDocuments(DATABASE_ID, collectionId, queries);
    if (response.documents.length === 0) break;
    cursor = response.documents[response.documents.length - 1].$id;
    appwriteIds.push(...response.documents.map(doc => doc.$id));
    totalSynced += response.documents.length;
    log(`Syncing chunk of ${response.documents.length} documents...`);
    // Map Appwrite $id to $id for MeiliSearch
    // Map Appwrite $id to $id and include only user-defined fields (exclude system fields)
    const mapped = response.documents.map(doc => {
      const { $id, ...rest } = doc;
      const userFields = {};
      for (const [key, value] of Object.entries(rest)) {
        if (!key.startsWith('$')) userFields[key] = value;
      }
      return { $id, ...userFields };
    }).filter(doc => doc.$id && Object.keys(doc).length > 1); // Ensure ID exists and has content
    
    // Debug mapped documents before sending
    if (mapped.length > 0) {
      log('DEBUG sample mapped document keys:', Object.keys(mapped[0]));
      log('DEBUG sample mapped document:', JSON.stringify(mapped[0]));
      log('DEBUG all document IDs being sent:', mapped.map(d => d.$id));
    }
    
    // add documents and wait for indexing to complete
    // use updateDocuments (PUT) to upsert documents by primaryKey
    const { taskUid: updateTask } = await index.updateDocuments(mapped);
    log(`📝 updateDocuments(task: ${updateTask}) called for ${mapped.length} docs`);
    
    // Wait for task and check result
    const taskResult = await index.waitForTask(updateTask);
    log(`📝 Task ${updateTask} result:`, JSON.stringify(taskResult, null, 2));
    
    if (taskResult.status !== 'succeeded') {
      log(`❌ Task failed:`, JSON.stringify(taskResult, null, 2));
      throw new Error(`Meilisearch task failed: ${taskResult.error?.message || 'Unknown error'}`);
    }
    
    // Verify documents exist after sync
    const stats = await index.getStats();
    log(`📊 Index stats after sync:`, JSON.stringify(stats, null, 2));
    
    // Get a few documents to verify they were added
    const testDocs = await index.getDocuments({ limit: 3 });
    log(`📄 Sample documents in index:`, JSON.stringify(testDocs, null, 2));
  } while (true);
  // Step 3: Delete obsolete documents
  const idsToDelete = meiliIds.filter(id => !appwriteIds.includes(id));
  totalDeleted = idsToDelete.length;
  if (totalDeleted > 0) {
    log(`Found ${totalDeleted} obsolete documents to delete`);
    for (let i = 0; i < idsToDelete.length; i += limit) {
      const batch = idsToDelete.slice(i, i + limit);
      // delete documents and wait for deletion to complete
      const { taskUid: delTask } = await index.deleteDocuments(batch);
      log(`🗑️ deleteDocuments(task: ${delTask}) called for ${batch.length} docs`);
      await index.waitForTask(delTask);
      log(`Deleted ${batch.length} obsolete documents`);
    }
  }
  return { synced: totalSynced, deleted: totalDeleted };
}

/**
 * Perform a simple sync (add/update only, no deletions)
 * @param {Object} databases - Appwrite Databases instance
 * @param {Object} index - Meilisearch index instance
 * @param {string} collectionName - Appwrite collection name
 * @param {Function} log - Logging function
 * @param {boolean} forceFullSync - Force full sync even if timestamp exists
 * @returns {Object} Sync results { synced, deleted }
 */
export async function syncSimple(databases, index, collectionId, log) {
  // Always perform full sync (metadata tracking removed)
  let totalSynced = 0;
  log('Performing full sync (simple)');
  let cursor = null;
  do {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const { documents } = await databases.listDocuments(DATABASE_ID, collectionId, queries);
    if (documents.length === 0) break;
    cursor = documents[documents.length - 1].$id;
    totalSynced += documents.length;
    log(`Syncing chunk of ${documents.length} documents...`);
    // Map Appwrite $id to $id for MeiliSearch
    // Map Appwrite $id to $id and include only user-defined fields
    const mapped = documents.map(doc => {
      const { $id, ...rest } = doc;
      const userFields = {};
      for (const [key, value] of Object.entries(rest)) {
        if (!key.startsWith('$')) userFields[key] = value;
      }
      return { $id, ...userFields };
    }).filter(doc => doc.$id && Object.keys(doc).length > 1); // Ensure ID exists and has content
    
    // Debug mapped documents before sending
    if (mapped.length > 0) {
      log('DEBUG sample mapped document keys:', Object.keys(mapped[0]));
      log('DEBUG sample mapped document:', JSON.stringify(mapped[0]));
      log('DEBUG all document IDs being sent:', mapped.map(d => d.$id));
    }
    
    // add documents and wait for indexing to complete
    // use updateDocuments (PUT) to upsert documents by primaryKey
    const { taskUid } = await index.updateDocuments(mapped);
    log(`📝 updateDocuments(task: ${taskUid}) called for ${mapped.length} docs`);
    
    // Wait for task and check result
    const taskResult = await index.waitForTask(taskUid);
    log(`📝 Task ${taskUid} result:`, JSON.stringify(taskResult, null, 2));
    
    if (taskResult.status !== 'succeeded') {
      log(`❌ Task failed:`, JSON.stringify(taskResult, null, 2));
      throw new Error(`Meilisearch task failed: ${taskResult.error?.message || 'Unknown error'}`);
    }
    
    // Verify documents exist after sync
    const stats = await index.getStats();
    log(`📊 Index stats after sync:`, JSON.stringify(stats, null, 2));
    
    // Get a few documents to verify they were added
    const testDocs = await index.getDocuments({ limit: 3 });
    log(`📄 Sample documents in index:`, JSON.stringify(testDocs, null, 2));
  } while (true);
  return { synced: totalSynced, deleted: 0 };
}
