# Blueprint Data Architecture

## Overview
Blueprint implements a dual-database architecture combining Appwrite for primary data storage and Meilisearch for optimized search functionality. This document outlines the key components, data flows, and best practices for working with Blueprint's data layer.

## Core Components

### 1. Appwrite
- **Role**: Primary database and authentication system
- **Use Cases**: 
  - CRUD operations
  - File storage
  - User authentication
  - Data persistence
- **Location**: `@/config/appwrite.ts`

### 2. Meilisearch
- **Role**: Search index and fast read operations
- **Use Cases**:
  - Full-text search
  - Filtered queries
  - Quick data retrieval 
- **Location**: `@/config/meilisearch.ts`

### 3. React Query
- **Role**: Frontend state management and data synchronization
- **Use Cases**:
  - Cache management
  - Server state handling
  - Mutation management
- **Location**: Used in custom hooks under `@/api/endpoints/`

## Data Flow Patterns

### Read Operations
```typescript
// Search & Display Pattern (via Meilisearch)
const useSearchSchematics = ({
  query = '',
  page = 1,
  category = 'all',
  version = 'all',
  loaders = 'all',
}) => {
  return useQuery({
    queryKey: ['searchSchematics', query, page, category, version, loaders],
    queryFn: async () => {
      const index = searchClient.index('schematics');
      return index.search(query, {
        filters: buildFilters({ category, version, loaders })
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });
};
```

### Write Operations
```typescript
// Direct Database Operations (via Appwrite)
const useSaveSchematics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schematic: Partial<Schematic>) => {
      return databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        schematic
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematics'] });
    }
  });
};
```

## Data Synchronization

### Process Overview
1. Data is written to Appwrite
2. Appwrite triggers background sync (1-minute delay)
3. Meilisearch index is updated
4. Updated data becomes available for search

### Important Considerations
- 1-minute lag between write and search availability
- Write operations should always go through Appwrite
- Read operations should prefer Meilisearch for performance
- React Query handles frontend caching automatically

## Best Practices

### Data Access
```typescript
// ✅ Good - Using appropriate hooks for operations
const Component = () => {
  // For displaying/searching
  const { data: searchResults } = useSearchSchematics(searchParams);
  
  // For mutations
  const { mutate: saveSchematic } = useSaveSchematics();
};

// ❌ Bad - Mixing concerns or bypassing patterns
const Component = () => {
  // Don't directly access databases
  const results = await databases.listDocuments(...);
};
```
