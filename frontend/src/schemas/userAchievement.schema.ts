import { z } from 'zod';

export const UserAchievementSchema = z.object({
  $id: z.string().optional(),
  userId: z.string(),
  badgeId: z.string(),
  ruleId: z.string().optional(),

  // Award details
  awardedAt: z.string(),
  awardedBy: z.string().optional(), // 'system' or admin userId
  reason: z.string().max(500).optional(),

  // Progress tracking
  progress: z.number().min(0).optional(),
  progressCurrent: z.string().optional(),
  progressMax: z.string().optional(),
  progressText: z.string().optional(),

  // For repeatable achievements
  timesEarned: z.number().int().min(1).optional(),
  isCompleted: z.boolean().optional(),
  completedAt: z.string().optional(),

  // Metadata
  metadata: z
    .union([
      z.string(),
      z.object({
        triggerEvent: z.string().optional(),
        bonusData: z.record(z.unknown()).optional(),
      }),
    ])
    .optional(),

  // Display
  isNew: z.boolean().optional(),
  isPinned: z.boolean().optional(),

  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
});

export const CreateUserAchievementSchema = UserAchievementSchema.omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UpdateUserAchievementSchema = UserAchievementSchema.partial().omit({
  $id: true,
  userId: true,
  $createdAt: true,
  $updatedAt: true,
});

export const AchievementProgressSchema = z.object({
  $id: z.string().optional(),
  userId: z.string(),
  ruleId: z.string(),

  // Current progress
  currentValue: z.number().min(0),
  targetValue: z.number().min(0),
  lastUpdated: z.string(),

  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
});

export const CreateAchievementProgressSchema = AchievementProgressSchema.omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UpdateAchievementProgressSchema = AchievementProgressSchema.partial().omit({
  $id: true,
  userId: true,
  ruleId: true,
  $createdAt: true,
  $updatedAt: true,
});

// Schema for manually awarding badges
export const ManualAwardSchema = z.object({
  userId: z.string(),
  badgeId: z.string(),
  reason: z.string().min(1).max(200),
});

// Schema for achievement summary
export const AchievementSummarySchema = z.object({
  totalBadges: z.number().int().min(0),
  recentAchievements: z.array(UserAchievementSchema),
  nextBadges: z.array(
    z.object({
      ruleId: z.string(),
      badgeId: z.string(),
      badgeName: z.string(),
      currentProgress: z.number(),
      targetValue: z.number(),
      percentage: z.number(),
    })
  ),
});

export type UserAchievement = z.infer<typeof UserAchievementSchema>;
export type CreateUserAchievement = z.infer<typeof CreateUserAchievementSchema>;
export type UpdateUserAchievement = z.infer<typeof UpdateUserAchievementSchema>;
export type AchievementProgress = z.infer<typeof AchievementProgressSchema>;
export type CreateAchievementProgress = z.infer<typeof CreateAchievementProgressSchema>;
export type UpdateAchievementProgress = z.infer<typeof UpdateAchievementProgressSchema>;
export type ManualAward = z.infer<typeof ManualAwardSchema>;
export type AchievementSummary = z.infer<typeof AchievementSummarySchema>;
