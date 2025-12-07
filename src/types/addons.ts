import * as z from 'zod';

export const Addon = z.object({
  $id: z.string(),
  name: z.string().max(150).nonempty(),
  description: z.string().max(5000),
  slug: z.string().max(120),
  icon: z.string().max(500),
  created_at: z.string().nullable(), // is an appwrite date
  updated_at: z.string().nullable(), // is an appwrite date
  isValid: z.boolean(),
  isChecked: z.boolean(),
  sources: z.array(z.string()).nonempty().max(20),
  modrinth_id: z.string().max(50).optional().nullable(),
  curseforge_id: z.string().max(50).optional().nullable(),
  claimed_by: z.string().max(256).optional(),
  downloads: z.number().default(0),
  loaders: z.array(z.string()).nonempty().max(64),
  create_versions: z.array(z.string()).max(32).optional().nullable(),
  minecraft_versions: z.array(z.string()).nonempty().max(32),
  authors: z.array(z.string()).nonempty().max(100),
  categories: z.array(z.string()).max(120).optional().default([]),
  stage: z.enum(['pending', 'reviewing', 'approved', 'rejected', 'archived']).optional(),
  reviewedAt: z.string().optional().nullable(), // is an appwrite date
  lastValidated: z.string().optional().nullable(), // is an appwrite date
  reviewedBy: z.string().max(255).optional().nullable(),
});

export const FeaturedAddon = z.object({
  $id: z.string(),
  slug: z.string().max(100),
  addon_id: z.string(),
  title: z.string().max(150).nonempty(),
  description: z.string().max(500),
  image_url: z.url(),
  banner_url: z.url(),
  display_order: z.number().min(0).max(20),
  active: z.boolean(),
  category: z.array(z.string()).max(100).optional().default([]),
});
