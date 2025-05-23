# Data Architecture and Flow

Blueprint implements a robust data architecture combining Appwrite for primary data storage and authentication, Meilisearch for optimized search, and TanStack Query for frontend state management and caching. This document outlines the key components, data flows, and best practices for working with Blueprint's data layer.

## Core Components

### 1. Appwrite

**Role**: Primary database, authentication system, and file storage. Source of truth for data.

**Use Cases**:
- CRUD operations for all data entities (Addons, Schematics, Blogs, Tags, Users, Feature Flags).
- User authentication (OAuth, email/password) and session management via `account` service.
- File storage via `storage` service.
- Data persistence and integrity via `databases` service.

**Configuration Location**: `/src/config/appwrite.ts`
* Exports typed service instances (`databases`, `account`, `storage`, `functions`).

```typescript
// src/config/appwrite.ts (Simplified)
import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

export const client = new Client();
// ... endpoint and project ID setup from window._env_ ...
client.setEndpoint(url).setProject(projectId);

// Typed service instances
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export Appwrite utilities
export { ID, Query, Permission, Role };
```

### 2. Meilisearch

**Role**: Search index providing fast, typo-tolerant search and filtering.

**Use Cases**:
- Full-text search across Addons, Schematics, and Blogs.
- Advanced filtering capabilities.
- Rapid retrieval of search results.

**Configuration Location**: `/src/config/meilisearch.ts`
* Exports a configured `MeiliSearch` client instance.

```typescript
// src/config/meilisearch.ts (Simplified)
import { MeiliSearch } from 'meilisearch';

// ... host and apiKey setup from window._env_ ...
export const searchClient = new MeiliSearch({ host: url, apiKey });
```

### 3. TanStack Query

**Role**: Frontend server state management, caching, and data synchronization UI layer.

**Use Cases**:
- Managing asynchronous data fetching states (loading, error, success).
- Caching responses from Appwrite and Meilisearch/Search API to improve performance and reduce redundant requests.
- Handling mutations (create, update, delete) and automatically invalidating/refetching relevant data.
- Providing hooks (`useQuery`, `useMutation`) for declarative data fetching and manipulation in components.

**Implementation**: Core logic resides in custom hooks within `/src/api/endpoints/`.

### 4. Canonical Types & Validation Schemas

**Role**: Ensuring data consistency and type safety.

**Implementation**:
- **Canonical Types**: Defined in `src/types/appwrite.ts`, representing the source-of-truth structure of data stored in Appwrite (e.g., `Addon`, `Blog`, `User`). These extend Appwrite's `Models.Document` or `Models.User`.
- **Validation Schemas**: Defined in `src/schemas/` using Zod (e.g., `CreateBlogSchema`, `UpdateAddonSchema`). Used primarily for validating form/API inputs *before* data is sent to mutation hooks or Appwrite. See [Zod Validation Guide](./zod-validation-guide.md).

## Data Flow Patterns

### Read Operations

#### 1. Search & List Pattern (via Meilisearch or Local API)

Used for list views, Browse, and search functionality where fast filtering and full-text search are needed.

```typescript
// Example: src/api/endpoints/useSearchAddons.tsx
import type { SearchAddonResult, AddonWithParsedFields } from '@/types';

export const useSearchAddons = (searchParams: SearchAddonsProps): SearchAddonResult => {
  return useQuery({ // Simplified representation
    queryKey: ['searchAddons', searchParams],
    queryFn: async () => {
      // 1. Calls Meilisearch via searchClient or a local API endpoint
      const rawResults = await searchMeiliAddons(searchParams); // Simplified

      // 2. Processes hits (e.g., parses JSON strings in Addon data)
      const processedData: AddonWithParsedFields[] = rawResults.hits.map(processAddon);

      // 3. Returns structured result with metadata
      return {
        data: processedData,
        totalHits: rawResults.totalHits,
        // page, limit, hasNextPage, etc.
        // isLoading, isError, etc. provided by TanStack Query
      };
    },
    staleTime: 1000 * 60 * 1, // Example: Cache search results for 1 minute
  });
};
```

**Data Path**:
1. User interacts with search input or filters.
2. Component calls the relevant search hook (`useSearchAddons`, `useSearchBlogs`, `useSearchSchematics`).
3. TanStack Query checks cache.
4. If cache miss/stale, hook executes query function:
    * For Addons/Schematics: Calls Meilisearch directly via `searchClient`.
    * For Blogs: Calls the local `/api/search` endpoint (which likely calls Meilisearch).
5. Search engine returns results.
6. Hook processes results (e.g., parsing JSON fields) to match application types (`AddonWithParsedFields`, `Blog`).
7. Results are cached by TanStack Query and returned to the component.

#### 2. Detail Fetch Pattern (via Appwrite)

Used for viewing a specific item (e.g., a single addon page, blog post) where the complete, most up-to-date data from the source of truth is needed.

```typescript
// Example: src/api/endpoints/useAddons.tsx
import type { Addon, AddonWithParsedFields } from '@/types';

export const useFetchAddon = (id?: string) => {
  return useQuery<AddonWithParsedFields | null>({ // Returns parsed type
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;
      // 1. Fetches directly from Appwrite using typed SDK method
      const addonDoc = await databases.getDocument<Addon>(DATABASE_ID, COLLECTION_ID, id);
      // 2. Hook internally parses JSON fields (e.g., curseforge_raw)
      return addParsedFields(addonDoc); // Simplified representation
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10, // Example: Cache detail views longer
  });
};
```

**Data Path**:
1. User navigates to a detail page (e.g., `/addons/[id]`).
2. Component calls the relevant fetch hook (`useFetchAddon`, `useFetchBlog`, `useFetchSchematic`) with the ID/slug.
3. TanStack Query checks cache.
4. If cache miss/stale, hook executes query function:
    * Calls Appwrite using typed methods (`databases.getDocument<Type>`).
    * Parses/processes data if needed (e.g., JSON strings).
5. Appwrite returns the full document.
6. Hook returns the processed, typed data (e.g., `AddonWithParsedFields`, `Blog`).
7. Result is cached by TanStack Query and returned to the component.

### Write Operations (via Appwrite)

All data modifications (Create, Update, Delete) **must** go through Appwrite, as it is the source of truth. Meilisearch is updated subsequently via the synchronization process.

#### 1. Create Pattern

```typescript
// Example: src/api/endpoints/useBlogs.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import type { Blog, RawBlog } from '@/types';
import { CreateBlogSchema, type CreateBlogInput } from '@/schemas/blog.schema'; // Validation schema
import { serializeJsonFields } from '@/api/utils/json-fields'; // Helper for serialization

export const useSaveBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Mutation expects validated input, matching CreateBlogInput (or similar)
    mutationFn: async (blogInput: CreateBlogInput) => {
      // 1. (Validation should happen *before* calling mutate)
      // const validatedData = CreateBlogSchema.parse(blogInput); // Example

      // 2. Prepare data for Appwrite (e.g., serialize JSON fields)
      const dataToSave: Partial<RawBlog> = serializeJsonFields(blogInput);

      // 3. Call Appwrite using typed SDK method
      const newBlogDoc = await databases.createDocument<Blog>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        dataToSave // Send serialized data
      );
      return newBlogDoc; // Return the created document
    },
    onSuccess: (newBlogDoc) => {
      // 4. Invalidate queries to refetch lists/searches
      queryClient.invalidateQueries({ queryKey: ['blogs', 'list'] });
      // Optional: Update cache for the newly created item
      queryClient.setQueryData(['blog', newBlogDoc.$id], newBlogDoc);
    },
  });
};
```

**Data Path**:
1. User submits a form to create a resource.
2. Form handler validates input using the appropriate Zod schema (e.g., `CreateBlogSchema`).
3. On successful validation, component calls `mutation.mutate(validatedData)`.
4. Mutation hook's `mutationFn` executes:
    * Prepares data (e.g., serializes JSON fields).
    * Sends create request to Appwrite using typed `databases.createDocument<Type>`.
5. Appwrite creates the document.
6. On success (`onSuccess` callback): TanStack Query invalidates relevant list/search queries.
7. (Background) Data synchronization process updates Meilisearch.

#### 2. Update Pattern

```typescript
// Example: src/api/endpoints/useAddons.tsx
import type { Addon } from '@/types';
import { UpdateAddonSchema, type UpdateAddonInput } from '@/schemas/addon.schema'; // Validation

export const useUpdateAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ addonId, data }: { addonId: string; data: UpdateAddonInput }) => {
      // 1. (Validation should happen *before* calling mutate)
      // const validatedData = UpdateAddonSchema.parse(data);

      // 2. Prepare data (serialize JSON etc.)
      const dataToSave = prepareAddonForUpdate(data); // Simplified

      // 3. Call Appwrite using typed SDK method
      const updatedDoc = await databases.updateDocument<Addon>(
        DATABASE_ID,
        COLLECTION_ID,
        addonId,
        dataToSave
      );
      return updatedDoc;
    },
    onSuccess: (updatedDoc) => {
      // 4. Invalidate queries & potentially update specific cache entry
      queryClient.invalidateQueries({ queryKey: ['addons', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['searchAddons'] });
      queryClient.setQueryData(['addon', updatedDoc.$id], updatedDoc); // Update detail view cache
    },
  });
};
```

**Data Path**: Similar to Create, but uses `databases.updateDocument<Type>` and updates specific cache entries (`setQueryData`) in addition to invalidating lists.

#### 3. Delete Pattern

```typescript
// Example: src/api/endpoints/useSchematics.tsx
export const useDeleteSchematic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // 1. Call Appwrite
      await databases.deleteDocument(DATABASE_ID, SCHEMATIC_COLLECTION_ID, id);
      return id; // Return ID for cache manipulation
    },
    onSuccess: (id) => {
      // 2. Remove specific item from cache and invalidate lists
      queryClient.removeQueries({ queryKey: ['schematic', id] });
      queryClient.invalidateQueries({ queryKey: ['schematics', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['searchSchematics'] });
    },
  });
};
```

**Data Path**: Similar to Create/Update, but uses `databases.deleteDocument`, removes items from cache (`removeQueries`), and invalidates lists.

## Data Synchronization (Appwrite -> Meilisearch)

### Process Overview

(Conceptual flow remains the same: Appwrite change -> Trigger (Webhook/Function) -> Sync Logic -> Meilisearch Update)

* **Mechanism:** Typically handled by Appwrite Functions triggered by database events (e.g., `databases.*.collections.*.documents.*.create`).
* **Lag:** Expect a potential delay (e.g., up to 1 minute, configurable) between an Appwrite write and the update reflecting in Meilisearch results.
* **Data Handling:** The synchronization function must fetch the document from Appwrite and format it correctly (handling JSON strings, selecting appropriate fields) for the Meilisearch index, respecting the canonical types.

### Events & Consistency

(Events and consistency points remain largely the same as the original doc).

## Caching Strategy

(Caching strategy description using TanStack Query, Browser Cache remains largely the same, but stale times should reflect current hook configurations).

## Best Practices

### Data Access

- Use search hooks (`useSearch*`) for list/browse/search views.
- Use detail fetch hooks (`useFetch*`) for specific item views.
- Use mutation hooks (`useSave*`, `useUpdate*`, `useDelete*`) for all write operations.
- Avoid direct calls to `databases` or `searchClient` within UI components; encapsulate logic within hooks.

### Data Validation

- **Validate Inputs First:** Always validate user input or API payloads using the appropriate Zod schema (e.g., `CreateProjectSchema`, `UpdateAddonSchema`) *before* calling mutation hooks (`mutate(validatedData)`).
- **Separate Concerns:** Use Zod schemas (`/src/schemas/`) for validation and canonical types (`/src/types/appwrite.ts`) for representing data structure and interacting with typed Appwrite SDK methods. Refer to the [Zod Validation Guide](./zod-validation-guide.md).

```typescript
// ✅ Good - Validate before mutation
try {
  const validatedData = CreateBlogSchema.parse(formData);
  createBlogMutation.mutate(validatedData);
} catch (error) {
  // Handle Zod validation errors
}

// ❌ Bad - Passing raw form data directly to mutation
createBlogMutation.mutate(formData); // Risk of invalid data reaching API hook
```

### Error Handling

Implement robust error handling:

```typescript
// ✅ Good - Proper error handling
const Component = () => {
  const { data, isLoading, error } = useAddon(slug);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;
  if (!data) return <NotFoundMessage />;

  return <AddonDisplay addon={data} />;
};

// ❌ Bad - Inadequate error handling
const Component = () => {
  const { data } = useAddon(slug);

  return <AddonDisplay addon={data} />; // May cause null reference errors
};
```

### Data Validation

Always validate data against schemas:

```typescript
// ✅ Good - Validating data with schemas
const validatedData = AddonSchema.parse(rawData);
databases.createDocument(..., validatedData);

// ❌ Bad - Not validating input data
databases.createDocument(..., rawData); // May contain invalid data
```

### Optimistic Updates

For better user experience, implement optimistic updates:

```typescript
// ✅ Good - Using optimistic updates
const useUpdateDownloads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, count }: { id: string; count: number }) => {
      return databases.updateDocument(
        DATABASE_ID,
        ADDON_COLLECTION_ID,
        id,
        { downloads: count }
      );
    },
    onMutate: async ({ id, count }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['addon', id] });

      // Get current data
      const previousData = queryClient.getQueryData(['addon', id]);

      // Optimistically update the cache
      queryClient.setQueryData(['addon', id], (old: any) => ({
        ...old,
        downloads: count,
      }));

      // Return context for potential rollback
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert to previous state if there's an error
      queryClient.setQueryData(
        ['addon', variables.id],
        context?.previousData
      );
    },
  });
};
```

## Troubleshooting

### Common Issues

#### No Data Loading
- Check Appwrite and Meilisearch connectivity
- Verify proper environment variables are set
- Check browser console for API errors
- Verify collection permissions

#### Search Not Working
- Check Meilisearch indexing status
- Verify searchable attributes configuration
- Check filter syntax for errors
- Ensure data exists in the index

#### Stale Data
- Check if TanStack Query is properly invalidating caches
- Verify synchronization between Appwrite and Meilisearch
- Try manually refetching with `refetch()`
- Check server logs for synchronization errors

#### Mutation Errors
- Validate data against schema
- Check permission settings
- Look for unique constraint violations
- Verify the document exists (for updates)

## Performance Considerations

To ensure optimal performance:

1. **Batch Operations**: Group related mutations
2. **Pagination**: Always paginate large result sets
3. **Selective Loading**: Only fetch needed fields
4. **Proper Indexing**: Ensure collections are properly indexed
5. **Query Optimization**: Use specific filters to reduce result set size
6. **Caching Tuning**: Adjust stale times based on data volatility

## Future Improvements

Planned improvements to the data architecture:

1. **Real-time Updates**: WebSocket integration for live updates
2. **Offline Support**: Progressive Web App capabilities
3. **Data Prefetching**: Smart prefetching based on user behavior
4. **Enhanced Caching**: More granular cache invalidation
5. **Entity Relationships**: Better handling of related data
6. **Data Compression**: Reducing payload sizes for mobile optimization
