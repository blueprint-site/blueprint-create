import dotenv from 'dotenv';
dotenv.config();

import { Client, Databases } from 'node-appwrite';
import { getStaticFile, interpolate, throwIfMissing } from './utils.js';
import { MeiliSearch } from 'meilisearch';
import { SYNC_CONFIG, REQUIRED_ENV_VARS, DATABASE_ID } from './config.js';
import { syncIndex } from './indexManager.js';

export default async ({ req, res, log, error = log }) => {
  throwIfMissing(process.env, REQUIRED_ENV_VARS);

  log('Environment Variables:', {
    MEILISEARCH_ENDPOINT: process.env.MEILISEARCH_ENDPOINT ? 'Set' : 'Missing',
    MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY ? 'Set' : 'Missing',
    APPWRITE_FUNCTION_API_ENDPOINT: process.env.APPWRITE_FUNCTION_API_ENDPOINT ? 'Set' : 'Missing',
    APPWRITE_FUNCTION_PROJECT_ID: process.env.APPWRITE_FUNCTION_PROJECT_ID ? 'Set' : 'Missing',
    APPWRITE_FUNCTION_API_KEY: req.headers['x-appwrite-key'] || process.env.APPWRITE_FUNCTION_API_KEY ? 'Set' : 'Missing',
  });

  log('Sync Config:', SYNC_CONFIG);

  if (req.method === 'GET') {
    const html = interpolate(getStaticFile('index.html'), {
      MEILISEARCH_ENDPOINT: process.env.MEILISEARCH_ENDPOINT,
      MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY,
    });

    return res.text(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);

  // Debug environment variables
  log('[DEBUG] APPWRITE_FUNCTION_API_ENDPOINT:', process.env.APPWRITE_FUNCTION_API_ENDPOINT);
  log('[DEBUG] APPWRITE_FUNCTION_PROJECT_ID:', process.env.APPWRITE_FUNCTION_PROJECT_ID);
  log('[DEBUG] APPWRITE_FUNCTION_API_KEY:', process.env.APPWRITE_FUNCTION_API_KEY);
  log('[DEBUG] MEILISEARCH_ENDPOINT:', process.env.MEILISEARCH_ENDPOINT);
  log('[DEBUG] MEILISEARCH_ADMIN_API_KEY:', process.env.MEILISEARCH_ADMIN_API_KEY);
  log('[DEBUG] MEILISEARCH_SEARCH_API_KEY:', process.env.MEILISEARCH_SEARCH_API_KEY);
  log('[DEBUG] Collection IDs:', JSON.stringify(SYNC_CONFIG.map(c => `${c.indexName} -> ${c.collectionId}`)));

  try {
    const { collections } = await databases.listCollections(DATABASE_ID);
    log(` [DEBUG] Available Appwrite collections in database '${DATABASE_ID}':`, collections.map(c => c.$id));
  } catch (e) {
    error('[DEBUG] Error listing collections:', e.message);
  }

  const meilisearch = new MeiliSearch({
    host: process.env.MEILISEARCH_ENDPOINT,
    apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
  });
  // Normalize request body: object or parsed JSON string
  let parsedBody = {};
  if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  } else if (typeof req.body === 'string' && req.body.trim()) {
    try {
      parsedBody = JSON.parse(req.body);
    } catch (e) {
      error(`❌ Failed to parse request body: ${e.message}`);
    }
  }
  log('[DEBUG] Request body:', parsedBody);
  log('[DEBUG] Request query:', req.query);

  // Check for force full sync parameter
  const forceFullSync = parsedBody.forceFullSync === true || req.query?.forceFullSync === 'true';
  
  if (forceFullSync) {
    log('🔄 Force full sync requested - will ignore last sync timestamps');
  }

  // Check for delete-all option
  const deleteAll = parsedBody.deleteAll === true || req.query?.deleteAll === 'true';
  if (deleteAll) {
    log('🗑️ Delete-all requested - removing every document from all indexes');
  }

  const results = {};
  let totalSynced = 0;
  let totalDeleted = 0;
  // Iterate over each index: delete all documents or perform sync

  for (const config of SYNC_CONFIG) {
    if (deleteAll) {
      try {
        const idx = meilisearch.index(config.indexName);
        // uruchom usuwanie
        const { taskUid } = await idx.deleteAllDocuments();
        // czekaj aż Meili zakończy operację
        await meilisearch.waitForTask(taskUid);
        log(`🗑️ ${config.indexName}: all documents deleted`);
        results[config.indexName] = { deletedAll: true };
        totalDeleted += 1;
      } catch (err) {
        error(`❌ Error deleting all documents from ${config.indexName}: ${err.message}`);
        results[config.indexName] = { error: err.message };
      }
      continue;
    }
    try {
      const result = await syncIndex(databases, meilisearch, config, log, forceFullSync);
      results[config.indexName] = result;
      totalSynced += result.synced;
      totalDeleted += result.deleted;
      log(`✅ ${config.indexName}: ${result.synced} synced, ${result.deleted} deleted`);
    } catch (err) {
      error(`❌ Error syncing ${config.indexName}: ${err.message}`);
      results[config.indexName] = { error: err.message };
    }
  }

  log(`🎉 All operations completed! Total: ${totalSynced} synced, ${totalDeleted} deleted`);
  return res.json({
    success: true,
    message: deleteAll ? 'All documents deleted' : 'All indexes synced',
    syncType: deleteAll ? 'deleteAll' : (forceFullSync ? 'full' : 'incremental'),
    results,
    totals: {
      synced: totalSynced,
      deleted: totalDeleted
    }
  }, 200);
};
