import { useEffect, useState } from 'react';
import { Addon } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { Button } from '@/components/ui/button.tsx';

const AdminAddonsTable = () => {
  const [addons] = useState<Addon[]>([]);
  const columns: ColumnDef<Addon>[] = [
    {
      id: 'actions',
      cell: ({ row }) => {
        const name = row.original.name;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions 🚀</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => validAndCheckAddon(name)}>
                Valid & check this addon ✅
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => InvalidAndCheckAddon(name)}>
                Invalid & Check this addon ❌
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={row.original.icon || ''} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: 'author',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Author
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Description
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: 'isValid',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            IsValid
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.isValid;
        return <div>{!value ? <div>❌</div> : <div>✅</div>}</div>;
      },
    },
    {
      accessorKey: 'isChecked',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            IsChecked
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.isChecked;
        return <div>{!value ? <div>❌</div> : <div>✅</div>}</div>;
      },
    },
  ];
  const validAndCheckAddon = async (name: string) => {
    console.log(name);
  };
  const InvalidAndCheckAddon = async (name: string) => {
    console.log(name);
  };

  const GetAddonList = async () => {
    return 'ok';
  };
  useEffect(() => {
    GetAddonList().then();
  }, []);

  return (
    <div className='px-4 md:px-8'>
      <DataTable columns={columns} data={addons} />
    </div>
  );
};

export default AdminAddonsTable;
