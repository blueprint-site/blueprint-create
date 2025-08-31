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
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  KeyRound, 
  UserCheck, 
  UserX,
  Shield,
  ShieldOff,
  FlaskConical,
  FlaskConicalOff,
  Ban,
  ShieldBan,
  Crown,
  Star
} from 'lucide-react';
import type { AdminUser } from '@/api/appwrite/useUsers';

const ADMIN_TEAM_ID = 'admin';
const BETA_TESTER_TEAM_ID = 'beta_tester';
const PREMIUM_TEAM_ID = 'premium';
const MVP_TEAM_ID = 'mvp';

interface UserActionsDropdownProps {
  user: AdminUser;
  isUpdatingTeam: boolean;
  updateUserTeam: (params: { userId: string; teamId: string; add: boolean }) => Promise<string>;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
  onResetPassword?: (user: AdminUser) => void;
  onToggleStatus?: (user: AdminUser) => void;
}

export const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  isUpdatingTeam,
  updateUserTeam,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
}) => {
  // Check both labels and teamIds for compatibility
  const labels = user.labels ?? [];
  const teamIds = user.teamIds ?? [];
  const userId = user.$id;
  
  // Check if user has roles based on labels (no underscores in Appwrite labels)
  const isBetaTester = labels.includes('betatester') || teamIds.includes(BETA_TESTER_TEAM_ID);
  const isAdmin = labels.includes('admin') || teamIds.includes(ADMIN_TEAM_ID);
  const isPremium = labels.includes('premium') || teamIds.includes(PREMIUM_TEAM_ID);
  const isMvp = labels.includes('mvp') || teamIds.includes(MVP_TEAM_ID);
  const isEnabled = user.status !== false;
  const isBanned = labels.includes('banned');

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
      <DropdownMenuContent align='end' className="w-56">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        
        {/* Edit and View Actions */}
        <DropdownMenuSeparator />
        {onEdit && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            disabled={isUpdatingTeam}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
        )}
        
        {/* Account Actions */}
        <DropdownMenuSeparator />
        {onToggleStatus && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(user);
            }}
            disabled={isUpdatingTeam}
          >
            {isEnabled ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Disable Account
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Enable Account
              </>
            )}
          </DropdownMenuItem>
        )}
        
        {onResetPassword && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onResetPassword(user);
            }}
            disabled={isUpdatingTeam}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate('banned', !isBanned);
          }}
          disabled={isUpdatingTeam}
          className={isBanned ? 'text-green-600' : 'text-red-600'}
        >
          {isBanned ? (
            <>
              <ShieldBan className="mr-2 h-4 w-4" />
              Unban User
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </>
          )}
        </DropdownMenuItem>
        
        {/* Role Management */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate('admin', !isAdmin);
          }}
          disabled={isUpdatingTeam}
        >
          {isAdmin ? (
            <>
              <ShieldOff className="mr-2 h-4 w-4" />
              Remove Admin Role
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Make Admin
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate('beta_tester', !isBetaTester);
          }}
          disabled={isUpdatingTeam}
        >
          {isBetaTester ? (
            <>
              <FlaskConicalOff className="mr-2 h-4 w-4" />
              Remove Beta Tester
            </>
          ) : (
            <>
              <FlaskConical className="mr-2 h-4 w-4" />
              Add Beta Tester
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate('premium', !isPremium);
          }}
          disabled={isUpdatingTeam}
        >
          <Crown className="mr-2 h-4 w-4" />
          {isPremium ? 'Remove Premium' : 'Add Premium'}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate('mvp', !isMvp);
          }}
          disabled={isUpdatingTeam}
        >
          <Star className="mr-2 h-4 w-4" />
          {isMvp ? 'Remove MVP' : 'Add MVP'}
        </DropdownMenuItem>
        
        {/* Danger Zone */}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user);
              }}
              disabled={isUpdatingTeam}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

UserActionsDropdown.displayName = 'UserActionsDropdown';
