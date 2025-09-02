# Bucket Cleaner Function

This Appwrite Function automatically identifies and removes orphaned files from storage buckets that are no longer referenced in the database.

## Features

- **Automatic Detection**: Scans multiple buckets for orphaned files
- **Database Reference Checking**: Verifies files against database references
- **Dry Run Mode**: Preview what would be deleted without actually removing files
- **Batch Processing**: Processes files in configurable batch sizes
- **Comprehensive Logging**: Detailed logs of all operations
- **Multi-Bucket Support**: Clean multiple buckets in a single execution

## Supported Buckets

The function supports cleaning the following buckets:

- `schematics_bucket` - Schematic files
- `67aee2b30000b9e21407` - User avatars and badge icons
- `67b2241e0032c25c8216` - Schematics storage
- `67b22481001e99d90888` - Schematic images

## How It Works

1. **Reference Collection**: The function first collects all file references from the database:
   - Schematic URLs from the `schematics` collection
   - Image URLs from schematic records
   - Avatar IDs from user preferences
   - Icon URLs from badges

2. **File Scanning**: Each bucket is scanned for all files

3. **Orphan Detection**: Files not found in the reference list are marked as orphaned

4. **Cleanup**: In non-dry-run mode, orphaned files are deleted

## Configuration

### Environment Variables

```bash
APPWRITE_FUNCTION_API_ENDPOINT=https://api.blueprint-create.com/v1
APPWRITE_FUNCTION_PROJECT_ID=your-project-id
APPWRITE_FUNCTION_API_KEY=your-api-key
```

### Request Parameters

```json
{
  "bucketIds": ["bucket1", "bucket2"],
  "dryRun": true,
  "batchSize": 100
}
```

## Deployment

### Using Appwrite CLI

```bash
# Create the function
appwrite functions create \
  --function-id bucket-cleaner \
  --name "Bucket Cleaner" \
  --runtime "node-18.0" \
  --entrypoint "index.js" \
  --commands "npm install" \
  --scopes "files.read,files.write,buckets.read,databases.read,users.read"

# Deploy the code
appwrite functions create-deployment \
  --function-id bucket-cleaner \
  --entrypoint index.js \
  --code . \
  --activate

# Set environment variables
appwrite functions create-variable \
  --function-id bucket-cleaner \
  --key APPWRITE_FUNCTION_API_ENDPOINT \
  --value "https://api.blueprint-create.com/v1"

appwrite functions create-variable \
  --function-id bucket-cleaner \
  --key APPWRITE_FUNCTION_PROJECT_ID \
  --value "your-project-id"

appwrite functions create-variable \
  --function-id bucket-cleaner \
  --key APPWRITE_FUNCTION_API_KEY \
  --value "your-api-key"
```

## Testing

### Local Testing

```bash
# Install dependencies
npm install

# Set environment variables
export APPWRITE_FUNCTION_API_ENDPOINT="https://api.blueprint-create.com/v1"
export APPWRITE_FUNCTION_PROJECT_ID="your-project-id"
export APPWRITE_FUNCTION_API_KEY="your-api-key"

# Run test in dry-run mode
node test.js
```

### Manual Execution

```bash
# Execute with dry run
appwrite functions create-execution \
  --function-id bucket-cleaner \
  --body '{"dryRun": true}'

# Execute and delete orphaned files
appwrite functions create-execution \
  --function-id bucket-cleaner \
  --body '{"dryRun": false}'

# Clean specific buckets only
appwrite functions create-execution \
  --function-id bucket-cleaner \
  --body '{"bucketIds": ["67aee2b30000b9e21407"], "dryRun": true}'
```

## Scheduling

To run automatically, configure a schedule:

```bash
# Run daily at 2 AM
appwrite functions update \
  --function-id bucket-cleaner \
  --schedule "0 2 * * *"

# Run weekly on Sunday at 3 AM
appwrite functions update \
  --function-id bucket-cleaner \
  --schedule "0 3 * * 0"
```

## Response Format

```json
{
  "success": true,
  "dryRun": true,
  "results": {
    "totalFilesChecked": 150,
    "totalOrphaned": 12,
    "totalDeleted": 0,
    "buckets": {
      "bucket-id": {
        "filesChecked": 50,
        "orphaned": [
          {
            "id": "file-id",
            "name": "file.jpg",
            "size": 1024,
            "created": "2024-01-01T00:00:00"
          }
        ],
        "deleted": [],
        "errors": []
      }
    },
    "errors": []
  }
}
```

## Safety Features

1. **Dry Run by Default**: The function defaults to dry-run mode to prevent accidental deletions
2. **Reference Verification**: Multiple checks to ensure files are truly orphaned
3. **Comprehensive Logging**: All operations are logged for audit purposes
4. **Error Handling**: Continues processing even if individual files fail
5. **Batch Processing**: Prevents timeout issues with large buckets

## Performance Considerations

- **Batch Size**: Adjust `batchSize` based on your bucket size and timeout limits
- **Execution Time**: Large buckets may require multiple executions
- **Memory Usage**: The function stores file references in memory; very large databases may need optimization

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Reduce `batchSize` or process fewer buckets per execution
2. **Permission Errors**: Ensure the API key has required scopes
3. **Memory Issues**: Process buckets individually if dealing with millions of files

### Debug Mode

Enable verbose logging by checking the function logs:

```bash
appwrite functions list-executions \
  --function-id bucket-cleaner

appwrite functions get-execution \
  --function-id bucket-cleaner \
  --execution-id <execution-id>
```

## Security Notes

- Requires API key with appropriate scopes
- Only processes configured buckets
- Cannot recover deleted files - use dry-run first
- Respects file permissions and bucket settings

## Future Enhancements

- [ ] Support for custom reference patterns
- [ ] Parallel bucket processing
- [ ] Detailed statistics and reporting
- [ ] Backup before deletion option
- [ ] Configurable retention periods
- [ ] Support for additional collection mappings
