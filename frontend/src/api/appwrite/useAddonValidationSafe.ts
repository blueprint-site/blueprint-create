import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import { Query } from 'appwrite';
import { addonValidator } from '@/utils/validation/addonValidator';
import type { Addon } from '@/types';
import { toast } from '@/hooks/useToast';

const DATABASE_ID = 'main';
const COLLECTIONS = {
  ADDONS: 'addons',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
};

// Safe version that only uses existing fields
export const usePendingValidation = () => {
  return useQuery({
    queryKey: ['addons', 'pending-validation'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADDONS, [
        Query.equal('isChecked', false),
        Query.orderDesc('$createdAt'),
      ]);

      // Add validation scores in memory only
      const addonsWithScores = response.documents.map((addon) => ({
        ...addon,
        validationScore: addonValidator.validateAddon(addon as any),
      }));

      return addonsWithScores;
    },
  });
};

// Get auto-approval ready addons
export const useAutoApprovalReady = () => {
  return useQuery({
    queryKey: ['addons', 'auto-approval-ready'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADDONS, [
        Query.equal('isChecked', false),
      ]);

      return response.documents.filter((addon) => {
        const score = addonValidator.validateAddon(addon as any);
        return score.autoApprovalReady;
      });
    },
  });
};

// Safe bulk operations using only existing fields
export const useBulkOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operation: {
      addonIds: string[];
      operation: 'approve' | 'reject' | 'delete' | 'archive' | 'flag' | 'assign';
      data?: any;
    }) => {
      const results = await Promise.all(
        operation.addonIds.map(async (addonId) => {
          let updateData: Record<string, any> = {};

          switch (operation.operation) {
            case 'approve':
              updateData = {
                isValid: true,
                isChecked: true,
              };
              break;
            case 'reject':
              updateData = {
                isValid: false,
                isChecked: true,
              };
              break;
            default:
              // For other operations, we'll just mark them as checked for now
              updateData = {
                isChecked: true,
              };
              break;
          }

          if (operation.data?.categories) {
            updateData.categories = operation.data.categories;
          }

          await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, addonId, updateData);

          return { addonId, operation: operation.operation };
        })
      );

      return results;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Bulk Operation Complete',
        description: `${variables.operation} operation applied to ${data.length} addons`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Operation Failed',
        description: 'Some operations could not be completed',
        variant: 'destructive',
      });
    },
  });
};

// Safe review action using only existing fields
export const useReviewAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: {
      addonId: string;
      action: 'approve' | 'reject' | 'flag' | 'skip';
      notes?: string;
      reason?: string;
    }) => {
      let updateData: Record<string, any> = {};

      switch (action.action) {
        case 'approve':
          updateData = {
            isValid: true,
            isChecked: true,
          };
          break;
        case 'reject':
          updateData = {
            isValid: false,
            isChecked: true,
          };
          break;
        case 'flag':
          // Just mark as checked for now
          updateData = {
            isChecked: true,
          };
          break;
        case 'skip':
          // No update needed
          return { addonId: action.addonId, action: action.action };
      }

      if (Object.keys(updateData).length > 0) {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, action.addonId, updateData);
      }

      return { addonId: action.addonId, action: action.action };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Review Action Completed',
        description: `Addon ${data.action}`,
      });
    },
  });
};

// Auto-approve using only existing fields
export const useAutoApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addonIds: string[]) => {
      const results = await Promise.all(
        addonIds.map(async (addonId) => {
          const addon = await databases.getDocument(DATABASE_ID, COLLECTIONS.ADDONS, addonId);

          const validationResult = addonValidator.validateAddon(addon as any);

          if (validationResult.autoApprovalReady) {
            await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, addonId, {
              isValid: true,
              isChecked: true,
            });

            return { addonId, approved: true };
          }

          return { addonId, approved: false };
        })
      );

      return results.filter((r) => r.approved);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Auto-Approval Complete',
        description: `Auto-approved ${data.length} addons`,
      });
    },
  });
};

// Mock notifications for now
export const useAdminNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      // Return mock notifications
      return [
        {
          id: '1',
          type: 'addon' as const,
          title: 'New addon submitted',
          message: 'Review pending addons',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high' as const,
          actionUrl: '/admin/addons',
          actionLabel: 'Review',
          source: 'System',
        },
      ];
    },
  });
};

// Mock mark as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return { notificationId, read: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
};

// Safe validation analytics using only existing fields
export const useValidationAnalytics = (timeRange: '7d' | '30d' | '90d' | '1y') => {
  return useQuery({
    queryKey: ['validation-analytics', timeRange],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADDONS, [
        Query.limit(1000),
      ]);

      const addons = response.documents;

      // Calculate analytics
      const totalAddons = addons.length;
      const approvedAddons = addons.filter((a) => a.isValid).length;
      const pendingAddons = addons.filter((a) => !a.isChecked).length;
      const rejectedAddons = addons.filter((a) => !a.isValid && a.isChecked).length;

      const approvalRate = (approvedAddons / totalAddons) * 100;

      // Calculate validation scores in memory
      const scores = addons.map((addon) => addonValidator.validateAddon(addon as any).percentage);

      const averageValidationScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      // Estimate auto-approved based on high scores
      const highScoreAddons = addons.filter((addon) => {
        const score = addonValidator.validateAddon(addon as any);
        return score.autoApprovalReady && addon.isValid;
      });
      const autoApprovedAddons = highScoreAddons.length;
      const autoApprovalRate = approvedAddons > 0 ? (autoApprovedAddons / approvedAddons) * 100 : 0;

      return {
        totalAddons,
        approvedAddons,
        autoApprovedAddons,
        pendingAddons,
        rejectedAddons,
        approvalRate,
        autoApprovalRate,
        averageValidationScore,
        scoreDistribution: {
          high: addons.filter((a) => {
            const score = addonValidator.validateAddon(a as any).percentage;
            return score >= 85;
          }).length,
          medium: addons.filter((a) => {
            const score = addonValidator.validateAddon(a as any).percentage;
            return score >= 60 && score < 85;
          }).length,
          low: addons.filter((a) => {
            const score = addonValidator.validateAddon(a as any).percentage;
            return score < 60;
          }).length,
        },
      };
    },
  });
};
