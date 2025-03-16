# Appwrite Integration

Blueprint uses Appwrite as its primary backend service for authentication, database, and storage functionality.

## Setup

### Environment Configuration

Appwrite requires the following environment variables:

```
APP_APPWRITE_URL=your_appwrite_url
APP_APPWRITE_PROJECT_ID=your_project_id
```

These variables are read from the `env.js` file at runtime:

```javascript
// public/env.js
window._env_ = {
  APP_APPWRITE_URL: "https://your-appwrite-instance.com/v1",
  APP_APPWRITE_PROJECT_ID: "your-project-id",
  // ... other variables
};
```

### Client Configuration

The Appwrite client is configured in `/src/config/appwrite.ts`:

```typescript
import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

const url = window._env_?.APPWRITE_URL || '';
const id = window._env_?.APPWRITE_PROJECT_ID || '';

client.setEndpoint(url).setProject(id);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
```

## Database Structure

### Collections

Blueprint uses the following collections in Appwrite:

#### Addons Collection

Stores information about Create Mod addons.

**Key Fields:**
- `name`: The display name of the addon
- `description`: Markdown description of the addon
- `slug`: URL-friendly identifier
- `author`: Creator of the addon
- `categories`: Array of category tags
- `downloads`: Number of downloads
- `icon`: URL to the addon's icon
- `sources`: Array of data sources (curseforge, modrinth)
- `loaders`: Array of supported mod loaders (forge, fabric, neoforge)
- `minecraft_versions`: Array of compatible Minecraft versions
- `create_versions`: Array of compatible Create Mod versions
- `curseforge_raw`: Raw JSON data from CurseForge API
- `modrinth_raw`: Raw JSON data from Modrinth API

**Indexes:**
- `slug` (unique): Fast lookups by URL slug
- `name`: Search by addon name
- `categories`: Filter by categories
- `loaders`: Filter by mod loader
- `minecraft_versions`: Filter by MC version
- `create_versions`: Filter by Create version

#### Schematics Collection

Stores information about user-created schematics.

**Key Fields:**
- `name`: The display name of the schematic
- `description`: Markdown description of the schematic
- `slug`: URL-friendly identifier
- `author`: Username of the creator
- `user_id`: Appwrite user ID of the creator
- `categories`: Array of category tags
- `downloads`: Number of downloads
- `image`: URL to the preview image
- `file`: URL to the schematic file
- `minecraft_versions`: Array of compatible Minecraft versions
- `create_versions`: Array of compatible Create Mod versions

**Indexes:**
- `slug` (unique): Fast lookups by URL slug
- `user_id`: Find schematics by creator
- `categories`: Filter by categories
- `minecraft_versions`: Filter by MC version
- `create_versions`: Filter by Create version

#### Blogs Collection

Stores blog posts.

**Key Fields:**
- `title`: Blog post title
- `content`: Markdown content of the post
- `slug`: URL-friendly identifier
- `author`: Username of the author
- `tags`: Array of topic tags
- `published`: Boolean indicating if post is published
- `publishDate`: Date when post was/will be published
- `coverImage`: URL to post cover image

**Indexes:**
- `slug` (unique): Fast lookups by URL slug
- `tags`: Filter by tags
- `published`: Only show published posts
- `publishDate`: Sort by publish date

#### Users Collection

Extends Appwrite's native users with additional profile information.

**Key Fields:**
- `name`: Display name
- `avatar`: URL to profile picture
- `bio`: User's biography
- `social_links`: Object with social media links
- `collections`: Array of collection IDs

**Indexes:**
- `name`: Search by username

## Authentication

Blueprint uses Appwrite's OAuth authentication with the following providers:

- Discord
- GitHub
- Google

Authentication is implemented in the `userStore.ts` using Zustand:

```typescript
// Simplified example from userStore.ts
handleOAuthLogin: async (provider: 'google' | 'github' | 'discord') => {
  try {
    const providerMap = {
      google: OAuthProvider.Google,
      github: OAuthProvider.Github,
      discord: OAuthProvider.Discord,
    };
    const oauthProvider = providerMap[provider];
    const successUrl = window._env_?.APP_URL + '/auth/success';
    const errorUrl = window._env_?.APP_URL + '/auth/error';
    account.createOAuth2Session(oauthProvider, successUrl, errorUrl);
    return Promise.resolve();
  } catch (error) {
    console.error('Error during OAuth authentication', error);
    return Promise.reject(error);
  }
}
```

### Authentication Flow

1. User clicks a login button for a provider
2. `handleOAuthLogin` is called with the selected provider
3. User is redirected to Appwrite's OAuth endpoint
4. Appwrite redirects to the provider's authentication page
5. User authenticates with the provider
6. Provider redirects back to Appwrite with authorization code
7. Appwrite creates a session and redirects to the success URL
8. The application handles the success redirect and calls `handleOAuthCallback`
9. User data is fetched and stored in the userStore

### Session Management

Sessions are automatically managed by Appwrite. The application checks for an existing session on startup:

```typescript
// From userStore.ts
fetchUser: async () => {
  try {
    const userData = await account.get();
    set({
      user: userData as User,
      preferences: userData.prefs as UserPreferences,
    });
  } catch (error) {
    console.log('User is not authenticated');
  }
},
```

To log out, the current session is deleted:

```typescript
// From userStore.ts
logout: async () => {
  try {
    await account.deleteSession('current');
    set({ user: null, preferences: null });
    return Promise.resolve();
  } catch (error) {
    console.error('Logout failed', error);
    return Promise.reject(error);
  }
},
```

## Storage

Blueprint uses Appwrite Storage for:

### Buckets

The application uses the following storage buckets:

#### Addon Icons
- **Bucket ID**: `addonIcons`
- **File Types**: Image files (PNG, JPG, WebP)
- **Max Size**: 2MB
- **Permissions**: Public read, admin write

#### Schematic Files
- **Bucket ID**: `schematicFiles`
- **File Types**: Schematic (.nbt) and schema files
- **Max Size**: 10MB
- **Permissions**: Public read, authenticated write

#### Schematic Previews
- **Bucket ID**: `schematicPreviews`
- **File Types**: Image files (PNG, JPG, WebP)
- **Max Size**: 5MB
- **Permissions**: Public read, authenticated write

#### Blog Images
- **Bucket ID**: `blogImages`
- **File Types**: Image files (PNG, JPG, WebP)
- **Max Size**: 5MB
- **Permissions**: Public read, admin write

#### User Avatars
- **Bucket ID**: `userAvatars`
- **File Types**: Image files (PNG, JPG, WebP)
- **Max Size**: 1MB
- **Permissions**: Public read, authenticated write

### File Operations

#### Uploading Files

```typescript
// Example of uploading a schematic file
const uploadSchematicFile = async (file: File, fileName: string) => {
  try {
    const result = await storage.createFile(
      'schematicFiles',
      ID.unique(),
      file,
      [`fileName=${fileName}`]
    );
    
    return result;
  } catch (error) {
    console.error('Failed to upload schematic file:', error);
    throw error;
  }
};
```

#### Getting File Preview URLs

```typescript
// Example of getting a file preview URL
const getFilePreview = (fileId: string, bucketId: string) => {
  return storage.getFilePreview(
    bucketId,
    fileId,
    800,  // width
    600,  // height
    'center',  // gravity
    100  // quality
  );
};
```

#### Downloading Files

```typescript
// Example of getting a file download URL
const getFileDownload = (fileId: string, bucketId: string) => {
  return storage.getFileDownload(bucketId, fileId);
};
```

## Best Practices

### Error Handling

Always handle Appwrite errors gracefully:

```typescript
// Pattern for handling Appwrite errors
try {
  await databases.createDocument(/* ... */);
} catch (error) {
  // Check for specific error types
  if (error instanceof AppwriteException) {
    if (error.code === 409) {
      // Conflict error (e.g., duplicate unique value)
      console.error('A document with this slug already exists');
    } else if (error.code === 401) {
      // Unauthorized error
      console.error('Authentication required');
    } else {
      // Other Appwrite-specific errors
      console.error('Appwrite error:', error.message);
    }
  } else {
    // Generic error handling
    console.error('Failed to create document:', error);
  }
  
  // Rethrow or handle as needed
  throw error;
}
```

### Transactions

Appwrite doesn't support transactions directly, so implement your own transaction-like patterns:

```typescript
// Example of a transaction-like pattern
async function createSchematicWithImage(schematic, image) {
  let schematicId = null;
  let imageId = null;
  
  try {
    // Step 1: Create schematic document
    const doc = await databases.createDocument(
      DATABASE_ID,
      SCHEMATICS_COLLECTION_ID,
      ID.unique(),
      schematic
    );
    schematicId = doc.$id;
    
    // Step 2: Upload image with reference to schematic
    const imageFile = await storage.createFile(
      'schematicPreviews',
      ID.unique(),
      image,
      [`schematicId=${schematicId}`]
    );
    imageId = imageFile.$id;
    
    // Step 3: Update schematic with image ID
    await databases.updateDocument(
      DATABASE_ID,
      SCHEMATICS_COLLECTION_ID,
      schematicId,
      { image: imageId }
    );
    
    return { success: true, schematicId, imageId };
  } catch (error) {
    // Cleanup on failure - roll back changes
    if (imageId) {
      await storage.deleteFile('schematicPreviews', imageId);
    }
    
    if (schematicId) {
      await databases.deleteDocument(
        DATABASE_ID,
        SCHEMATICS_COLLECTION_ID,
        schematicId
      );
    }
    
    return { success: false, error };
  }
}
```

### Permissions

Set appropriate permissions for collections and buckets:

- **Public Resources**: Use read permissions for everyone
- **User Content**: Restrict write access to the content creator
- **Admin Content**: Restrict write access to administrators
- **Sensitive Data**: Use role-based permissions

### Pagination

Implement proper pagination for listing documents:

```typescript
// Example of pagination
const getAddons = async (limit = 20, offset = 0) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADDONS_COLLECTION_ID,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc('$createdAt')
      ]
    );
    
    return {
      documents: response.documents,
      total: response.total
    };
  } catch (error) {
    console.error('Error fetching addons:', error);
    throw error;
  }
};
```

### Data Validation

Always validate data before sending it to Appwrite:

```typescript
// Example of data validation with Zod
const createSchematic = async (data: unknown) => {
  try {
    // Validate data against schema
    const validatedData = SchematicSchema.parse(data);
    
    // Proceed with creating document
    const document = await databases.createDocument(
      DATABASE_ID,
      SCHEMATICS_COLLECTION_ID,
      ID.unique(),
      validatedData
    );
    
    return document;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error('Validation failed:', error.format());
      throw new Error('Invalid schematic data');
    }
    
    console.error('Error creating schematic:', error);
    throw error;
  }
};
```

## Troubleshooting

### Common Issues

#### Authentication Failures
- Check if the OAuth provider is configured correctly in Appwrite
- Verify redirect URLs are correct
- Check for CORS issues if using a different domain

#### Permission Errors
- Verify collection/bucket permissions
- Check if the user has the correct role
- Ensure the user is authenticated for protected operations

#### Document Not Found
- Verify the document ID is correct
- Check if the document exists in the collection
- Ensure the user has read permissions for the document

#### Server Connection Issues
- Check if the Appwrite URL is correct
- Verify the project ID is correct
- Check if Appwrite server is running and accessible

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite GitHub Repository](https://github.com/appwrite/appwrite)
- [Appwrite Discord Community](https://discord.gg/appwrite)
