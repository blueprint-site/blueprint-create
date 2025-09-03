import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Shield, Target, Zap } from 'lucide-react';
import { useUserStats } from '@/api/appwrite/useUserStats';
import { useUserStore } from '@/api/stores/userStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserAchievements } from '@/api/appwrite/useUserAchievements';
import { useBadges } from '@/api/appwrite/useBadges';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AchievementService } from '@/api/services/achievementService';
import { useRewardRules } from '@/api/appwrite/useRewardRules';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAchievementProgress } from '@/api/appwrite/useAchievementProgress';

export const ProfileRewardsTab: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const { data: stats, isLoading: statsLoading } = useUserStats(user?.$id || '');
  const {
    data: achievements,
    isLoading: achievementsLoading,
    refetch: refetchAchievements,
  } = useUserAchievements(user?.$id);
  const { data: badges, isLoading: badgesLoading } = useBadges();
  const { data: rules, isLoading: rulesLoading } = useRewardRules();
  const { data: progress, isLoading: progressLoading } = useUserAchievementProgress();
  const [isCheckingAchievements, setIsCheckingAchievements] = React.useState(false);

  const isLoading =
    statsLoading || achievementsLoading || badgesLoading || rulesLoading || progressLoading;

  // User achievements are already filtered by userId in the hook
  const userAchievements = useMemo(() => {
    if (!achievements) return [];
    return achievements;
  }, [achievements]);

  // Get badge info for each achievement
  const achievementWithBadges = useMemo(() => {
    if (!userAchievements || !badges) return [];
    console.log('User achievements:', userAchievements);
    console.log('Badges:', badges);
    return userAchievements.map((achievement) => {
      const badge = badges.find((b) => b.$id === achievement.badgeId);
      if (!badge && achievement.badgeId) {
        console.warn(
          `Badge not found for achievement ${achievement.$id} with badgeId ${achievement.badgeId}`
        );
      }
      return {
        ...achievement,
        badge,
      };
    }); // Temporarily removed filter to see all achievements
    // }).filter(a => a.badge); // Only show achievements with valid badges
  }, [userAchievements, badges]);

  // Get available achievements (rules not yet earned)
  const availableAchievements = useMemo(() => {
    if (!rules || !badges) return [];

    console.log('Rules:', rules);
    console.log('Badges for rules:', badges);

    const earnedRuleIds = userAchievements?.map((a) => a.ruleId).filter(Boolean) || [];
    const activeRules = rules.filter(
      (rule) =>
        rule.isActive && !rule.testMode && (!earnedRuleIds.includes(rule.$id) || rule.isRepeatable)
    );

    console.log('Active rules:', activeRules);

    return activeRules.map((rule) => {
      const badge = badges.find((b) => b.$id === rule.badgeId);
      if (!badge && rule.badgeId) {
        console.warn(`Badge not found for rule ${rule.$id} with badgeId ${rule.badgeId}`);
      }
      const progressData = progress?.find((p) => p.ruleId === rule.$id);
      return {
        ...rule,
        badge,
        isEarned: earnedRuleIds.includes(rule.$id),
        progress: progressData,
      };
    }); // Temporarily removed filter to see all rules
    // }).filter(a => a.badge);
  }, [rules, badges, userAchievements, progress]);

  const handleCheckAchievements = async () => {
    if (!user?.$id || isCheckingAchievements) return;

    setIsCheckingAchievements(true);
    try {
      await AchievementService.runFullAchievementCheck(user.$id);
      toast.success('Achievement check complete!');
      // Refetch achievements after a short delay to ensure database updates are complete
      setTimeout(() => {
        refetchAchievements();
      }, 1000);
    } catch (error) {
      toast.error('Failed to check achievements');
      console.error('Achievement check error:', error);
    } finally {
      // Prevent re-checking for 3 seconds
      setTimeout(() => {
        setIsCheckingAchievements(false);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className='h-24' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>No rewards data available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='earned' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='earned'>Earned Badges</TabsTrigger>
          <TabsTrigger value='available'>Available Badges</TabsTrigger>
        </TabsList>

        <TabsContent value='earned' className='mt-6'>
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Earned Badges
                </CardTitle>
                <Button
                  onClick={handleCheckAchievements}
                  variant='outline'
                  size='sm'
                  disabled={isCheckingAchievements}
                >
                  <Target className='mr-2 h-4 w-4' />
                  {isCheckingAchievements ? 'Checking...' : 'Check Progress'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {achievementWithBadges.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {achievementWithBadges.map((achievement) => (
                    <div key={achievement.$id} className='relative'>
                      {achievement.isNew && (
                        <Badge className='absolute -top-2 -right-2 z-10' variant='destructive'>
                          NEW
                        </Badge>
                      )}
                      <div
                        className={`rounded-lg border-2 p-4 transition-all ${
                          achievement.badge?.tier === 'legendary'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                            : achievement.badge?.tier === 'epic'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                              : achievement.badge?.tier === 'rare'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-300 bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          {achievement.badge?.iconUrl ? (
                            <img
                              src={achievement.badge.iconUrl}
                              alt={achievement.badge.name}
                              className='h-12 w-12 rounded-full object-cover'
                            />
                          ) : (
                            <div className='bg-primary/10 rounded-full p-2'>
                              <Trophy className='text-primary h-8 w-8' />
                            </div>
                          )}
                          <div className='flex-1'>
                            <h3 className='text-sm font-semibold'>
                              {achievement.badge?.name ||
                                `Achievement ${achievement.$id?.substring(0, 8)}`}
                            </h3>
                            <p className='text-muted-foreground mt-1 text-sm'>
                              {achievement.badge?.description ||
                                'Badge not found - ID: ' + achievement.badgeId}
                            </p>
                            {achievement.reason && (
                              <p className='text-muted-foreground mt-2 text-xs italic'>
                                {achievement.reason}
                              </p>
                            )}
                            <div className='mt-2 flex items-center gap-2'>
                              <Badge variant='outline' className='text-xs'>
                                {achievement.badge?.tier || 'common'}
                              </Badge>
                              {achievement.timesEarned && achievement.timesEarned > 1 && (
                                <Badge variant='secondary' className='text-xs'>
                                  ×{achievement.timesEarned}
                                </Badge>
                              )}
                            </div>
                            <p className='text-muted-foreground mt-2 text-xs'>
                              Earned {new Date(achievement.awardedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center'>
                  <Trophy className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>No badges earned yet</p>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    Complete challenges to earn badges!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='available' className='mt-6'>
          {/* Available Badges */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                Available Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableAchievements.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {availableAchievements.map((rule) => (
                    <div key={rule.$id} className='relative'>
                      {rule.isEarned && (
                        <Badge className='absolute -top-2 -right-2 z-10' variant='outline'>
                          REPEATABLE
                        </Badge>
                      )}
                      <div
                        className={`rounded-lg border-2 p-4 transition-all ${
                          rule.badge?.tier === 'legendary'
                            ? 'border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/50'
                            : rule.badge?.tier === 'epic'
                              ? 'border-purple-300 bg-purple-50/50 dark:bg-purple-950/50'
                              : rule.badge?.tier === 'rare'
                                ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/50'
                                : 'border-gray-200 bg-gray-50/50 dark:bg-gray-900/50'
                        } opacity-80 hover:opacity-100`}
                      >
                        <div className='flex items-start gap-3'>
                          {rule.badge?.iconUrl ? (
                            <img
                              src={rule.badge.iconUrl}
                              alt={rule.badge.name}
                              className='h-12 w-12 rounded-full object-cover'
                            />
                          ) : (
                            <div className='bg-primary/10 rounded-full p-2'>
                              <Trophy className='text-primary h-8 w-8' />
                            </div>
                          )}
                          <div className='flex-1'>
                            <h3 className='text-sm font-semibold'>
                              {rule.badge?.name || rule.name || 'Unknown Badge'}
                            </h3>
                            <p className='text-muted-foreground mt-1 text-sm'>
                              {rule.badge?.description ||
                                rule.description ||
                                'Badge ID: ' + rule.badgeId}
                            </p>
                            <div className='mt-3 flex items-center gap-2'>
                              <Badge variant='outline' className='text-xs'>
                                {rule.badge?.tier || 'common'}
                              </Badge>
                              <Badge variant='outline' className='text-xs'>
                                {rule.ruleType.replace('_', ' ')}
                              </Badge>
                              {rule.isRepeatable && (
                                <Badge variant='secondary' className='text-xs'>
                                  Repeatable
                                </Badge>
                              )}
                            </div>
                            {rule.progressVisible && (
                              <div className='mt-3'>
                                <div className='text-muted-foreground mb-1 flex justify-between text-xs'>
                                  <span>Progress</span>
                                  <span>
                                    {rule.progress
                                      ? `${rule.progress.currentValue} / ${rule.progress.targetValue}`
                                      : 'Not started'}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    rule.progress
                                      ? (rule.progress.currentValue / rule.progress.targetValue) *
                                        100
                                      : 0
                                  }
                                  className='h-2'
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center'>
                  <Zap className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>All badges have been earned!</p>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    Check back later for new challenges.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Badges Earned</span>
              <span className='font-semibold'>
                {achievementWithBadges.length} / {badges?.length || 0}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Available Challenges</span>
              <span className='font-semibold'>
                {availableAchievements.filter((a) => !a.isEarned).length}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Total Downloads Received</span>
              <span className='font-semibold'>{stats.totalDownloadsReceived.toLocaleString()}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Current Rating</span>
              <span className='font-semibold'>{stats.averageRating.toFixed(1)} / 5.0</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Content Created</span>
              <span className='font-semibold'>
                {stats.totalSchematics + stats.totalAddons} items
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
