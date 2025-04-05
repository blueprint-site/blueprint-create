# Guide: Using Zod for Validation

## Introduction

Blueprint uses [Zod](https://zod.dev/) as its primary tool for schema declaration and data validation. It allows us to define expected data structures and validate incoming data against them, ensuring data integrity and providing excellent type safety, especially for form inputs and API payloads.

**Core Philosophy:**

In Blueprint, Zod is used primarily for **validating inputs**, such as:
* Data submitted through forms.
* Parameters passed to API hooks or functions.
* Configuration objects.

Zod schemas are generally **kept separate** from the canonical type definitions representing our database structures (which reside in `src/types/appwrite.ts`). This separation allows us to:
1.  Define the source-of-truth data structures based on Appwrite collections.
2.  Create specific validation rules for different operations (e.g., creating vs. updating) without cluttering the core data type.

## Where to Define Schemas

Validation schemas should be defined in the `/src/schemas/` directory.

* **File Naming:** Use a descriptive name related to the entity, e.g., `project.schema.ts`, `blog.schema.ts`, `tag.schema.ts`, `user.schema.ts`.

## Creating Validation Schemas

When creating schemas, think about the specific data you need to validate for a particular use case.

**Common Schema Types:**

1.  **Creation Schemas (`CreateEntitySchema`):**
    * Used to validate data when creating a *new* entity.
    * Typically includes all required fields for creation.
    * Omits system-generated fields like `$id`, `$createdAt`, `$updatedAt`, `$permissions`.
    * May set default values appropriate for creation.

    ```typescript
    // src/schemas/project.schema.ts
    import { z } from 'zod';

    export const CreateProjectSchema = z.object({
      name: z.string().min(3, 'Project name must be at least 3 characters'),
      status: z.enum(['planning', 'active', 'on_hold']), // Only allow certain statuses on creation
      ownerId: z.string(), // Required on creation
      description: z.string().optional(),
      dueDate: z.string().datetime({ offset: true }).optional().nullable(), // Validate ISO string format
      tags: z.array(z.string()).optional(),
      // Validate nested structure if settings are provided as an object input
      settings: z.object({
          notifications: z.boolean(),
          priority: z.enum(['low', 'medium', 'high'])
      }).optional().nullable(),
    });
    ```

2.  **Update Schemas (`UpdateEntitySchema`):**
    * Used to validate data when updating an *existing* entity.
    * Often derived from the `Create` schema using `.partial()` to make most fields optional.
    * May use `.extend()` or `.omit()` to modify requirements specifically for updates.

    ```typescript
    // src/schemas/project.schema.ts
    export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
      // Example: Maybe status cannot be changed back to 'planning' once active
      status: z.enum(['active', 'completed', 'on_hold']).optional(),
      // Name might still be required even on update
      name: z.string().min(3, 'Project name must be at least 3 characters').optional(),
    });
    // Note: Using .partial() makes all fields optional initially.
    // Use .required() or re-define fields if some must be present during update.
    ```

3.  **Form Schemas (`EntityFormSchema`):**
    * Specifically tailored for validating data directly from HTML forms.
    * May be identical to `Create` or `Update` schemas.
    * Might handle form-specific data types (e.g., File objects) before they are processed for API submission.

4.  **Parameter Schemas (`SearchEntityPropsSchema`):**
    * Used to validate parameters passed to functions or API hooks, like search parameters.

    ```typescript
    // src/schemas/addon.schema.ts (Example)
    export const SearchAddonsPropsSchema = z.object({
      query: z.string(),
      page: z.number().int().positive(),
      limit: z.number().int().positive().optional(),
      category: z.string().optional(),
      version: z.string().optional(),
      loaders: z.string().optional(),
    });
    ```

## Deriving TypeScript Types from Schemas

Zod allows you to infer TypeScript types directly from your schemas. This is useful for typing validated data.

```typescript
// src/schemas/project.schema.ts
// ... (CreateProjectSchema definition) ...
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

// ... (UpdateProjectSchema definition) ...
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
```

* **Important:** Remember these inferred types (`CreateProjectInput`, `UpdateProjectInput`) represent the shape of **validated input data**, which is often different from the canonical `Project` type (defined in `src/types/appwrite.ts`) that includes system fields like `$id`.
* If these input types are needed across the application, export them from `src/types/index.ts`.

## Using Schemas for Validation

### 1. In API Hooks / Mutations

Validate data within your mutation functions *before* sending it to Appwrite. Use `.parse()` (throws on error) or `.safeParse()` (returns a result object).

```typescript
// src/api/endpoints/useProjects.ts (Simplified Mutation)
import { CreateProjectSchema } from '@/schemas/project.schema';
import type { CreateProjectInput } from '@/schemas/project.schema'; // Import derived type
import type { Project } from '@/types'; // Import canonical type

// ...

export const useSaveProject = () => {
  // ...
  return useMutation({
    mutationFn: async (projectInput: CreateProjectInput) => { // Expect validated input type
      // Optional: If the input wasn't pre-validated, validate here
      // const validationResult = CreateProjectSchema.safeParse(projectInput);
      // if (!validationResult.success) {
      //   console.error("Validation failed:", validationResult.error.format());
      //   throw new Error("Invalid project data provided.");
      // }
      // const validatedData = validationResult.data;

      // Prepare data for Appwrite (handle JSON serialization etc.)
      const dataToSave = prepareProjectDataForAppwrite(projectInput); // Assume helper exists

      // Create new document using validated & prepared data
      return databases.createDocument<Project>( // Use canonical type for SDK call
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        dataToSave
      );
    },
    // ...
  });
};
```

### 2. In Forms (with React Hook Form)

Integrate Zod schemas seamlessly with form libraries like React Hook Form using the official resolver.

```typescript
// src/components/forms/ProjectForm.tsx (Example)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema, type CreateProjectInput } from '@/schemas/project.schema';
import { useSaveProject } from '@/api'; // Import your mutation hook

const ProjectForm = () => {
  const saveProjectMutation = useSaveProject();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema), // Use the Zod resolver
    defaultValues: {
      name: '',
      status: 'planning',
      // ... other defaults
    }
  });

  const onSubmit = (data: CreateProjectInput) => {
    // Data is already validated according to CreateProjectSchema
    saveProjectMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input for Name */}
      <div>
        <label htmlFor="name">Project Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      {/* Input for Status */}
      <div>
        <label htmlFor="status">Status</label>
        <select id="status" {...register('status')}>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
        </select>
        {errors.status && <p className="error">{errors.status.message}</p>}
      </div>

      {/* Other form fields... */}

      <button type="submit" disabled={saveProjectMutation.isPending}>
        {saveProjectMutation.isPending ? 'Saving...' : 'Save Project'}
      </button>
    </form>
  );
};
```

## Best Practices

* **Keep Schemas Focused:** Define schemas for specific validation tasks (creation input, update input, form data, search params). Avoid making one giant schema that tries to do everything.
* **DRY:** Use Zod's utility methods like `.extend()`, `.omit()`, `.pick()`, `.partial()` to build upon base schemas and avoid repetition.
* **Clear Naming:** Use descriptive names (e.g., `Create...`, `Update...`, `Form...`, `Params...`) to indicate the schema's purpose.
* **Error Handling:** Prefer `.safeParse()` in backend/API logic for more control over error handling. Use the `@hookform/resolvers/zod` for easy integration with React Hook Form, which handles errors automatically. Leverage `error.format()` for detailed error feedback when needed.
* **Separation:** Do **not** use Zod schemas defined in `/src/schemas/` as the primary types for data returned directly from Appwrite query hooks. Use the canonical types from `src/types/appwrite.ts` for that purpose.

## Relationship to Canonical Types (`src/types/appwrite.ts`)

It's crucial to understand the distinction:

* **`src/types/appwrite.ts`:** Defines the **structure of data** as it exists in or is returned by Appwrite (the canonical model, including system fields like `$id`). These types are used in Appwrite SDK calls (`getDocument<Type>`) and as the return types for query hooks.
* **`src/schemas/*.schema.ts`:** Defines **rules for validating data** for specific operations (creation, updates, forms, parameters). They often represent a *subset* or *variation* of the canonical data structure. Types inferred from these schemas represent *validated input*.

## Conclusion

Using Zod effectively for input validation, while keeping it separate from canonical data type definitions, provides Blueprint with robust data integrity checks, improved type safety for inputs and forms, and a clear separation of concerns within the codebase.
