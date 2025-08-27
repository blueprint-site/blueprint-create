import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { AdminUser } from '@/api/appwrite/useUsers'; // Import the user type

const ADMIN_TEAM_ID = 'admin';
const BETA_TESTER_TEAM_ID = 'beta_testers';

interface UserActionsDropdownProps {
  user: AdminUser;
  isUpdatingTeam: boolean;
  updateUserTeam: (params: { userId: string; teamId: string; add: boolean }) => Promise<string>;
}

export const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  isUpdatingTeam,
  updateUserTeam,
}) => {
  const teamIds = user.teamIds ?? [];
  const userId = user.$id;
  const isBetaTester = teamIds.includes(BETA_TESTER_TEAM_ID);
  const isAdmin = teamIds.includes(ADMIN_TEAM_ID);

  const handleUpdate = async (teamId: string, add: boolean) => {
    try {
      await updateUserTeam({ userId, teamId, add });
      // Success toast is handled by the hook
    } catch (err) {
      console.error(`Failed to update team ${teamId} for user ${userId}`, err);
      // Error toast is handled by the hook
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0' disabled={isUpdatingTeam}>
          <span className='sr-only'>Open user actions menu</span> {/* Accessibility */}
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Beta Tester Action */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(BETA_TESTER_TEAM_ID, !isBetaTester);
          }}
          disabled={isUpdatingTeam}
        >
          {isBetaTester ? 'Remove from Beta Testers' : 'Add to Beta Testers'}
        </DropdownMenuItem>
        {/* Admin Action */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(ADMIN_TEAM_ID, !isAdmin);
          }}
          disabled={isUpdatingTeam}
        >
          {isAdmin ? 'Remove Admin Role' : 'Make Admin'}
        </DropdownMenuItem>
        {/* Placeholder for future actions */}
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isUpdatingTeam}>View Details</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

UserActionsDropdown.displayName = 'UserActionsDropdown';
