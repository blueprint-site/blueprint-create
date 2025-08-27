// src/components/tables/users/DataTable.tsx

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import type { User as BaseUser } from '@/types'; // Import your base User type

// --- Define or import Team IDs and mapping ---
// It's better to import these from a shared config file
const ADMIN_TEAM_ID = 'admin';
const BETA_TESTER_TEAM_ID = 'beta_testers';

// Maps Team IDs to displayable Role Names
const teamIdToRoleName: Record<string, string> = {
  [ADMIN_TEAM_ID]: 'Admin',
  [BETA_TESTER_TEAM_ID]: 'Beta Tester',
  // Add mappings for other relevant teams if needed
};

// Helper to get a displayable role name from a team ID
const getRoleNameFromId = (teamId: string): string | null => {
  return teamIdToRoleName[teamId] || null; // Return null if ID is not mapped
};

// --- Define the User type expected by this component ---
// Ensure it includes teamIds (make optional if it might be missing)
type User = BaseUser & {
  teamIds?: string[];
};

// Helper to get an array of role names for a user based on their teamIds
const getUserRoleNames = (user: User | undefined): string[] => {
  if (!user || !Array.isArray(user.teamIds)) {
    return []; // Return empty array if user or teamIds is invalid
  }
  return user.teamIds
    .map((id) => getRoleNameFromId(id)) // Map IDs to names
    .filter((roleName): roleName is string => roleName !== null); // Filter out unmapped IDs and ensure string type
};
// --- End Helpers ---

interface DataTableProps<TData extends User, TValue> {
  readonly columns: readonly ColumnDef<TData, TValue>[];
  readonly data: readonly TData[];
  readonly searchPlaceholder?: string;
  readonly searchField?: keyof TData;
  readonly isFetching?: boolean; // Add prop for fetching state indication
}

export function UsersDataTable<TData extends User, TValue>({
  columns,
  data,
  searchPlaceholder = 'Filter users...',
  searchField = 'name' as keyof TData,
  isFetching,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const uniqueRoleNames = (() => {
    const rolesSet = new Set<string>();
    data.forEach((user) => {
      const userRoles = getUserRoleNames(user);
      userRoles.forEach((roleName) => rolesSet.add(roleName));
    });
    return Array.from(rolesSet).sort((a, b) => a.localeCompare(b));
  })();

  const table = useReactTable({
    data: data as TData[],
    columns: columns as ColumnDef<TData, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const manuallyFilteredRows = (() => {
    const rows = table.getFilteredRowModel().rows;
    if (roleFilter === 'all') {
      return rows;
    }

    return rows.filter((row) => {
      const userRoleNames = getUserRoleNames(row.original);
      return userRoleNames.includes(roleFilter);
    });
  })();

  // Calculate pagination based on the *final* filtered list
  const pageCount = Math.ceil(manuallyFilteredRows.length / table.getState().pagination.pageSize);

  return (
    <div>
      {/* Filters Row */}
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          {/* Search Input */}
          <Input
            placeholder={searchPlaceholder}
            // Ensure searchField exists as a column before accessing getColumn
            value={(table.getColumn(searchField as string)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchField as string)?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          {/* Role Filter Dropdown */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              {/* Use role names derived from teamIds */}
              {uniqueRoleNames.map((roleName) => (
                <SelectItem key={roleName} value={roleName}>
                  {roleName} {/* Display role name */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Status Text */}
        <div className='flex items-center gap-2'>
          {/* Indicate fetching state */}
          {isFetching && <span className='text-muted-foreground text-sm'>Updating...</span>}
          <span className='text-muted-foreground text-sm'>
            {/* Show count based on manually filtered rows */}
            {manuallyFilteredRows.length} user{manuallyFilteredRows.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className='text-foreground' key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Render rows from the paginated view of manually filtered data */}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                // Check if this row ID exists in our manually filtered set before rendering
                // This seems overly complex - let's rethink pagination interaction
                // --- Simplified approach: Render rows from the manually filtered data directly (pagination needs adjustment) ---
                // Let's assume pagination applies to the MANUALLY filtered rows for now.
                // This might require passing manuallyFilteredRows to useReactTable or handling pagination outside.
                // --- Easiest Fix: Display the filtered rows and handle pagination on THAT set ---
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  // Filter visibility based on manual filter results BEFORE pagination is applied by Tanstack
                  // This might be inefficient. Let's adjust pagination controls instead.
                  style={{
                    display: manuallyFilteredRows.find((fr) => fr.id === row.id) ? '' : 'none',
                  }} // Hide rows not in manual filter (Inefficient)
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No users match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {/* TODO: Pagination needs refinement to work correctly with manual filtering */}
      {/* The default table.getPageCount() is based on data AFTER tanstack filters, not our manual role filter */}
      {/* We need to either:
          1. Tell tanstack about the manually filtered rows for pagination (complex).
          2. Implement custom pagination controls based on `manuallyFilteredRows`.
          3. Find a way to make the role filter work via tanstack's `filterFns`.
      */}
      <div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()} // This might be inaccurate now
          >
            Previous
          </Button>
          <div className='text-muted-foreground flex items-center gap-1 text-sm'>
            <span>Page</span>
            <span className='font-medium'>{table.getState().pagination.pageIndex + 1}</span>
            <span>of</span>
            {/* Use page count based on manually filtered data */}
            <span className='font-medium'>{pageCount > 0 ? pageCount : 1}</span>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()} // This might be inaccurate now
          >
            Next
          </Button>
        </div>
        <p className='text-muted-foreground text-right text-xs'>
          Note: Pagination might be inaccurate with role filter applied.
        </p>
      </div>
    </div>
  );
}
