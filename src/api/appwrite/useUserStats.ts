import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { ID, Query } from 'appwrite';
import {
  UserStatsSchema,
  type UserStats,
  type UpdateUserStats,
} from '@/schemas/userStats.schema';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'user_stats';

export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('userId', userId),
          Query.limit(1),
        ]);
        
        if (response.documents.length === 0) {
          // Create initial stats for user if they don't exist
          const newStats = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            { userId }
          );
          return UserStatsSchema.parse(newStats) as UserStats;
        }
        
        return UserStatsSchema.parse(response.documents[0]) as UserStats;
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }
    },
    enabled: !!userId,
  });
};

export const useAllUserStats = () => {
  return useQuery({
    queryKey: ['allUserStats'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('totalDownloadsReceived'),
        Query.limit(100),
      ]);
      return response.documents.map((doc) => UserStatsSchema.parse(doc)) as UserStats[];
    },
  });
};

export const useUpdateUserStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ statsId, updates }: { statsId: string; updates: UpdateUserStats }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        statsId,
        updates
      );
      return UserStatsSchema.parse(response) as UserStats;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStats', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserStats'] });
    },
    onError: (error) => {
      console.error('Error updating user stats:', error);
      toast.error('Failed to update statistics');
    },
  });
};

export const useIncrementUserStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, field, value = 1 }: { userId: string; field: string; value?: number }) => {
      // Find user stats document
      const statsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      if (statsResponse.documents.length === 0) {
        throw new Error('User stats not found');
      }

      const stats = statsResponse.documents[0];
      const currentValue = (stats[field] as number) || 0;
      
      // Update the field
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        stats.$id,
        { [field]: currentValue + value }
      );
      
      return UserStatsSchema.parse(response) as UserStats;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStats', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserStats'] });
    },
    onError: (error) => {
      console.error('Error incrementing user stat:', error);
    },
  });
};

export const useTrackLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const statsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      let stats: UserStats | null = null;
      
      if (statsResponse.documents.length === 0) {
        // Create initial stats
        const newStats = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            userId,
            totalLogins: 1,
            lastLoginAt: new Date().toISOString(),
            consecutiveLoginDays: 1,
            totalDaysActive: 1,
          }
        );
        stats = UserStatsSchema.parse(newStats) as UserStats;
      } else {
        const existingStats = statsResponse.documents[0];
        const lastLogin = existingStats.lastLoginAt ? new Date(existingStats.lastLoginAt) : null;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Calculate consecutive days
        let consecutiveDays = existingStats.consecutiveLoginDays || 0;
        let shouldUpdate = true;
        let incrementDaysActive = false;
        
        if (lastLogin) {
          const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceLastLogin === 0) {
            // Already logged in today, no need to update
            shouldUpdate = false;
            stats = UserStatsSchema.parse(existingStats) as UserStats;
          } else if (daysSinceLastLogin === 1) {
            consecutiveDays++;
            incrementDaysActive = true;
          } else {
            consecutiveDays = 1; // Reset streak
            incrementDaysActive = true;
          }
        } else {
          consecutiveDays = 1;
          incrementDaysActive = true;
        }
        
        if (shouldUpdate) {
          // Update stats
          const updatedStats = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existingStats.$id,
            {
              totalLogins: (existingStats.totalLogins || 0) + 1,
              lastLoginAt: new Date().toISOString(),
              consecutiveLoginDays: consecutiveDays,
              totalDaysActive: (existingStats.totalDaysActive || 0) + (incrementDaysActive ? 1 : 0),
            }
          );
          stats = UserStatsSchema.parse(updatedStats) as UserStats;
        }
      }
      
      return stats!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStats', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserStats'] });
    },
    onError: (error) => {
      console.error('Error tracking login:', error);
    },
  });
};

export const useTrackContentCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, contentType }: { userId: string; contentType: 'schematic' | 'addon' }) => {
      const statsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      if (statsResponse.documents.length === 0) {
        throw new Error('User stats not found');
      }

      const stats = statsResponse.documents[0];
      const updates: Record<string, unknown> = {};
      const now = new Date().toISOString();
      
      switch (contentType) {
        case 'schematic':
          updates.totalSchematics = (stats.totalSchematics || 0) + 1;
          if (!stats.firstSchematicAt) {
            updates.firstSchematicAt = now;
          }
          break;
        case 'addon':
          updates.totalAddons = (stats.totalAddons || 0) + 1;
          if (!stats.firstAddonAt) {
            updates.firstAddonAt = now;
          }
          break;
      }
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        stats.$id,
        updates
      );
      
      return UserStatsSchema.parse(response) as UserStats;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStats', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserStats'] });
    },
    onError: (error) => {
      console.error('Error tracking content creation:', error);
    },
  });
};

export const useCheckMilestones = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const statsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      if (statsResponse.documents.length === 0) {
        return null;
      }

      const stats = statsResponse.documents[0];
      const updates: Record<string, unknown> = {};
      const now = new Date().toISOString();
      
      // Check download milestones
      if (stats.totalDownloadsReceived >= 100 && !stats.reached100Downloads) {
        updates.reached100Downloads = now;
        toast.success('Milestone reached: 100 downloads!');
      }
      
      if (stats.totalDownloadsReceived >= 1000 && !stats.reached1000Downloads) {
        updates.reached1000Downloads = now;
        toast.success('Milestone reached: 1000 downloads!');
      }
      
      if (Object.keys(updates).length > 0) {
        const response = await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          stats.$id,
          updates
        );
        return UserStatsSchema.parse(response) as UserStats;
      }
      
      return UserStatsSchema.parse(stats) as UserStats;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['userStats', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['allUserStats'] });
      }
    },
    onError: (error) => {
      console.error('Error checking milestones:', error);
    },
  });
};