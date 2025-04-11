# Meilisearch & Appwrite Type Integration Guide

## Overview

This document outlines Blueprint's approach for integrating Meilisearch with Appwrite in a type-safe manner. It ensures consistent data types throughout the application, regardless of whether data originates directly from Appwrite or via Meilisearch results.

### The Challenge

Working with both Appwrite (database) and Meilisearch (search index) presents challenges:

1.  **Multiple Data Sources**: Data exists in Appwrite and is mirrored/indexed in Meilisearch.
2.  **Type Consistency**: A unified data model is needed across the application, irrespective of the source.
3.  **Type Safety**: Maintain strong TypeScript typing when interacting with both Appwrite SDK and Meilisearch results.
4.  **Handling Differences**: Account for potential variations, like fields stored as JSON strings in Appwrite vs. how they might be indexed or returned by Meilisearch.
5.  **Code Duplication**: Avoid redundant type definitions and data mapping logic.

### Our Solution

Blueprint establishes a pattern where:

1.  Appwrite document interfaces defined in `src/types/appwrite.ts` are considered the **canonical types**.
2.  Meilisearch type definitions in `src/types/meilisearch.ts` leverage these canonical types, adding search-specific metadata if needed.
3.  API hooks (`/src/api/endpoints/`) abstract the data fetching and provide consistent, typed data to the UI, handling necessary conversions (like JSON string parsing) internally.
4.  Zod schemas (`/src/schemas/`) are used primarily for form/input validation, separate from the canonical data structure types.

## Implementation Steps

Follow these steps when integrating an Appwrite collection that is also indexed in Meilisearch (using `Addon` as an example):

### 1. Define Canonical Types in `appwrite.ts`

Ensure your document interface exists in `src/types/appwrite.ts`:

```typescript
// src/types/appwrite.ts
import type { Models } from 'appwrite';

export interface Addon extends Models.Document {
  name: string;
  description: string;
  slug: string;
  author: string;
  categories: string[];
  downloads: number;
  // ... other fields
  // Fields stored as JSON strings
  curseforge_raw: string | null;
  modrinth_raw: string | null;
}
```

*(Define other types like `Blog`, `Schematic`, `User`, `FeatureFlag` similarly)*

### 2. Create Meilisearch Type Definitions in `meilisearch.ts`

Define types for Meilisearch responses in `src/types/meilisearch.ts`:

```typescript
// src/types/meilisearch.ts
import type { Hits, SearchResponse } from 'meilisearch';
import type { Addon, Blog, Schematic } from '@/types/appwrite'; // Import canonical types

// Type for a full Meilisearch search response for Addons
export type MeiliAddonResponse = SearchResponse<Addon>;

// Type for an array of Meilisearch hits containing Addon data
export type MeiliAddonHits = Hits<Addon>;

// Type for a single Meilisearch hit for an Addon
export type MeiliAddonHit = MeiliAddonHits[number];

// Define similar types for Blog (MeiliBlogResponse, etc.) and Schematic
```

### 3. Update API Hooks for Appwrite (`useQuery`, `useMutation`)

Use generics with your canonical types in Appwrite API hooks (e.g., in `src/api/endpoints/useAddons.tsx`):

```typescript
// src/api/endpoints/useAddons.tsx
import type { Addon, AddonWithParsedFields } from '@/types';
import { Query, ID } from 'appwrite';

// Fetch a single addon
export const useFetchAddon = (id?: string) => {
  return useQuery<AddonWithParsedFields | null>({ // Use helper type if parsing needed
    queryKey: ['addon', id],
    queryFn: async () => {
      if (!id) return null;
      // Uses Appwrite SDK with generic type
      const addon = await databases.getDocument<Addon>(DATABASE_ID, COLLECTION_ID, id);
      // Internal helper parses JSON fields
      return addParsedFields(addon);
    },
    enabled: Boolean(id),
  });
};

// Fetch multiple addons
export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery<{ addons: AddonWithParsedFields[]; total: number; ... }>({
    queryKey: ['addons', 'list', page, limit],
    queryFn: async () => {
      const response = await databases.listDocuments<Addon>(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(limit), Query.offset((page - 1) * limit)]
      );
      // Process results to parse JSON fields
      const addons = response.documents.map(addParsedFields);
      return {
        addons,
        total: response.total,
        // pagination logic...
      };
    },
  });
};

// Create or update an addon
export const useUpdateAddon = () => {
  return useMutation({
    // Accepts Partial<Addon> but handles serialization internally
    mutationFn: async ({ addonId, data }: { addonId: string; data: Partial<Addon> }) => {
      // Internal logic stringifies raw JSON fields if provided as objects
      const updateData = prepareAddonForUpdate(data);

      return databases.updateDocument<Addon>( // Use generic type
        DATABASE_ID,
        COLLECTION_ID,
        addonId,
        updateData
      );
    },
    // onSuccess invalidation...
  });
};
```

### 4. Create Search Hooks for Meilisearch

Implement search hooks using the Meilisearch types (e.g., in `src/api/endpoints/useSearchAddons.tsx`):

```typescript
// src/api/endpoints/useSearchAddons.tsx
import type { Addon, AddonWithParsedFields } from '@/types';
import type { MeiliAddonResponse } from '@/types/meilisearch'; // Import Meili type
import searchClient from '@/config/meilisearch';

export const useSearchAddons = (searchParams) => {
  return useQuery({
    queryKey: ['searchAddons', searchParams],
    queryFn: async () => {
      const index = searchClient.index('addons');

      // Use Meilisearch types for the raw response
      const result = (await index.search(searchParams.query, {
        limit: searchParams.limit,
        offset: (searchParams.page - 1) * searchParams.limit,
        filter: buildFilter(searchParams.filters), // Assume buildFilter exists
      })) as MeiliAddonResponse; // Cast to the specific Meili response type

      // Meilisearch hits might contain raw JSON strings. Process them.
      const processedHits: AddonWithParsedFields[] = result.hits.map(processAddon); // Assume processAddon helper exists

      return {
        data: processedHits, // Return data conforming to application needs
        totalHits: result.estimatedTotalHits || 0,
        // pagination...
      };
    },
  });
};
```
*(Note: `useSearchBlogs` currently uses a local API endpoint `/api/search` which encapsulates Meilisearch interaction, but the principle of returning parsed, canonical types remains)*

### 5. Define Unified Search Result Types

Define consistent result types for search hooks in `src/types/meilisearch.ts` (or `src/types/index.ts`):

```typescript
// src/types/meilisearch.ts
import type { Addon, Blog, Schematic } from './appwrite'; // Use canonical types

// Generic utility type for search results with metadata
export interface SearchResult<T> {
  data: T[]; // Holds the canonical data type
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  totalHits: number;
  page: number;
  limit?: number;
}

// Define specific search result types
export type SearchAddonResult = SearchResult<AddonWithParsedFields>; // Use helper type if needed
export type SearchSchematicResult = SearchResult<Schematic>;
export type SearchBlogResult = SearchResult<Blog>; // Assumes parsing happens before return
```

### 6. Update Schema Definitions (Zod)

Focus Zod schemas (`/src/schemas/`) on **form and input validation**, not duplicating the data structure defined in `src/types/appwrite.ts`:

```typescript
// src/schemas/addon.schema.ts
import { z } from 'zod';

// Example: Schema for UPDATING an addon (all fields optional)
export const UpdateAddonSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  // Only include fields that can be updated via a form/API input
}).partial();

// src/schemas/blog.schema.ts
// Example: Schema for CREATING a blog post
export const CreateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  // ... other required fields for creation
});

// Schemas for Search Parameters
export const SearchAddonsPropsSchema = z.object({
  query: z.string(),
  page: z.number().int().positive(),
  limit: z.number().int().positive().optional(),
  category: z.string().optional(),
  // ... other filter params
});
```

### 7. Export Types Correctly from `index.ts`

Consolidate and export types cleanly from `src/types/index.ts`:

```typescript
// src/types/index.ts

// Export the CANONICAL Appwrite document types
export type {
  Addon,
  Blog,
  Schematic,
  User,
  UserPreferences,
  BlogTag,
  SchematicTag,
  FeatureFlag,
  // etc.
} from '@/types/appwrite';

// Export HELPER types if they are used externally
export type { AddonWithParsedFields } from '@/types/addons/addon-details';

// Export SEARCH RESULT types
export type {
  SearchAddonResult,
  SearchBlogResult,
  SearchSchematicResult,
  // Export MeiliSearchResult<T> if used directly
} from '@/types/meilisearch';

// Export types derived from Zod SCHEMAS (for forms, inputs)
export type { BlogFormValues } from '@/schemas/blog.schema';
export type { TagFormValues } from '@/schemas/tag.schema';
// ... other Zod-derived types

// DO NOT export internal Meilisearch response types like MeiliAddonResponse unless necessary outside API hooks.
```

## Benefits of This Approach

1.  **Single Source of Truth**: `src/types/appwrite.ts` defines the core data structures.
2.  **Type Safety**: Interactions with Appwrite and processing of Meilisearch data are strongly typed.
3.  **DRY**: Reduces redundancy in type definitions and eliminates manual mapping in many places.
4.  **Clear Separation**: Distinguishes between data structure definitions (`*.ts`), validation rules (`*.schema.ts`), and API interaction logic (`use*.tsx`).
5.  **Improved DX**: Better autocompletion and compile-time checks in the IDE.
6.  **Maintainability**: Easier to update types when Appwrite collection structures change.

## Handling Specific Cases

1.  **JSON String Fields**: For fields like `addon.curseforge_raw` or `blog.tags`, API hooks (queries and mutations) must handle the parsing (string -> object/array) and serialization (object/array -> string). Helper types (e.g., `AddonWithParsedFields`) or utility functions (`parseJsonFields`, `addParsedFields`) are used to manage this, providing the parsed version to the application code.
2.  **Field Mismatches**: Ensure field names are consistent between Appwrite attributes and Meilisearch index attributes.
3.  **Meilisearch-Specific Fields**: If you need fields only present in Meilisearch results (like `_matchesPosition`), extend the canonical type or handle them explicitly within the search hook.

By adhering to this pattern, Blueprint maintains a robust and type-safe data layer when interacting with both Appwrite and Meilisearch.
```