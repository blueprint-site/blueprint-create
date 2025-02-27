// src/schemas/schematic.schema.tsx
import { z } from "zod";

// Form schema for schematic uploads
export const schematicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  schematicFile: z.instanceof(File, { message: 'Please upload a schematic file' }),
  imageFiles: z.array(z.instanceof(File, { message: 'Please upload valid image files' }))
    .min(1, 'Upload at least one image'),
  gameVersions: z.array(z.string()).min(1, 'Select at least one game version'),
  createVersions: z.array(z.string()).min(1, 'Select at least one Create version'),
  modloaders: z.array(z.string()).min(1, 'Select at least one modloader'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  subCategories: z.array(z.string()).optional(),
});

// Database schema for stored schematics
export const schematicSchema = z.object({
  $id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  schematic_url: z.string().url("Must be a valid URL"),
  image_urls: z.array(z.string().url("Must be a valid URL")),
  user_id: z.string(),
  authors: z.array(z.string()),
  game_versions: z.array(z.string()),
  create_versions: z.array(z.string()),
  modloaders: z.array(z.string()),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  sub_categories: z.array(z.string()).optional(),
  slug: z.string(),
  downloads: z.number().int().nonnegative().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  $createdAt: z.string().datetime(),
  $updatedAt: z.string().datetime(),
  likes: z.number().int().nonnegative().default(0),
});

// For retrieving a schematic with optional fields
export const partialSchematicSchema = schematicSchema.partial();

// For creating a new schematic (omit ID and other auto-generated fields)
export const createSchematicSchema = schematicSchema.omit({
  $id: true,
  downloads: true,
  $createdAt: true,
  $updatedAt: true,
  likes: true, // Omit likes for creation schema
});

// Schema for search results
export const searchSchematicsResultSchema = z.object({
  data: z.array(schematicSchema),
  isLoading: z.boolean(),
  isError: z.boolean(),
  error: z.instanceof(Error).nullable(),
  isFetching: z.boolean(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalHits: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});

// Type exports
export type SchematicFormValues = z.infer<typeof schematicFormSchema>;
export type Schematic = z.infer<typeof schematicSchema>;
export type PartialSchematic = z.infer<typeof partialSchematicSchema>;
export type CreateSchematic = z.infer<typeof createSchematicSchema>;
export type SearchSchematicsResult = z.infer<typeof searchSchematicsResultSchema>;