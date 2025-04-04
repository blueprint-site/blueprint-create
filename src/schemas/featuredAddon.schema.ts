import { z } from 'zod';

// Form validation schema for creating a featured addon
// Remove system fields that are handled by Appwrite
export const FeaturedAddonFormSchema = z.object({
  addon_id: z.string().min(1, 'Addon ID is required').max(100),
  title: z.string().min(1, 'Title is required').max(150),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  image_url: z.string().url('Image URL must be a valid URL'),
  banner_url: z.string().url('Banner URL must be a valid URL'),
  display_order: z.number().int().nonnegative().min(0).max(20),
  slug: z.string().min(1, 'Slug is required').max(100),
  active: z.boolean(),
  category: z.array(z.string()).nullable(),
});

// Keep the validation schema with system fields for parsing API responses
export const FeaturedAddonSchema = FeaturedAddonFormSchema.extend({
  $id: z.string(),
  $createdAt: z.string().datetime().or(z.string()),
  $updatedAt: z.string().datetime().or(z.string()),
});

// Partial schema for updates
export const updateFeaturedAddonSchema = FeaturedAddonFormSchema.partial();
