import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, storage, ID } from '@/config/appwrite';
import type { FeedbackRecord, FeedbackSubmission } from '@/types/feedback';
import { Query } from 'appwrite';
import { toast } from '@/hooks';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'feedback'; // This will need to be created in Appwrite
const STORAGE_BUCKET_ID = 'feedback-screenshots'; // This will need to be created in Appwrite

/**
 * Hook to submit feedback with optional screenshot
 * @returns {Object} Object containing submitFeedback mutation
 */
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackData: FeedbackSubmission): Promise<FeedbackRecord> => {
      try {
        let screenshotUrl: string | null = null;

        // Upload screenshot if provided
        if (feedbackData.screenshot) {
          const fileId = ID.unique();
          const uploadResult = await storage.createFile(
            STORAGE_BUCKET_ID,
            fileId,
            feedbackData.screenshot
          );

          // Get the download URL
          screenshotUrl = storage.getFileDownload(STORAGE_BUCKET_ID, uploadResult.$id);
        }

        // Create feedback document
        const feedbackRecord = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            type: feedbackData.type,
            message: feedbackData.message,
            url: feedbackData.url,
            screenshot: screenshotUrl,
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }
        );

        return feedbackRecord as FeedbackRecord;
      } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Feedback submitted successfully! Thank you for your input.',
      });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
    onError: (error) => {
      console.error('Failed to submit feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to fetch all feedback (admin only)
 * @returns {Query} Query object to fetch all feedback
 */
export const useFetchFeedback = () => {
  return useQuery<FeedbackRecord[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments<FeedbackRecord>(DATABASE_ID, COLLECTION_ID, [
          Query.orderDesc('createdAt'),
          Query.limit(100),
        ]);
        return response.documents;
      } catch (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook to update feedback status (admin only)
 * @returns {Object} Object containing updateFeedbackStatus mutation
 */
export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'open' | 'in-progress' | 'resolved' | 'closed';
    }) => {
      try {
        const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
          status,
          updatedAt: new Date().toISOString(),
        });
        return response;
      } catch (error) {
        console.error('Error updating feedback status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Feedback status updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
    onError: (error) => {
      console.error('Failed to update feedback status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feedback status',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete feedback (admin only)
 * @returns {Object} Object containing deleteFeedback mutation
 */
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Get the feedback first to check if it has a screenshot
        const feedback = await databases.getDocument<FeedbackRecord>(
          DATABASE_ID,
          COLLECTION_ID,
          id
        );

        // Delete screenshot if it exists
        if (feedback.screenshot) {
          try {
            // Extract file ID from screenshot URL if needed
            const fileId = feedback.screenshot.split('/').pop()?.split('?')[0];
            if (fileId) {
              await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
            }
          } catch (storageError) {
            console.warn('Could not delete screenshot file:', storageError);
          }
        }

        // Delete the feedback document
        const response = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        return response;
      } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Feedback deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
    onError: (error) => {
      console.error('Failed to delete feedback:', error);
      toast({ title: 'Error', description: 'Failed to delete feedback', variant: 'destructive' });
    },
  });
};
