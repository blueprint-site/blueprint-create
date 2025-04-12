// src/components/features/admin/users/UserManagement.tsx

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { UserPlus } from 'lucide-react'; // Removed unused icons
import { UsersDataTable } from '@/components/tables/users/DataTable';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AdminUser } from '@/api/appwrite/useUsers';
import { useFetchUsers, useUpdateUserTeam } from '@/api/appwrite/useUsers';
import { useState } from 'react';

import { RolesCell } from './RolesCell';
import { UserActionsDropdown } from './UserActionsDropdown';
import { InviteUserDialog } from './InviteUserDialog';
import { SortableHeader } from './SortableHeader';

export const UserManagement = () => {
  const { data: usersData, isLoading, error, isFetching } = useFetchUsers();
  const { mutateAsync: updateUserTeam, isPending: isUpdatingTeam } = useUpdateUserTeam();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Placeholder invite handler - implement actual Appwrite invite logic here
  const handleInviteUser = async (email: string, name: string) => {
    console.log('Attempting to invite user:', email, name);
    // TODO: Implement actual Appwrite user invitation (e.g., using teams.createMembership with email)
    // Example (conceptual - requires backend function update or different approach):
    // await appwriteFunctionCall({ action: 'inviteUser', payload: { email, name } });
    // For now, just simulate success/failure:
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    // throw new Error("Simulated invite error"); // Uncomment to test error case
    console.log('Simulated invite success');
  };

  // --- Define Columns using Extracted Components ---
  const columns: ColumnDef<AdminUser>[] = [
    // Avatar Column (Could be extracted too)
    {
      accessorKey: 'prefs.avatar',
      header: 'Avatar',
      cell: ({ row }) => (
        <Avatar>
          <AvatarFallback>{row.original.name?.substring(0, 2).toUpperCase() ?? 'U'}</AvatarFallback>
          <AvatarImage src={row.original.prefs?.avatar ?? ''} />
        </Avatar>
      ),
      enableSorting: false,
    },
    // Name Column
    {
      accessorKey: 'name',
      // Use SortableHeader
      header: ({ column }) => <SortableHeader column={column} title='Name' />,
    },
    // Email Column
    {
      accessorKey: 'email',
      // Use SortableHeader
      header: ({ column }) => <SortableHeader column={column} title='Email' />,
    },
    // Joined Date Column
    {
      accessorKey: '$createdAt',
      // Use SortableHeader
      header: ({ column }) => <SortableHeader column={column} title='Joined' />,
      cell: ({ getValue }) => <span>{format(new Date(getValue() as string), 'dd/MM/yyyy')}</span>,
    },
    // Roles column
    {
      accessorKey: 'teamIds',
      header: 'Roles',
      // Use RolesCell component
      cell: ({ row }) => <RolesCell teamIds={row.original.teamIds} />,
      enableSorting: false,
    },
    // Last Active Column
    {
      accessorKey: 'lastAccessedAt',
      // Use SortableHeader
      header: ({ column }) => <SortableHeader column={column} title='Last Active' />,
      cell: ({ getValue }) => {
        /* ... date formatting ... */
      },
    },
    // Actions column
    {
      id: 'actions',
      // Use UserActionsDropdown component
      cell: ({ row }) => (
        <UserActionsDropdown
          user={row.original}
          isUpdatingTeam={isUpdatingTeam}
          updateUserTeam={updateUserTeam} // Pass mutation function
        />
      ),
    },
  ];

  // Loading State
  if (isLoading) {
    /* ... skeleton ... */
  }

  // Error State
  if (error) return <p className='text-destructive'>Error loading users: {error.message}</p>;

  // Render Component
  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        {/* Button now just opens the dialog */}
        <Button onClick={() => setInviteDialogOpen(true)} disabled={isUpdatingTeam}>
          <UserPlus className='mr-2 h-4 w-4' />
          Invite User
        </Button>
      </div>

      {/* Data Table */}
      <UsersDataTable
        columns={columns}
        data={usersData?.documents ?? []}
        searchPlaceholder='Search users...'
        searchField='name' // Make sure User type always has 'name' or adjust
        isFetching={isFetching}
      />
      {isFetching && !isLoading && <p>Checking for updates...</p>}

      {/* Invite Dialog Component */}
      <InviteUserDialog
        isOpen={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInviteUser}
        // Pass isUpdatingTeam to disable invite button during team updates? Optional.
        isSubmitting={false} // Or pass relevant state if invite has its own mutation
      />
    </div>
  );
};
