import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { ID, Query } from 'appwrite';
import { BadgeSchema, type Badge, type CreateBadge, type UpdateBadge } from '@/schemas/badge.schema';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'badges';

export const useBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderAsc('sortOrder'),
        Query.limit(100),
      ]);
      return response.documents.map((doc) => BadgeSchema.parse(doc)) as Badge[];
    },
  });
};

export const useBadge = (badgeId: string) => {
  return useQuery({
    queryKey: ['badge', badgeId],
    queryFn: async () => {
      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, badgeId);
      return BadgeSchema.parse(response) as Badge;
    },
    enabled: !!badgeId,
  });
};

export const useCreateBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badge: CreateBadge) => {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        badge
      );
      return BadgeSchema.parse(response) as Badge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast.success('Badge created successfully!');
    },
    onError: (error) => {
      console.error('Error creating badge:', error);
      toast.error('Failed to create badge');
    },
  });
};

export const useUpdateBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ badgeId, badge }: { badgeId: string; badge: UpdateBadge }) => {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        badgeId,
        badge
      );
      return BadgeSchema.parse(response) as Badge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast.success('Badge updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating badge:', error);
      toast.error('Failed to update badge');
    },
  });
};

export const useDeleteBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeId: string) => {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, badgeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast.success('Badge deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting badge:', error);
      toast.error('Failed to delete badge');
    },
  });
};