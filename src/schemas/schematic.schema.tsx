import { z } from 'zod';

// Form schema
export const schematicFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  schematicFile: z.instanceof(File, { message: 'Please upload a schematic file' }).optional(),
  imageFiles: z.array(z.instanceof(File, { message: 'Please upload valid image files' })).min(1, 'Upload at least one image'),
  gameVersions: z.array(z.string()).min(1, 'Select at least one game version'),
  createVersions: z.array(z.string()).min(1, 'Select at least one Create version'),
  modloaders: z.array(z.string()).min(1, 'Select at least one modloader'),
});

export type SchematicFormValues = z.infer<typeof schematicFormSchema>;