import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67c372910017d2f7ba64';

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        console.log('Email deleted successfully');
      } catch (error) {
        console.error('Error deleting email:', error);
        throw new Error('Error deleting email:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_list'] });
    },
  });
};

export const useFetchEmail = (id?: string) => {
  return useQuery<{ $id: string; email: string } | null>({
    queryKey: ['email', id],
    queryFn: async () => {
      if (!id) return null;

      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);

      const emailData = {
        $id: response.$id,
        email: response.email || '',
      };

      return emailData;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useFetchEmails = (page: number, limit: number = 10) => {
  return useQuery<{
    emails: { $id: string; email: string }[];
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    queryKey: ['email_list', page, limit],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
        ]);

        const emails = response.documents.map((doc) => ({
          $id: doc.$id,
          email: doc.email || '',
        }));

        return {
          emails,
          total: response.total,
          hasNextPage: page * limit < response.total,
          hasPreviousPage: page > 1,
        };
      } catch (err) {
        console.error('Error fetching emails:', err);
        throw new Error('Failed to fetch emails');
      }
    },
    retry: 2,
  });
};

export const useSaveEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailData: { $id?: string; email: string }) => {
      if (!emailData.$id) {
        return databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), emailData);
      }

      return databases.updateDocument(DATABASE_ID, COLLECTION_ID, emailData.$id, emailData);
    },
    onSuccess: () => {
      console.log('Successfully updated email list');
      queryClient.invalidateQueries({ queryKey: ['email_list'] });
    },
  });
};
