import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '@/config/appwrite';
import { ID, Query } from 'appwrite';
import {
  RewardRuleSchema,
  type RewardRule,
  type CreateRewardRule,
  type UpdateRewardRule,
  type RuleTest,
  type RuleTestResult,
} from '@/schemas/rewardRule.schema';
import { UserStatsSchema, type UserStats } from '@/schemas/userStats.schema';
import { toast } from 'sonner';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'reward_rules_new';
const USER_STATS_COLLECTION_ID = 'user_stats';

export const useRewardRules = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: ['rewardRules', activeOnly],
    queryFn: async () => {
      const queries = [Query.orderAsc('priority'), Query.limit(100)];
      if (activeOnly) {
        queries.push(Query.equal('isActive', true));
      }

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
      return response.documents.map((doc) => {
        // Parse conditions JSON string back to object
        const parsedDoc = { ...doc };
        if (typeof parsedDoc.conditions === 'string') {
          try {
            parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
          } catch (error) {
            console.error('Error parsing conditions:', error);
            parsedDoc.conditions = {};
          }
        }
        return RewardRuleSchema.parse(parsedDoc);
      }) as RewardRule[];
    },
  });
};

export const useRewardRule = (ruleId: string) => {
  return useQuery({
    queryKey: ['rewardRule', ruleId],
    queryFn: async () => {
      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, ruleId);
      // Parse conditions JSON string back to object
      const parsedDoc = { ...response };
      if (typeof parsedDoc.conditions === 'string') {
        try {
          parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
        } catch (error) {
          console.error('Error parsing conditions:', error);
          parsedDoc.conditions = {};
        }
      }
      return RewardRuleSchema.parse(parsedDoc) as RewardRule;
    },
    enabled: !!ruleId,
  });
};

export const useCreateRewardRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: CreateRewardRule) => {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        rule
      );
      // Parse conditions JSON string back to object
      const parsedDoc = { ...response };
      if (typeof parsedDoc.conditions === 'string') {
        try {
          parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
        } catch (error) {
          console.error('Error parsing conditions:', error);
          parsedDoc.conditions = {};
        }
      }
      return RewardRuleSchema.parse(parsedDoc) as RewardRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardRules'] });
      toast.success('Reward rule created successfully!');
    },
    onError: (error) => {
      console.error('Error creating reward rule:', error);
      toast.error('Failed to create reward rule');
    },
  });
};

export const useUpdateRewardRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ruleId, rule }: { ruleId: string; rule: UpdateRewardRule }) => {
      const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, ruleId, rule);
      // Parse conditions JSON string back to object
      const parsedDoc = { ...response };
      if (typeof parsedDoc.conditions === 'string') {
        try {
          parsedDoc.conditions = JSON.parse(parsedDoc.conditions);
        } catch (error) {
          console.error('Error parsing conditions:', error);
          parsedDoc.conditions = {};
        }
      }
      return RewardRuleSchema.parse(parsedDoc) as RewardRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardRules'] });
      toast.success('Reward rule updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating reward rule:', error);
      toast.error('Failed to update reward rule');
    },
  });
};

export const useDeleteRewardRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, ruleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardRules'] });
      toast.success('Reward rule deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting reward rule:', error);
      toast.error('Failed to delete reward rule');
    },
  });
};

export const useTestRewardRule = () => {
  return useMutation({
    mutationFn: async ({ ruleId, userId }: RuleTest): Promise<RuleTestResult> => {
      // Fetch the rule
      const rule = await databases.getDocument(DATABASE_ID, COLLECTION_ID, ruleId);
      const parsedRule = RewardRuleSchema.parse(rule) as RewardRule;

      // Fetch user stats
      const statsResponse = await databases.listDocuments(DATABASE_ID, USER_STATS_COLLECTION_ID, [
        Query.equal('userId', userId),
        Query.limit(1),
      ]);

      if (statsResponse.documents.length === 0) {
        return {
          wouldAward: false,
          reason: 'User stats not found',
          currentProgress: 0,
          targetValue: 1,
          meetsConditions: false,
          canEarnAgain: false,
        };
      }

      const userStats = UserStatsSchema.parse(statsResponse.documents[0]) as UserStats;

      // Check if user already has this achievement
      const achievementResponse = await databases.listDocuments(DATABASE_ID, 'user_achievements', [
        Query.equal('userId', userId),
        Query.equal('ruleId', ruleId),
        Query.limit(1),
      ]);

      const hasAchievement = achievementResponse.documents.length > 0;
      const achievement = hasAchievement ? achievementResponse.documents[0] : null;

      // Evaluate the rule conditions
      const evaluation = await evaluateRuleConditions(parsedRule, userStats);

      // Check if can earn again (for repeatable achievements)
      let canEarnAgain = true;
      let nextAvailableDate: string | undefined;

      if (hasAchievement && !parsedRule.isRepeatable) {
        canEarnAgain = false;
      } else if (hasAchievement && parsedRule.isRepeatable && parsedRule.cooldownDays > 0) {
        const lastEarned = achievement?.lastEarnedAt || achievement?.awardedAt;
        if (lastEarned) {
          const cooldownEnd = new Date(lastEarned);
          cooldownEnd.setDate(cooldownEnd.getDate() + parsedRule.cooldownDays);
          if (new Date() < cooldownEnd) {
            canEarnAgain = false;
            nextAvailableDate = cooldownEnd.toISOString();
          }
        }
      }

      // Check max awards limit
      if (hasAchievement && parsedRule.maxAwards > 1) {
        const timesEarned = achievement?.timesEarned || 1;
        if (timesEarned >= parsedRule.maxAwards) {
          canEarnAgain = false;
        }
      }

      const wouldAward = evaluation.meetsConditions && canEarnAgain && !parsedRule.testMode;

      return {
        wouldAward,
        reason: evaluation.reason,
        currentProgress: evaluation.currentValue,
        targetValue: evaluation.targetValue,
        meetsConditions: evaluation.meetsConditions,
        canEarnAgain,
        nextAvailableDate,
      };
    },
    onError: (error) => {
      console.error('Error testing reward rule:', error);
      toast.error('Failed to test reward rule');
    },
  });
};

// Helper function to evaluate rule conditions
async function evaluateRuleConditions(rule: RewardRule, userStats: UserStats) {
  const { conditions, ruleType } = rule;

  switch (ruleType) {
    case 'milestone': {
      if (!conditions.metric || !conditions.operator || conditions.value === undefined) {
        return {
          meetsConditions: false,
          reason: 'Invalid milestone conditions',
          currentValue: 0,
          targetValue: 1,
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

      return {
        meetsConditions,
        reason: meetsConditions
          ? `Condition met: ${conditions.metric} ${operator} ${targetValue}`
          : `Condition not met: ${currentValue} ${operator} ${targetValue}`,
        currentValue,
        targetValue,
      };
    }

    case 'action': {
      // For action rules, we'd need to implement specific action checking
      // This would depend on what actions we're tracking
      return {
        meetsConditions: false,
        reason: 'Action rule evaluation not implemented',
        currentValue: 0,
        targetValue: 1,
      };
    }

    case 'time_based': {
      if (!conditions.metric || !conditions.operator || conditions.value === undefined) {
        return {
          meetsConditions: false,
          reason: 'Invalid time-based conditions',
          currentValue: 0,
          targetValue: 1,
        };
      }

      const currentValue = (userStats[conditions.metric as keyof UserStats] as number) || 0;
      const targetValue = conditions.value;
      const meetsConditions = currentValue >= targetValue;

      return {
        meetsConditions,
        reason: meetsConditions
          ? `Time-based condition met: ${conditions.metric} >= ${targetValue}`
          : `Time-based condition not met: ${currentValue} < ${targetValue}`,
        currentValue,
        targetValue,
      };
    }

    case 'combination': {
      if (!conditions.subconditions || conditions.subconditions.length === 0) {
        return {
          meetsConditions: false,
          reason: 'No subconditions defined',
          currentValue: 0,
          targetValue: 1,
        };
      }

      const logic = conditions.logic || 'AND';
      let overallMet = logic === 'AND';
      const results: string[] = [];

      for (const subcondition of conditions.subconditions) {
        const subRule: RewardRule = {
          ...rule,
          conditions: subcondition,
          ruleType: subcondition.metric ? 'milestone' : 'action',
        };

        const subResult = await evaluateRuleConditions(subRule, userStats);
        results.push(subResult.reason);

        if (logic === 'AND') {
          overallMet = overallMet && subResult.meetsConditions;
        } else {
          // OR
          overallMet = overallMet || subResult.meetsConditions;
        }
      }

      return {
        meetsConditions: overallMet,
        reason: `${logic} logic: ${results.join('; ')}`,
        currentValue: 0,
        targetValue: 1,
      };
    }

    default:
      return {
        meetsConditions: false,
        reason: `Unsupported rule type: ${ruleType}`,
        currentValue: 0,
        targetValue: 1,
      };
  }
}
