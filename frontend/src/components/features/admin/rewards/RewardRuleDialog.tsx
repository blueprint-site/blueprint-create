import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CreateRewardRuleSchema,
  type RewardRule,
  type RuleType,
  type Operator,
  type Timeframe,
  type Logic,
} from '@/schemas/rewardRule.schema';
import { useBadges } from '@/api/appwrite/useBadges';
import { useCreateRewardRule, useUpdateRewardRule } from '@/api/appwrite/useRewardRules';
import { useUserStore } from '@/api/stores/userStore';

interface RewardRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: RewardRule | null;
}

const RULE_TYPES: { value: RuleType; label: string; description: string }[] = [
  {
    value: 'milestone',
    label: 'Milestone',
    description: 'Triggered when a numeric threshold is reached',
  },
  {
    value: 'action',
    label: 'Action',
    description: 'Triggered by specific user actions',
  },
  {
    value: 'time_based',
    label: 'Time-Based',
    description: 'Triggered by time-related achievements (streaks, durations)',
  },
  {
    value: 'combination',
    label: 'Combination',
    description: 'Multiple conditions with AND/OR logic',
  },
];

const OPERATORS: { value: Operator; label: string }[] = [
  { value: '>=', label: 'Greater than or equal to (≥)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '==', label: 'Equal to (=)' },
  { value: '<=', label: 'Less than or equal to (≤)' },
  { value: '<', label: 'Less than (<)' },
  { value: '!=', label: 'Not equal to (≠)' },
];

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: 'all_time', label: 'All Time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
  { value: 'custom', label: 'Custom Date Range' },
];

const LOGIC_OPTIONS: { value: Logic; label: string }[] = [
  { value: 'AND', label: 'AND (All conditions must be met)' },
  { value: 'OR', label: 'OR (Any condition can be met)' },
];

// Available metrics from UserStats schema
const METRICS = [
  { value: 'totalLogins', label: 'Total Logins' },
  { value: 'consecutiveLoginDays', label: 'Consecutive Login Days' },
  { value: 'totalDaysActive', label: 'Total Days Active' },
  { value: 'totalSchematics', label: 'Total Schematics' },
  { value: 'totalAddons', label: 'Total Addons' },
  { value: 'totalDownloadsReceived', label: 'Total Downloads Received' },
  { value: 'totalDownloadsMade', label: 'Total Downloads Made' },
  { value: 'totalLikesReceived', label: 'Total Likes Received' },
  { value: 'totalLikesGiven', label: 'Total Likes Given' },
  { value: 'totalFollowers', label: 'Total Followers' },
  { value: 'totalFollowing', label: 'Total Following' },
  { value: 'averageRating', label: 'Average Rating' },
  { value: 'totalRatingsReceived', label: 'Total Ratings Received' },
  { value: 'featuredContentCount', label: 'Featured Content Count' },
];

const ACTION_TYPES = [
  { value: 'profile_complete', label: 'Profile Complete' },
  { value: 'email_verified', label: 'Email Verified' },
  { value: 'first_upload', label: 'First Upload' },
  { value: 'first_download', label: 'First Download' },
  { value: 'first_like', label: 'First Like' },
  { value: 'first_follow', label: 'First Follow' },
];

export const RewardRuleDialog: React.FC<RewardRuleDialogProps> = ({ isOpen, onClose, rule }) => {
  const { data: badges = [] } = useBadges();
  const createMutation = useCreateRewardRule();
  const updateMutation = useUpdateRewardRule();
  const user = useUserStore((state) => state.user);

  const form = useForm({
    resolver: zodResolver(CreateRewardRuleSchema),
    defaultValues: {
      name: '',
      description: '',
      badgeId: '',
      ruleType: 'milestone',
      conditions: {
        metric: '',
        operator: '>=',
        value: 1,
        timeframe: 'all_time',
      },
      priority: 10,
      isActive: true,
      isRepeatable: false,
      cooldownDays: 0,
      maxAwards: 1,
      isRetroactive: false,
      progressVisible: true,
      announcement: 'Congratulations! You earned a new badge!',
      createdBy: user?.$id || '',
      testMode: false,
    },
  });

  const ruleType = form.watch('ruleType');
  const isRepeatable = form.watch('isRepeatable');
  const timeframe = form.watch('conditions.timeframe');

  // Reset form when rule changes
  useEffect(() => {
    if (rule) {
      // Deserialize conditions string back to object
      let conditions = rule.conditions;
      if (typeof conditions === 'string') {
        try {
          conditions = JSON.parse(conditions);
        } catch (error) {
          console.error('Error parsing conditions:', error);
          conditions = {
            metric: '',
            operator: '>=',
            value: 1,
            timeframe: 'all_time',
          };
        }
      }

      form.reset({
        name: rule.name,
        description: rule.description,
        badgeId: rule.badgeId,
        ruleType: rule.ruleType,
        conditions: conditions,
        priority: rule.priority,
        isActive: rule.isActive,
        isRepeatable: rule.isRepeatable,
        cooldownDays: rule.cooldownDays,
        maxAwards: rule.maxAwards,
        isRetroactive: rule.isRetroactive,
        progressVisible: rule.progressVisible,
        announcement: rule.announcement,
        createdBy: rule.createdBy,
        testMode: rule.testMode,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        badgeId: '',
        ruleType: 'milestone',
        conditions: {
          metric: '',
          operator: '>=',
          value: 1,
          timeframe: 'all_time',
        },
        priority: 10,
        isActive: true,
        isRepeatable: false,
        cooldownDays: 0,
        maxAwards: 1,
        isRetroactive: false,
        progressVisible: true,
        announcement: 'Congratulations! You earned a new badge!',
        createdBy: user?.$id || '',
        testMode: false,
      });
    }
  }, [rule, form, user]);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      // Serialize conditions object to JSON string
      const processedData = {
        ...data,
        conditions:
          typeof data.conditions === 'object' ? JSON.stringify(data.conditions) : data.conditions,
      };

      if (rule) {
        await updateMutation.mutateAsync({
          ruleId: rule.$id!,
          rule: processedData,
        });
      } else {
        await createMutation.mutateAsync(processedData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Reward Rule' : 'Create New Reward Rule'}</DialogTitle>
          <DialogDescription>
            Configure conditions and settings for automatic badge awarding
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., First Upload Master' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='badgeId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge to Award</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a badge' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {badges.map((badge) => (
                              <SelectItem key={badge.$id} value={badge.$id!}>
                                <div className='flex items-center gap-2'>
                                  <div
                                    className='h-4 w-4 rounded-full'
                                    style={{ backgroundColor: badge.backgroundColor }}
                                  />
                                  {badge.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe what this rule does...'
                          className='min-h-[80px]'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='announcement'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement Announcement</FormLabel>
                      <FormControl>
                        <Input placeholder='Message shown when badge is earned' {...field} />
                      </FormControl>
                      <FormDescription>
                        This message will be displayed to users when they earn this badge
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Rule Type and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Rule Type and Conditions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='ruleType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RULE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className='font-medium'>{type.label}</div>
                                <div className='text-muted-foreground text-sm'>
                                  {type.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Milestone Conditions */}
                {ruleType === 'milestone' && (
                  <div className='space-y-4'>
                    <h4 className='font-medium'>Milestone Conditions</h4>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='conditions.metric'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Metric</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select metric' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {METRICS.map((metric) => (
                                  <SelectItem key={metric.value} value={metric.value}>
                                    {metric.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='conditions.operator'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Operator</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {OPERATORS.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='conditions.value'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Value</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min='0'
                                step='0.01'
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='conditions.timeframe'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeframe</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMEFRAMES.map((tf) => (
                                <SelectItem key={tf.value} value={tf.value}>
                                  {tf.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {timeframe === 'custom' && (
                      <div className='grid grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='conditions.startDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type='datetime-local' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='conditions.endDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type='datetime-local' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Action Conditions */}
                {ruleType === 'action' && (
                  <div className='space-y-4'>
                    <h4 className='font-medium'>Action Conditions</h4>
                    <FormField
                      control={form.control}
                      name='conditions.actionType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select action type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ACTION_TYPES.map((action) => (
                                <SelectItem key={action.value} value={action.value}>
                                  {action.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Time-based Conditions */}
                {ruleType === 'time_based' && (
                  <div className='space-y-4'>
                    <h4 className='font-medium'>Time-based Conditions</h4>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='conditions.metric'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Metric</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select metric' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {METRICS.filter(
                                  (m) =>
                                    m.value.includes('Days') ||
                                    m.value.includes('Login') ||
                                    m.value === 'totalDaysActive'
                                ).map((metric) => (
                                  <SelectItem key={metric.value} value={metric.value}>
                                    {metric.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='conditions.value'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (days)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min='1'
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='conditions.requiresStreak'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base'>Requires Streak</FormLabel>
                              <FormDescription>Must be consecutive</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Combination Logic */}
                {ruleType === 'combination' && (
                  <div className='space-y-4'>
                    <h4 className='font-medium'>Combination Logic</h4>
                    <FormField
                      control={form.control}
                      name='conditions.logic'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logic Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOGIC_OPTIONS.map((logic) => (
                                <SelectItem key={logic.value} value={logic.value}>
                                  {logic.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Note: Subconditions configuration requires advanced setup
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Configuration</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='priority'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='0'
                            max='1000'
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                          />
                        </FormControl>
                        <FormDescription>Lower numbers = higher priority (0-1000)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='maxAwards'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Awards</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='1'
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>Maximum times this badge can be earned</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isRepeatable && (
                    <FormField
                      control={form.control}
                      name='cooldownDays'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooldown (days)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='0'
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>Days to wait before earning again</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Active</FormLabel>
                          <FormDescription>Rule is enabled</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isRepeatable'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Repeatable</FormLabel>
                          <FormDescription>Can earn multiple times</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='progressVisible'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Show Progress</FormLabel>
                          <FormDescription>Users can see progress</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='testMode'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Test Mode</FormLabel>
                          <FormDescription>Will not award badges</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : rule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
