import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { ID, Query } from 'appwrite';
import {
  UserAchievementSchema,
  AchievementProgressSchema,
  type UserAchievement,
  type CreateUserAchievement,
  type UpdateUserAchievement,
  type AchievementProgress,
  type CreateAchievementProgress,
  type UpdateAchievementProgress,
  type ManualAward,
  type AchievementSummary,
} from '@/schemas/userAchievement.schema';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const USER_ACHIEVEMENTS_COLLECTION_ID = 'user_achievements';
const ACHIEVEMENT_PROGRESS_COLLECTION_ID = 'achievement_progress';
const BADGES_COLLECTION_ID = 'badges';
const REWARD_RULES_COLLECTION_ID = 'reward_rules';

export const useUserAchievements = (userId?: string) => {
  return useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: async () => {
      if (!userId) return [];

      const response = await databases.listDocuments(DATABASE_ID, USER_ACHIEVEMENTS_COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.orderDesc('awardedAt'),
        Query.limit(100),
      ]);
      return response.documents.map((doc) => {
        // Parse metadata if it's a string
        const parsedDoc = { ...doc };
        if (typeof parsedDoc.metadata === 'string' && parsedDoc.metadata) {
          try {
            parsedDoc.metadata = JSON.parse(parsedDoc.metadata);
          } catch {
            // Keep as string if parsing fails
          }
        }
        return UserAchievementSchema.parse(parsedDoc);
      }) as UserAchievement[];
    },
    enabled: !!userId,
    staleTime: 5000, // Consider data fresh for 5 seconds
    gcTime: 60000, // Keep in cache for 1 minute (formerly cacheTime)
  });
};

export const useAllUserAchievements = () => {
  return useQuery({
    queryKey: ['allUserAchievements'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, USER_ACHIEVEMENTS_COLLECTION_ID, [
        Query.orderDesc('awardedAt'),
        Query.limit(500),
      ]);
      return response.documents.map((doc) => UserAchievementSchema.parse(doc)) as UserAchievement[];
    },
  });
};

export const useUserAchievementProgress = (userId?: string, ruleId?: string) => {
  return useQuery({
    queryKey: ['achievementProgress', userId, ruleId],
    queryFn: async () => {
      if (!userId) return [];

      const queries = [
        Query.equal('userId', userId),
        Query.orderDesc('lastUpdatedAt'),
        Query.limit(50),
      ];

      if (ruleId) {
        queries.push(Query.equal('ruleId', ruleId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENT_PROGRESS_COLLECTION_ID,
        queries
      );
      return response.documents.map((doc) =>
        AchievementProgressSchema.parse(doc)
      ) as AchievementProgress[];
    },
    enabled: !!userId,
  });
};

export const useAchievementSummary = (userId?: string) => {
  return useQuery({
    queryKey: ['achievementSummary', userId],
    queryFn: async (): Promise<AchievementSummary | null> => {
      if (!userId) return null;

      // Get user achievements
      const achievementsResponse = await databases.listDocuments(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('awardedAt'), Query.limit(10)]
      );

      const achievements = achievementsResponse.documents.map((doc) =>
        UserAchievementSchema.parse(doc)
      ) as UserAchievement[];

      // Get progress towards next badges
      const progressResponse = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENT_PROGRESS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('percentage'), Query.limit(5)]
      );

      const progress = progressResponse.documents.map((doc) =>
        AchievementProgressSchema.parse(doc)
      ) as AchievementProgress[];

      // Get rule and badge details for next badges
      const nextBadges = await Promise.all(
        progress.map(async (p) => {
          try {
            const ruleDoc = await databases.getDocument(
              DATABASE_ID,
              REWARD_RULES_COLLECTION_ID,
              p.ruleId
            );
            const badge = await databases.getDocument(
              DATABASE_ID,
              BADGES_COLLECTION_ID,
              ruleDoc.badgeId
            );

            return {
              ruleId: p.ruleId,
              badgeId: badge.$id,
              badgeName: badge.name,
              currentProgress: p.currentValue,
              targetValue: p.targetValue,
              percentage: p.percentage,
            };
          } catch (error) {
            console.error('Error fetching rule/badge details:', error);
            return null;
          }
        })
      );

      return {
        totalBadges: achievementsResponse.total,
        recentAchievements: achievements,
        nextBadges: nextBadges.filter(Boolean) as Array<{
          ruleId: string;
          badgeId: string;
          badgeName: string;
          currentProgress: number;
          targetValue: number;
          percentage: number;
        }>,
      };
    },
    enabled: !!userId,
  });
};

export const useCreateUserAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: CreateUserAchievement) => {
      const response = await databases.createDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        ID.unique(),
        achievement
      );
      return UserAchievementSchema.parse(response) as UserAchievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserAchievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievementSummary', data.userId] });
      toast.success('Achievement awarded successfully!');
    },
    onError: (error) => {
      console.error('Error creating user achievement:', error);
      toast.error('Failed to award achievement');
    },
  });
};

export const useManualAwardBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, badgeId, reason }: ManualAward) => {
      const now = new Date().toISOString();

      const achievement: CreateUserAchievement = {
        userId,
        badgeId,
        ruleId: 'manual_award', // Special rule ID for manual awards
        awardedAt: now,
        awardedBy: 'admin', // Should be replaced with actual admin user ID
        reason,
        progress: 1,
        progressMax: 1,
        progressPercentage: 100,
        timesEarned: 1,
        lastEarnedAt: now,
        metadata: {
          triggerEvent: 'manual_award',
        },
        isNew: true,
        isPinned: false,
        displayOrder: 0,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        ID.unique(),
        achievement
      );
      return UserAchievementSchema.parse(response) as UserAchievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserAchievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievementSummary', data.userId] });
      toast.success('Badge awarded manually!');
    },
    onError: (error) => {
      console.error('Error manually awarding badge:', error);
      toast.error('Failed to award badge');
    },
  });
};

export const useUpdateUserAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      achievementId,
      updates,
    }: {
      achievementId: string;
      updates: UpdateUserAchievement;
    }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        achievementId,
        updates
      );
      return UserAchievementSchema.parse(response) as UserAchievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserAchievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievementSummary', data.userId] });
    },
    onError: (error) => {
      console.error('Error updating user achievement:', error);
      toast.error('Failed to update achievement');
    },
  });
};

export const useRevokeAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const achievement = await databases.getDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        achievementId
      );
      await databases.deleteDocument(DATABASE_ID, USER_ACHIEVEMENTS_COLLECTION_ID, achievementId);
      return achievement.userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserAchievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievementSummary', userId] });
      toast.success('Achievement revoked successfully!');
    },
    onError: (error) => {
      console.error('Error revoking achievement:', error);
      toast.error('Failed to revoke achievement');
    },
  });
};

export const useCreateAchievementProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: CreateAchievementProgress) => {
      const response = await databases.createDocument(
        DATABASE_ID,
        ACHIEVEMENT_PROGRESS_COLLECTION_ID,
        ID.unique(),
        progress
      );
      return AchievementProgressSchema.parse(response) as AchievementProgress;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievementProgress', data.userId] });
    },
    onError: (error) => {
      console.error('Error creating achievement progress:', error);
    },
  });
};

export const useUpdateAchievementProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      progressId,
      updates,
    }: {
      progressId: string;
      updates: UpdateAchievementProgress;
    }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        ACHIEVEMENT_PROGRESS_COLLECTION_ID,
        progressId,
        updates
      );
      return AchievementProgressSchema.parse(response) as AchievementProgress;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievementProgress', data.userId] });
    },
    onError: (error) => {
      console.error('Error updating achievement progress:', error);
    },
  });
};

export const useMarkAchievementAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        achievementId,
        { isNew: false }
      );
      return UserAchievementSchema.parse(response) as UserAchievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['achievementSummary', data.userId] });
    },
    onError: (error) => {
      console.error('Error marking achievement as read:', error);
    },
  });
};

export const usePinAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      achievementId,
      isPinned,
    }: {
      achievementId: string;
      isPinned: boolean;
    }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        achievementId,
        { isPinned }
      );
      return UserAchievementSchema.parse(response) as UserAchievement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userAchievements', data.userId] });
      toast.success(data.isPinned ? 'Achievement pinned!' : 'Achievement unpinned!');
    },
    onError: (error) => {
      console.error('Error pinning/unpinning achievement:', error);
      toast.error('Failed to update achievement');
    },
  });
};
