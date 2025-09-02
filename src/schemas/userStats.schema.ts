import { z } from 'zod';

export const UserStatsSchema = z.object({
  $id: z.string().optional(),
  userId: z.string(),
  
  // Authentication & Activity
  totalLogins: z.number().int().min(0).default(0),
  lastLoginAt: z.string().datetime().optional().nullable(),
  consecutiveLoginDays: z.number().int().min(0).default(0),
  totalDaysActive: z.number().int().min(0).default(0),
  
  // Content Creation
  totalSchematics: z.number().int().min(0).default(0),
  totalAddons: z.number().int().min(0).default(0),
  
  // Downloads & Interactions
  totalDownloadsReceived: z.number().int().min(0).default(0),
  totalDownloadsMade: z.number().int().min(0).default(0),
  totalLikesReceived: z.number().int().min(0).default(0),
  totalLikesGiven: z.number().int().min(0).default(0),
  
  // Social
  totalFollowers: z.number().int().min(0).default(0),
  totalFollowing: z.number().int().min(0).default(0),
  
  // Quality Metrics
  averageRating: z.number().min(0).max(5).default(0),
  totalRatingsReceived: z.number().int().min(0).default(0),
  featuredContentCount: z.number().int().min(0).default(0),
  
  // Milestones
  firstSchematicAt: z.string().datetime().optional().nullable(),
  firstAddonAt: z.string().datetime().optional().nullable(),
  reached100Downloads: z.string().datetime().optional().nullable(),
  reached1000Downloads: z.string().datetime().optional().nullable(),
  
  // Metadata
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
});

export const CreateUserStatsSchema = UserStatsSchema.omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UpdateUserStatsSchema = UserStatsSchema.partial().omit({
  $id: true,
  userId: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UserStatsIncrementSchema = z.object({
  field: z.enum([
    'totalLogins',
    'consecutiveLoginDays',
    'totalDaysActive',
    'totalSchematics',
    'totalAddons',
    'totalDownloadsReceived',
    'totalDownloadsMade',
    'totalLikesReceived',
    'totalLikesGiven',
    'totalFollowers',
    'totalFollowing',
    'totalRatingsReceived',
    'featuredContentCount',
  ]),
  value: z.number().int().min(1).default(1),
});

export type UserStats = z.infer<typeof UserStatsSchema>;
export type CreateUserStats = z.infer<typeof CreateUserStatsSchema>;
export type UpdateUserStats = z.infer<typeof UpdateUserStatsSchema>;
export type UserStatsIncrement = z.infer<typeof UserStatsIncrementSchema>;