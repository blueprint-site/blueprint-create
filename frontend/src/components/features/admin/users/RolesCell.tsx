import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Crown, TestTube } from 'lucide-react';

const getRoleBadge = (label: string): React.ReactNode | null => {
  const key = label.toLowerCase();

  switch (key) {
    case 'admin':
      return (
        <Badge key={label} variant='destructive'>
          <Shield className='mr-1 h-3 w-3' />
          Admin
        </Badge>
      );
    case 'betatester': // No underscores in Appwrite labels
    case 'beta_tester': // Keep for backwards compatibility
      return (
        <Badge key={label} variant='secondary'>
          <TestTube className='mr-1 h-3 w-3' />
          Beta Tester
        </Badge>
      );
    case 'premium':
      return (
        <Badge key={label} variant='default'>
          <Star className='mr-1 h-3 w-3' />
          Premium
        </Badge>
      );
    case 'mvp':
      return (
        <Badge key={label} variant='outline'>
          <Crown className='mr-1 h-3 w-3' />
          MVP
        </Badge>
      );
    default:
      // For any other labels, show them as is
      return (
        <Badge key={label} variant='outline'>
          {label}
        </Badge>
      );
  }
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
