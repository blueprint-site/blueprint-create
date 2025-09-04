import { z } from 'zod';

// Extended schema for addon with validation fields
export const AddonValidationSchema = z.object({
  // Existing fields
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  author: z.string(),
  categories: z.array(z.string()),
  downloads: z.number().int().nonnegative(),
  icon: z.string().nullable().optional(),
  sources: z.array(z.string()),
  isValid: z.boolean(),
  loaders: z.array(z.string()),
  isChecked: z.boolean(),
  minecraft_versions: z.array(z.string()),
  create_versions: z.array(z.string()),
  claimed_by: z.string().nullable().optional(),

  // New validation fields
  validationScore: z.number().min(0).max(100).optional(),
  autoValidated: z.boolean().optional(),
  validationFlags: z.array(z.string()).optional(),
  validationTimestamp: z.string().datetime().optional(),
  validationDetails: z
    .object({
      createDependency: z.boolean().optional(),
      keywordScore: z.number().optional(),
      versionCompatibility: z.boolean().optional(),
      metadataCompleteness: z.number().optional(),
      sourceVerification: z.boolean().optional(),
      categoryRelevance: z.number().optional(),
    })
    .optional(),

  // Review metadata
  reviewNotes: z.string().optional(),
  reviewHistory: z
    .array(
      z.object({
        id: z.string(),
        action: z.enum(['approved', 'rejected', 'flagged', 'reviewed', 'auto_approved']),
        timestamp: z.string().datetime(),
        userId: z.string(),
        userName: z.string(),
        notes: z.string().optional(),
        previousStatus: z
          .object({
            isValid: z.boolean(),
            isChecked: z.boolean(),
          })
          .optional(),
      })
    )
    .optional(),

  // Workflow fields
  stage: z.enum(['pending', 'reviewing', 'approved', 'rejected', 'archived']).optional(),
  assignedTo: z.string().nullable().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  tags: z.array(z.string()).optional(),

  // Analytics fields
  lastReviewedAt: z.string().datetime().optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  approvalRate: z.number().min(0).max(100).optional(),
  averageReviewTime: z.number().optional(), // in minutes

  // Automation fields
  autoApprovalEligible: z.boolean().optional(),
  autoApprovalReason: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  keywords: z.array(z.string()).optional(),
});

export type AddonValidation = z.infer<typeof AddonValidationSchema>;

// Schema for bulk operations
export const BulkOperationSchema = z.object({
  addonIds: z.array(z.string()),
  operation: z.enum(['approve', 'reject', 'delete', 'archive', 'flag', 'assign']),
  data: z
    .object({
      notes: z.string().optional(),
      reason: z.string().optional(),
      assignTo: z.string().optional(),
      priority: z.enum(['high', 'medium', 'low']).optional(),
      categories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

export type BulkOperation = z.infer<typeof BulkOperationSchema>;

// Schema for validation request
export const ValidationRequestSchema = z.object({
  addonId: z.string(),
  forceRevalidation: z.boolean().optional(),
  includeDetails: z.boolean().optional(),
});

export type ValidationRequest = z.infer<typeof ValidationRequestSchema>;

// Schema for validation response
export const ValidationResponseSchema = z.object({
  addonId: z.string(),
  score: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  autoApprovalReady: z.boolean(),
  details: z.object({
    createDependency: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
    }),
    keywordPresence: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
      keywords: z.array(z.string()).optional(),
    }),
    versionCompatibility: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
    }),
    metadataCompleteness: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
      missingFields: z.array(z.string()).optional(),
    }),
    sourceVerification: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
    }),
    categoryRelevance: z.object({
      passed: z.boolean(),
      score: z.number(),
      message: z.string(),
    }),
  }),
  suggestions: z.array(z.string()),
  flags: z.array(z.string()),
});

export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;

// Schema for review action
export const ReviewActionSchema = z.object({
  addonId: z.string(),
  action: z.enum(['approve', 'reject', 'flag', 'skip']),
  notes: z.string().optional(),
  reason: z.string().optional(),
  updateValidation: z.boolean().optional(),
  autoApproved: z.boolean().optional(),
});

export type ReviewAction = z.infer<typeof ReviewActionSchema>;

// Schema for admin notifications
export const AdminNotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['success', 'warning', 'error', 'info', 'addon', 'user', 'system']),
  title: z.string(),
  message: z.string(),
  timestamp: z.string().datetime(),
  read: z.boolean(),
  priority: z.enum(['high', 'medium', 'low']),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type AdminNotification = z.infer<typeof AdminNotificationSchema>;
