import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks';
import { databases, ID } from '@/config/appwrite';
import { Query } from 'appwrite';
import type { SchematicTag } from '@/types';
import { schematicTagSchema, type SchematicTagFormValues } from '@/schemas/tag.schema';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67bf59d30021b5c117f5';

/**
 * Hook to fetch all schematic tags
 */
export const useSchematicTags = () => {
  return useQuery<SchematicTag[]>({
    queryKey: ['schematicTags'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<SchematicTag>(DATABASE_ID, COLLECTION_ID, [
          Query.limit(100),
        ]);
        return response.documents;
      } catch (error) {
        console.error('Error fetching schematic tags:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new schematic tag
 */
export const useCreateSchematicTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SchematicTagFormValues) => {
      try {
        // Validate with Zod schema
        const validatedData = schematicTagSchema.parse(data);

        const response = await databases.createDocument<SchematicTag>(
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
        console.error('Error creating schematic tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error creating tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematicTags'] });
    },
  });
};

/**
 * Hook to update a schematic tag
 */
export const useUpdateSchematicTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SchematicTagFormValues }) => {
      try {
        // Validate with Zod schema
        const validatedData = schematicTagSchema.parse(data);

        const response = await databases.updateDocument<SchematicTag>(
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
        console.error('Error updating schematic tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error updating tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematicTags'] });
    },
  });
};

/**
 * Hook to delete a schematic tag
 */
export const useDeleteSchematicTag = () => {
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
        console.error('Error deleting schematic tag:', error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting tag',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schematicTags'] });
    },
  });
};
