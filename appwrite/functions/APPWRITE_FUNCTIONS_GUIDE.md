# Appwrite Functions Development Guide

## Overview

This guide provides best practices and patterns for developing Appwrite Functions, based on our experience building the image-compressor function.

## Function Structure

### Basic Template

```javascript
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Parse request body
    const payload = JSON.parse(req.body || '{}');

    // Initialize SDK client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    // Your function logic here

    return res.json({ success: true, data: result });
  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
```

## Environment Variables

Required environment variables for SDK usage:

- `APPWRITE_FUNCTION_API_ENDPOINT` - The Appwrite API endpoint (e.g., https://api.blueprint-create.com/v1)
- `APPWRITE_FUNCTION_PROJECT_ID` - Your project ID
- `APPWRITE_FUNCTION_API_KEY` - API key with necessary scopes

## Working with Storage

### Downloading Files

```javascript
const storage = new sdk.Storage(client);

// Get file metadata
const file = await storage.getFile(bucketId, fileId);

// Download file content
const fileResponse = await storage.getFileDownload(bucketId, fileId);

// Handle different response types
let buffer;
if (fileResponse instanceof Buffer) {
  buffer = fileResponse;
} else if (fileResponse instanceof ArrayBuffer) {
  buffer = Buffer.from(fileResponse);
} else if (fileResponse.arrayBuffer) {
  const arrayBuffer = await fileResponse.arrayBuffer();
  buffer = Buffer.from(arrayBuffer);
} else if (typeof fileResponse === 'string') {
  buffer = Buffer.from(fileResponse, 'binary');
} else {
  // Handle as stream
  const chunks = [];
  for await (const chunk of fileResponse) {
    chunks.push(chunk);
  }
  buffer = Buffer.concat(chunks);
}
```

### Uploading Files

```javascript
const sdk = require('node-appwrite');

// Method 1: Using InputFile.fromBuffer (preferred)
const inputFile = sdk.InputFile.fromBuffer(buffer, 'filename.ext');
const file = await storage.createFile(
  bucketId,
  sdk.ID.unique(), // or custom ID
  inputFile,
  permissions // optional array of permission strings
);

// Method 2: Using InputFile.fromPlainText (for text/base64)
const base64 = buffer.toString('base64');
const inputFile = sdk.InputFile.fromPlainText(base64, 'filename.ext');
const file = await storage.createFile(bucketId, fileId, inputFile, permissions);
```

### Handling Permissions

```javascript
// Extract permissions from existing file
let permissions = [];
if (file.$permissions && Array.isArray(file.$permissions)) {
  permissions = file.$permissions;
} else if (file.permissions && Array.isArray(file.permissions)) {
  permissions = file.permissions;
}

// Common permission patterns
const publicRead = ['read("any")'];
const authenticatedRead = ['read("users")'];
const ownerOnly = [`read("user:${userId}")`, `write("user:${userId}")`];
```

## Working with Databases

```javascript
const databases = new sdk.Databases(client);

// List documents
const documents = await databases.listDocuments(databaseId, collectionId, [sdk.Query.limit(100)]);

// Create document
const document = await databases.createDocument(databaseId, collectionId, sdk.ID.unique(), {
  field1: 'value1',
  field2: 'value2',
});

// Update document
const updated = await databases.updateDocument(databaseId, collectionId, documentId, {
  field1: 'new value',
});
```

## Error Handling

### Comprehensive Error Handling

```javascript
try {
  // Main logic
} catch (err) {
  // Log the full error for debugging
  error(`Full error: ${JSON.stringify(err)}`);

  // Check for specific error types
  if (err.code === 404) {
    return res.json(
      {
        success: false,
        error: 'Resource not found',
      },
      404
    );
  }

  if (err.message.includes('InputFile')) {
    // Handle SDK-specific errors with fallback
    try {
      // Alternative approach
    } catch (altErr) {
      error(`Alternative failed: ${altErr.message}`);
    }
  }

  // Generic error response
  return res.json(
    {
      success: false,
      error: err.message,
    },
    500
  );
}
```

## Package.json Configuration

```json
{
  "name": "function-name",
  "version": "1.0.0",
  "description": "Function description",
  "main": "index.js",
  "dependencies": {
    "node-appwrite": "^14.1.0",
    "sharp": "^0.33.5",
    "form-data": "^4.0.0"
  },
  "engines": {
    "node": ">=18.0"
  }
}
```

## Deployment

### Using Appwrite CLI

```bash
# Create deployment
appwrite functions create-deployment \
  --function-id function-name \
  --entrypoint index.js \
  --code path/to/function \
  --activate

# Check deployment status
appwrite functions get-deployment \
  --function-id function-name \
  --deployment-id <deployment-id>
```

### Function Configuration

```bash
# Create function
appwrite functions create \
  --function-id image-compressor \
  --name "Image Compressor" \
  --runtime "node-18.0" \
  --entrypoint "index.js" \
  --commands "npm install" \
  --scopes "files.read,files.write,buckets.read"

# Set environment variables
appwrite functions create-variable \
  --function-id image-compressor \
  --key APPWRITE_FUNCTION_API_ENDPOINT \
  --value "https://api.blueprint-create.com/v1"
```

## Common Pitfalls and Solutions

### 1. InputFile.fromBuffer undefined

**Problem**: SDK version mismatch or incorrect import
**Solution**: Ensure `node-appwrite` is properly imported and use fallback methods

### 2. Route not found (404)

**Problem**: Incorrect API endpoint construction
**Solution**: Use the SDK methods directly, don't construct URLs manually

### 3. Buffer handling issues

**Problem**: Different response types from SDK methods
**Solution**: Implement comprehensive buffer conversion logic

### 4. Permission preservation

**Problem**: Lost permissions when creating new files
**Solution**: Extract and pass permissions from original file

## Testing Functions Locally

```javascript
// test.js
const handler = require('./index.js');

const mockContext = {
  req: {
    body: JSON.stringify({
      bucketId: 'test-bucket',
      fileId: 'test-file',
      quality: 85,
    }),
    headers: {},
  },
  res: {
    json: (data, status = 200) => {
      console.log('Response:', { status, data });
    },
  },
  log: console.log,
  error: console.error,
};

// Set environment variables
process.env.APPWRITE_FUNCTION_API_ENDPOINT = 'https://api.example.com/v1';
process.env.APPWRITE_FUNCTION_PROJECT_ID = 'project-id';
process.env.APPWRITE_FUNCTION_API_KEY = 'api-key';

// Run the function
handler(mockContext);
```

## Performance Optimization

1. **Stream Processing**: For large files, process as streams when possible
2. **Buffer Management**: Clear large buffers after use to free memory
3. **Parallel Operations**: Use Promise.all() for independent operations
4. **Caching**: Consider caching frequently accessed data in memory
5. **Timeout Management**: Set appropriate timeouts (default is 30s)

## Security Best Practices

1. **Input Validation**: Always validate and sanitize input parameters
2. **API Key Scopes**: Use minimal required scopes for API keys
3. **Error Messages**: Don't expose sensitive information in error responses
4. **Permission Checks**: Verify user permissions before operations
5. **Rate Limiting**: Implement rate limiting for public functions

## Debugging Tips

1. Use extensive logging with `log()` function
2. Log at each major step of execution
3. Include timing information for performance debugging
4. Use try-catch blocks around each major operation
5. Test with various input sizes and formats

## Example: Image Compression Function

See `image-compressor/index.js` for a complete implementation that:

- Downloads images from storage
- Compresses them using Sharp
- Converts to WebP format
- Preserves permissions
- Handles various buffer types
- Implements comprehensive error handling
- Provides detailed logging
