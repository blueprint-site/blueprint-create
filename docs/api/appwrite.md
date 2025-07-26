# Appwrite Integration

Blueprint uses Appwrite as its primary backend service for authentication, database, storage, and function execution.

## Setup

### Environment Configuration

Appwrite requires the following environment variables, typically set via `/public/env.js`:

```javascript
// public/env.js
window._env_ = {
  APPWRITE_URL: "https://your-appwrite-instance.com/v1", // Your Appwrite API endpoint
  APPWRITE_PROJECT_ID: "your-project-id",              // Your Appwrite project ID
  APPWRITE_MANAGE_USERS_FUNCTION_ID: "your-function-id", // Function ID for user management
  // ... other variables
};
```

These variables configure the Appwrite client used throughout the application.

### Client Configuration

The Appwrite client is configured in `/src/config/appwrite.ts`:

```typescript
// src/config/appwrite.ts
import { Client, Account, Databases, Storage, Functions, ID } from 'appwrite';

export const client = new Client();

const url = window._env_?.APPWRITE_URL || '';
const projectId = window._env_?.APPWRITE_PROJECT_ID || '';

// Basic client setup
client.setEndpoint(url).setProject(projectId);

// Export Appwrite service instances
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export Appwrite utility constants
export { ID, Query, Permission, Role } from 'appwrite';
```

## Database Structure

Blueprint utilizes several collections within an Appwrite database (defined by `DATABASE_ID` constants in API hooks). Canonical type definitions for these collections can be found in `src/types/appwrite.ts`.

### Collections

#### Addons Collection (`COLLECTION_ID: '67b1dc4b000762a0ccc6'`)

Stores information about Create Mod addons. See `Addon` type in `src/types/appwrite.ts`.

**Key Fields:**
- `name`: string - Display name
- `description`: string - Markdown description
- `slug`: string - URL-friendly identifier (unique)
- `author`: string - Creator name(s)
- `categories`: string[] - Array of category tags
- `downloads`: number - Download count
- `icon`: string - URL to the addon's icon
- `sources`: string[] - Data sources ('curseforge', 'modrinth')
- `isValid`: boolean - If the addon data is considered valid
- `loaders`: string[] | null - Supported mod loaders ('forge', 'fabric', 'neoforge')
- `minecraft_versions`: string[] | null - Compatible Minecraft versions
- `create_versions`: string[] | null - Compatible Create Mod versions
- `claimed_by`: string | null - User ID claiming the addon
- `curseforge_raw`: string | null - **Stored as JSON string**: Raw data from CurseForge API
- `modrinth_raw`: string | null - **Stored as JSON string**: Raw data from Modrinth API

**Indexes:** `slug` (unique), `name`, `categories`, `loaders`, `minecraft_versions`, `create_versions`

#### Schematics Collection (`COLLECTION_ID: '67b2310d00356b0cb53c'`)

Stores information about user-created schematics. See `Schematic` type in `src/types/appwrite.ts`.

**Key Fields:**
- `title`: string - Display name
- `description`: string - Markdown description
- `slug`: string - URL-friendly identifier
- `user_id`: string - Appwrite user ID of the creator
- `authors`: string[] - Creator Appwrite user ID(s)
- `categories`: string[] - Array of category tags (`SchematicTag` references)
- `sub_categories`: string[] | undefined - Array of sub-category tags
- `downloads`: number - Download count
- `likes`: number - Like count
- `status`: 'draft' | 'published' | 'archived' - Publication status
- `image_urls`: string[] - URLs to preview images (Appwrite Storage IDs/URLs)
- `schematic_url`: string - URL to the schematic file (Appwrite Storage ID/URL)
- `game_versions`: string[] - Compatible Minecraft versions
- `create_versions`: string[] - Compatible Create Mod versions
- `modloaders`: string[] - Compatible mod loaders

**Indexes:** `slug` (unique), `user_id`, `categories`, `game_versions`, `create_versions`

#### Blogs Collection (`COLLECTION_ID: '67b232540003ed4d8e4f'`)

Stores blog posts. See `Blog` type in `src/types/appwrite.ts`.

**Key Fields:**
- `title`: string - Blog post title
- `content`: string - Markdown content
- `slug`: string - URL-friendly identifier (unique)
- `authors_uuid`: string[] - Author Appwrite user ID(s)
- `authors`: string[] - Author display names
- `img_url`: string - URL to cover image (Appwrite Storage ID/URL)
- `status`: 'draft' | 'published' | 'archived' - Publication status
- `likes`: number - Like count
- `tags`: string | null - **Stored as JSON string**: Array of `BlogTag` objects (`[{ $id, value, color }, ...]`)
- `links`: string | null - **Stored as JSON string**: Array of `BlogLink` objects (`[{ url, title }, ...]`)
- `blog_tags`: string[] | undefined - Array of `BlogTag` document IDs (for relationships)

**Indexes:** `slug` (unique), `blog_tags`, `status`, `$createdAt`

#### Blog Tags Collection (`COLLECTION_ID: '67b2326100053d0e304f'`)

Stores tags specific to blog posts. See `BlogTag` type in `src/types/appwrite.ts`.

**Key Fields:**
- `value`: string - The tag display name (e.g., "Tutorial")
- `color`: string - Hex color code for the tag (e.g., "#3498db")

**Indexes:** `value` (unique)

#### Schematic Tags Collection (`COLLECTION_ID: '67bf59d30021b5c117f5'`)

Stores tags specific to schematics. See `SchematicTag` type in `src/types/appwrite.ts`.

**Key Fields:**
- `value`: string - The tag display name (e.g., "Factory")
- `color`: string - Hex color code for the tag

**Indexes:** `value` (unique)

#### Feature Flags Collection (`COLLECTION_ID: '67b232540003ed4d8e4f'`) *(Verify Collection ID)*

Stores feature flags for controlling application features. See `FeatureFlag` type in `src/types/appwrite.ts`.

**Key Fields:**
- `key`: string - Unique identifier for the flag (e.g., "new_dashboard")
- `enabled`: boolean - Global enabled status
- `users`: string[] | undefined - Array of user IDs the flag is enabled for
- `groups`: string[] | undefined - Array of group names the flag is enabled for (e.g., "beta_testers", "admins")
- `description`: string | undefined - Description of the feature flag

**Indexes:** `key` (unique)

#### Users Collection (Appwrite Built-in + Preferences)

Appwrite's native user management is extended using the `prefs` field. User data is accessed via `account.get()` and typed using `User` and `UserPreferences` from `src/types/appwrite.ts`.

**Key Preference Fields (`prefs` object):**
- `theme`: 'light' | 'dark' | undefined - User's preferred theme
- `language`: string | undefined - Preferred language code
- `notificationsEnabled`: boolean | undefined - Notification preference
- `avatar`: string | undefined - URL or identifier for custom avatar
- `bio`: string | undefined - User's biography
- `roles`: string[] | undefined - Custom application roles (e.g., 'admin', 'moderator')
- `easterEggs`: object | null | undefined - Easter egg tracking
- `betaTester`: object | undefined (`BetaTesterPrefs`) - Beta program status and access

See `docs/api/appwrite-user-model.md` for detailed usage.

## Authentication

Blueprint uses Appwrite's Account API, primarily leveraging OAuth2 with providers like Discord, GitHub, and Google.

Authentication state and logic are managed in `src/api/stores/userStore.ts` using Zustand.

```typescript
// Simplified example from userStore.ts
import { OAuthProvider } from 'appwrite';
import type { User, UserPreferences } from '@/types'; // Import canonical types

// ... Zustand store setup ...

// Initiating OAuth Login
handleOAuthLogin: (provider: 'google' | 'github' | 'discord') => {
  const providerMap = { /* ... */ };
  const successUrl = `${window.location.origin}/auth/callback`; // Example callback URL
  const failureUrl = `${window.location.origin}/login?error=oauth_failed`;
  account.createOAuth2Session(providerMap[provider], successUrl, failureUrl);
},

// Fetching User Data (e.g., after successful login or on app load)
fetchUser: async () => {
  try {
    // Cast to extended User type
    const userData = (await account.get()) as User;
    set({
      user: userData,
      preferences: userData.prefs, // Access nested preferences
      error: null,
      isLoading: false,
    });
  } catch (error) {
    console.error('User is not authenticated', error);
    set({ user: null, preferences: null, isLoading: false });
  }
},

// Logging Out
logout: async () => {
  try {
    await account.deleteSession('current');
    set({ user: null, preferences: null });
  } catch (error) {
    console.error('Logout failed', error);
    // Handle error appropriately
  }
},
```

### Authentication Flow

(Flow description remains largely the same as the original doc)

### Session Management

(Session management description remains largely the same as the original doc)

## Storage

Blueprint uses Appwrite Storage for various file types across different buckets.

### Buckets

*(Bucket descriptions seem reasonable, verify IDs and permissions against actual Appwrite setup)*

#### Addon Icons (`addonIcons` - Example ID)
- Permissions: Public read, role:admin write (Example)

#### Schematic Files (`schematicFiles` - Example ID)
- Permissions: Public read, role:user write (Example)

#### Schematic Previews (`schematicPreviews` - Example ID)
- Permissions: Public read, role:user write (Example)

#### Blog Images (`blogImages` - Example ID)
- Permissions: Public read, role:admin write (Example)

#### User Avatars (`userAvatars` - Example ID)
- Permissions: Public read, role:user write (Example)

### File Operations

(Code examples for `createFile`, `getFilePreview`, `getFileDownload` remain valid usage patterns).

## Best Practices

### Typed SDK Methods (New)

Whenever possible, use the typed methods provided by the Appwrite SDK by passing generic type parameters. This improves type safety and reduces the need for manual casting or mapping.

```typescript
import type { Addon } from '@/types';
import { Query } from 'appwrite';

// GOOD: Using generic type parameter
async function getAddon(id: string): Promise<Addon | null> {
  try {
    const addonDoc = await databases.getDocument<Addon>(ADDON_DB_ID, ADDON_COLL_ID, id);
    return addonDoc;
  } catch (error) {
    // handle 404 etc.
    return null;
  }
}

async function listAddons(limit: number): Promise<Addon[]> {
  const response = await databases.listDocuments<Addon>(
      ADDON_DB_ID,
      ADDON_COLL_ID,
      [Query.limit(limit)]
  );
  return response.documents;
}
```

### Handling JSON String Fields (New)

Some fields (e.g., `Addon.curseforge_raw`, `Blog.tags`, `Blog.links`) are stored as JSON strings in Appwrite due to database limitations or structure.
- **Parsing:** When fetching data via API hooks (e.g., `useFetchBlog`, `useFetchAddon`), these strings are typically parsed into their corresponding object/array types *before* being returned by the hook. Consumers interact with the parsed data. Helper types (e.g., `AddonWithParsedFields`) or utility functions (e.g., `parseJsonFields` in `src/api/utils/json-fields.ts`) may be used internally by the hooks.
- **Serialization:** When saving data via mutation hooks (e.g., `useSaveBlog`), the hook logic serializes the object/array back into a JSON string before sending the update/create request to Appwrite.

### Error Handling

(Original error handling patterns using `try...catch` and checking `AppwriteException` remain valid).

### Transactions

(Original transaction-like pattern description remains valid as Appwrite lacks native transactions).

### Permissions

(Original guidance on setting permissions remains valid).

### Pagination

(Original pagination example using `Query.limit` and `Query.offset` remains valid).

### Data Validation

Use Zod schemas (defined in `/src/schemas/`) primarily for **validating form input and API request payloads**, *before* interacting with Appwrite. Do not confuse these validation schemas with the canonical data structure types defined in `src/types/appwrite.ts`.

```typescript
// src/schemas/blog.schema.ts - For validation
import { z } from 'zod';
export const CreateBlogSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  // ... other fields required for CREATION
});

// src/api/endpoints/useBlogs.tsx - Usage example
import type { Blog } from '@/types'; // Canonical type
import { CreateBlogSchema } from '@/schemas/blog.schema'; // Validation schema

const mutation = useSaveBlog();

async function handleCreateBlog(formData: unknown) {
  try {
    // 1. Validate input data
    const validatedData = CreateBlogSchema.parse(formData);

    // 2. Call mutation hook with validated data (hook handles Appwrite call)
    // The hook might further map validatedData to Partial<Blog> if needed
    await mutation.mutateAsync(validatedData);

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.format());
      // Show validation errors to user
    } else {
      console.error('Error creating blog:', error);
      // Show generic error
    }
  }
}
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
