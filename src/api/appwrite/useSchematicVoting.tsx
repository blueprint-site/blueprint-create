import { useMutation, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { useUserStore } from '@/api/stores/userStore';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'schematics';

export const useToggleSchematicLike = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      schematicId,
      currentLikes,
      likedBy = [],
    }: {
      schematicId: string;
      currentLikes: number;
      likedBy: string[];
    }) => {
      if (!user) {
        throw new Error('You must be logged in to vote');
      }

      const userId = user.$id;
      const isLiked = likedBy.includes(userId);

      // Toggle the like state
      const newLikedBy = isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];

      const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

      // Update the document
      const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, schematicId, {
        likes: newLikes,
        liked_by: newLikedBy,
      });

      return {
        ...response,
        isLiked: !isLiked,
      };
    },
    onSuccess: (data) => {
      // Invalidate and refetch schematic data
      queryClient.invalidateQueries({ queryKey: ['schematic', data.$id] });
      queryClient.invalidateQueries({ queryKey: ['schematics'] });

      // Show feedback
      if (data.isLiked) {
        toast.success('Added to your favorites!');
      } else {
        toast.info('Removed from favorites');
      }
    },
    onError: (error: Error) => {
      console.error('Error toggling like:', error);
      if (error.message === 'You must be logged in to vote') {
        toast.error('Please log in to vote on schematics');
      } else {
        toast.error('Failed to update vote. Please try again.');
      }
    },
  });
};

export const useRateSchematic = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      schematicId,
      rating,
      currentRating,
      totalRatings = 0,
    }: {
      schematicId: string;
      rating: number;
      currentRating: number;
      totalRatings: number;
    }) => {
      if (!user) {
        throw new Error('You must be logged in to rate');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Calculate new average rating
      // This is a simplified approach - in production you'd want to track individual ratings
      const newTotalRatings = totalRatings + 1;
      const newRating = (currentRating * totalRatings + rating) / newTotalRatings;

      // Update the document
      const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, schematicId, {
        rating: newRating,
      });

      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch schematic data
      queryClient.invalidateQueries({ queryKey: ['schematic', data.$id] });
      queryClient.invalidateQueries({ queryKey: ['schematics'] });

      toast.success('Thank you for rating this schematic!');
    },
    onError: (error: Error) => {
      console.error('Error rating schematic:', error);
      if (error.message === 'You must be logged in to rate') {
        toast.error('Please log in to rate schematics');
      } else {
        toast.error('Failed to submit rating. Please try again.');
      }
    },
  });
};
