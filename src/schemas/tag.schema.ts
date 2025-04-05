import { z } from 'zod';

/**
 * Base schema for both blog and schematic tags
 */
export const baseTagSchema = z.object({
  value: z.string().min(1, 'Tag name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
});

/**
 * Schema for creating/updating blog tags
 */
export const blogTagSchema = baseTagSchema;

/**
 * Schema for creating/updating schematic tags
 */
export const schematicTagSchema = baseTagSchema;

/**
 * Type inference for tag form values
 */
export type TagFormValues = z.infer<typeof baseTagSchema>;
export type BlogTagFormValues = z.infer<typeof blogTagSchema>;
export type SchematicTagFormValues = z.infer<typeof schematicTagSchema>;
