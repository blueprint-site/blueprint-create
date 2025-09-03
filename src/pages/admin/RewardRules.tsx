import { useState } from 'react';
import { Plus, TestTube, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRewardRules, useDeleteRewardRule, useUpdateRewardRule } from '@/api/appwrite/useRewardRules';
import { useBadges } from '@/api/appwrite/useBadges';
import { RewardRuleDialog } from '@/components/features/admin/rewards/RewardRuleDialog';
import { RuleTestDialog } from '@/components/features/admin/rewards/RuleTestDialog';
import { toast } from 'sonner';
import type { RewardRule } from '@/schemas/rewardRule.schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const RewardRules = () => {
  const [selectedRule, setSelectedRule] = useState<RewardRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  
  const { data: rules = [], isLoading: rulesLoading } = useRewardRules();
  const { data: badges = [] } = useBadges();
  const deleteRuleMutation = useDeleteRewardRule();
  const updateRuleMutation = useUpdateRewardRule();

  const getBadgeName = (badgeId: string) => {
    const badge = badges.find(b => b.$id === badgeId);
    return badge?.name || 'Unknown Badge';
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: RewardRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  const handleTestRule = (rule: RewardRule) => {
    setSelectedRule(rule);
    setIsTestDialogOpen(true);
  };

  const handleToggleActive = async (rule: RewardRule) => {
    try {
      await updateRuleMutation.mutateAsync({
        ruleId: rule.$id!,
        rule: { isActive: !rule.isActive },
      });
      toast.success(`Rule ${rule.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch {
      toast.error('Failed to update rule status');
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await deleteRuleMutation.mutateAsync(ruleId);
      setRuleToDelete(null);
    } catch {
      toast.error('Failed to delete rule');
    }
  };

  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case 'milestone':
        return 'bg-blue-100 text-blue-800';
      case 'action':
        return 'bg-green-100 text-green-800';
      case 'time_based':
        return 'bg-purple-100 text-purple-800';
      case 'combination':
        return 'bg-orange-100 text-orange-800';
      case 'custom':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (rulesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading reward rules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reward Rules</h1>
          <p className="text-muted-foreground">
            Manage dynamic badge reward rules and conditions
          </p>
        </div>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repeatable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {rules.filter(r => r.isRepeatable).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Test Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rules.filter(r => r.testMode).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No reward rules found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first reward rule to start awarding badges automatically
                </p>
                <Button onClick={handleCreateRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.$id} className={`${!rule.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <Badge className={getRuleTypeColor(rule.ruleType)}>
                        {rule.ruleType.replace('_', ' ')}
                      </Badge>
                      {rule.isRepeatable && (
                        <Badge variant="outline">Repeatable</Badge>
                      )}
                      {rule.testMode && (
                        <Badge variant="destructive">Test Mode</Badge>
                      )}
                      {!rule.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription className="max-w-2xl">
                      {rule.description}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      Badge: <span className="font-medium">{getBadgeName(rule.badgeId)}</span>
                      {rule.priority && (
                        <>
                          {' • '}
                          Priority: <span className="font-medium">{rule.priority}</span>
                        </>
                      )}
                      {rule.cooldownDays > 0 && (
                        <>
                          {' • '}
                          Cooldown: <span className="font-medium">{rule.cooldownDays} days</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestRule(rule)}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(rule)}
                      disabled={updateRuleMutation.isPending}
                    >
                      {rule.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRuleToDelete(rule.$id!)}
                      disabled={deleteRuleMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(rule.conditions.metric || rule.conditions.actionType) && (
                <CardContent>
                  <div className="text-sm bg-muted p-3 rounded-lg">
                    <strong>Conditions:</strong>{' '}
                    {rule.ruleType === 'milestone' && rule.conditions.metric && (
                      <>
                        {rule.conditions.metric} {rule.conditions.operator} {rule.conditions.value}
                        {rule.conditions.timeframe && ` (${rule.conditions.timeframe})`}
                      </>
                    )}
                    {rule.ruleType === 'action' && rule.conditions.actionType && (
                      <>Action: {rule.conditions.actionType}</>
                    )}
                    {rule.ruleType === 'time_based' && rule.conditions.metric && (
                      <>
                        {rule.conditions.metric} {rule.conditions.operator} {rule.conditions.value}
                        {rule.conditions.requiresStreak && ' (streak required)'}
                      </>
                    )}
                    {rule.ruleType === 'combination' && (
                      <>
                        {rule.conditions.subconditions?.length || 0} conditions with {rule.conditions.logic || 'AND'} logic
                      </>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <RewardRuleDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRule(null);
        }}
        rule={selectedRule}
      />

      <RuleTestDialog
        isOpen={isTestDialogOpen}
        onClose={() => {
          setIsTestDialogOpen(false);
          setSelectedRule(null);
        }}
        rule={selectedRule}
      />

      <AlertDialog open={!!ruleToDelete} onOpenChange={() => setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reward Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reward rule? This action cannot be undone.
              Existing achievements earned through this rule will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ruleToDelete && handleDeleteRule(ruleToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};