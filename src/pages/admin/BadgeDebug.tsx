import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBadges } from '@/api/appwrite/useBadges';
import { useRewardRules } from '@/api/appwrite/useRewardRules';
import { useUserAchievements } from '@/api/appwrite/useUserAchievements';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const BadgeDebug = () => {
  const { data: badges } = useBadges();
  const { data: rules } = useRewardRules();
  const { data: achievements } = useUserAchievements();
  const [issues, setIssues] = useState<string[]>([]);
  const [validations, setValidations] = useState<string[]>([]);

  useEffect(() => {
    if (!badges || !rules) return;

    const newIssues: string[] = [];
    const newValidations: string[] = [];

    // Check if all rules have valid badges
    rules.forEach(rule => {
      const badge = badges.find(b => b.$id === rule.badgeId);
      if (!badge) {
        newIssues.push(`Rule "${rule.name}" (${rule.$id}) references missing badge: ${rule.badgeId}`);
      } else {
        newValidations.push(`✓ Rule "${rule.name}" correctly linked to badge "${badge.name}"`);
      }
    });

    // Check if all achievements have valid badges
    achievements?.forEach(achievement => {
      const badge = badges.find(b => b.$id === achievement.badgeId);
      if (!badge) {
        newIssues.push(`Achievement ${achievement.$id} references missing badge: ${achievement.badgeId}`);
      }
    });

    // List all badges
    badges.forEach(badge => {
      const hasRule = rules.some(r => r.badgeId === badge.$id);
      if (!hasRule) {
        newIssues.push(`Badge "${badge.name}" (${badge.$id}) has no associated rules`);
      }
      
      // Check if badge has iconUrl
      if (!badge.iconUrl) {
        newIssues.push(`Badge "${badge.name}" (${badge.$id}) is missing iconUrl`);
      } else {
        newValidations.push(`✓ Badge "${badge.name}" has iconUrl: ${badge.iconUrl.substring(0, 50)}...`);
      }
    });

    setIssues(newIssues);
    setValidations(newValidations);
  }, [badges, rules, achievements]);

  return (
    <div className='flex-1 space-y-6 p-4 pt-6 md:p-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Badge System Debug</h2>
        <p className='text-muted-foreground'>Check badge and rule relationships</p>
      </div>

      <div className='grid gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span>Total Badges:</span>
                <Badge>{badges?.length || 0}</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>Total Rules:</span>
                <Badge>{rules?.length || 0}</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span>Total Achievements:</span>
                <Badge>{achievements?.length || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {issues.length > 0 && (
          <Card className='border-red-500'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-red-600'>
                <AlertTriangle className='h-5 w-5' />
                Issues Found ({issues.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {issues.map((issue, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm'>
                    <XCircle className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {validations.length > 0 && (
          <Card className='border-green-500'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-600'>
                <CheckCircle className='h-5 w-5' />
                Valid Configurations ({validations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {validations.map((validation, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm'>
                    <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                    <span>{validation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Badge Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {badges?.map(badge => (
                <div key={badge.$id} className='border rounded-lg p-3'>
                  <div className='font-medium'>{badge.name}</div>
                  <div className='text-xs text-muted-foreground'>ID: {badge.$id}</div>
                  <div className='text-xs'>
                    Icon URL: {badge.iconUrl ? '✓ Set' : '✗ Missing'}
                  </div>
                  <div className='text-xs'>
                    Rules: {rules?.filter(r => r.badgeId === badge.$id).length || 0}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};