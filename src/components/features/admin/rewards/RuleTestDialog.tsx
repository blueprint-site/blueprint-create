import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, AlertCircle, User, TestTube } from 'lucide-react';
import { useTestRewardRule } from '@/api/appwrite/useRewardRules';
import { useFetchUsers } from '@/api/appwrite/useUsers';
import { useUserStats } from '@/api/appwrite/useUserStats';
import { useBadges } from '@/api/appwrite/useBadges';
import type { RewardRule } from '@/schemas/rewardRule.schema';
import type { RuleTestResult } from '@/schemas/rewardRule.schema';

interface RuleTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: RewardRule | null;
}

export const RuleTestDialog: React.FC<RuleTestDialogProps> = ({
  isOpen,
  onClose,
  rule,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [testResult, setTestResult] = useState<RuleTestResult | null>(null);
  
  const { data: usersData } = useFetchUsers();
  const users = usersData?.documents || [];
  const { data: badges = [] } = useBadges();
  const { data: userStats } = useUserStats(selectedUserId);
  const testMutation = useTestRewardRule();

  const selectedUser = users.find(u => u.$id === selectedUserId);
  const ruleBadge = badges.find(b => b.$id === rule?.badgeId);

  const handleTest = async () => {
    if (!rule || !selectedUserId) return;
    
    try {
      const result = await testMutation.mutateAsync({
        ruleId: rule.$id!,
        userId: selectedUserId,
      });
      setTestResult(result);
    } catch (error) {
      console.error('Error testing rule:', error);
      setTestResult({
        wouldAward: false,
        reason: 'Error testing rule',
        currentProgress: 0,
        targetValue: 1,
        meetsConditions: false,
        canEarnAgain: false,
      });
    }
  };

  const getResultIcon = (result: RuleTestResult) => {
    if (result.wouldAward) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (!result.meetsConditions) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (!result.canEarnAgain) {
      return <Clock className="h-5 w-5 text-orange-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getResultColor = (result: RuleTestResult) => {
    if (result.wouldAward) return 'text-green-700 bg-green-50 border-green-200';
    if (!result.meetsConditions) return 'text-red-700 bg-red-50 border-red-200';
    if (!result.canEarnAgain) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  };

  if (!rule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Rule: {rule.name}
          </DialogTitle>
          <DialogDescription>
            Test this reward rule against a specific user to see if it would award a badge
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Rule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{rule.ruleType.replace('_', ' ')}</Badge>
                {rule.isRepeatable && <Badge variant="secondary">Repeatable</Badge>}
                {rule.testMode && <Badge variant="destructive">Test Mode</Badge>}
                {!rule.isActive && <Badge variant="outline">Inactive</Badge>}
              </div>
              
              <div className="text-sm space-y-1">
                <div><strong>Badge:</strong> {ruleBadge?.name || 'Unknown Badge'}</div>
                <div><strong>Description:</strong> {rule.description}</div>
                {rule.cooldownDays > 0 && (
                  <div><strong>Cooldown:</strong> {rule.cooldownDays} days</div>
                )}
              </div>

              {/* Conditions Preview */}
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
                    {rule.conditions.subconditions?.length || 0} conditions with{' '}
                    {rule.conditions.logic || 'AND'} logic
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select User for Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user to test..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.slice(0, 50).map((user) => (
                        <SelectItem key={user.$id} value={user.$id!}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleTest} 
                  disabled={!selectedUserId || testMutation.isPending}
                >
                  {testMutation.isPending ? 'Testing...' : 'Test Rule'}
                </Button>
              </div>

              {/* User Stats Preview */}
              {selectedUser && userStats && (
                <div className="text-sm bg-muted p-3 rounded-lg">
                  <strong>User Stats Preview:</strong>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div>Logins: {userStats.totalLogins}</div>
                    <div>Schematics: {userStats.totalSchematics}</div>
                    <div>Downloads: {userStats.totalDownloadsReceived}</div>
                    <div>Followers: {userStats.totalFollowers}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Test Results
                  {getResultIcon(testResult)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Result */}
                <div className={`p-4 rounded-lg border ${getResultColor(testResult)}`}>
                  <div className="flex items-center gap-2 font-medium">
                    {getResultIcon(testResult)}
                    <span>
                      {testResult.wouldAward 
                        ? 'Badge WOULD BE AWARDED' 
                        : 'Badge would NOT be awarded'
                      }
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <strong>Reason:</strong> {testResult.reason}
                  </div>
                </div>

                {/* Progress Information */}
                {testResult.currentProgress !== undefined && testResult.targetValue !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {testResult.currentProgress} / {testResult.targetValue}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((testResult.currentProgress / testResult.targetValue) * 100, 100)} 
                    />
                    <div className="text-xs text-muted-foreground">
                      {Math.round((testResult.currentProgress / testResult.targetValue) * 100)}% complete
                    </div>
                  </div>
                )}

                {/* Detailed Checks */}
                <Separator />
                <div className="space-y-2">
                  <div className="font-medium">Detailed Checks:</div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {testResult.meetsConditions ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Rule conditions {testResult.meetsConditions ? 'met' : 'not met'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {testResult.canEarnAgain ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      User {testResult.canEarnAgain ? 'can' : 'cannot'} earn this badge
                      {!testResult.canEarnAgain && testResult.nextAvailableDate && (
                        <span className="text-muted-foreground ml-1">
                          (next available: {new Date(testResult.nextAvailableDate).toLocaleDateString()})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {rule.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Rule is {rule.isActive ? 'active' : 'inactive'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {!rule.testMode ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <span>
                      {rule.testMode ? 'Test mode (no actual awards)' : 'Production mode (would award)'}
                    </span>
                  </div>
                </div>

                {/* Next Steps */}
                {testResult.wouldAward && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>✓ This rule would successfully award the badge!</strong>
                      <br />
                      In production mode, this would create a new achievement for the user.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};