import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const ADMIN_TEAM_ID = '67aee1ab00037d3646b9';
const BETA_TESTER_TEAM_ID = '67f959e9001e4967667e';

const teamIdToRoleNameMap: Record<string, string> = {
  [ADMIN_TEAM_ID]: 'Admin',
  [BETA_TESTER_TEAM_ID]: 'Beta Tester',
};

const getRoleBadge = (teamId: string): React.ReactNode | null => {
  const roleName = teamIdToRoleNameMap[teamId];
  if (!roleName) return null;

  if (roleName === 'Admin') {
    return (
      <Badge key={teamId} variant='destructive'>
        <Shield className='mr-1 h-3 w-3' />
        Admin
      </Badge>
    );
  }
  if (roleName === 'Beta Tester') {
    return (
      <Badge key={teamId} variant='secondary'>
        Beta Tester
      </Badge>
    );
  }

  return null;
};

interface RolesCellProps {
  teamIds: string[];
}

export const RolesCell: React.FC<RolesCellProps> = ({ teamIds }) => {
  const resolvedTeamIds = teamIds ?? [];
  const roleBadges = resolvedTeamIds.map((id: string) => getRoleBadge(id)).filter(Boolean); // Filter out nulls

  return (
    <div className='flex flex-wrap justify-start gap-1'>
      {roleBadges.length > 0 ? roleBadges : <span className='text-muted-foreground'>No roles</span>}
    </div>
  );
};

// Optional: Add display name for better debugging
RolesCell.displayName = 'RolesCell';
