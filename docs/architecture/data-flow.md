# Data Architecture and Flow

Blueprint implements a dual-database architecture combining Appwrite for primary data storage and Meilisearch for optimized search functionality. This document outlines the key components, data flows, and best practices for working with Blueprint's data layer.

## Core Components

### 1. Appwrite

**Role**: Primary database and authentication system

**Use Cases**:
- CRUD operations for all data entities
- User authentication and session management
- File storage for images and schematics
- Data persistence and integrity

**Configuration Location**: `/src/config/appwrite.ts`

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

### 2. Meilisearch

**Role**: Search index and fast read operations

**Use Cases**:
- Full-text search across all content
- Filtered queries with complex conditions
- Quick data retrieval with low latency
- Typo-tolerant search functionality

**Configuration Location**: `/src/config/meilisearch.ts`

```typescript
import { MeiliSearch } from 'meilisearch';

const url = window._env_?.MEILISEARCH_URL || '';
const apiKey = window._env_?.MEILISEARCH_API_KEY || '';
const searchClient = new MeiliSearch({
  host: url,
  apiKey: apiKey,
});
export default searchClient;
```

### 3. TanStack Query

**Role**: Frontend state management and data synchronization

**Use Cases**:
- Cache management for API responses
- Server state handling
- Mutation management
- Automatic refetching and background updates

**Implementation**: Used in custom hooks under `/src/api/endpoints/`

## Data Flow Patterns

### Read Operations

Blueprint implements different read patterns depending on the use case:

#### 1. Search & Display Pattern (via Meilisearch)

Used for list views and search functionality where performance is critical.

```typescript
// Example from useSearchAddons.tsx
const useSearchAddons = ({
  query = '',
  page = 1,
  category = 'all',
  version = 'all',
  loaders = 'all',
}) => {
  return useQuery({
    queryKey: ['searchAddons', query, page, category, version, loaders],
    queryFn: async () => {
      const index = searchClient.index('addons');
      
      // Build filter string based on parameters
      const filters = buildFilters({ category, version, loaders });
      
      // Execute search with pagination
      return index.search(query, {
        filter: filters,
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });
};
```

**Data Path**:
1. User triggers search or filter action
2. React component calls `useSearchAddons` hook
3. TanStack Query checks its cache for matching query
4. If cache miss or stale, request is sent to Meilisearch
5. Meilisearch returns matching documents
6. Results are cached in TanStack Query store
7. Data is displayed to user

#### 2. Detail Pattern (via Appwrite)

Used for detailed views where complete and up-to-date data is required.

```typescript
// Example from useAddons.tsx
const useAddon = (slug: string) => {
  return useQuery({
    queryKey: ['addon', slug],
    queryFn: async () => {
      // Query Appwrite for the addon with matching slug
      const response = await databases.listDocuments(
        DATABASE_ID,
        ADDON_COLLECTION_ID,
        [Query.equal('slug', slug)]
      );
      
      if (response.documents.length === 0) {
        throw new Error('Addon not found');
      }
      
      return response.documents[0];
    },
    staleTime: 1000 * 60 * 10, // 10 minute cache
  });
};
```

**Data Path**:
1. User navigates to detail page
2. React component calls `useAddon` hook with slug
3. TanStack Query checks its cache for matching query
4. If cache miss or stale, request is sent to Appwrite
5. Appwrite returns complete document
6. Result is cached in TanStack Query store
7. Full data is displayed to user

### Write Operations

All write operations go through Appwrite as the source of truth.

#### 1. Create Pattern

Used when creating new resources.

```typescript
// Example for saving a new schematic
const useSaveSchematic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schematic: Partial<Schematic>) => {
      return databases.createDocument(
        DATABASE_ID,
        SCHEMATICS_COLLECTION_ID,
        ID.unique(),
        {
          ...schematic,
          created_at: new Date().toISOString(),
        }
      );
    },
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['schematics'] });
      queryClient.invalidateQueries({ queryKey: ['searchSchematics'] });
    },
  });
};
```

**Data Path**:
1. User submits form to create resource
2. React component calls `useSaveSchematic().mutate()` with data
3. Mutation function sends create request to Appwrite
4. Appwrite creates document and returns result
5. On success, related queries are invalidated
6. Background process syncs new data to Meilisearch (1-minute delay)
7. Users will see the new data in search results after sync completes

#### 2. Update Pattern

Used when modifying existing resources.

```typescript
// Example for updating a schematic
const useUpdateSchematic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Schematic> }) => {
      return databases.updateDocument(
        DATABASE_ID,
        SCHEMATICS_COLLECTION_ID,
        id,
        {
          ...data,
          updated_at: new Date().toISOString(),
        }
      );
    },
    onSuccess: (result) => {
      // Update cache with new data
      queryClient.setQueryData(['schematic', result.$id], result);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['schematics'] });
      queryClient.invalidateQueries({ queryKey: ['searchSchematics'] });
    },
  });
};
```

**Data Path**:
1. User submits form to update resource
2. React component calls `useUpdateSchematic().mutate()` with ID and data
3. Mutation function sends update request to Appwrite
4. Appwrite updates document and returns result
5. On success, cache is updated and related queries are invalidated
6. Background process syncs updated data to Meilisearch (1-minute delay)
7. Users will see the updated data in search results after sync completes

#### 3. Delete Pattern

Used when removing resources.

```typescript
// Example for deleting a schematic
const useDeleteSchematic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await databases.deleteDocument(
        DATABASE_ID,
        SCHEMATICS_COLLECTION_ID,
        id
      );
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['schematic', id] });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['schematics'] });
      queryClient.invalidateQueries({ queryKey: ['searchSchematics'] });
    },
  });
};
```

**Data Path**:
1. User triggers delete action
2. React component calls `useDeleteSchematic().mutate()` with ID
3. Mutation function sends delete request to Appwrite
4. Appwrite removes document
5. On success, cache entry is removed and related queries are invalidated
6. Background process syncs deletion to Meilisearch (1-minute delay)
7. Item will disappear from search results after sync completes

## Data Synchronization

### Process Overview

Data synchronization between Appwrite and Meilisearch follows this flow:

1. Data is written to Appwrite (primary database)
2. Appwrite triggers a webhook on document changes
3. The webhook calls a serverless function or API endpoint
4. The function processes the change and updates Meilisearch
5. Updated data becomes available for search

There is typically a 1-minute lag between write operations in Appwrite and the data becoming available in Meilisearch search results.

### Synchronization Events

The following events trigger synchronization:

- Document creation
- Document update
- Document deletion
- Collection changes (schema updates)

### Ensuring Data Consistency

To ensure data consistency:

1. **Write Validation**: Data is validated before writing to Appwrite
2. **Schema Validation**: Schema ensures data structure consistency
3. **Sync Validation**: Data is validated again during synchronization
4. **Error Handling**: Failed syncs are logged and retried
5. **Periodic Full Sync**: Regular full synchronization to catch any missed changes

## Caching Strategy

Blueprint uses a multi-layered caching strategy:

### 1. TanStack Query Cache

- **Stale Time**: How long data stays fresh
  - Search results: 5 minutes
  - Detail views: 10 minutes
  - User data: 5 minutes
- **Cache Time**: How long unused data stays in memory (default: 5 minutes)
- **Refetch On**: When automatic refetching occurs
  - Window focus: Enabled
  - Network reconnection: Enabled
  - Component mount: Disabled (uses cache)

### 2. Browser Cache

- **HTTP Caching**: For static assets and images
- **localStorage**: For user preferences and filter settings
- **Service Worker**: For offline support (planned feature)

## Best Practices

### Data Access

Always use the appropriate patterns for data access:

```typescript
// ✅ Good - Using appropriate hooks for operations
const Component = () => {
  // For displaying/searching (Meilisearch)
  const { data: searchResults } = useSearchAddons(searchParams);
  
  // For detailed views (Appwrite)
  const { data: addonDetails } = useAddon(slug);
  
  // For mutations (Appwrite)
  const { mutate: saveAddon } = useSaveAddon();
};

// ❌ Bad - Mixing concerns or bypassing patterns
const Component = () => {
  // Don't directly access databases
  const results = await databases.listDocuments(...);
  
  // Don't bypass caching layer
  const searchResults = await searchClient.index('addons').search(...);
};
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
