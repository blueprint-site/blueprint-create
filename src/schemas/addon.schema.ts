import { z } from 'zod';

// Schema for validating addon updates
export const UpdateAddonSchema = z.object({
  name: z.string().optional(),
  description: z.string().max(5000).optional(),
  slug: z.string().max(120).optional(),
  author: z.string().max(250).optional(),
  categories: z.array(z.string()).optional(),
  downloads: z.number().int().nonnegative().optional(),
  icon: z.string().max(500).optional(),
  sources: z.array(z.string()).optional(),
  isValid: z.boolean().optional(),
  loaders: z.array(z.string()).optional(),
  isChecked: z.boolean().optional(),
  minecraft_versions: z.array(z.string()).optional(),
  create_versions: z.array(z.string()).optional(),
  claimed_by: z.string().nullable().optional(),
});

// Schema for creating new addons
export const CreateAddonSchema = UpdateAddonSchema.required({
  name: true,
  description: true,
  slug: true,
});
