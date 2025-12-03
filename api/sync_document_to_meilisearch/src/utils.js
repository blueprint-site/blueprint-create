import { MAX_RETRY_ATTEMPTS, RETRY_DELAY } from './config.js';

/**
 * Throws an error if any required environment variables are missing
 * @param {Object} env - Environment variables object
 * @param {string[]} requiredVars - Array of required environment variable names
 */
export function throwIfMissing(env, requiredVars) {
  const missing = requiredVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Get environment variable with optional default value
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if key is not found
 * @returns {string} Environment variable value or default
 */
export function getEnvVar(key, defaultValue = null) {
  return process.env[key] || defaultValue;
}

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with the function result
 */
export async function retryWithBackoff(
  fn,
  maxAttempts = MAX_RETRY_ATTEMPTS,
  baseDelay = RETRY_DELAY
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Parse event data from Appwrite event payload
 * @param {Object} eventData - Event data from Appwrite
 * @returns {Object} Parsed event information
 */
export function parseEventData(eventData) {
  console.log('🔍 parseEventData called with:', JSON.stringify(eventData, null, 2));

  // Handle different event structures
  let eventString;
  let payload;

  if (eventData.events && Array.isArray(eventData.events)) {
    // Structure: { events: ["databases.xxx.collections.yyy.documents.zzz.create"], payload: {...} }
    console.log('📋 Detected events array structure');
    eventString = eventData.events[0];
    payload = eventData.payload || eventData;
    console.log('📋 Event string:', eventString);
    console.log('📋 Payload keys:', payload ? Object.keys(payload) : 'no payload');
  } else if (eventData.event) {
    // Structure: { event: "databases.xxx.collections.yyy.documents.zzz.create", ...document }
    console.log('📋 Detected event string structure');
    eventString = eventData.event;
    payload = eventData;
    console.log('📋 Event string:', eventString);
  } else if (eventData.$collectionId && eventData.$databaseId) {
    // Direct document structure - try to infer action
    console.log('📋 Detected direct document structure');
    console.log('📋 Document ID:', eventData.$id);
    console.log('📋 Collection ID:', eventData.$collectionId);
    console.log('📋 Database ID:', eventData.$databaseId);

    return {
      databaseId: eventData.$databaseId,
      collectionId: eventData.$collectionId,
      documentId: eventData.$id,
      action: 'update', // Default to update for direct document events
      payload: eventData,
    };
  } else {
    console.error('❌ Unable to parse event structure');
    console.error('❌ Available keys:', Object.keys(eventData));
    throw new Error(`Unable to parse event structure: ${JSON.stringify(Object.keys(eventData))}`);
  }

  // Parse event string: databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.[DOCUMENT_ID].[ACTION]
  const eventParts = eventString?.split('.') || [];
  console.log('📋 Event parts:', eventParts);

  if (eventParts.length < 6) {
    console.error('❌ Invalid event format - not enough parts');
    console.error('❌ Expected format: databases.DB.collections.COLL.documents.DOC.ACTION');
    console.error('❌ Got parts:', eventParts);
    throw new Error(`Invalid event format: ${eventString}`);
  }

  const parsedEvent = {
    databaseId: eventParts[1],
    collectionId: eventParts[3],
    documentId: eventParts[5],
    action: eventParts[6], // create, update, delete
    payload: payload,
  };

  console.log('✅ Successfully parsed event:', JSON.stringify(parsedEvent, null, 2));
  return parsedEvent;
}

/**
 * Transform Appwrite document for Meilisearch
 * @param {Object} document - Appwrite document
 * @returns {Object} Transformed document for Meilisearch
 */
export function transformDocumentForMeilisearch(document) {
  // Create a copy and ensure $id is preserved for Meilisearch
  const transformed = {
    ...document,
  };

  // Remove Appwrite-specific fields that might not be needed in search, but keep $id
  delete transformed.$collectionId;
  delete transformed.$databaseId;
  delete transformed.$permissions;

  // Ensure $id exists (Meilisearch requires this as the document identifier)
  if (!transformed.$id && document.id) {
    transformed.$id = document.id;
  }

  return transformed;
}

/**
 * Validate that the event is for a supported collection
 * @param {string} collectionId - Collection ID from the event
 * @param {Object} mapping - Collection to index mapping
 * @returns {boolean} True if collection is supported
 */
export function isSupportedCollection(collectionId, mapping) {
  return collectionId in mapping;
}

/**
 * Get Meilisearch index name for a collection
 * @param {string} collectionId - Appwrite collection ID
 * @param {Object} mapping - Collection to index mapping
 * @returns {string} Meilisearch index name
 */
export function getIndexNameForCollection(collectionId, mapping) {
  return mapping[collectionId];
}
