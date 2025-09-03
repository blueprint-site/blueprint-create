// src/components/features/admin/users/UserManagement.tsx

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { UserPlus } from 'lucide-react';
import { UsersDataTable } from '@/components/tables/users/DataTable';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AdminUser } from '@/api/appwrite/useUsers';
import {
  useFetchUsers,
  useUpdateUserTeam,
  useUpdateUserStatus,
  useResetUserPassword,
} from '@/api/appwrite/useUsers';
import { useState } from 'react';

import { RolesCell } from './RolesCell';
import { StatusBadge } from './StatusBadge';
import { StatusLegend } from './StatusLegend';
import { UserActionsDropdown } from './UserActionsDropdown';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { DeleteUserDialog } from './DeleteUserDialog';
import { SortableHeader } from './SortableHeader';
import { UserTableRow } from './UserTableRow';

export const UserManagement = () => {
  const { data: usersData, isLoading, error, isFetching } = useFetchUsers();
  const { mutateAsync: updateUserTeam, isPending: isUpdatingTeam } = useUpdateUserTeam();
  const { mutate: updateUserStatus } = useUpdateUserStatus();
  const { mutate: resetPassword } = useResetUserPassword();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Handlers for CRUD operations
  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPassword = async (user: AdminUser) => {
    if (window.confirm(`Reset password for ${user.name || user.email}?`)) {
      resetPassword(user.$id);
    }
  };

  const handleToggleStatus = (user: AdminUser) => {
    const newStatus = user.status === false ? true : false;
    updateUserStatus({
      userId: user.$id,
      status: newStatus,
    });
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
    // Status Column
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} title='Status' />,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          labels={row.original.labels}
          emailVerification={row.original.emailVerification}
        />
      ),
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
      accessorKey: 'labels',
      header: 'Roles',
      // Use RolesCell component - pass labels as teamIds since RolesCell expects teamIds
      cell: ({ row }) => <RolesCell teamIds={row.original.labels || row.original.teamIds || []} />,
      enableSorting: false,
    },
    // Last Active Column
    {
      accessorKey: 'accessedAt',
      // Use SortableHeader
      header: ({ column }) => <SortableHeader column={column} title='Last Active' />,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        if (!value || value === '') return <span className='text-muted-foreground'>Never</span>;
        return <span>{format(new Date(value), 'dd/MM/yyyy HH:mm')}</span>;
      },
    },
    // Actions column
    {
      id: 'actions',
      // Use UserActionsDropdown component with all handlers
      cell: ({ row }) => (
        <UserActionsDropdown
          user={row.original}
          isUpdatingTeam={isUpdatingTeam}
          updateUserTeam={updateUserTeam}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
          onToggleStatus={handleToggleStatus}
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
        <div className='flex items-center gap-2'>
          <StatusLegend />
          {/* Button to create new user */}
          <Button onClick={() => setCreateModalOpen(true)} disabled={isUpdatingTeam}>
            <UserPlus className='mr-2 h-4 w-4' />
            Create User
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <UsersDataTable
        columns={columns}
        data={usersData?.documents ?? []}
        searchPlaceholder='Search users...'
        searchField='name' // Make sure User type always has 'name' or adjust
        isFetching={isFetching}
        renderRow={(row) => (
          <UserTableRow
            key={row.id}
            row={row}
            isUpdatingTeam={isUpdatingTeam}
            updateUserTeam={updateUserTeam}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onResetPassword={handleResetPassword}
            onToggleStatus={handleToggleStatus}
          />
        )}
      />
      {isFetching && !isLoading && <p>Checking for updates...</p>}

      {/* CRUD Modals */}
      <CreateUserModal isOpen={createModalOpen} onOpenChange={setCreateModalOpen} />

      <EditUserModal isOpen={editModalOpen} onOpenChange={setEditModalOpen} user={selectedUser} />

      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
      />
    </div>
  );
};
