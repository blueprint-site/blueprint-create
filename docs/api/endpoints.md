# API Endpoints

Blueprint implements a comprehensive set of API endpoints using custom hooks to interact with backend services (Appwrite, Meilisearch) and manage application state. This document outlines the available endpoints, their usage, and implementation details.

## Overview

Blueprint's API layer is built primarily around TanStack Query hooks located in `/src/api/endpoints`. These hooks provide a clean, declarative, and type-safe way to fetch, create, update, delete, and search data.

## Endpoint Organization

API endpoints are organized in the `/src/api/endpoints` directory, with each file typically focusing on a specific data type or feature:

```
src/api/endpoints/
├── useAddons.tsx            # Addon CRUD and fetch operations
├── useBlogTags.ts           # Blog Tag CRUD operations
├── useBlogs.tsx             # Blog post management
├── useFeatureFlags.tsx      # Feature Flag fetching
├── useModrinth.tsx          # Modrinth API interaction hooks
├── useSchematicTags.ts      # Schematic Tag CRUD operations
├── useSchematics.tsx        # Schematic CRUD and fetch operations
├── useSearchAddons.tsx      # Addon search functionality (Meilisearch)
├── useSearchBlogs.tsx       # Blog search functionality (via local API)
├── useSearchSchematics.tsx  # Schematic search functionality (Meilisearch)
```
*(Note: Utility hooks like `useBreakpoints` and `useSystemThemeSync` may reside in `/src/hooks`)*

## Core Endpoint Types

### Query Endpoints (`useQuery`)

Retrieve data using TanStack Query's `useQuery`. These hooks typically return typed data directly from Appwrite or processed data from search endpoints.

```typescript
// src/api/endpoints/useAddons.tsx
import type { Addon, AddonWithParsedFields } from '@/types';

export const useFetchAddon = (id?: string) => {
  // Returns typed data, including parsed JSON fields if applicable
  return useQuery<AddonWithParsedFields | null>({
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;
      // Uses databases.getDocument<Addon>(...) internally
      // and processes raw JSON fields
      const addon = await fetchAndProcessAddonById(id); // Simplified representation
      return addon;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

### Mutation Endpoints (`useMutation`)

Modify data using TanStack Query's `useMutation`. They handle creating, updating, or deleting data in Appwrite.

```typescript
// src/api/endpoints/useBlogs.tsx
import type { Blog, RawBlog } from '@/types';

export const useSaveBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Accepts a partial Blog object
    mutationFn: async (blog: Partial<Blog>) => {
      // Internal logic serializes JSON fields (tags, links) to strings
      const serializedBlog: Partial<RawBlog> = serializeJsonFields(blog);

      if (!blog.$id) {
        // Uses databases.createDocument<Blog>(...)
        return await createBlogInAppwrite(serializedBlog); // Simplified
      }
      // Uses databases.updateDocument<Blog>(...)
      return await updateBlogInAppwrite(blog.$id, serializedBlog); // Simplified
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};
```

### Search Endpoints (`useQuery` with Meilisearch/API)

Interact with Meilisearch (directly or via a local API) for search functionality.

```typescript
// src/api/endpoints/useSearchAddons.tsx
import type { SearchAddonResult, AddonWithParsedFields } from '@/types';

export const useSearchAddons = ({
  query,
  page = 1,
  limit = 16,
  // Other filters like category, version, loaders
}: SearchAddonsProps): SearchAddonResult => {
  return useQuery({ // Simplified representation
    queryKey: ['searchAddons', query, page, limit, /* filters */],
    queryFn: async () => {
      // Interacts with Meilisearch index 'addons'
      const results = await searchMeiliAddons({ query, page, limit, /* filters */ });

      // Processes hits to parse raw JSON fields
      const processedHits: AddonWithParsedFields[] = results.hits.map(processAddon);

      return {
        data: processedHits,
        totalHits: results.totalHits,
        // Other pagination metadata
      };
    },
    // Configuration options
  });
};
```

## Specific Endpoints

### Addon Endpoints (`useAddons.tsx`)

- `useFetchAddon(id)`: Fetches a single addon by Appwrite ID. Returns `AddonWithParsedFields | null`.
- `useFetchAddonBySlug(slug)`: Fetches a single addon by slug. Returns `AddonWithParsedFields | null`.
- `useFetchAddons(page, limit)`: Fetches a paginated list of addons. Returns `{ addons: AddonWithParsedFields[], total: number, ... }`.
- `useUpdateAddon()`: Mutation hook to update an addon. Accepts `{ addonId: string, data: Partial<Addon> }`. Handles stringifying raw JSON fields.
- `useDeleteAddon()`: Mutation hook to delete an addon by ID.

### Blog Endpoints (`useBlogs.tsx`)

- `useFetchBlog(blogId)`: Fetches a single blog post by ID. Returns `Blog | null`. Handles parsing JSON fields (`tags`, `links`).
- `useFetchBlogBySlug(slug)`: Fetches a single blog post by slug. Returns `Blog | null`. Handles parsing JSON fields.
- `useFetchBlogs(page, limit, tagId)`: Fetches a paginated list of blog posts, optionally filtered by tag ID. Returns `{ data: Blog[], total: number, ... }`. Handles parsing JSON fields.
- `useSaveBlog()`: Mutation hook to create or update a blog post. Accepts `Partial<Blog>`. Handles serializing JSON fields.
- `useDeleteBlog()`: Mutation hook to delete a blog post by ID.

### Schematic Endpoints (`useSchematics.tsx`)

- `useFetchSchematic(id)`: Fetches a single schematic by ID. Returns `Schematic | null`.
- `useFetchSchematics(categories)`: Fetches schematics, optionally filtered by categories. Returns `Schematic[]`.
- `useFetchUserSchematics(userId)`: Fetches schematics created by a specific user. Returns `Schematic[]`.
- `useSaveSchematics()`: Mutation hook to create or update a schematic. Accepts `Partial<Schematic>`. Handles file uploads implicitly or via related logic.
- `useDeleteSchematics(userId)`: Mutation hook to delete a schematic by ID. Invalidates user-specific schematic list.
- `useIncrementDownloads()`: Mutation hook to increment a schematic's download count.
- `useIncrementLikes()`: Mutation hook to increment a schematic's like count.

### Tag Endpoints (`useBlogTags.ts`, `useSchematicTags.ts`)

- `useBlogTags()` / `useSchematicTags()`: Fetches all tags for blogs or schematics. Returns `BlogTag[]` or `SchematicTag[]`.
- `useCreateBlogTag()` / `useCreateSchematicTag()`: Mutation hook to create a new tag. Accepts `TagFormValues`. Requires Zod validation.
- `useUpdateBlogTag()` / `useUpdateSchematicTag()`: Mutation hook to update a tag. Accepts `{ id: string, data: TagFormValues }`. Requires Zod validation.
- `useDeleteBlogTag()` / `useDeleteSchematicTag()`: Mutation hook to delete a tag by ID.

### Feature Flag Endpoints (`useFeatureFlags.tsx`)

- `useFeatureFlag(userId, flagKey)`: Query hook to check if a single feature flag is enabled for a user. Returns `boolean`.
- `useAllFeatureFlags(userId)`: Query hook to fetch all feature flags and their statuses for a user. Returns `Record<string, boolean>`.
*(Note: These often interact with `useFeatureFlagsStore` for state management)*

### Search Endpoints

- `useSearchAddons({ query, page, limit, category?, version?, loaders? })`: Searches addons via Meilisearch. Returns `SearchAddonResult` (containing `AddonWithParsedFields[]`).
- `useSearchBlogs(query)`: Searches blogs via the local `/api/search` endpoint. Returns `MeiliSearchResult<Blog>`. Handles parsing JSON fields.
- `useSearchSchematics({ query, page, limit, ...filters })`: Searches schematics via Meilisearch. Returns `SearchSchematicResult` (containing `Schematic[]`).

## Implementation Details

### Query Key Management

Blueprint follows TanStack Query's best practices for query keys to ensure proper caching and invalidation:

- Single entity: `[entityType, id]` (e.g., `['addon', addonId]`)
- Single entity by secondary key: `[entityType, keyName, value]` (e.g., `['addon', 'slug', addonSlug]`)
- Collection/List: `[entityType, 'list', page, limit, ...filters]` (e.g., `['addons', 'list', 1, 10]`)
- Search: `['searchAddons', query, page, ...filters]` or `['search-blogs', query]`
- Tags/Flags: `['blogTags']`, `['schematicTags']`, `['featureFlags', userId]`

### Error Handling

API hooks generally use `try...catch` blocks. Errors are logged, and often re-thrown to be handled by TanStack Query's `isError` and `error` states or component-level error boundaries. Specific error codes (e.g., 401, 404) might be checked for specific handling.

### API Response Transformation

- **Appwrite Hooks:** Transformation is minimized. Hooks use typed SDK methods (`getDocument<Type>`) returning objects matching the canonical types in `src/types/appwrite.ts`.
- **JSON String Fields:** For types like `Blog` (with `tags`, `links`) or `Addon` (with `curseforge_raw`, `modrinth_raw`), utility functions (`parseJsonFields`, `serializeJsonFields`, `addParsedFields`) are used internally within the hooks or before mutation to handle conversion between object/array types and the stored JSON strings. Consumers of query hooks receive the parsed data directly.
- **Search Hooks:** Responses from Meilisearch (or the `/api/search` endpoint) are processed within the hook to match the expected application types, including parsing any JSON string fields returned by the search index.

### Caching Strategy

Standard TanStack Query caching applies:

- `staleTime`: Configured per-query (often 5 minutes for fetched data, shorter for search) to control when data is considered stale.
- `gcTime` (formerly `cacheTime`): Default TanStack Query behavior (5 minutes) applies unless overridden.
- Automatic refetching on window focus, mount, and network reconnect is enabled by default.
- Mutations typically invalidate relevant queries using `queryClient.invalidateQueries` on success.

## Authentication Handling

Hooks interacting with Appwrite implicitly rely on the Appwrite client's session management. Operations requiring authentication (e.g., saving user-specific data, updating preferences) will fail if no valid session exists. The `userStore` (`/src/api/stores/userStore.ts`) manages fetching the authenticated user state.

```typescript
// Example: userStore fetches user data on load or after login
// src/api/stores/userStore.ts
fetchUser: async () => {
  try {
    // Uses type casting as Appwrite User model is special
    const userData = (await account.get()) as User;
    set({
      user: userData,
      preferences: userData.prefs, // Preferences are nested
    });
  } catch (error) {
    // Handle not authenticated state
    console.error('User is not authenticated', error);
    set({ user: null, preferences: null });
  }
},
```

## File Upload Handling

File uploads (e.g., for schematics, images) are handled using Appwrite's `Storage` service, often within mutation hooks or dedicated utility functions called by them. The process typically involves:
1. Calling `storage.createFile(...)`.
2. Saving the resulting file ID or URL in the relevant Appwrite Database document.

*(The specific implementation for schematic uploads needs review after the removal of `uploadUtils.ts`).*

## Best Practices

### Optimizing Query Performance

- Use pagination (`limit`, `offset`) for lists (`useFetchAddons`, `useFetchBlogs`, etc.).
- Use Appwrite's `Query.select([...])` where appropriate, although not explicitly shown in all hook examples, it can be added internally if needed.
- Set appropriate `staleTime` values.

### Error Handling Guidelines

- Check `isLoading`, `isError`, `error` states returned by hooks in UI components.
- Provide user-friendly feedback and potential retry mechanisms.
- Log detailed errors for debugging.

### Query Invalidation Strategy

- Invalidate specific query keys on mutation success for data consistency (e.g., invalidate `['addons', 'list']` and `['addon', id]` after updating an addon).
- Consider optimistic updates for a smoother UX, especially for frequent actions (like toggling likes), though not shown in all examples.

## Related Documentation

- [Appwrite Integration](./appwrite.md)
- [Meilisearch Integration](./meilisearch.md)
- [State Management](../architecture/state-management.md)
- [Appwrite User Model Integration](../contributing/appwrite-user-model.md)
- [Meilisearch & Appwrite Type Integration Guide](../guides/appwrite-meilisearch-types.md)