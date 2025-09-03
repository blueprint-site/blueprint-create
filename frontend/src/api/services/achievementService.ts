import { RewardRulesEngine } from './rewardRulesEngine';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import { toast } from 'sonner';
import type { RewardRule } from '@/schemas/rewardRule.schema';

const DATABASE_ID = 'main';

/**
 * Service for integrating achievement checks into user actions
 */
export class AchievementService {
  /**
   * Track user login and check for related achievements
   */
  static async trackUserLogin(userId: string): Promise<void> {
    try {
      // Check achievements for login event
      await RewardRulesEngine.checkAchievementsForEvent(userId, 'login');
    } catch (error) {
      console.error('Error tracking login achievements:', error);
    }
  }

  /**
   * Track content upload (schematic or addon) and check achievements
   */
  static async trackContentUpload(
    userId: string,
    contentType: 'schematic' | 'addon'
  ): Promise<void> {
    try {
      await RewardRulesEngine.checkAchievementsForEvent(userId, 'upload', {
        contentType,
      });
    } catch (error) {
      console.error('Error tracking upload achievements:', error);
    }
  }

  /**
   * Track content download and check achievements
   */
  static async trackContentDownload(
    downloaderId: string,
    contentOwnerId: string,
    contentId: string
  ): Promise<void> {
    try {
      // Check achievements for both downloader and content owner
      await Promise.all([
        RewardRulesEngine.checkAchievementsForEvent(downloaderId, 'download', {
          role: 'downloader',
          contentId,
        }),
        RewardRulesEngine.checkAchievementsForEvent(contentOwnerId, 'download', {
          role: 'content_owner',
          contentId,
          downloaderId,
        }),
      ]);
    } catch (error) {
      console.error('Error tracking download achievements:', error);
    }
  }

  /**
   * Track likes given/received and check achievements
   */
  static async trackLike(
    likerId: string,
    contentOwnerId: string,
    contentId: string
  ): Promise<void> {
    try {
      await Promise.all([
        RewardRulesEngine.checkAchievementsForEvent(likerId, 'like', {
          role: 'liker',
          contentId,
        }),
        RewardRulesEngine.checkAchievementsForEvent(contentOwnerId, 'like', {
          role: 'content_owner',
          contentId,
          likerId,
        }),
      ]);
    } catch (error) {
      console.error('Error tracking like achievements:', error);
    }
  }

  /**
   * Track follows and check achievements
   */
  static async trackFollow(followerId: string, followedUserId: string): Promise<void> {
    try {
      await Promise.all([
        RewardRulesEngine.checkAchievementsForEvent(followerId, 'follow', {
          role: 'follower',
          followedUserId,
        }),
        RewardRulesEngine.checkAchievementsForEvent(followedUserId, 'follow', {
          role: 'followed',
          followerId,
        }),
      ]);
    } catch (error) {
      console.error('Error tracking follow achievements:', error);
    }
  }

  /**
   * Track profile completion and check achievements
   */
  static async trackProfileCompletion(
    userId: string,
    profileData: Record<string, unknown>
  ): Promise<void> {
    try {
      await RewardRulesEngine.checkAchievementsForEvent(userId, 'profile_complete', {
        profile: profileData,
      });
    } catch (error) {
      console.error('Error tracking profile completion achievements:', error);
    }
  }

  /**
   * Track email verification and check achievements
   */
  static async trackEmailVerification(userId: string): Promise<void> {
    try {
      await RewardRulesEngine.checkAchievementsForEvent(userId, 'email_verified', {
        emailVerified: true,
      });
    } catch (error) {
      console.error('Error tracking email verification achievements:', error);
    }
  }

  /**
   * Run a comprehensive achievement check for a user
   * Should be called periodically or when major stats change
   */
  static async runFullAchievementCheck(userId: string): Promise<void> {
    try {
      await RewardRulesEngine.checkAllAchievements(userId);
    } catch (error) {
      console.error('Error running full achievement check:', error);
    }
  }

  /**
   * Process achievements for multiple users (batch processing)
   * Useful for retroactive rule application or scheduled processing
   */
  static async processBatchAchievements(userIds: string[]): Promise<void> {
    const batchSize = 10;

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (userId) => {
          try {
            await this.runFullAchievementCheck(userId);
            // Small delay to prevent overwhelming the database
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error processing achievements for user ${userId}:`, error);
          }
        })
      );

      // Longer delay between batches
      if (i + batchSize < userIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Apply a specific rule retroactively to all eligible users
   */
  static async applyRuleRetroactively(
    ruleId: string,
    fromDate?: string
  ): Promise<{ processed: number; awarded: number }> {
    try {
      // Get all users (or filter by date if needed)
      const usersResponse = await databases.listDocuments(DATABASE_ID, 'users', [
        Query.limit(1000),
        ...(fromDate ? [Query.greaterThanEqual('$createdAt', fromDate)] : []),
      ]);

      let processedCount = 0;
      let awardedCount = 0;

      // Get the rule
      const ruleDoc = await databases.getDocument(DATABASE_ID, 'reward_rules_new', ruleId);

      // Parse conditions JSON string back to object
      const parsedRule = { ...ruleDoc };
      if (typeof parsedRule.conditions === 'string') {
        try {
          parsedRule.conditions = JSON.parse(parsedRule.conditions);
        } catch (error) {
          console.error('Error parsing conditions in achievement service:', error);
          parsedRule.conditions = {};
        }
      }

      for (const user of usersResponse.documents) {
        try {
          const result = await RewardRulesEngine.checkSingleRule(
            user.$id,
            parsedRule as unknown as RewardRule
          );
          processedCount++;

          if (result.awarded) {
            awardedCount++;
          }

          // Small delay to prevent overloading
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Error applying rule to user ${user.$id}:`, error);
        }
      }

      toast.success(
        `Retroactive processing complete: ${awardedCount} badges awarded to ${processedCount} users`
      );

      return { processed: processedCount, awarded: awardedCount };
    } catch (error) {
      console.error('Error applying rule retroactively:', error);
      toast.error('Failed to apply rule retroactively');
      throw error;
    }
  }

  /**
   * Get achievement recommendations for a user
   * Returns badges that are close to being earned
   */
  static async getAchievementRecommendations(userId: string): Promise<
    Array<{
      ruleId: string;
      badgeId: string;
      badgeName: string;
      progress: number;
      target: number;
      percentage: number;
      suggestion: string;
    }>
  > {
    try {
      // Get all active rules
      const rulesResponse = await databases.listDocuments(DATABASE_ID, 'reward_rules_new', [
        Query.equal('isActive', true),
        Query.equal('progressVisible', true),
      ]);

      const recommendations = [];

      for (const ruleDoc of rulesResponse.documents) {
        // Parse conditions JSON string back to object
        const parsedRule = { ...ruleDoc };

        try {
          if (typeof parsedRule.conditions === 'string') {
            try {
              parsedRule.conditions = JSON.parse(parsedRule.conditions);
            } catch (error) {
              console.error('Error parsing conditions in recommendations:', error);
              parsedRule.conditions = {};
            }
          }

          const result = await RewardRulesEngine.checkSingleRule(
            userId,
            parsedRule as unknown as RewardRule
          );

          if (!result.awarded && result.progressUpdated) {
            // Get the rule's test result to see progress
            const testResult = await databases.listDocuments(DATABASE_ID, 'achievement_progress', [
              Query.equal('userId', userId),
              Query.equal('ruleId', parsedRule.$id),
              Query.limit(1),
            ]);

            if (testResult.documents.length > 0) {
              const progress = testResult.documents[0];
              const percentage = (progress.currentValue / progress.targetValue) * 100;

              // Only recommend if progress is significant (>25%)
              if (percentage >= 25 && percentage < 100) {
                const badge = await databases.getDocument(
                  DATABASE_ID,
                  'badges',
                  parsedRule.badgeId
                );

                recommendations.push({
                  ruleId: parsedRule.$id,
                  badgeId: parsedRule.badgeId,
                  badgeName: badge.name,
                  progress: progress.currentValue,
                  target: progress.targetValue,
                  percentage: Math.round(percentage),
                  suggestion: this.generateProgressSuggestion(
                    parsedRule as unknown as RewardRule,
                    progress as unknown as { currentValue: number; targetValue: number }
                  ),
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error getting recommendation for rule ${ruleDoc.$id}:`, error);
        }
      }

      return recommendations.sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error('Error getting achievement recommendations:', error);
      return [];
    }
  }

  /**
   * Generate a helpful suggestion for making progress on an achievement
   */
  private static generateProgressSuggestion(
    rule: RewardRule,
    progress: { currentValue: number; targetValue: number }
  ): string {
    const remaining = progress.targetValue - progress.currentValue;

    switch (rule.ruleType) {
      case 'milestone':
        if (rule.conditions.metric === 'totalSchematics') {
          return `Upload ${remaining} more schematic${remaining === 1 ? '' : 's'} to earn this badge`;
        } else if (rule.conditions.metric === 'totalDownloadsReceived') {
          return `Get ${remaining} more download${remaining === 1 ? '' : 's'} on your content to earn this badge`;
        } else if (rule.conditions.metric === 'totalFollowers') {
          return `Gain ${remaining} more follower${remaining === 1 ? '' : 's'} to earn this badge`;
        }
        return `Reach ${progress.targetValue} ${rule.conditions.metric} to earn this badge`;

      case 'time_based':
        if (rule.conditions.metric === 'consecutiveLoginDays') {
          return `Login for ${remaining} more consecutive day${remaining === 1 ? '' : 's'} to earn this badge`;
        }
        return `Continue for ${remaining} more day${remaining === 1 ? '' : 's'} to earn this badge`;

      default:
        return 'Continue your current progress to earn this badge';
    }
  }
}

// Export convenience functions
export const trackUserLogin = AchievementService.trackUserLogin;
export const trackContentUpload = AchievementService.trackContentUpload;
export const trackContentDownload = AchievementService.trackContentDownload;
export const trackLike = AchievementService.trackLike;
export const trackFollow = AchievementService.trackFollow;
export const trackProfileCompletion = AchievementService.trackProfileCompletion;
export const trackEmailVerification = AchievementService.trackEmailVerification;
export const runFullAchievementCheck = AchievementService.runFullAchievementCheck;
export const processBatchAchievements = AchievementService.processBatchAchievements;
export const applyRuleRetroactively = AchievementService.applyRuleRetroactively;
export const getAchievementRecommendations = AchievementService.getAchievementRecommendations;
