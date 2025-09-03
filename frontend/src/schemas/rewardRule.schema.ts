import { z } from 'zod';

// Enum for rule types
export const RuleTypeEnum = z.enum(['milestone', 'action', 'time_based', 'combination', 'custom']);

// Enum for operators
export const OperatorEnum = z.enum(['>=', '<=', '==', '!=', '>', '<']);

// Enum for timeframes
export const TimeframeEnum = z.enum(['all_time', 'monthly', 'weekly', 'daily', 'custom']);

// Enum for logic operators for combination rules
export const LogicEnum = z.enum(['AND', 'OR']);

// Define the condition type interface
export interface Condition {
  metric?: string | null;
  operator?: z.infer<typeof OperatorEnum> | null;
  value?: number | null;
  timeframe?: z.infer<typeof TimeframeEnum> | null;
  startDate?: string | null;
  endDate?: string | null;
  actionType?: string | null;
  requiredFields?: string[] | null;
  duration?: number | null;
  requiresStreak?: boolean | null;
  logic?: z.infer<typeof LogicEnum> | null;
  subconditions?: Condition[] | null;
}

// Schema for individual condition
export const ConditionSchema: z.ZodType<Condition> = z.object({
  // For milestone type
  metric: z.string().optional().nullable(),
  operator: OperatorEnum.optional().nullable(),
  value: z.number().optional().nullable(),
  timeframe: TimeframeEnum.optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),

  // For action type
  actionType: z.string().optional().nullable(),
  requiredFields: z.array(z.string()).optional().nullable(),

  // For time_based
  duration: z.number().optional().nullable(),
  requiresStreak: z.boolean().optional().nullable(),

  // For combination type
  logic: LogicEnum.optional().nullable(),
  subconditions: z
    .array(z.lazy(() => ConditionSchema))
    .optional()
    .nullable(),
});

// Main Reward Rule Schema
export const RewardRuleSchema = z.object({
  $id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required').max(100),
  description: z.string().max(500).nullable(),
  badgeId: z.string().min(1, 'Badge ID is required'),

  ruleType: RuleTypeEnum,
  conditions: ConditionSchema,

  // Configuration
  priority: z.number().int().min(0).max(1000).default(10),
  isActive: z.boolean().default(true),
  isRepeatable: z.boolean().default(false),
  cooldownDays: z.number().int().min(0).default(0),
  maxAwards: z.number().int().min(1).default(1),

  // Retroactive application
  isRetroactive: z.boolean().default(false),
  retroactiveDate: z.string().datetime().optional().nullable(),

  // Display
  progressVisible: z.boolean().default(true),
  announcement: z.string().max(200).default('Congratulations! You earned a new badge!'),

  // Metadata
  createdBy: z.string().nullable(),
  testMode: z.boolean().default(false),
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
});

export const CreateRewardRuleSchema = RewardRuleSchema.omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

export const UpdateRewardRuleSchema = RewardRuleSchema.partial().omit({
  $id: true,
  $createdAt: true,
  $updatedAt: true,
});

// Schema for rule testing
export const RuleTestSchema = z.object({
  userId: z.string(),
  ruleId: z.string(),
});

export const RuleTestResultSchema = z.object({
  wouldAward: z.boolean(),
  reason: z.string(),
  currentProgress: z.number().optional(),
  targetValue: z.number().optional(),
  meetsConditions: z.boolean(),
  canEarnAgain: z.boolean(),
  nextAvailableDate: z.string().datetime().optional(),
});

export type RewardRule = z.infer<typeof RewardRuleSchema>;
export type CreateRewardRule = z.infer<typeof CreateRewardRuleSchema>;
export type UpdateRewardRule = z.infer<typeof UpdateRewardRuleSchema>;
// Condition interface is already defined above
export type RuleType = z.infer<typeof RuleTypeEnum>;
export type Operator = z.infer<typeof OperatorEnum>;
export type Timeframe = z.infer<typeof TimeframeEnum>;
export type Logic = z.infer<typeof LogicEnum>;
export type RuleTest = z.infer<typeof RuleTestSchema>;
export type RuleTestResult = z.infer<typeof RuleTestResultSchema>;
