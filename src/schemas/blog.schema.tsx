// src/schemas/blog.schema.tsx
import { z } from "zod";

/**
 * Schema for Tag object in Blog
 */
export const TagSchema = z.object({
  id: z.string(),
  value: z.string(),
  color: z.string()
});

/**
 * Main Blog schema with all properties
 */
export const BlogSchema = z.object({
  $id: z.string(),
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  img_url: z.string().url("Image URL must be valid"),
  status: z.enum(["draft", "published", "archived"]),
  links: z.record(z.any()).nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(),
  blog_tags: z.array(z.string()).nullable().optional(),
  likes: z.number().int().nonnegative(),
  authors_uuid: z.array(z.string()),
  authors: z.array(z.string()),
  $createdAt: z.string(),
  $updatedAt: z.string()
});

/**
 * Schema for creating new blog posts
 */
export const CreateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  img_url: z.string().url("Image URL must be valid"),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(TagSchema).optional(),
  authors_uuid: z.array(z.string()),
  authors: z.array(z.string())
});

/**
 * Schema for updating blog posts
 */
export const UpdateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").optional(),
  content: z.string().min(20, "Content must be at least 20 characters long").optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly").optional(),
  img_url: z.string().url("Image URL must be valid").optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(TagSchema).optional(),
  likes: z.number().int().nonnegative().optional(),
  authors_uuid: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional()
});

/**
 * Schema for filtering blog posts
 */
export const BlogFilterSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  search: z.string().optional()
});

// Export types based on the schemas
export type Blog = z.infer<typeof BlogSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type BlogFilter = z.infer<typeof BlogFilterSchema>;