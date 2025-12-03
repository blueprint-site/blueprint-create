# Deployment Guide: Real-time Document Sync to Meilisearch

This guide walks you through deploying the real-time document synchronization function to your Appwrite project.

## Prerequisites

- Appwrite project with database collections to sync
- Running Meilisearch instance with admin API access
- Appwrite admin access for function deployment

## Step-by-Step Deployment

### 1. Prepare Environment Variables

Before deployment, gather the following information:

| Variable                         | Description                | Example                        |
| -------------------------------- | -------------------------- | ------------------------------ |
| `APPWRITE_FUNCTION_API_ENDPOINT` | Your Appwrite API endpoint | `https://cloud.appwrite.io/v1` |
| `APPWRITE_FUNCTION_PROJECT_ID`   | Your Appwrite project ID   | `64f8a9b2c1e5d6f7a8b9c0d1`     |
| `MEILISEARCH_ENDPOINT`           | Meilisearch server URL     | `https://your-meilisearch.com` |
| `MEILISEARCH_ADMIN_API_KEY`      | Meilisearch admin API key  | `your-admin-key-here`          |

### 2. Configure Collection Mapping

Edit `src/config.js` to match your collections:

```javascript
export const COLLECTION_INDEX_MAPPING = {
  your_collection_1: 'search_index_1',
  your_collection_2: 'search_index_2',
  // Add all collections you want to sync
};
```

### 3. Deploy Function

#### Option A: Manual Deployment (Recommended for first deployment)

1. **Create Function**

   - Go to Appwrite Console → Functions
   - Click "Create function"
   - Select "Manual" deployment
   - Fill in function details:
     - **Name**: `Sync Document to Meilisearch`
     - **Function ID**: `sync-document-to-meilisearch`
     - **Runtime**: `Node.js 18.0`
     - **Entrypoint**: `src/main.js`

2. **Upload Code**

   - Zip the entire function directory
   - Upload via the console or use Appwrite CLI

3. **Set Environment Variables**

   - Go to Function → Settings → Environment variables
   - Add all required variables from step 1

4. **Configure Scopes**
   - Go to Function → Settings → Scopes
   - Add: `databases.read`

#### Option B: CLI Deployment

```bash
# Install Appwrite CLI if not already installed
npm install -g appwrite-cli

# Login to your Appwrite project
appwrite login

# Deploy function
appwrite functions create \
  --functionId sync-document-to-meilisearch \
  --name "Sync Document to Meilisearch" \
  --runtime node-18.0 \
  --entrypoint src/main.js \
  --timeout 300

# Set environment variables
appwrite functions updateVariables \
  --functionId sync-document-to-meilisearch \
  --variables MEILISEARCH_ENDPOINT=your-endpoint \
  --variables MEILISEARCH_ADMIN_API_KEY=your-key
```

### 4. Configure Event Triggers

For each collection in your `COLLECTION_INDEX_MAPPING`, add these event triggers:

1. Go to Function → Settings → Events
2. Add the following patterns (replace `[DATABASE_ID]` and `[COLLECTION_ID]`):

```
databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.create
databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.update
databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.delete
```

**Example for 'addons' collection in 'main' database:**

```
databases.main.collections.addons.documents.*.create
databases.main.collections.addons.documents.*.update
databases.main.collections.addons.documents.*.delete
```

### 5. Test Deployment

#### Method 1: Health Check

Visit your function's URL with a GET request:

```
https://[PROJECT_ID].appwrite.global/functions/sync-document-to-meilisearch
```

This will return a health check report showing:

- Meilisearch connectivity
- Index status
- Configuration summary

#### Method 2: Trigger Test Event

Create, update, or delete a document in one of your configured collections and check the function logs.

#### Method 3: Use Test Script

Run the local test script:

```bash
cd "functions/Sync Document to Meilisearch"
npm install
node test-local.js
```

### 6. Monitor Function

#### Check Logs

- Go to Function → Executions
- Monitor for successful sync operations
- Look for error patterns

#### Key Log Messages

- `✅ Sync completed successfully` - Normal operation
- `⏭️ Collection [name] not configured for sync` - Collection not in mapping
- `❌ Sync failed` - Error occurred, check details

### 7. Production Considerations

#### Security

- Use dedicated Meilisearch API keys with minimal required permissions
- Regularly rotate API keys
- Monitor function execution logs for security issues

#### Performance

- Monitor function execution time (should be < 5 seconds typically)
- Watch for Meilisearch rate limiting
- Consider function timeout settings (default: 300 seconds)

#### Reliability

- Set up monitoring alerts for function failures
- Consider implementing dead letter queues for failed syncs
- Monitor Meilisearch disk space and performance

## Troubleshooting

### Common Issues

| Problem                                  | Solution                                                          |
| ---------------------------------------- | ----------------------------------------------------------------- |
| "Missing required environment variables" | Verify all environment variables are set in function settings     |
| "Collection not configured for sync"     | Add collection to `COLLECTION_INDEX_MAPPING` and redeploy         |
| "Index not found" errors                 | Function will auto-create indexes; check Meilisearch connectivity |
| Events not triggering                    | Verify event patterns match your database/collection IDs exactly  |
| Permission denied                        | Add `databases.read` scope to function settings                   |

### Debug Steps

1. **Check Function Status**

   ```bash
   curl https://[PROJECT_ID].appwrite.global/functions/sync-document-to-meilisearch
   ```

2. **View Recent Logs**

   - Go to Function → Executions
   - Check latest execution logs

3. **Test Meilisearch Connection**

   - Verify Meilisearch is accessible from your Appwrite environment
   - Test API key permissions

4. **Validate Event Format**
   - Check that events are being generated correctly
   - Verify event patterns in function settings

## Adding New Collections

To sync a new collection:

1. **Update Configuration**

   ```javascript
   // In src/config.js
   export const COLLECTION_INDEX_MAPPING = {
     // ...existing mappings...
     new_collection: 'new_search_index',
   };
   ```

2. **Redeploy Function**

   - Upload updated code
   - Create new deployment

3. **Add Event Triggers**

   ```
   databases.[DATABASE_ID].collections.new_collection.documents.*.create
   databases.[DATABASE_ID].collections.new_collection.documents.*.update
   databases.[DATABASE_ID].collections.new_collection.documents.*.delete
   ```

4. **Test**
   - Create a test document in the new collection
   - Verify it appears in Meilisearch

## Rollback Plan

If issues occur:

1. **Disable Function**

   - Go to Function → Settings
   - Toggle "Enabled" to off

2. **Remove Event Triggers**

   - Clear all events in Function → Settings → Events

3. **Investigate**

   - Check function logs
   - Test in development environment

4. **Re-enable**
   - Fix issues
   - Re-enable function and events

The batch sync function can handle any documents that were missed during downtime.
