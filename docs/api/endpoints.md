# API Endpoints

Blueprint implements a comprehensive set of API endpoints to interact with the backend services. This document outlines the available endpoints, their usage, and implementation details.

## Overview

Blueprint's API layer is built around TanStack Query hooks that interact with Appwrite and Meilisearch services. These hooks provide a clean, declarative way to fetch, create, update, and delete data.

## Endpoint Organization

API endpoints are organized in the `/src/api/endpoints` directory, with each file focusing on a specific feature or data type:

```
src/api/endpoints/
├── useAddons.tsx            # Addon CRUD operations
├── useBlogs.tsx             # Blog post management
├── useBreakpoints.tsx       # Responsive design hooks
├── useSearchAddons.tsx      # Addon search functionality
├── useSearchSchematics.tsx  # Schematic search functionality
├── useSystemThemeSync.tsx   # Theme synchronization
```

## Core Endpoint Types

### Query Endpoints

Query endpoints retrieve data from backend services using TanStack Query's `useQuery` hook:

```typescript
// src/api/endpoints/useAddons.tsx
export const useFetchAddon = (slug?: string) => {
  return useQuery<Addon | null>({
    queryKey: ['addon', slug],
    queryFn: async () => {
      if (!slug) return null;

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('slug', slug),
      ]);

      if (response.documents.length === 0) return null;
      
      const doc = response.documents[0];
      // Transform document to Addon type
      const addonData: Addon = {
        // Mapping properties
      };

      return addonData;
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
```

### Mutation Endpoints

Mutation endpoints modify data using TanStack Query's `useMutation` hook:

```typescript
// src/api/endpoints/useAddons.tsx
export const useSaveAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addon: Partial<Addon>) => {
      const serializedAddon = {
        // Prepare data for storage
      };

      if (!addon.$id) {
        return databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), serializedAddon);
      }

      return databases.updateDocument(DATABASE_ID, COLLECTION_ID, addon.$id, serializedAddon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};
```

### Search Endpoints

Search endpoints interact with Meilisearch to provide search functionality:

```typescript
// src/api/endpoints/useSearchAddons.tsx
export const useSearchAddons = ({
  query,
  filters,
  page = 1,
  hitsPerPage = 20,
}: SearchAddonsParams) => {
  return useQuery<SearchResults<Addon>>({
    queryKey: ['search', 'addons', query, filters, page, hitsPerPage],
    queryFn: async () => {
      const index = meilisearch.index('addons');
      const results = await index.search(query, {
        filter: filters,
        page,
        hitsPerPage,
      });
      
      return {
        hits: results.hits as Addon[],
        total: results.estimatedTotalHits,
        page: results.page,
        // Other result metadata
      };
    },
    // Configuration options
  });
};
```

### Utility Endpoints

Utility endpoints provide application-specific functionality:

```typescript
// src/api/endpoints/useBreakpoints.tsx
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1024px)');
};

export const useIsTablet = () => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 767px)');
};
```

## Addon Endpoints

Endpoints for managing Create Mod addons:

### `useFetchAddons`

Retrieves a paginated list of addons:

```typescript
const { 
  data, 
  isLoading, 
  error 
} = useFetchAddons(page, limit);

// Response structure
interface FetchAddonsResponse {
  addons: Addon[];
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### `useFetchAddon`

Retrieves a single addon by slug:

```typescript
const { 
  data: addon, 
  isLoading, 
  error 
} = useFetchAddon(slug);

// Response is either an Addon object or null
```

### `useSaveAddon`

Creates or updates an addon:

```typescript
const mutation = useSaveAddon();

// Usage
mutation.mutate(addonData);

// Track status
const isLoading = mutation.isPending;
const error = mutation.error;
```

### `useDeleteAddon`

Deletes an addon:

```typescript
const mutation = useDeleteAddon();

// Usage
mutation.mutate(addonId);
```

## Blog Endpoints

Endpoints for managing blog posts:

### `useFetchBlogs`

Retrieves a paginated list of blog posts:

```typescript
const {
  data,
  isLoading,
  error
} = useFetchBlogs(page, limit);
```

### `useFetchBlog`

Retrieves a single blog post by slug:

```typescript
const {
  data: blog,
  isLoading,
  error
} = useFetchBlog(slug);
```

### `useSaveBlog`

Creates or updates a blog post:

```typescript
const mutation = useSaveBlog();

// Usage
mutation.mutate(blogData);
```

### `useDeleteBlog`

Deletes a blog post:

```typescript
const mutation = useDeleteBlog();

// Usage
mutation.mutate(blogId);
```

## Schematic Endpoints

Endpoints for managing Create Mod schematics:

### `useFetchSchematics`

Retrieves a paginated list of schematics:

```typescript
const {
  data,
  isLoading,
  error
} = useFetchSchematics(page, limit);
```

### `useFetchSchematic`

Retrieves a single schematic by ID:

```typescript
const {
  data: schematic,
  isLoading,
  error
} = useFetchSchematic(id);
```

### `useUploadSchematic`

Uploads a new schematic:

```typescript
const mutation = useUploadSchematic();

// Usage
mutation.mutate({
  file: schematicFile,
  metadata: {
    name: 'My Schematic',
    description: 'A detailed description',
    tags: ['automation', 'factory'],
    // Other metadata
  }
});
```

## Search Endpoints

Endpoints for searching content:

### `useSearchAddons`

Searches for addons based on query and filters:

```typescript
const {
  data,
  isLoading,
  error
} = useSearchAddons({
  query: 'factory',
  filters: 'categories = "automation"',
  page: 1,
  hitsPerPage: 20
});
```

### `useSearchSchematics`

Searches for schematics based on query and filters:

```typescript
const {
  data,
  isLoading,
  error
} = useSearchSchematics({
  query: 'sorting',
  filters: 'tags = "automation"',
  page: 1,
  hitsPerPage: 20
});
```

## Utility Endpoints

Utility endpoints for application functionality:

### Breakpoint Utilities

Responsive design utility hooks:

```typescript
// Check current device type
const isDesktop = useIsDesktop();
const isTablet = useIsTablet();
const isMobile = useIsMobile();

// Get current breakpoint as a string
const breakpoint = useCurrentBreakpoint(); // 'mobile', 'tablet', or 'desktop'
```

### Theme Utilities

Theme management utilities:

```typescript
// Sync with system theme
useSystemThemeSync();
```

## Implementation Details

### Query Key Management

Blueprint follows a consistent pattern for query keys:

- Single entity: `[entityType, id]`
- Collection: `[entityType, page, limit]`
- Search: `['search', entityType, query, filters, page, limit]`

This pattern ensures proper caching and invalidation of queries.

### Error Handling

API endpoints implement consistent error handling:

```typescript
// Common error handling pattern
try {
  // API operation
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to perform operation');
}
```

### API Response Transformation

Raw API responses are transformed into application data structures:

```typescript
// Example transformation
const addonData: Addon = {
  $id: doc.$id,
  name: doc.name || '',
  description: doc.description || '',
  // Map other properties
  
  // Transform complex properties
  curseforge_raw: doc.curseforge_raw ? JSON.parse(doc.curseforge_raw) : undefined,
  
  // Ensure arrays for collections
  categories: Array.isArray(doc.categories) ? doc.categories : [],
};
```

### Caching Strategy

Blueprint implements a thoughtful caching strategy:

1. **Stale-While-Revalidate**: Show cached data immediately while fetching updates
2. **Appropriate Stale Times**: Set cache durations appropriate to data volatility
3. **Automatic Refetching**: Refetch data when window regains focus
4. **Query Invalidation**: Invalidate related queries on mutations

## Authentication Handling

API endpoints that require authentication are protected using Appwrite's session management:

```typescript
// Example of a protected endpoint
const useFetchUserData = () => {
  return useQuery({
    queryKey: ['user', 'data'],
    queryFn: async () => {
      try {
        // This will fail if not authenticated
        const userData = await account.get();
        return userData;
      } catch (error) {
        if (error.code === 401) {
          throw new Error('Authentication required');
        }
        throw error;
      }
    },
  });
};
```

## File Upload Handling

File uploads are managed through Appwrite Storage:

```typescript
// Example file upload
const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({ file, metadata }: { file: File, metadata: Record<string, any> }) => {
      // Upload file to storage
      const fileResponse = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        metadata
      );
      return fileResponse;
    },
  });
};
```

## Best Practices

### Optimizing Query Performance

1. **Use Pagination**: Always paginate large collections
   ```typescript
   const { data } = useFetchAddons(page, limit);
   ```

2. **Select Specific Fields**: Only request needed fields
   ```typescript
   // Appwrite example
   const response = await databases.listDocuments(
     DATABASE_ID,
     COLLECTION_ID,
     [
       Query.limit(limit),
       Query.offset((page - 1) * limit),
       Query.select(['$id', 'name', 'description', 'icon']),
     ]
   );
   ```

3. **Appropriate Cache Times**: Match cache duration to data volatility
   ```typescript
   // Frequently changing data
   staleTime: 1000 * 60, // 1 minute
   
   // Relatively stable data
   staleTime: 1000 * 60 * 5, // 5 minutes
   ```

### Error Handling Guidelines

1. **Graceful Error Recovery**: Provide fallbacks when possible
   ```tsx
   const { data, error, isLoading } = useFetchAddons(1, 10);
   
   if (isLoading) return <LoadingState />;
   if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
   if (!data || data.addons.length === 0) return <EmptyState />;
   ```

2. **Specific Error Messages**: Provide actionable error information
   ```typescript
   try {
     // Operation
   } catch (error) {
     if (error.code === 404) {
       throw new Error('Addon not found. It may have been deleted.');
     } else if (error.code === 403) {
       throw new Error('You do not have permission to access this addon.');
     } else {
       throw new Error(`Failed to fetch addon: ${error.message}`);
     }
   }
   ```

3. **Error Logging**: Log detailed errors while showing user-friendly messages
   ```typescript
   try {
     // Operation
   } catch (error) {
     console.error('Detailed error:', error);
     throw new Error('A problem occurred while loading data. Please try again.');
   }
   ```

### Query Invalidation Strategy

1. **Targeted Invalidation**: Invalidate only affected queries
   ```typescript
   // Good: Only invalidate related queries
   queryClient.invalidateQueries({ queryKey: ['addon', slug] });
   
   // Bad: Invalidate everything
   queryClient.invalidateQueries();
   ```

2. **Optimistic Updates**: Update UI before server confirmation
   ```typescript
   useMutation({
     mutationFn: updateAddon,
     onMutate: async (newAddon) => {
       // Cancel outgoing refetches
       await queryClient.cancelQueries({ queryKey: ['addon', newAddon.slug] });
       
       // Snapshot previous value
       const previousAddon = queryClient.getQueryData(['addon', newAddon.slug]);
       
       // Optimistically update
       queryClient.setQueryData(['addon', newAddon.slug], newAddon);
       
       return { previousAddon };
     },
     onError: (err, newAddon, context) => {
       // Restore previous value on error
       queryClient.setQueryData(
         ['addon', newAddon.slug],
         context.previousAddon
       );
     },
   });
   ```

## Related Documentation

- [Appwrite Integration](./appwrite.md)
- [Meilisearch Integration](./meilisearch.md)
- [State Management](../architecture/state-management.md)
