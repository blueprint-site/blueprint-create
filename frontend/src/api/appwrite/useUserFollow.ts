import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import { useUserStore } from '@/api/stores/userStore';

// Check if user is following another user
export const useIsFollowing = (targetUserId: string) => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ['isFollowing', user?.$id, targetUserId],
    queryFn: async () => {
      if (!user?.$id || !targetUserId || user.$id === targetUserId) {
        return false;
      }

      try {
        const response = await databases.listDocuments('main', 'user_follows', [
          Query.equal('follower_id', user.$id),
          Query.equal('following_id', targetUserId),
          Query.limit(1),
        ]);
        return response.documents.length > 0;
      } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
      }
    },
    enabled: !!user?.$id && !!targetUserId && user.$id !== targetUserId,
  });
};

// Get followers count for a user
export const useFollowersCount = (userId: string) => {
  return useQuery({
    queryKey: ['followersCount', userId],
    queryFn: async () => {
      if (!userId) return 0;

      try {
        const response = await databases.listDocuments('main', 'user_follows', [
          Query.equal('following_id', userId),
          Query.limit(1), // We just need the count
        ]);
        return response.total;
      } catch (error) {
        console.error('Error fetching followers count:', error);
        return 0;
      }
    },
    enabled: !!userId,
  });
};

// Get following count for a user
export const useFollowingCount = (userId: string) => {
  return useQuery({
    queryKey: ['followingCount', userId],
    queryFn: async () => {
      if (!userId) return 0;

      try {
        const response = await databases.listDocuments('main', 'user_follows', [
          Query.equal('follower_id', userId),
          Query.limit(1), // We just need the count
        ]);
        return response.total;
      } catch (error) {
        console.error('Error fetching following count:', error);
        return 0;
      }
    },
    enabled: !!userId,
  });
};

// Toggle follow/unfollow
export const useToggleFollow = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      targetUserId,
      isCurrentlyFollowing,
    }: {
      targetUserId: string;
      isCurrentlyFollowing: boolean;
    }) => {
      if (!user?.$id || !targetUserId || user.$id === targetUserId) {
        throw new Error('Invalid follow operation');
      }

      if (isCurrentlyFollowing) {
        // Unfollow - find and delete the relationship
        const response = await databases.listDocuments('main', 'user_follows', [
          Query.equal('follower_id', user.$id),
          Query.equal('following_id', targetUserId),
          Query.limit(1),
        ]);

        if (response.documents.length > 0) {
          await databases.deleteDocument('main', 'user_follows', response.documents[0].$id);
        }
        return false; // Now unfollowing
      } else {
        // Follow - create new relationship
        await databases.createDocument('main', 'user_follows', 'unique()', {
          follower_id: user.$id,
          following_id: targetUserId,
        });
        return true; // Now following
      }
    },
    onSuccess: (_, { targetUserId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['isFollowing', user?.$id, targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followersCount', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followingCount', user?.$id] });

      // Also invalidate user stats as they track follow counts
      queryClient.invalidateQueries({ queryKey: ['userStats', user?.$id] });
      queryClient.invalidateQueries({ queryKey: ['userStats', targetUserId] });
    },
    onError: (error) => {
      console.error('Error toggling follow:', error);
    },
  });
};
