import { Badge } from '@/components/ui/badge';
import { useFetchSchematics } from '@/api/appwrite/useSchematics.ts';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { Button } from '@/components/ui/button';
import type { Schematic } from '@/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash, Ban, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

export const SchematicsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useFetchSchematics();
  const navigate = useNavigate();
  // Handle navigation to schematic detail page
  const handleRowClick = (slug: string, id: string) => {
    navigate(`/schematics/${id}/${slug}`); // ⬅️ navigation propre
  };
  // Handle delete schematic action
  const handleDelete = (schematic: Schematic) => {
    if (confirm(`Are you sure you want to delete "${schematic.title}"?`)) {
      console.log('Deleting schematic:', schematic);
      // Implement your delete logic here
      // e.g. deleteSchematic(schematic.$id).then(() => refetch());
    }
  };

  // Handle ban schematic action
  const handleBan = (schematic: Schematic) => {
    if (confirm(`Are you sure you want to ban "${schematic.title}"?`)) {
      console.log('Banning schematic:', schematic);
      // Implement your ban logic here
      // e.g. banSchematic(schematic.$id).then(() => refetch());
    }
  };

  const columns: ColumnDef<Schematic>[] = [
    {
      accessorKey: '$id',
      header: 'ID',
      cell: ({ row }) => <Badge variant='outline'>{row.original.$id}</Badge>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <ContextMenu>
          <ContextMenuTrigger>
            <span
              className='cursor-pointer font-medium hover:text-blue-600'
              onClick={() => handleRowClick(row.original.slug, row.original.$id)}
            >
              {row.original.title}
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-48'>
            <ContextMenuLabel>Schematic Options</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => handleDelete(row.original)}
              className='text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950'
            >
              <Trash className='mr-2 h-4 w-4' />
              Delete Schematic
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleBan(row.original)}
              className='text-orange-600 focus:bg-orange-50 focus:text-orange-600 dark:focus:bg-orange-950'
            >
              <Ban className='mr-2 h-4 w-4' />
              Ban Schematic
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
    },
    {
      accessorKey: 'likes',
      header: 'Likes',
    },
    {
      accessorKey: '$createdAt',
      header: 'Created At',
      cell: ({ row }) => <span>{new Date(row.original.$createdAt).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRowClick(row.original.slug, row.original.$id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.original)}
              className='text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950'
            >
              <Trash className='mr-2 h-4 w-4' />
              Delete Schematic
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleBan(row.original)}
              className='text-orange-600 focus:bg-orange-50 focus:text-orange-600 dark:focus:bg-orange-950'
            >
              <Ban className='mr-2 h-4 w-4' />
              Ban Schematic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error?.message}</div>;

  return (
    <div>
      <div className='px-4 md:px-8'>
        <DataTable columns={columns} data={data || []} />

        <div className='mt-4 flex items-center justify-between'>
          <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Précédent
          </Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage((prev) => prev + 1)}>Suivant</Button>
        </div>
      </div>
    </div>
  );
};

export default SchematicsTable;
