# Feedback Feature Setup

This document outlines the setup required for the feedback widget feature in Appwrite.

## Database Collection Setup

### 1. Create Feedback Collection

In your Appwrite console, create a new collection with the following details:

- **Collection ID**: `feedback`
- **Collection Name**: `Feedback`

### 2. Collection Attributes

Add the following attributes to the feedback collection:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|--------|
| `type` | String | 20 | Yes | - | No |
| `message` | String | 2000 | Yes | - | No |
| `url` | String | 500 | Yes | - | No |
| `screenshot` | String | 500 | No | - | No |
| `status` | String | 20 | Yes | `open` | No |
| `createdAt` | String | 50 | Yes | - | No |
| `updatedAt` | String | 50 | No | - | No |
| `userAgent` | String | 1000 | Yes | - | No |
| `timestamp` | Integer | - | Yes | - | No |
| `userId` | String | 50 | No | - | No |

### 3. Collection Permissions

Set the following permissions for the feedback collection:

#### Create Permissions
- Any user (for submitting feedback)

#### Read Permissions
- Admin users only (for viewing feedback in admin panel)

#### Update Permissions
- Admin users only (for changing feedback status)

#### Delete Permissions
- Admin users only (for removing spam/inappropriate feedback)

## Storage Setup

### 1. Create Storage Bucket

Create a new storage bucket with the following details:

- **Bucket ID**: `feedback-screenshots`
- **Bucket Name**: `Feedback Screenshots`
- **Maximum File Size**: `5MB` (or as needed)
- **Allowed File Extensions**: `jpg,jpeg,png,gif,webp`

### 2. Bucket Permissions

Set the following permissions for the storage bucket:

#### Create Permissions
- Any user (for uploading screenshots)

#### Read Permissions
- Any user (for viewing screenshots in admin panel)

#### Update Permissions
- Admin users only

#### Delete Permissions
- Admin users only

## Database Indexes

For better performance, create the following indexes:

1. **Status Index**
   - Type: Key
   - Attribute: `status`
   - Order: ASC

2. **Type Index**
   - Type: Key
   - Attribute: `type`
   - Order: ASC

3. **Timestamp Index**
   - Type: Key
   - Attribute: `timestamp`
   - Order: DESC

4. **Created At Index**
   - Type: Key
   - Attribute: `createdAt`
   - Order: DESC

## Environment Variables

Ensure the following environment variables are set:

```env
APPWRITE_URL=https://your-appwrite-endpoint
APPWRITE_PROJECT_ID=your-project-id
```

## Admin User Setup

To access the feedback admin panel, ensure your user account has admin permissions. The feedback admin panel is accessible at `/admin` under the "Feedback" tab.

## Testing the Setup

1. Navigate to any page in the application
2. Click the feedback icon in the footer
3. Submit a test feedback with screenshot
4. Check the admin panel to verify the feedback appears
5. Test status updates and deletion functionality

## Troubleshooting

### Common Issues

1. **"Collection not found" error**
   - Verify the collection ID matches exactly: `feedback`
   - Check that the collection exists in the correct database

2. **"Bucket not found" error**
   - Verify the storage bucket ID matches exactly: `feedback-screenshots`
   - Check that the bucket exists and has proper permissions

3. **Permission denied errors**
   - Verify collection and bucket permissions are set correctly
   - Check that users are authenticated if required

4. **File upload fails**
   - Check file size limits on the storage bucket
   - Verify allowed file extensions include image formats
   - Ensure proper CORS settings if needed

### Database Collection ID

The current implementation uses collection ID `feedback`. If you need to use a different collection ID, update the `COLLECTION_ID` constant in:

```typescript
// src/api/appwrite/useFeedback.ts
const COLLECTION_ID = 'your-custom-collection-id';
```

### Storage Bucket ID

Similarly, if you need to use a different bucket ID, update the `STORAGE_BUCKET_ID` constant in:

```typescript
// src/api/appwrite/useFeedback.ts
const STORAGE_BUCKET_ID = 'your-custom-bucket-id';
```
