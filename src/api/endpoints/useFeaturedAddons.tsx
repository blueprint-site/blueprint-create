import { databases } from '@/config/appwrite';
import type { FeaturedAddon } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ID, Query } from 'appwrite';
import { toast } from '@/hooks/useToast';
import type { Models } from 'appwrite';

const DATABASE_ID = '67e6ec5c0032a90a14e6';
const COLLECTION_ID = '67ed41fb000467814396';

interface FetchFeaturedAddonsOptions {
  active?: boolean;
  orderBy?: 'display_order' | 'title' | '$createdAt' | '$updatedAt';
  orderDirection?: 'asc' | 'desc';
}

export const useFetchFeaturedAddons = (options: FetchFeaturedAddonsOptions = {}) => {
  const { active = false, orderBy = 'display_order', orderDirection = 'asc' } = options;

  return useQuery({
    queryKey: ['featuredAddons', options],
    queryFn: async () => {
      try {
        const queries: string[] = [];

        if (orderDirection === 'asc') {
          queries.push(Query.orderAsc(orderBy));
        } else {
          queries.push(Query.orderDesc(orderBy));
        }

        if (active) {
          queries.push(Query.equal('active', true));
        }

        const response = await databases.listDocuments<FeaturedAddon>(
          DATABASE_ID,
          COLLECTION_ID,
          queries
        );

        return response.documents;
      } catch (err) {
        console.error('Error fetching featured addons:', err);
        throw new Error('Failed to fetch featured addons');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create a new featured addon
export const useCreateFeaturedAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<FeaturedAddon, '$id' | '$createdAt' | '$updatedAt'>) => {
      try {
        const response = await databases.createDocument<FeaturedAddon>(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          data
        );
        return response;
      } catch (err) {
        console.error('Error creating featured addon:', err);
        throw new Error('Failed to create featured addon');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredAddons'] });
      toast({
        title: 'Success',
        description: 'Featured addon created successfully',
      });
    },
    onError: (_error) => {
      toast({
        title: 'Error',
        description: 'Failed to create featured addon',
        variant: 'destructive',
      });
    },
  });
};
type UpdateFeaturedAddonArgs = {
  id: string;
  addon: Partial<FeaturedAddon>;
};
// Update a featured addon
export const useUpdateFeaturedAddon = () => {
  return useMutation({
    mutationFn: async ({ id, addon }: UpdateFeaturedAddonArgs): Promise<Models.Document> => {
      try {
        const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, addon);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Featured addon updated',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Error updating featured addon',
        });
        console.error('Error updating featured addon:', error);
        throw error;
      }
    },
  });
};

// Delete a featured addon
export const useDeleteFeaturedAddon = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Featured addon deleted',
        });
        return response;
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: 'Error deleting featured addon',
        });
        console.error('Error deleting featured addon:', error);
        throw error;
      }
    },
    onError: (_error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete featured addon',
        variant: 'destructive',
      });
    },
  });
};
