# Guide: Creating New Appwrite-Backed Data Types

## Introduction

This guide walks through the process of defining and integrating a new data type in Blueprint that is primarily stored and fetched from Appwrite. Following these steps ensures type safety, consistency across the application, and maintainability. This guide also covers how to integrate the new type with Meilisearch for search functionality, if required.

We aim to:
1.  Define a single, canonical type definition for data stored in Appwrite.
2.  Use typed Appwrite SDK methods for fetching and manipulating data.
3.  Create dedicated TanStack Query hooks for interacting with the data type.
4.  Optionally integrate with Meilisearch for searching.
5.  Use Zod primarily for input/form validation, keeping it distinct from the data structure definition.

Let's use a hypothetical `Project` type as an example throughout this guide. Assume we have an Appwrite collection named `projects`.

## Step 1: Define the Canonical Type (`src/types/appwrite.ts`)

All core data structures corresponding to Appwrite collections should be defined here.

1.  **Location:** Open `src/types/appwrite.ts`.
2.  **Definition:** Define an interface that extends `Models.Document` (or `Models.User` for user-related types). The properties should match the attributes defined in your Appwrite `projects` collection.

```typescript
// src/types/appwrite.ts
import type { Models } from 'appwrite';

// ... other type imports

export interface Project extends Models.Document {
  // Match Appwrite collection attributes exactly
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  ownerId: string; // User ID relationship
  tags: string[]; // Array of strings, maybe simple tags or Tag document IDs
  dueDate: string | null; // Appwrite stores dates as ISO strings
  // Example of a field stored as a JSON string
  settings: string | null; // e.g., '{ "notifications": true, "priority": "high" }'
}

// Define nested object type if 'settings' is parsed
export interface ProjectSettings {
  notifications: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Define other related types...
```

* **Important:** Pay attention to types. Appwrite often stores dates as ISO strings. Relationships are usually stored as document IDs (strings). Complex nested data might be stored as a JSON string.

## Step 2: Create API Hooks (`/src/api/endpoints/`)

Create TanStack Query hooks to fetch and mutate your new type.

1.  **Location:** Create a new file, e.g., `src/api/endpoints/useProjects.ts`.
2.  **Implementation:** Implement hooks using the typed Appwrite SDK methods (`getDocument<Project>`, `listDocuments<Project>`, etc.) and your canonical `Project` type.

```typescript
// src/api/endpoints/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID, Query } from '@/config/appwrite';
import type { Project, ProjectSettings } from '@/types/appwrite'; // Use canonical type

// --- Constants ---
const DATABASE_ID = 'your_database_id'; // Replace with actual ID
const COLLECTION_ID = 'projects';       // Replace with actual ID

// --- Helper for JSON Parsing (if needed) ---
function parseProjectSettings(project: Project): Project & { settingsParsed: ProjectSettings | null } {
  let settingsParsed: ProjectSettings | null = null;
  if (project.settings) {
    try {
      settingsParsed = JSON.parse(project.settings) as ProjectSettings;
    } catch (e) {
      console.error(`Failed to parse settings for project ${project.$id}:`, e);
    }
  }
  return { ...project, settingsParsed };
}

// --- Hooks ---

// Fetch a single project
export const useFetchProject = (id?: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      const projectDoc = await databases.getDocument<Project>(DATABASE_ID, COLLECTION_ID, id);
      // Parse JSON fields after fetching
      return parseProjectSettings(projectDoc);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch a list of projects
export const useFetchProjects = (/* add params like page, limit, filters if needed */) => {
  return useQuery({
    queryKey: ['projects', 'list', /* params */],
    queryFn: async () => {
      const response = await databases.listDocuments<Project>(DATABASE_ID, COLLECTION_ID, [
        // Add Query.limit, Query.offset, Query.equal etc. here
      ]);
      // Parse JSON fields for each document
      return response.documents.map(parseProjectSettings);
    },
    // Add pagination logic if needed
  });
};

// Create or Update a project
export const useSaveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData: Partial<Omit<Project, '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>> & { $id?: string, settings?: ProjectSettings | string | null }) => {
      // Prepare data for Appwrite (e.g., serialize JSON fields)
      const dataToSave = { ...projectData };
      if (projectData.settings && typeof projectData.settings === 'object') {
        dataToSave.settings = JSON.stringify(projectData.settings);
      } else if (projectData.settings === null) {
         dataToSave.settings = null;
      }
      // remove settingsParsed if it exists from the helper type
      delete (dataToSave as any).settingsParsed;


      if (projectData.$id) {
        // Update existing document
        return databases.updateDocument<Project>(
          DATABASE_ID,
          COLLECTION_ID,
          projectData.$id,
          dataToSave
        );
      } else {
        // Create new document
        return databases.createDocument<Project>(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          dataToSave
        );
      }
    },
    onSuccess: (savedProject) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['project', savedProject.$id] });
    },
  });
};

// Add useDeleteProject mutation hook similarly...
```

* **Query Keys:** Use descriptive query keys (e.g., `['project', id]`, `['projects', 'list', page, filters]`) for effective caching and invalidation.
* **JSON Handling:** If your type has fields stored as JSON strings (like `Project.settings`), implement parsing logic within the query hooks (`useFetch*`) and serialization logic within the mutation hooks (`useSave*`). Return the *parsed* version from query hooks.

## Step 3: Update Type Exports (`src/types/index.ts`)

Make your new canonical type available throughout the application.

1.  **Location:** Open `src/types/index.ts`.
2.  **Export:** Add your new type(s) to the export list from `appwrite.ts`.

```typescript
// src/types/index.ts

// Export the CANONICAL Appwrite document types
export type {
  Addon,
  Blog,
  Project, // <--- Add your new type here
  ProjectSettings, // <-- Add related types if needed
  // ... other types
} from '@/types/appwrite';

// Export helper types if needed externally
// export type { ProjectWithParsedSettings } from '@/types/...'

// Export SEARCH RESULT types (if applicable, see Step 5)
// export type { SearchProjectResult } from '@/types/meilisearch';

// Export types derived from Zod SCHEMAS (if applicable, see Step 4)
// export type { CreateProjectInput } from '@/schemas/project.schema';
```

## Step 4: Create Validation Schemas (Optional - `/src/schemas/`)

If you need to validate form data or API inputs before saving, use Zod schemas. Keep these separate from your canonical type definition.

1.  **Location:** Create a new file, e.g., `src/schemas/project.schema.ts`.
2.  **Definition:** Define schemas for specific actions like creation or updates. These typically *omit* system fields (`$id`, `$createdAt`, etc.) and may have different required/optional fields than the canonical type.

```typescript
// src/schemas/project.schema.ts
import { z } from 'zod';

// Schema for creating a new project
export const CreateProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  status: z.enum(['planning', 'active', 'on_hold']), // Only allow certain statuses on creation
  ownerId: z.string(), // Required on creation
  description: z.string().optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  tags: z.array(z.string()).optional(),
  // Validate the structure of settings if provided as an object
  settings: z.object({
      notifications: z.boolean(),
      priority: z.enum(['low', 'medium', 'high'])
  }).optional().nullable(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// Schema for updating a project (most fields optional)
export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
    // You might require specific fields for update, or none
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
```
3.  **Export (Optional):** Export Zod-derived types (like `CreateProjectInput`) from `src/types/index.ts` if needed elsewhere.

## Step 5: Add Search Integration (If Applicable - Meilisearch)

If your new `Project` type needs to be searchable:

1.  **Configure Meilisearch Index:** Ensure a `projects` index exists in Meilisearch and is configured with appropriate `searchableAttributes`, `filterableAttributes`, etc.
2.  **Define Meilisearch Types (`src/types/meilisearch.ts`):**
    ```typescript
    // src/types/meilisearch.ts
    import type { Hits, SearchResponse } from 'meilisearch';
    import type { Project } from '@/types/appwrite'; // Reference canonical type

    export type MeiliProjectResponse = SearchResponse<Project>;
    export type MeiliProjectHits = Hits<Project>;
    export type MeiliProjectHit = MeiliProjectHits[number];
    ```
3.  **Create Search Hook (`/src/api/endpoints/useSearchProjects.ts`):**
    ```typescript
    // src/api/endpoints/useSearchProjects.ts
    import { useQuery } from '@tanstack/react-query';
    import searchClient from '@/config/meilisearch';
    import type { Project } from '@/types/appwrite';
    import type { MeiliProjectResponse } from '@/types/meilisearch';
    import type { SearchResult } from '@/types/meilisearch'; // Import generic result type

    // Assume parseProjectSettings helper exists or adapt as needed
    import { parseProjectSettings } from './useProjects'; // Example import

    export const useSearchProjects = (searchParams: { query: string, /* filters, page, limit... */ }) => {
      return useQuery<SearchResult<ReturnType<typeof parseProjectSettings>>>({ // Use parsed type
        queryKey: ['searchProjects', searchParams],
        queryFn: async () => {
          const index = searchClient.index('projects');
          const result = (await index.search(searchParams.query, {
            // Add filters, limit, offset etc.
          })) as MeiliProjectResponse;

          // Meilisearch might return raw JSON strings if indexed that way
          // Parse them here if needed
          const parsedHits = result.hits.map(parseProjectSettings);

          return {
            data: parsedHits,
            totalHits: result.estimatedTotalHits || 0,
            // Include other fields required by SearchResult<T>
            isLoading: false, // Provided by useQuery
            isError: false,  // Provided by useQuery
            error: null,     // Provided by useQuery
            isFetching: false,// Provided by useQuery
            hasNextPage: /* Calculate based on totalHits, page, limit */ false,
            page: searchParams.page || 1,
            limit: searchParams.limit,
          };
        },
      });
    };
    ```
4.  **Define Search Result Type (`src/types/meilisearch.ts`):** Ensure the specific `SearchProjectResult` type exists or is covered by the generic `SearchResult<T>`.
    ```typescript
    // src/types/meilisearch.ts
    // ... (generic SearchResult<T> definition) ...
    export type SearchProjectResult = SearchResult<Project>; // Or the parsed type
    ```
5.  **Data Synchronization:** Set up a mechanism (e.g., Appwrite Functions triggered on database events) to push created/updated/deleted `Project` documents from Appwrite to your Meilisearch `projects` index.

## Step 6: Update API Index (`src/api/index.tsx`)

Export your new hooks so they can be easily imported elsewhere.

1.  **Location:** Open `src/api/index.tsx`.
2.  **Export:** Add export statements for your new hooks.

```typescript
// src/api/index.tsx

// ... other exports

export {
  useFetchProject,
  useFetchProjects,
  useSaveProject,
  // useDeleteProject,
} from './endpoints/useProjects';

// Export search hook if created
// export { useSearchProjects } from './endpoints/useSearchProjects';
```

## Conclusion

By following these steps, you create a well-defined, type-safe integration for your new Appwrite-backed data type. This approach promotes consistency, reduces errors, improves the developer experience through better autocompletion, and makes the codebase easier to maintain and scale. Remember to adapt the examples (especially JSON handling and search integration) based on the specific needs of your data type.
```