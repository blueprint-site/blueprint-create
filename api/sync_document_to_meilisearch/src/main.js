import { Client, Databases } from 'node-appwrite';
import { MeiliSearch } from 'meilisearch';
import { COLLECTION_INDEX_MAPPING, REQUIRED_ENV_VARS } from './config.js';
import {
  throwIfMissing,
  parseEventData,
  isSupportedCollection,
  getIndexNameForCollection,
} from './utils.js';
import {
  syncDocumentCreate,
  syncDocumentUpdate,
  syncDocumentDelete,
  ensureIndexExists,
} from './meilisearchSync.js';
import { performHealthCheck, formatHealthReport } from './healthCheck.js';

/**
 * Main function handler for real-time document synchronization
 * @param {Object} context - Appwrite function context
 * @returns {Object} Function response
 */
export default async ({ req, res, log, error }) => {
  const startTime = Date.now();

  try {
    // Validate required environment variables
    throwIfMissing(process.env, REQUIRED_ENV_VARS);

    // Handle GET requests for health checks and status
    if (req.method === 'GET') {
      if (req.path === '/test' || req.query?.test) {
        log('🧪 Manual test requested - simulating document sync');

        // Create a test event for the addons collection
        const testEvent = {
          events: ['databases.main.collections.addons.documents.test123.update'],
          payload: {
            $id: 'test123',
            $collectionId: 'addons',
            $databaseId: 'main',
            name: 'Test Addon',
            description: 'This is a test addon for manual sync testing',
            authors: ['Test Author'],
            downloads: 100,
            sources: ['test'],
          },
        };

        // Process the test event
        req.body = testEvent;
        log('🔄 Processing test event...');
        // Continue with normal processing
      } else {
        log('🏥 Health check requested');

        const healthCheck = await performHealthCheck(
          process.env.MEILISEARCH_ENDPOINT,
          process.env.MEILISEARCH_ADMIN_API_KEY
        );

        // Return formatted report if requesting text/plain, otherwise JSON
        const acceptHeader = req.headers.accept || '';
        if (acceptHeader.includes('text/plain') || req.query?.format === 'text') {
          const report = formatHealthReport(healthCheck);
          return res.text(report, 200, { 'Content-Type': 'text/plain; charset=utf-8' });
        }
        context.log(healthCheck);
        return res.json(healthCheck, healthCheck.overall.status === 'healthy' ? 200 : 503);
      }
    }

    log('🚀 Starting real-time document sync to Meilisearch');

    // Debug: Log comprehensive request information
    log(`📋 Request method: ${req.method}`);
    log(`📋 Request headers:`, JSON.stringify(req.headers, null, 2));
    log(`📋 Request path: ${req.path || 'undefined'}`);
    log(`📋 Request query:`, JSON.stringify(req.query || {}, null, 2));

    // Debug: Log the complete request body structure
    if (req.body) {
      log(`📋 Request body type: ${typeof req.body}`);
      log(`📋 Request body keys: [${Object.keys(req.body).join(', ')}]`);
      log(`📋 Full request body:`, JSON.stringify(req.body, null, 2));
    } else {
      log(`📋 Request body is: ${req.body}`);
    }

    // Check if this is triggered by an event - handle different event structures
    const hasEvents = req.body?.events || req.body?.event || req.body?.$id;
    if (!hasEvents) {
      error('⚠️  No event data found in request body');
      error(`Expected one of: 'events', 'event', or '$id' in request body`);
      error(`Got keys: [${req.body ? Object.keys(req.body).join(', ') : 'no body'}]`);

      return res.json(
        {
          success: false,
          message: 'This function should be triggered by Appwrite database events',
          debug: {
            bodyKeys: req.body ? Object.keys(req.body) : 'no body',
            bodyType: typeof req.body,
            hasEvents: !!req.body?.events,
            hasEvent: !!req.body?.event,
            hasId: !!req.body?.$id,
          },
          timestamp: new Date().toISOString(),
        },
        400
      );
    }

    log(
      `✅ Event data detected. Structure type: ${req.body?.events ? 'events array' : req.body?.event ? 'event string' : '$id direct'}`
    );

    // Parse event data
    let eventInfo;
    try {
      log(`🔍 Attempting to parse event data...`);
      eventInfo = parseEventData(req.body);
      log(`✅ Event parsed successfully:`, JSON.stringify(eventInfo, null, 2));
      log(
        `📋 Event details: ${eventInfo.action} on ${eventInfo.collectionId}/${eventInfo.documentId}`
      );
      log(`📋 Database ID: ${eventInfo.databaseId}`);
      log(`📋 Payload type: ${typeof eventInfo.payload}`);
      log(
        `📋 Payload keys: [${eventInfo.payload ? Object.keys(eventInfo.payload).join(', ') : 'no payload'}]`
      );
    } catch (parseError) {
      error(`❌ Failed to parse event data: ${parseError.message}`);
      error(`❌ Parse error stack:`, parseError.stack);
      error(`❌ Raw event data being parsed:`, JSON.stringify(req.body, null, 2));

      return res.json(
        {
          success: false,
          message: 'Invalid event data format',
          error: parseError.message,
          debug: {
            errorStack: parseError.stack,
            rawEventData: req.body,
          },
          timestamp: new Date().toISOString(),
        },
        400
      );
    }

    // Check if the collection is supported
    if (!isSupportedCollection(eventInfo.collectionId, COLLECTION_INDEX_MAPPING)) {
      log(`⏭️  Collection ${eventInfo.collectionId} not configured for sync - skipping`);
      return res.json({
        success: true,
        message: `Collection ${eventInfo.collectionId} not configured for sync`,
        skipped: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Get target index name
    const indexName = getIndexNameForCollection(eventInfo.collectionId, COLLECTION_INDEX_MAPPING);
    log(`🎯 Target Meilisearch index: ${indexName}`);

    // Initialize Appwrite client (for getting document data if needed)
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Initialize Meilisearch client
    log(`🔗 Initializing Meilisearch client...`);
    log(`🔗 Meilisearch endpoint: ${process.env.MEILISEARCH_ENDPOINT}`);
    log(`🔗 Has Meilisearch API key: ${!!process.env.MEILISEARCH_ADMIN_API_KEY}`);

    const meilisearch = new MeiliSearch({
      host: process.env.MEILISEARCH_ENDPOINT,
      apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
    });

    // Ensure the target index exists
    log(`🏗️  Ensuring index '${indexName}' exists...`);
    await ensureIndexExists(meilisearch, indexName, log);
    log(`✅ Index '${indexName}' ready`);

    let syncResult;

    // Handle different event types
    log(`🔄 Processing ${eventInfo.action} action for document ${eventInfo.documentId}`);

    switch (eventInfo.action) {
      case 'create':
        log(`📝 Processing document creation: ${eventInfo.documentId}`);
        log(`📝 Payload has $id: ${!!eventInfo.payload?.$id}`);
        log(
          `📝 Payload keys: [${eventInfo.payload ? Object.keys(eventInfo.payload).join(', ') : 'no payload'}]`
        );

        if (!eventInfo.payload || !eventInfo.payload.$id) {
          error('❌ Create event missing document payload');
          error(`❌ Payload: ${JSON.stringify(eventInfo.payload, null, 2)}`);
          throw new Error('Create event missing document payload');
        }
        syncResult = await syncDocumentCreate(meilisearch, indexName, eventInfo.payload, log);
        break;

      case 'update':
        log(`✏️  Processing document update: ${eventInfo.documentId}`);
        log(`✏️  Payload has $id: ${!!eventInfo.payload?.$id}`);
        log(
          `✏️  Payload keys: [${eventInfo.payload ? Object.keys(eventInfo.payload).join(', ') : 'no payload'}]`
        );

        if (!eventInfo.payload || !eventInfo.payload.$id) {
          error('❌ Update event missing document payload');
          error(`❌ Payload: ${JSON.stringify(eventInfo.payload, null, 2)}`);
          throw new Error('Update event missing document payload');
        }
        syncResult = await syncDocumentUpdate(meilisearch, indexName, eventInfo.payload, log);
        break;

      case 'delete':
        log(`🗑️  Processing document deletion: ${eventInfo.documentId}`);
        syncResult = await syncDocumentDelete(meilisearch, indexName, eventInfo.documentId, log);
        break;

      default:
        log(`⚠️  Unknown action: ${eventInfo.action}`);
        return res.json(
          {
            success: false,
            message: `Unknown action: ${eventInfo.action}`,
            timestamp: new Date().toISOString(),
          },
          400
        );
    }

    const executionTime = Date.now() - startTime;
    log(`✅ Sync completed successfully in ${executionTime}ms`);

    return res.json({
      success: true,
      message: `Document ${eventInfo.action} synced successfully`,
      data: {
        action: eventInfo.action,
        collectionId: eventInfo.collectionId,
        documentId: eventInfo.documentId,
        indexName: indexName,
        meilisearchTaskUid: syncResult.taskUid,
        executionTimeMs: executionTime,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const executionTime = Date.now() - startTime;
    error(`❌ Sync failed after ${executionTime}ms: ${err.message}`);
    error(`Stack trace: ${err.stack}`);

    return res.json(
      {
        success: false,
        message: 'Document sync failed',
        error: err.message,
        executionTimeMs: executionTime,
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
};
