import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks';
import { databases, ID } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { BlogTag } from '@/types';
import { blogTagSchema, type BlogTagFormValues } from '@/schemas/tag.schema';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b2326100053d0e304f';

/**
 * Hook to fetch all blog tags
 */
export const useBlogTags = () => {
  return useQuery<BlogTag[]>({
    queryKey: ['blogTags'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<BlogTag>(DATABASE_ID, COLLECTION_ID, [
          Query.limit(100),
        ]);
        return response.documents;
      } catch (error) {
        console.error('Error fetching blog tags:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new blog tag
 */
export const useCreateBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BlogTagFormValues) => {
      try {
        // Validate with Zod schema
        const validatedData = blogTagSchema.parse(data);

        const response = await databases.createDocument<BlogTag>(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          validatedData
        );

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Tag created successfully',
        });

        return response;
      } catch (error) {
        console.error('Error creating blog tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error creating tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogTags'] });
    },
  });
};

/**
 * Hook to update a blog tag
 */
export const useUpdateBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogTagFormValues }) => {
      try {
        // Validate with Zod schema
        const validatedData = blogTagSchema.parse(data);

        const response = await databases.updateDocument<BlogTag>(
          DATABASE_ID,
          COLLECTION_ID,
          id,
          validatedData
        );

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Tag updated successfully',
        });

        return response;
      } catch (error) {
        console.error('Error updating blog tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error updating tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogTags'] });
    },
  });
};

/**
 * Hook to delete a blog tag
 */
export const useDeleteBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Tag deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting blog tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogTags'] });
    },
  });
};
