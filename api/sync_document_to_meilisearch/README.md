# Real-time Document Sync to Meilisearch

This Appwrite Function provides real-time synchronization of document changes (create, update, delete) from Appwrite collections to corresponding Meilisearch indexes.

## Features

- **Real-time sync**: Triggered by Appwrite database events
- **Multi-action support**: Handles create, update, and delete operations
- **Error handling**: Robust error handling with retry mechanisms
- **Configurable**: Easy to configure for new collections/indexes
- **Automatic index creation**: Creates Meilisearch indexes if they don't exist
- **Comprehensive logging**: Detailed logging for monitoring and debugging

## Configuration

### Environment Variables

#### Required

- `APPWRITE_FUNCTION_API_ENDPOINT`: Your Appwrite API endpoint
- `APPWRITE_FUNCTION_PROJECT_ID`: Your Appwrite project ID
- `MEILISEARCH_ENDPOINT`: Your Meilisearch server endpoint
- `MEILISEARCH_ADMIN_API_KEY`: Meilisearch admin API key (with write permissions)

#### Optional

- `APPWRITE_DATABASE_ID`: Database ID to sync from (defaults to 'main')
- `APPWRITE_API_KEY`: API key for Appwrite (if not using function's built-in key)

### Collection-Index Mapping

Edit `src/config.js` to configure which Appwrite collections should sync to which Meilisearch indexes:

```javascript
export const COLLECTION_INDEX_MAPPING = {
  addons: 'addons',
  blogs: 'blogs',
  blog_tags: 'blog_tags',
  schematics: 'schematics',
  schematics_tags: 'schematics_tags',
  // Add new mappings here
  your_collection: 'your_index',
};
```

## Deployment

### 1. Create the Function

1. Go to your Appwrite Console → Functions
2. Click "Create function"
3. Choose "Manual" deployment method
4. Configure:
   - **Name**: "Sync Document to Meilisearch"
   - **Function ID**: `sync-document-to-meilisearch`
   - **Runtime**: Node.js 18.0
   - **Entrypoint**: `src/main.js`

### 2. Set Environment Variables

In Function Settings → Environment variables, add all required environment variables listed above.

### 3. Configure Events

In Function Settings → Events, add the following event triggers for each collection you want to sync:

For each collection in your `COLLECTION_INDEX_MAPPING`, add:

- `databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.create`
- `databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.update`
- `databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.*.delete`

**Example** (for 'addons' collection in 'main' database):

- `databases.main.collections.addons.documents.*.create`
- `databases.main.collections.addons.documents.*.update`
- `databases.main.collections.addons.documents.*.delete`

### 4. Set Permissions

In Function Settings → Scopes, ensure the function has the following permissions:

- `databases.read` (to read document data if needed)
- Any other scopes your specific use case requires

### 5. Deploy

Upload your function code and click "Deploy".

## Usage

Once deployed and configured, the function will automatically:

1. **Listen for events**: React to document changes in configured collections
2. **Transform data**: Convert Appwrite documents to Meilisearch format
3. **Sync to Meilisearch**: Add, update, or delete documents in the corresponding index
4. **Handle errors**: Retry failed operations with exponential backoff
5. **Log activity**: Provide detailed logs for monitoring

## Event Handling

The function handles three types of events:

### Create Events

- Triggered when a new document is created
- Adds the document to the corresponding Meilisearch index
- Uses the Appwrite document ID as the Meilisearch document ID

### Update Events

- Triggered when a document is updated
- Updates the existing document in Meilisearch
- Replaces the entire document (Meilisearch behavior)

### Delete Events

- Triggered when a document is deleted
- Removes the document from the Meilisearch index
- Uses the document ID from the event

## Data Transformation

The function automatically transforms Appwrite documents for Meilisearch by:

1. Using `$id` as the Meilisearch document `id`
2. Removing Appwrite-specific fields:
   - `$id` (converted to `id`)
   - `$collectionId`
   - `$databaseId`
   - `$permissions`

## Monitoring

### Logs

Check the function execution logs in the Appwrite Console to monitor:

- Successful sync operations
- Error messages and retry attempts
- Performance metrics (execution time)

### Response Format

Successful responses include:

```json
{
  "success": true,
  "message": "Document create synced successfully",
  "data": {
    "action": "create",
    "collectionId": "addons",
    "documentId": "doc123",
    "indexName": "addons",
    "meilisearchTaskUid": 456,
    "executionTimeMs": 150
  },
  "timestamp": "2025-05-30T10:30:00.000Z"
}
```

## Troubleshooting

### Common Issues

1. **"Collection not configured for sync"**

   - Add the collection to `COLLECTION_INDEX_MAPPING` in `src/config.js`
   - Redeploy the function

2. **"Index not found" errors**

   - The function automatically creates indexes, but ensure Meilisearch is accessible
   - Check Meilisearch admin API key permissions

3. **Event not triggering**

   - Verify event patterns in Function Settings → Events
   - Ensure database and collection IDs match exactly
   - Check that the function is deployed and active

4. **Permission errors**
   - Verify function scopes include necessary database permissions
   - Check that API keys have appropriate permissions

### Performance Considerations

- **Individual sync**: This function syncs one document at a time (real-time)
- **Initial sync**: For bulk/initial sync, use the existing "Sync Meilisearch" function
- **Rate limiting**: Meilisearch has rate limits; the function includes retry logic

## Adding New Collections

To sync a new collection:

1. Add the mapping to `COLLECTION_INDEX_MAPPING` in `src/config.js`
2. Redeploy the function
3. Add event triggers for the new collection:
   - `databases.[DATABASE_ID].collections.[NEW_COLLECTION_ID].documents.*.create`
   - `databases.[DATABASE_ID].collections.[NEW_COLLECTION_ID].documents.*.update`
   - `databases.[DATABASE_ID].collections.[NEW_COLLECTION_ID].documents.*.delete`

The function will automatically create the Meilisearch index on first sync if it doesn't exist.

## Integration with Existing Sync

This real-time function complements the existing "Sync Meilisearch" function:

- **Batch function**: Use for initial data loads and periodic full syncs
- **Real-time function**: Use for ongoing document changes

Both functions can work together without conflicts.
