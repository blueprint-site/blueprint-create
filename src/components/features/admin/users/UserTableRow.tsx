import { TableCell, TableRow } from '@/components/ui/table';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
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
  Star,
} from 'lucide-react';
import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import type { AdminUser } from '@/api/appwrite/useUsers';

interface UserTableRowProps<TData extends AdminUser> {
  row: Row<TData>;
  isUpdatingTeam: boolean;
  updateUserTeam: (params: { userId: string; teamId: string; add: boolean }) => Promise<string>;
  onEdit?: (user: TData) => void;
  onDelete?: (user: TData) => void;
  onResetPassword?: (user: TData) => void;
  onToggleStatus?: (user: TData) => void;
}

export function UserTableRow<TData extends AdminUser>({
  row,
  isUpdatingTeam,
  updateUserTeam,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
}: UserTableRowProps<TData>) {
  const user = row.original;
  const labels = user.labels ?? [];
  const userId = user.$id;

  // Check if user has roles based on labels (no underscores in Appwrite labels)
  const isBetaTester = labels.includes('betatester');
  const isAdmin = labels.includes('admin');
  const isPremium = labels.includes('premium');
  const isMvp = labels.includes('mvp');
  const isEnabled = user.status !== false;
  const isBanned = labels.includes('banned');

  const handleUpdate = async (teamId: string, add: boolean) => {
    try {
      await updateUserTeam({ userId, teamId, add });
    } catch (err) {
      console.error(`Failed to update team ${teamId} for user ${userId}`, err);
    }
  };

  // Determine row styling based on status
  const getRowClassName = () => {
    const classes = ['transition-colors'];
    if (isBanned) {
      classes.push('bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500');
    } else if (!isEnabled) {
      classes.push('bg-gray-50 dark:bg-gray-900/20 opacity-75');
    } else if (!user.emailVerification) {
      classes.push('bg-yellow-50/50 dark:bg-yellow-950/10');
    }
    return classes.join(' ');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className={getRowClassName()}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-56'>
        <ContextMenuLabel>User Actions</ContextMenuLabel>

        {/* Edit and View Actions */}
        <ContextMenuSeparator />
        {onEdit && (
          <ContextMenuItem onClick={() => onEdit(user)} disabled={isUpdatingTeam}>
            <Edit className='mr-2 h-4 w-4' />
            Edit User
          </ContextMenuItem>
        )}

        {/* Account Actions */}
        <ContextMenuSeparator />
        {onToggleStatus && (
          <ContextMenuItem onClick={() => onToggleStatus(user)} disabled={isUpdatingTeam}>
            {isEnabled ? (
              <>
                <UserX className='mr-2 h-4 w-4' />
                Disable Account
              </>
            ) : (
              <>
                <UserCheck className='mr-2 h-4 w-4' />
                Enable Account
              </>
            )}
          </ContextMenuItem>
        )}

        {onResetPassword && (
          <ContextMenuItem onClick={() => onResetPassword(user)} disabled={isUpdatingTeam}>
            <KeyRound className='mr-2 h-4 w-4' />
            Reset Password
          </ContextMenuItem>
        )}

        <ContextMenuItem
          onClick={() => handleUpdate('banned', !isBanned)}
          disabled={isUpdatingTeam}
          className={isBanned ? 'text-green-600' : 'text-red-600'}
        >
          {isBanned ? (
            <>
              <ShieldBan className='mr-2 h-4 w-4' />
              Unban User
            </>
          ) : (
            <>
              <Ban className='mr-2 h-4 w-4' />
              Ban User
            </>
          )}
        </ContextMenuItem>

        {/* Role Management */}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => handleUpdate('admin', !isAdmin)} disabled={isUpdatingTeam}>
          {isAdmin ? (
            <>
              <ShieldOff className='mr-2 h-4 w-4' />
              Remove Admin Role
            </>
          ) : (
            <>
              <Shield className='mr-2 h-4 w-4' />
              Make Admin
            </>
          )}
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => handleUpdate('beta_tester', !isBetaTester)}
          disabled={isUpdatingTeam}
        >
          {isBetaTester ? (
            <>
              <FlaskConicalOff className='mr-2 h-4 w-4' />
              Remove Beta Tester
            </>
          ) : (
            <>
              <FlaskConical className='mr-2 h-4 w-4' />
              Add Beta Tester
            </>
          )}
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => handleUpdate('premium', !isPremium)}
          disabled={isUpdatingTeam}
        >
          <Crown className='mr-2 h-4 w-4' />
          {isPremium ? 'Remove Premium' : 'Add Premium'}
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handleUpdate('mvp', !isMvp)} disabled={isUpdatingTeam}>
          <Star className='mr-2 h-4 w-4' />
          {isMvp ? 'Remove MVP' : 'Add MVP'}
        </ContextMenuItem>

        {/* Danger Zone */}
        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onDelete(user)}
              disabled={isUpdatingTeam}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete User
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

UserTableRow.displayName = 'UserTableRow';
