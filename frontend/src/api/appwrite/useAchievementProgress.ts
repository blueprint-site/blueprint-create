import { useQuery } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import { useUserStore } from '@/api/stores/userStore';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'achievement_progress';

export interface AchievementProgress {
  $id: string;
  userId: string;
  ruleId: string;
  currentValue: number;
  targetValue: number;
  lastUpdated: string;
  $createdAt?: string;
  $updatedAt?: string;
}

// Get user's achievement progress
export const useUserAchievementProgress = () => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ['achievementProgress', user?.$id],
    queryFn: async () => {
      if (!user?.$id) return [];

      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('userId', user.$id),
          Query.limit(100),
        ]);

        return response.documents as AchievementProgress[];
      } catch (error) {
        console.error('Error fetching achievement progress:', error);
        return [];
      }
    },
    enabled: !!user?.$id,
  });
};

// Get progress for a specific rule
export const useAchievementProgressForRule = (ruleId: string) => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ['achievementProgress', user?.$id, ruleId],
    queryFn: async () => {
      if (!user?.$id || !ruleId) return null;

      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('userId', user.$id),
          Query.equal('ruleId', ruleId),
          Query.limit(1),
        ]);

        return response.documents[0] as AchievementProgress | undefined;
      } catch (error) {
        console.error('Error fetching rule progress:', error);
        return null;
      }
    },
    enabled: !!user?.$id && !!ruleId,
  });
};
