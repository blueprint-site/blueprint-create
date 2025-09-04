import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/config/appwrite';
import { Query } from 'appwrite';
import { addonValidator } from '@/utils/validation/addonValidator';

const DATABASE_ID = 'main';
const COLLECTIONS = {
  ADDONS: 'addons',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
};
import type {
  AddonValidation,
  BulkOperation,
  ValidationRequest,
  ValidationResponse,
  ReviewAction,
  AdminNotification,
} from '@/schemas/addon-validation.schema';
import type { Addon } from '@/types';
import { toast } from '@/hooks/useToast';

// Validate single addon
export const useValidateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ValidationRequest) => {
      // Get addon data
      const addon = await databases.getDocument(DATABASE_ID, COLLECTIONS.ADDONS, request.addonId);

      // Run validation
      const validationResult = addonValidator.validateAddon(addon as any);

      // Prepare update data
      const updateData: Partial<AddonValidation> = {
        validationScore: validationResult.percentage,
        autoValidated: false,
        validationFlags: validationResult.flags,
        validationTimestamp: new Date().toISOString(),
        confidence: validationResult.confidence,
        autoApprovalEligible: validationResult.autoApprovalReady,
        keywords: [], // Extract from validation
        validationDetails: {
          createDependency: validationResult.results.create_dependency.passed,
          keywordScore: validationResult.results.keyword_presence.score,
          versionCompatibility: validationResult.results.version_compatibility.passed,
          metadataCompleteness: validationResult.results.metadata_completeness.score,
          sourceVerification: validationResult.results.source_verification.passed,
          categoryRelevance: validationResult.results.category_relevance.score,
        },
      };

      // Update addon with validation data
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, request.addonId, updateData);

      return {
        addonId: request.addonId,
        score: validationResult.percentage,
        confidence: validationResult.confidence,
        autoApprovalReady: validationResult.autoApprovalReady,
        details: validationResult.results,
        suggestions: validationResult.suggestions,
        flags: validationResult.flags,
      } as ValidationResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Validation Complete',
        description: `Addon validated with ${data.score}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Validation Failed',
        description: 'Could not validate addon',
        variant: 'destructive',
      });
    },
  });
};

// Bulk validate addons
export const useBulkValidateAddons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addonIds: string[]) => {
      const results = await Promise.all(
        addonIds.map(async (addonId) => {
          const addon = await databases.getDocument(DATABASE_ID, COLLECTIONS.ADDONS, addonId);

          const validationResult = addonValidator.validateAddon(addon as any);

          await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, addonId, {
            validationScore: validationResult.percentage,
            confidence: validationResult.confidence,
            autoApprovalEligible: validationResult.autoApprovalReady,
            validationTimestamp: new Date().toISOString(),
          });

          return { addonId, ...validationResult };
        })
      );

      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Bulk Validation Complete',
        description: `Validated ${data.length} addons`,
      });
    },
  });
};

// Handle bulk operations
export const useBulkOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operation: BulkOperation) => {
      const results = await Promise.all(
        operation.addonIds.map(async (addonId) => {
          let updateData: Record<string, any> = {};

          switch (operation.operation) {
            case 'approve':
              updateData = {
                isValid: true,
                isChecked: true,
                stage: 'approved',
                reviewedAt: new Date().toISOString(),
              };
              break;
            case 'reject':
              updateData = {
                isValid: false,
                isChecked: true,
                stage: 'rejected',
                reviewedAt: new Date().toISOString(),
                reviewNotes: operation.data?.reason,
              };
              break;
            case 'archive':
              updateData = {
                stage: 'archived',
              };
              break;
            case 'flag':
              updateData = {
                validationFlags: operation.data?.reason ? [operation.data.reason] : [],
                priority: 'high',
              };
              break;
            case 'assign':
              updateData = {
                assignedTo: operation.data?.assignTo || operation.data?.assignedTo,
                stage: 'reviewing',
              };
              break;
            case 'update':
              // Handle generic updates with stage
              if (operation.data?.stage) {
                updateData = { ...operation.data };
              }
              break;
          }

          if (operation.data?.categories) {
            updateData.categories = operation.data.categories;
          }
          if (operation.data?.tags) {
            updateData.tags = operation.data.tags;
          }
          if (operation.data?.priority) {
            updateData.priority = operation.data.priority;
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
  });
};

// Handle review actions
export const useReviewAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: ReviewAction) => {
      const addon = await databases.getDocument(DATABASE_ID, COLLECTIONS.ADDONS, action.addonId);

      const reviewEntry = {
        id: ID.unique(),
        action: action.action,
        timestamp: new Date().toISOString(),
        userId: 'admin', // Get from auth context
        userName: 'Admin',
        notes: action.notes,
        previousStatus: {
          isValid: addon.isValid,
          isChecked: addon.isChecked,
        },
      };

      let updateData: Record<string, any> = {
        reviewHistory: [...(addon.reviewHistory || []), reviewEntry],
        reviewCount: (addon.reviewCount || 0) + 1,
        reviewedAt: new Date().toISOString(),
      };

      switch (action.action) {
        case 'approve':
          updateData = {
            ...updateData,
            isValid: true,
            isChecked: true,
            stage: 'approved',
            autoValidated: action.autoApproved || false,
          };
          break;
        case 'reject':
          updateData = {
            ...updateData,
            isValid: false,
            isChecked: true,
            stage: 'rejected',
            reviewNotes: action.reason,
          };
          break;
        case 'flag':
          updateData = {
            ...updateData,
            validationFlags: [
              ...(addon.validationFlags || []),
              action.reason || 'Flagged for review',
            ],
            priority: 'high',
          };
          break;
        case 'skip':
          // Just add to history
          break;
      }

      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDONS, action.addonId, updateData);

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

// Get addons pending validation
export const usePendingValidation = () => {
  return useQuery({
    queryKey: ['addons', 'pending-validation'],
    queryFn: async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADDONS, [
        Query.equal('isChecked', false),
        Query.orderDesc('$createdAt'),
      ]);

      // Add validation scores
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
        Query.greaterThanEqual('validationScore', 85),
      ]);

      return response.documents.filter((addon) => {
        const score = addonValidator.validateAddon(addon as any);
        return score.autoApprovalReady;
      });
    },
  });
};

// Auto-approve eligible addons
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
              stage: 'approved',
              autoValidated: true,
              validationScore: validationResult.percentage,
              confidence: validationResult.confidence,
              autoApprovalReason: 'Passed all validation criteria',
              reviewedAt: new Date().toISOString(),
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

// Get admin notifications
export const useAdminNotifications = () => {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      // In a real app, this would fetch from a notifications collection
      const notifications: AdminNotification[] = [
        {
          id: '1',
          type: 'addon',
          title: 'New addon submitted',
          message: '5 new addons are pending review',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/admin/addons',
          actionLabel: 'Review',
          source: 'System',
        },
      ];

      return notifications;
    },
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real app, this would update the notification in the database
      return { notificationId, read: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
};

// Get validation analytics
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
      const autoApprovedAddons = addons.filter((a) => a.autoValidated).length;
      const pendingAddons = addons.filter((a) => !a.isChecked).length;
      const rejectedAddons = addons.filter((a) => !a.isValid && a.isChecked).length;

      const approvalRate = (approvedAddons / totalAddons) * 100;
      const autoApprovalRate = (autoApprovedAddons / approvedAddons) * 100;

      const averageValidationScore =
        addons
          .filter((a) => a.validationScore)
          .reduce((sum, a) => sum + (a.validationScore || 0), 0) / totalAddons;

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
          high: addons.filter((a) => (a.validationScore || 0) >= 85).length,
          medium: addons.filter(
            (a) => (a.validationScore || 0) >= 60 && (a.validationScore || 0) < 85
          ).length,
          low: addons.filter((a) => (a.validationScore || 0) < 60).length,
        },
      };
    },
  });
};
