# Image Compressor Function

Compresses images to WebP format for optimized storage in Appwrite.

## Features

- Converts any image format to WebP
- Configurable quality settings
- Optional resizing
- Can preserve or delete original files
- Automatic document update support
- Maintains original file permissions

## Configuration

### Environment Variables

Set these in Appwrite Console:

- `APPWRITE_FUNCTION_API_ENDPOINT`: Your Appwrite API endpoint
- `APPWRITE_FUNCTION_PROJECT_ID`: Your project ID
- `APPWRITE_FUNCTION_API_KEY`: API key with storage and database permissions

## Usage

### Request Body

```json
{
  "bucketId": "profile-images",
  "fileId": "file123",
  "quality": 85,
  "width": 800,
  "height": 600,
  "preserveOriginal": false,
  "updateDocument": {
    "databaseId": "main",
    "collectionId": "users",
    "documentId": "user123",
    "attributeName": "profileImage"
  }
}
```

### Parameters

- `bucketId` (required): Storage bucket ID
- `fileId` (required): File ID to compress
- `quality` (optional): WebP quality 1-100, default 85
- `width` (optional): Max width in pixels
- `height` (optional): Max height in pixels
- `preserveOriginal` (optional): Keep original file, default false
- `updateDocument` (optional): Update a document with new file ID

### Response

```json
{
  "success": true,
  "original": {
    "id": "file123",
    "name": "profile.jpg",
    "size": 2048000,
    "width": 2000,
    "height": 1500,
    "format": "jpeg",
    "deleted": true
  },
  "compressed": {
    "id": "file456",
    "name": "profile.webp",
    "size": 512000,
    "width": 800,
    "height": 600,
    "format": "webp",
    "bucketId": "profile-images"
  },
  "stats": {
    "compressionRatio": "75%",
    "sizeSaved": 1536000,
    "processingTime": "250ms"
  }
}
```

## Example Usage in Frontend

```javascript
// Compress user profile image
const compressProfileImage = async (fileId) => {
  const functions = new Functions(appwriteClient);

  const response = await functions.createExecution(
    "image-compressor",
    JSON.stringify({
      bucketId: "profile-images",
      fileId: fileId,
      quality: 90,
      width: 500,
      height: 500,
      preserveOriginal: false,
      updateDocument: {
        databaseId: "main",
        collectionId: "users",
        documentId: userId,
        attributeName: "profileImage",
      },
    }),
  );

  return JSON.parse(response.responseBody);
};

// Compress schematic image
const compressSchematicImage = async (fileId) => {
  const functions = new Functions(appwriteClient);

  const response = await functions.createExecution(
    "image-compressor",
    JSON.stringify({
      bucketId: "schematics-images",
      fileId: fileId,
      quality: 85,
      width: 1920,
      height: 1080,
      preserveOriginal: true,
    }),
  );

  return JSON.parse(response.responseBody);
};
```

## Deployment

1. Create function in Appwrite Console
2. Set runtime to Node.js 18.0 or higher
3. Set entrypoint to `index.js`
4. Add environment variables
5. Deploy using CLI or upload zip
