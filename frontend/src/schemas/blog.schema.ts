// src/schemas/blog.schema.tsx
import { z } from 'zod';
import { baseTagSchema } from '@/schemas/tag.schema';

/**
 * Schema for creating new blog posts
 *
 * Used for input validation when creating a new blog
 */
export const CreateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  img_url: z.string().url('Image URL must be valid'),
  status: z.enum(['draft', 'published']).default('draft'),
  tags: z.array(baseTagSchema).optional(),
  authors_uuid: z.array(z.string()),
  authors: z.array(z.string()),
});

/**
 * Schema for updating blog posts
 */
export const UpdateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').optional(),
  content: z.string().min(20, 'Content must be at least 20 characters long').optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly')
    .optional(),
  img_url: z.string().url('Image URL must be valid').optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(baseTagSchema).optional(),
  likes: z.number().int().nonnegative().optional(),
  authors_uuid: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
});

// Export types derived from validation schemas
export type CreateBlogFormValues = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogFormValues = z.infer<typeof UpdateBlogSchema>;
