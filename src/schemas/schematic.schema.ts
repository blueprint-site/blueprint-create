// src/schemas/schematic.schema.tsx
import { z } from 'zod';

// Form schema for schematic uploads (used directly with react-hook-form)
export const schematicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  schematicFile: z.instanceof(File, { message: 'Please upload a schematic file' }),
  imageFiles: z
    .array(z.instanceof(File, { message: 'Please upload valid image files' }))
    .min(1, 'Upload at least one image'),
  game_versions: z.array(z.string()).min(1, 'Select at least one game version'),
  create_versions: z.array(z.string()).min(1, 'Select at least one Create version'),
  modloaders: z.array(z.string()).min(1, 'Select at least one modloader'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  sub_categories: z.array(z.string()).optional(),
});

// Schema for API operations - creating a new schematic
export const createSchematicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  schematic_url: z.string().url('Must be a valid URL'),
  image_urls: z.array(z.string().url('Must be a valid URL')),
  user_id: z.string(),
  authors: z.array(z.string()),
  game_versions: z.array(z.string()),
  create_versions: z.array(z.string()),
  modloaders: z.array(z.string()),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  sub_categories: z.array(z.string()).optional(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

// Schema for API operations - updating an existing schematic
export const updateSchematicSchema = createSchematicSchema.partial();

// Schema for search parameters
export const searchSchematicsPropsSchema = z.object({
  query: z.string().optional(),
  page: z.number().optional(),
  category: z.string().optional(),
  sub_categories: z.string().optional(),
  create_versions: z.string().optional(),
  version: z.string().optional(),
  loaders: z.string().optional(),
  id: z.string().optional(),
});

// Export types derived from validation schemas
export type SchematicFormValues = z.infer<typeof schematicFormSchema>;
export type CreateSchematicFormValues = z.infer<typeof createSchematicSchema>;
export type UpdateSchematicFormValues = z.infer<typeof updateSchematicSchema>;
export type SearchSchematicsProps = z.infer<typeof searchSchematicsPropsSchema>;
