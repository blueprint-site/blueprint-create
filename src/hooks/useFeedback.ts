import { useSubmitFeedback } from '@/api';
import type { FeedbackSubmission } from '@/types/feedback';

/**
 * useFeedback - custom hook to submit feedback to Appwrite
 * @returns submitFeedback, loading, error, data
 */
export function useFeedback() {
  const submitFeedbackMutation = useSubmitFeedback();

  /**
   * Submits feedback to the Appwrite 'feedback' collection
   * @param {FeedbackSubmission} params
   * @returns {Promise<any>}
   */
  const submitFeedback = async (params: FeedbackSubmission) => {
    return submitFeedbackMutation.mutateAsync(params);
  };

  return {
    submitFeedback,
    loading: submitFeedbackMutation.isPending,
    error: submitFeedbackMutation.error,
    data: submitFeedbackMutation.data,
  };
}
