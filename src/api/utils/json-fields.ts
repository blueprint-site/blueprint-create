import type { Blog, RawBlog } from '@/types';
import type { Models } from 'appwrite';

type JsonFieldsInput = Models.Document | RawBlog | Partial<Blog> | Record<string, unknown>;

/**
 * Parse JSON fields in a blog document from database format to application format
 */
export function parseJsonFields(input: JsonFieldsInput): Blog {
  // Create a shallow copy to avoid mutating the input
  const result = { ...input } as unknown as Blog;

  // Check if tags is already an array (already parsed)
  if (Array.isArray(result.tags)) {
    // Already parsed, do nothing
  }
  // Check if tags is a string that needs parsing
  else if (typeof input.tags === 'string' && input.tags) {
    try {
      result.tags = JSON.parse(input.tags);
    } catch (e) {
      console.error('Error parsing tags JSON:', e);
      result.tags = [];
    }
  }
  // Default case - no tags or invalid format
  else {
    result.tags = [];
  }

  // Check if links is already an object/array (already parsed)
  if (result.links !== null && typeof result.links === 'object') {
    // Already parsed, do nothing
  }
  // Check if links is a string that needs parsing
  else if (typeof input.links === 'string' && input.links) {
    try {
      result.links = JSON.parse(input.links);
    } catch (e) {
      console.error('Error parsing links JSON:', e);
      result.links = null;
    }
  }
  // Default case - no links or invalid format
  else {
    result.links = null;
  }

  return result;
}

/**
 * Serialize objects to JSON strings before saving to database
 */
export function serializeJsonFields(blog: Partial<Blog>): Partial<RawBlog> {
  const rawBlog = { ...blog } as Partial<RawBlog>;

  if (blog.tags) {
    rawBlog.tags = JSON.stringify(blog.tags);
  }

  if (blog.links) {
    rawBlog.links = JSON.stringify(blog.links);
  }

  return rawBlog;
}
