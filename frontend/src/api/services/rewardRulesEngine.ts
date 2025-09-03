import { databases } from '@/config/appwrite';
import { ID, Query } from 'appwrite';
import { RewardRuleSchema, type RewardRule, type Condition } from '@/schemas/rewardRule.schema';
import { UserStatsSchema, type UserStats } from '@/schemas/userStats.schema';
import { UserAchievementSchema, type UserAchievement } from '@/schemas/userAchievement.schema';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const REWARD_RULES_COLLECTION_ID = 'reward_rules_new';
const USER_STATS_COLLECTION_ID = 'user_stats';
const USER_ACHIEVEMENTS_COLLECTION_ID = 'user_achievements';
const ACHIEVEMENT_PROGRESS_COLLECTION_ID = 'achievement_progress';

export interface RuleEvaluationResult {
  meetsConditions: boolean;
  reason: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100 percentage
}

export interface AwardResult {
  awarded: boolean;
  reason: string;
  achievement?: UserAchievement;
  progressUpdated?: boolean;
}

export class RewardRulesEngine {
  /**
   * Check all achievements for a specific user
   */
  static async checkAllAchievements(userId: string): Promise<AwardResult[]> {
    try {
      // Get all active rules
      const rulesResponse = await databases.listDocuments(DATABASE_ID, REWARD_RULES_COLLECTION_ID, [
        Query.equal('isActive', true),
        Query.orderAsc('priority'),
      ]);

      const rules = rulesResponse.documents.map((doc) => {
        // Parse conditions JSON string back to object before Zod validation
        const parsedDoc = { ...doc };
        if (typeof parsedDoc.conditions === 'string') {
          try {
            parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
          } catch (error) {
            console.error('Error parsing conditions in rules engine:', error);
            parsedDoc.conditions = {};
          }
        }
        return RewardRuleSchema.parse(parsedDoc);
      }) as RewardRule[];
      const results: AwardResult[] = [];

      // Process each rule
      for (const rule of rules) {
        const result = await this.checkSingleRule(userId, rule);
        results.push(result);

        // If we awarded something, show notification
        if (result.awarded && result.achievement) {
          toast.success(`🏆 ${rule.announcement || 'You earned a new badge!'}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error checking all achievements:', error);
      return [];
    }
  }

  /**
   * Check achievements for a specific trigger event
   */
  static async checkAchievementsForEvent(
    userId: string,
    eventType: string,
    eventData?: Record<string, unknown>
  ): Promise<AwardResult[]> {
    try {
      // Get rules that might be triggered by this event
      const rulesResponse = await databases.listDocuments(DATABASE_ID, REWARD_RULES_COLLECTION_ID, [
        Query.equal('isActive', true),
        Query.orderAsc('priority'),
      ]);

      const rules = rulesResponse.documents.map((doc) => {
        // Parse conditions JSON string back to object before Zod validation
        const parsedDoc = { ...doc };
        if (typeof parsedDoc.conditions === 'string') {
          try {
            parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
          } catch (error) {
            console.error('Error parsing conditions in rules engine:', error);
            parsedDoc.conditions = {};
          }
        }
        return RewardRuleSchema.parse(parsedDoc);
      }) as RewardRule[];
      const relevantRules = this.filterRulesForEvent(rules, eventType);
      const results: AwardResult[] = [];

      // Process relevant rules
      for (const rule of relevantRules) {
        const result = await this.checkSingleRule(userId, rule, eventType, eventData);
        results.push(result);

        if (result.awarded && result.achievement) {
          toast.success(`🏆 ${rule.announcement || 'You earned a new badge!'}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error checking achievements for event:', error);
      return [];
    }
  }

  /**
   * Check a single rule for a user
   */
  static async checkSingleRule(
    userId: string,
    rule: RewardRule,
    triggerEvent?: string,
    eventData?: Record<string, unknown>
  ): Promise<AwardResult> {
    try {
      // Skip if in test mode
      if (rule.testMode) {
        return {
          awarded: false,
          reason: 'Rule in test mode',
        };
      }

      // Get user stats
      const userStats = await this.getUserStats(userId);
      if (!userStats) {
        return {
          awarded: false,
          reason: 'User stats not found',
        };
      }

      // Check if user already has this achievement with duplicate prevention
      const existingAchievement = await this.getExistingAchievementWithLock(userId, rule.$id!);

      // Check cooldown and repeatability
      if (existingAchievement) {
        if (!rule.isRepeatable) {
          return {
            awarded: false,
            reason: 'Achievement already earned (not repeatable)',
          };
        }

        if (rule.cooldownDays > 0) {
          const cooldownCheck = this.checkCooldown(existingAchievement, rule.cooldownDays);
          if (!cooldownCheck.canEarn) {
            return {
              awarded: false,
              reason: `Cooldown active until ${cooldownCheck.nextAvailableDate}`,
            };
          }
        }

        if (rule.maxAwards > 0 && (existingAchievement.timesEarned || 1) >= rule.maxAwards) {
          return {
            awarded: false,
            reason: 'Maximum awards limit reached',
          };
        }
      }

      // Evaluate rule conditions
      const evaluation = await this.evaluateRuleConditions(rule, userStats, eventData);

      // Update progress tracking
      await this.updateProgressTracking(userId, rule.$id!, evaluation);

      // Award if conditions are met
      if (evaluation.meetsConditions) {
        const achievement = await this.awardAchievement(
          userId,
          rule,
          existingAchievement,
          evaluation,
          triggerEvent,
          eventData
        );

        return {
          awarded: true,
          reason: evaluation.reason,
          achievement,
          progressUpdated: true,
        };
      }

      return {
        awarded: false,
        reason: evaluation.reason,
        progressUpdated: true,
      };
    } catch (error) {
      console.error('Error checking single rule:', error);
      return {
        awarded: false,
        reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Evaluate rule conditions against user stats
   */
  static async evaluateRuleConditions(
    rule: RewardRule,
    userStats: UserStats,
    eventData?: Record<string, unknown>
  ): Promise<RuleEvaluationResult> {
    const { conditions, ruleType } = rule;

    switch (ruleType) {
      case 'milestone':
        return this.evaluateMilestoneConditions(conditions, userStats);

      case 'action':
        return this.evaluateActionConditions(conditions, userStats, eventData);

      case 'time_based':
        return this.evaluateTimeBasedConditions(conditions, userStats);

      case 'combination':
        return this.evaluateCombinationConditions(conditions, userStats, eventData);

      case 'custom':
        return this.evaluateCustomConditions(conditions, userStats, eventData);

      default:
        return {
          meetsConditions: false,
          reason: `Unsupported rule type: ${ruleType}`,
          currentValue: 0,
          targetValue: 1,
          progress: 0,
        };
    }
  }

  /**
   * Evaluate milestone conditions (numeric thresholds)
   */
  private static evaluateMilestoneConditions(
    conditions: Condition,
    userStats: UserStats
  ): RuleEvaluationResult {
    if (!conditions.metric || !conditions.operator || conditions.value === undefined) {
      return {
        meetsConditions: false,
        reason: 'Invalid milestone conditions',
        currentValue: 0,
        targetValue: 1,
        progress: 0,
      };
    }

    const currentValue = (userStats[conditions.metric as keyof UserStats] as number) || 0;
    const targetValue = conditions.value;
    const operator = conditions.operator;

    let meetsConditions = false;
    switch (operator) {
      case '>=':
        meetsConditions = currentValue >= targetValue;
        break;
      case '<=':
        meetsConditions = currentValue <= targetValue;
        break;
      case '==':
        meetsConditions = currentValue === targetValue;
        break;
      case '!=':
        meetsConditions = currentValue !== targetValue;
        break;
      case '>':
        meetsConditions = currentValue > targetValue;
        break;
      case '<':
        meetsConditions = currentValue < targetValue;
        break;
    }

    const progress =
      operator === '>=' || operator === '>'
        ? Math.min((currentValue / targetValue) * 100, 100)
        : meetsConditions
          ? 100
          : 0;

    return {
      meetsConditions,
      reason: meetsConditions
        ? `Milestone reached: ${conditions.metric} ${operator} ${targetValue} (current: ${currentValue})`
        : `Milestone not reached: ${currentValue} ${operator} ${targetValue}`,
      currentValue,
      targetValue,
      progress,
    };
  }

  /**
   * Evaluate action conditions (specific actions completed)
   */
  private static evaluateActionConditions(
    conditions: Condition,
    userStats: UserStats,
    eventData?: Record<string, unknown>
  ): RuleEvaluationResult {
    if (!conditions.actionType) {
      return {
        meetsConditions: false,
        reason: 'No action type specified',
        currentValue: 0,
        targetValue: 1,
        progress: 0,
      };
    }

    // This would be extended based on specific actions we want to track
    const actionType = conditions.actionType;
    let meetsConditions = false;
    let reason = `Action '${actionType}' not completed`;

    switch (actionType) {
      case 'profile_complete':
        // Check if profile is complete based on required fields
        if (conditions.requiredFields && eventData?.profile) {
          const profile = eventData.profile as Record<string, unknown>;
          const missingFields = conditions.requiredFields.filter(
            (field: string) => !profile[field]
          );
          meetsConditions = missingFields.length === 0;
          reason = meetsConditions
            ? 'Profile completed with all required fields'
            : `Missing required fields: ${missingFields.join(', ')}`;
        }
        break;

      case 'first_upload':
        meetsConditions =
          (userStats.totalSchematics || 0) >= 1 || (userStats.totalAddons || 0) >= 1;
        reason = meetsConditions ? 'First upload completed' : 'No uploads yet';
        break;

      case 'email_verified':
        meetsConditions = eventData?.emailVerified === true;
        reason = meetsConditions ? 'Email verified' : 'Email not verified';
        break;

      default:
        reason = `Unknown action type: ${actionType}`;
    }

    return {
      meetsConditions,
      reason,
      currentValue: meetsConditions ? 1 : 0,
      targetValue: 1,
      progress: meetsConditions ? 100 : 0,
    };
  }

  /**
   * Evaluate time-based conditions (streaks, durations)
   */
  private static evaluateTimeBasedConditions(
    conditions: Condition,
    userStats: UserStats
  ): RuleEvaluationResult {
    if (!conditions.metric || conditions.value === undefined) {
      return {
        meetsConditions: false,
        reason: 'Invalid time-based conditions',
        currentValue: 0,
        targetValue: 1,
        progress: 0,
      };
    }

    const currentValue = (userStats[conditions.metric as keyof UserStats] as number) || 0;
    const targetValue = conditions.value;

    let meetsConditions = false;
    let reason = '';

    if (conditions.requiresStreak && conditions.metric === 'consecutiveLoginDays') {
      meetsConditions = currentValue >= targetValue;
      reason = meetsConditions
        ? `Login streak requirement met: ${currentValue}/${targetValue} days`
        : `Login streak progress: ${currentValue}/${targetValue} days`;
    } else {
      meetsConditions = currentValue >= targetValue;
      reason = meetsConditions
        ? `Time-based requirement met: ${conditions.metric} >= ${targetValue}`
        : `Time-based progress: ${currentValue}/${targetValue}`;
    }

    const progress = Math.min((currentValue / targetValue) * 100, 100);

    return {
      meetsConditions,
      reason,
      currentValue,
      targetValue,
      progress,
    };
  }

  /**
   * Evaluate combination conditions (AND/OR logic)
   */
  private static async evaluateCombinationConditions(
    conditions: Condition,
    userStats: UserStats,
    eventData?: Record<string, unknown>
  ): Promise<RuleEvaluationResult> {
    if (!conditions.subconditions || conditions.subconditions.length === 0) {
      return {
        meetsConditions: false,
        reason: 'No subconditions defined',
        currentValue: 0,
        targetValue: 1,
        progress: 0,
      };
    }

    const logic = conditions.logic || 'AND';
    let overallMet = logic === 'AND';
    const results: RuleEvaluationResult[] = [];

    // Evaluate each subcondition
    for (const subcondition of conditions.subconditions) {
      let result: RuleEvaluationResult;

      if (subcondition.metric) {
        result = this.evaluateMilestoneConditions(subcondition, userStats);
      } else if (subcondition.actionType) {
        result = this.evaluateActionConditions(subcondition, userStats, eventData);
      } else {
        result = {
          meetsConditions: false,
          reason: 'Invalid subcondition',
          currentValue: 0,
          targetValue: 1,
          progress: 0,
        };
      }

      results.push(result);

      if (logic === 'AND') {
        overallMet = overallMet && result.meetsConditions;
      } else {
        // OR
        overallMet = overallMet || result.meetsConditions;
      }
    }

    const avgProgress = results.reduce((sum, r) => sum + r.progress, 0) / results.length;
    const reasons = results.map((r) => r.reason);

    return {
      meetsConditions: overallMet,
      reason: `${logic} logic: ${reasons.join('; ')}`,
      currentValue: results.reduce((sum, r) => sum + r.currentValue, 0),
      targetValue: results.reduce((sum, r) => sum + r.targetValue, 0),
      progress: logic === 'AND' ? Math.min(...results.map((r) => r.progress)) : avgProgress,
    };
  }

  /**
   * Evaluate custom conditions (for future complex logic)
   */
  private static evaluateCustomConditions(
    _conditions: Condition,
    _userStats: UserStats,
    _eventData?: Record<string, unknown>
  ): RuleEvaluationResult {
    // This would be implemented for custom logic requirements
    return {
      meetsConditions: false,
      reason: 'Custom conditions not implemented',
      currentValue: 0,
      targetValue: 1,
      progress: 0,
    };
  }

  /**
   * Award achievement to user
   */
  private static async awardAchievement(
    userId: string,
    rule: RewardRule,
    existingAchievement: UserAchievement | null,
    evaluation: RuleEvaluationResult,
    triggerEvent?: string,
    eventData?: Record<string, unknown>
  ): Promise<UserAchievement> {
    const now = new Date().toISOString();
    const lockKey = `${userId}-${rule.$id}`;

    // Additional check to prevent duplicate awards
    const lastAward = this.recentAwards.get(lockKey);
    if (lastAward && Date.now() - lastAward < 5000) {
      console.log(`Preventing duplicate award for ${lockKey} - too recent`);
      // Return the existing achievement or a placeholder
      if (existingAchievement) return existingAchievement;
      throw new Error('Duplicate award prevented');
    }

    if (existingAchievement && rule.isRepeatable) {
      // Update existing repeatable achievement
      const updatedAchievement = await databases.updateDocument(
        DATABASE_ID,
        USER_ACHIEVEMENTS_COLLECTION_ID,
        existingAchievement.$id!,
        {
          timesEarned: (existingAchievement.timesEarned || 0) + 1,
          completedAt: now,
          isNew: true,
          metadata: JSON.stringify({
            triggerEvent,
            bonusData: eventData,
          }),
        }
      );
      // Parse the document before validating
      const parsedUpdatedAchievement = { ...updatedAchievement };
      if (typeof parsedUpdatedAchievement.metadata === 'string') {
        try {
          parsedUpdatedAchievement.metadata = JSON.parse(parsedUpdatedAchievement.metadata);
        } catch {
          // Keep as string if parsing fails
        }
      }
      return UserAchievementSchema.parse(parsedUpdatedAchievement) as UserAchievement;
    } else {
      // Create new achievement with duplicate check
      try {
        // Final check before creating to prevent race conditions
        const finalCheck = await databases.listDocuments(
          DATABASE_ID,
          USER_ACHIEVEMENTS_COLLECTION_ID,
          [Query.equal('userId', userId), Query.equal('ruleId', rule.$id!), Query.limit(1)]
        );

        if (finalCheck.documents.length > 0 && !rule.isRepeatable) {
          console.log(`Achievement already exists for ${lockKey}, skipping creation`);
          return UserAchievementSchema.parse(finalCheck.documents[0]) as UserAchievement;
        }

        // Mark as recently awarded
        this.recentAwards.set(lockKey, Date.now());

        // Clean up old entries after 10 seconds
        setTimeout(() => {
          this.recentAwards.delete(lockKey);
        }, 10000);

        const achievement = {
          userId,
          badgeId: rule.badgeId,
          ruleId: rule.$id!,
          awardedAt: now,
          awardedBy: 'system',
          reason: evaluation.reason,
          progress: evaluation.progress,
          progressCurrent: String(evaluation.currentValue),
          progressMax: String(evaluation.targetValue),
          progressText: `${evaluation.currentValue} / ${evaluation.targetValue}`,
          timesEarned: 1,
          isCompleted: true,
          completedAt: now,
          metadata: JSON.stringify({
            triggerEvent,
            bonusData: eventData,
          }),
          isNew: true,
          isPinned: false,
        };

        const newAchievement = await databases.createDocument(
          DATABASE_ID,
          USER_ACHIEVEMENTS_COLLECTION_ID,
          ID.unique(),
          achievement
        );
        // Parse the document before validating
        const parsedAchievement = { ...newAchievement };
        if (typeof parsedAchievement.metadata === 'string') {
          try {
            parsedAchievement.metadata = JSON.parse(parsedAchievement.metadata);
          } catch {
            // Keep as string if parsing fails
          }
        }
        return UserAchievementSchema.parse(parsedAchievement) as UserAchievement;
      } catch (error) {
        console.error('Error creating achievement:', error);
        throw error;
      }
    }
  }

  /**
   * Update progress tracking for a rule
   */
  private static async updateProgressTracking(
    userId: string,
    ruleId: string,
    evaluation: RuleEvaluationResult
  ): Promise<void> {
    try {
      // Check if progress tracking exists
      const existingResponse = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENT_PROGRESS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.equal('ruleId', ruleId), Query.limit(1)]
      );

      const now = new Date().toISOString();
      const percentage = Math.min(
        Math.round((evaluation.currentValue / evaluation.targetValue) * 100),
        100
      );

      if (existingResponse.documents.length > 0) {
        // Update existing progress only if values have changed
        const existing = existingResponse.documents[0];
        if (
          existing.currentValue !== evaluation.currentValue ||
          existing.targetValue !== evaluation.targetValue
        ) {
          await databases.updateDocument(
            DATABASE_ID,
            ACHIEVEMENT_PROGRESS_COLLECTION_ID,
            existing.$id,
            {
              currentValue: evaluation.currentValue,
              targetValue: evaluation.targetValue,
              percentage: percentage,
              lastUpdatedAt: now,
            }
          );
        }
      } else {
        // Create new progress tracking
        const progress = {
          userId,
          ruleId,
          currentValue: evaluation.currentValue,
          targetValue: evaluation.targetValue,
          percentage: percentage,
          lastUpdatedAt: now,
        };

        await databases.createDocument(
          DATABASE_ID,
          ACHIEVEMENT_PROGRESS_COLLECTION_ID,
          ID.unique(),
          progress
        );
      }
    } catch (error) {
      console.error('Error updating progress tracking:', error);
    }
  }

  /**
   * Helper methods
   */
  private static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, USER_STATS_COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return null;
      }

      return UserStatsSchema.parse(response.documents[0]) as UserStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  private static async getExistingAchievement(
    userId: string,
    ruleId: string
  ): Promise<UserAchievement | null> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, USER_ACHIEVEMENTS_COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.equal('ruleId', ruleId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return null;
      }

      return UserAchievementSchema.parse(response.documents[0]) as UserAchievement;
    } catch (error) {
      console.error('Error fetching existing achievement:', error);
      return null;
    }
  }

  // Processing locks to prevent duplicate awards in Strict Mode
  private static processingLocks = new Map<string, boolean>();
  private static recentAwards = new Map<string, number>();

  private static async getExistingAchievementWithLock(
    userId: string,
    ruleId: string
  ): Promise<UserAchievement | null> {
    const lockKey = `${userId}-${ruleId}`;

    // Check if we're already processing this achievement
    if (this.processingLocks.get(lockKey)) {
      console.log(`Already processing achievement for ${lockKey}, skipping duplicate check`);
      // Return a fake achievement to prevent duplicate processing
      return {
        userId,
        badgeId: '',
        ruleId,
        awardedAt: new Date().toISOString(),
        timesEarned: 1,
      } as UserAchievement;
    }

    // Check if we recently awarded this (within 5 seconds)
    const lastAward = this.recentAwards.get(lockKey);
    if (lastAward && Date.now() - lastAward < 5000) {
      console.log(`Recently awarded achievement for ${lockKey}, preventing duplicate`);
      return {
        userId,
        badgeId: '',
        ruleId,
        awardedAt: new Date().toISOString(),
        timesEarned: 1,
      } as UserAchievement;
    }

    // Set the lock
    this.processingLocks.set(lockKey, true);

    try {
      // Double-check the database for existing achievement
      const response = await databases.listDocuments(DATABASE_ID, USER_ACHIEVEMENTS_COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.equal('ruleId', ruleId),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        return null;
      }

      return UserAchievementSchema.parse(response.documents[0]) as UserAchievement;
    } catch (error) {
      console.error('Error fetching existing achievement:', error);
      return null;
    } finally {
      // Release the lock after a short delay
      setTimeout(() => {
        this.processingLocks.delete(lockKey);
      }, 1000);
    }
  }

  private static checkCooldown(
    achievement: UserAchievement,
    cooldownDays: number
  ): { canEarn: boolean; nextAvailableDate?: string } {
    if (cooldownDays === 0) {
      return { canEarn: true };
    }

    const lastEarned = new Date(achievement.lastEarnedAt || achievement.awardedAt);
    const cooldownEnd = new Date(lastEarned);
    cooldownEnd.setDate(cooldownEnd.getDate() + cooldownDays);

    const canEarn = new Date() >= cooldownEnd;
    return {
      canEarn,
      nextAvailableDate: canEarn ? undefined : cooldownEnd.toISOString(),
    };
  }

  private static filterRulesForEvent(rules: RewardRule[], eventType: string): RewardRule[] {
    // Filter rules that might be relevant to the event
    return rules.filter((rule) => {
      switch (eventType) {
        case 'login':
          return (
            rule.conditions.metric?.includes('login') ||
            rule.conditions.metric === 'consecutiveLoginDays' ||
            rule.conditions.actionType?.includes('login')
          );

        case 'upload':
          return (
            rule.conditions.metric?.includes('Schematics') ||
            rule.conditions.metric?.includes('Addons') ||
            rule.conditions.actionType?.includes('upload')
          );

        case 'download':
          return (
            rule.conditions.metric?.includes('download') ||
            rule.conditions.metric?.includes('Downloads')
          );

        case 'like':
          return rule.conditions.metric?.includes('likes');

        case 'follow':
          return (
            rule.conditions.metric?.includes('followers') ||
            rule.conditions.metric?.includes('Following')
          );

        default:
          return true; // Check all rules if event type is unknown
      }
    });
  }
}

// Export convenience functions
export const checkAllAchievements = RewardRulesEngine.checkAllAchievements;
export const checkAchievementsForEvent = RewardRulesEngine.checkAchievementsForEvent;
export const checkSingleRule = RewardRulesEngine.checkSingleRule;
