import { retryWithBackoff, transformDocumentForMeilisearch } from './utils.js';

/**
 * Sync a document creation to Meilisearch
 * @param {Object} meilisearch - Meilisearch client instance
 * @param {string} indexName - Target Meilisearch index name
 * @param {Object} document - Document data from Appwrite
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Sync result
 */
export async function syncDocumentCreate(meilisearch, indexName, document, log) {
  const transformedDoc = transformDocumentForMeilisearch(document);

  const syncOperation = async () => {
    const index = meilisearch.index(indexName);
    const task = await index.addDocuments([transformedDoc]);
    log(`Document ${transformedDoc.id} added to ${indexName} (task: ${task.taskUid})`);
    return { taskUid: task.taskUid, action: 'create', documentId: transformedDoc.id };
  };

  return await retryWithBackoff(syncOperation);
}

/**
 * Sync a document update to Meilisearch
 * @param {Object} meilisearch - Meilisearch client instance
 * @param {string} indexName - Target Meilisearch index name
 * @param {Object} document - Updated document data from Appwrite
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Sync result
 */
export async function syncDocumentUpdate(meilisearch, indexName, document, log) {
  const transformedDoc = transformDocumentForMeilisearch(document);

  const syncOperation = async () => {
    const index = meilisearch.index(indexName);

    // Meilisearch's addDocuments will update existing documents with the same ID
    const task = await index.addDocuments([transformedDoc]);
    log(`Document ${transformedDoc.id} updated in ${indexName} (task: ${task.taskUid})`);
    return { taskUid: task.taskUid, action: 'update', documentId: transformedDoc.id };
  };

  return await retryWithBackoff(syncOperation);
}

/**
 * Sync a document deletion to Meilisearch
 * @param {Object} meilisearch - Meilisearch client instance
 * @param {string} indexName - Target Meilisearch index name
 * @param {string} documentId - ID of the document to delete
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Sync result
 */
export async function syncDocumentDelete(meilisearch, indexName, documentId, log) {
  const syncOperation = async () => {
    const index = meilisearch.index(indexName);
    const task = await index.deleteDocument(documentId);
    log(`Document ${documentId} deleted from ${indexName} (task: ${task.taskUid})`);
    return { taskUid: task.taskUid, action: 'delete', documentId };
  };

  return await retryWithBackoff(syncOperation);
}

/**
 * Check if a Meilisearch index exists, create if it doesn't
 * @param {Object} meilisearch - Meilisearch client instance
 * @param {string} indexName - Index name to check/create
 * @param {Function} log - Logging function
 * @returns {Promise<Object>} Index instance
 */
export async function ensureIndexExists(meilisearch, indexName, log) {
  try {
    // Try to get the index
    const index = meilisearch.index(indexName);
    await index.getRawInfo();
    log(`Index ${indexName} exists`);
    return index;
  } catch (error) {
    if (error.code === 'index_not_found') {
      log(`Index ${indexName} not found, creating...`);

      // Create the index
      const task = await meilisearch.createIndex(indexName);
      log(`Index ${indexName} creation initiated (task: ${task.taskUid})`);

      // Wait for index creation to complete
      await waitForTask(meilisearch, task.taskUid, log);

      const index = meilisearch.index(indexName);
      log(`Index ${indexName} created successfully`);
      return index;
    }
    throw error;
  }
}

/**
 * Wait for a Meilisearch task to complete
 * @param {Object} meilisearch - Meilisearch client instance
 * @param {number} taskUid - Task UID to wait for
 * @param {Function} log - Logging function
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds
 * @returns {Promise<Object>} Task result
 */
export async function waitForTask(meilisearch, taskUid, log, maxWaitTime = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const task = await meilisearch.getTask(taskUid);

      if (task.status === 'succeeded') {
        log(`Task ${taskUid} completed successfully`);
        return task;
      } else if (task.status === 'failed') {
        log(`Task ${taskUid} failed: ${task.error?.message || 'Unknown error'}`);
        throw new Error(`Meilisearch task failed: ${task.error?.message || 'Unknown error'}`);
      }

      // Task is still processing, wait a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      log(`Error checking task ${taskUid}: ${error.message}`);
      throw error;
    }
  }

  throw new Error(`Task ${taskUid} did not complete within ${maxWaitTime}ms`);
}
