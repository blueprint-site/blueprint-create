import { z } from 'zod';

export const BadgeShapeEnum = z.enum(['rounded', 'square', 'hexagon', 'circle', 'shield', 'star']);
export const BadgeRarityEnum = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']);

export const BadgeSchema = z.object({
  $id: z.string().optional(),
  name: z.string().min(1, 'Badge name is required').max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).default('shield'),
  iconUrl: z.string().optional(), // URL for custom badge image (relaxed validation)
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#3b82f6'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#ffffff'),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#2563eb'),
  shape: BadgeShapeEnum.default('rounded'),
  hasGlow: z.boolean().default(false),
  isAnimated: z.boolean().default(false),
  rarity: BadgeRarityEnum.default('common'),
  tier: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common').optional(), // Added tier for compatibility
  sortOrder: z.number().min(0).max(1000).default(0),
  isActive: z.boolean().default(true),
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
});

export const CreateBadgeSchema = BadgeSchema.omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UpdateBadgeSchema = BadgeSchema.partial().omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UserBadgeSchema = z.object({
  userId: z.string(),
  badgeId: z.string(),
  awardedAt: z.string().datetime(),
  awardedBy: z.string().optional(),
  reason: z.string().max(200).optional(),
});

export type Badge = z.infer<typeof BadgeSchema>;
export type CreateBadge = z.infer<typeof CreateBadgeSchema>;
export type UpdateBadge = z.infer<typeof UpdateBadgeSchema>;
export type UserBadge = z.infer<typeof UserBadgeSchema>;
export type BadgeShape = z.infer<typeof BadgeShapeEnum>;
export type BadgeRarity = z.infer<typeof BadgeRarityEnum>;