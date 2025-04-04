// src/schemas/blog.schema.tsx
import { z } from 'zod';

/**
 * Schema for Tag object in Blog
 */
export const TagSchema = z.object({
  id: z.string(),
  value: z.string(),
  color: z.string(),
});

/**
 * Form validation schema for Blog
 *
 * Note: This is used for form validation, not as the source of truth for Blog type.
 * The canonical Blog type is defined in src/types/appwrite.ts
 */
export const BlogFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  img_url: z.string().url('Image URL must be valid'),
  status: z.enum(['draft', 'published', 'archived']),
  links: z.record(z.any()).nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(),
  blog_tags: z.array(z.string()).nullable().optional(),
  authors_uuid: z.array(z.string()),
  authors: z.array(z.string()),
});

// Export renamed schema for backward compatibility
export const BlogSchema = BlogFormSchema;

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
  tags: z.array(TagSchema).optional(),
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
  tags: z.array(TagSchema).optional(),
  likes: z.number().int().nonnegative().optional(),
  authors_uuid: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
});

/**
 * Schema for filtering blog posts
 */
export const BlogFilterSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  search: z.string().optional(),
});
/**
 * Schema for search parameters when querying blogs
 */
export const SearchBlogPropsSchema = z.object({
  query: z.string().default(''),
  page: z.number().int().positive().default(1),
  tags: z.array(z.string()).default(['All']),
  id: z.string().default('all'),
});

/**
 * Schema for the search result structure
 *
 * Note: This is kept for backward compatibility, but the canonical
 * type now comes from the SearchResult generic in meilisearch.ts
 */
export const SearchBlogResultSchema = z.object({
  data: z.array(z.any()), // Use z.any() since the canonical type comes from types/appwrite.ts
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalHits: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  isLoading: z.boolean(),
  isError: z.boolean(),
  error: z.any().optional(),
  isFetching: z.boolean(),
});
