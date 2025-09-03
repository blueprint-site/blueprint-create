import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, ArrowUpDown, Edit, Maximize2 } from 'lucide-react';
import { AdminBlogTable } from '@/components/tables/blog/AdminBlogTable.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { useDeleteBlog, useFetchBlogs, useSaveBlog } from '@/api';
import { useNavigate } from 'react-router';
import type { Blog } from '@/types';

export const BlogList = () => {
  const { data: blogs, isLoading, error } = useFetchBlogs();
  const navigate = useNavigate();

  const { mutateAsync: deleteBlog } = useDeleteBlog();
  const { mutateAsync: saveBlog } = useSaveBlog();

  const handleUpdateStatus = async ($id: string, newStatus: 'draft' | 'published') => {
    try {
      await saveBlog({ $id, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: 'img_url',
      header: 'Image',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.img_url || ''} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
    },
    {
      accessorKey: 'authors',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Authors
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
    },
    {
      accessorKey: '$createdAt',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created at
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span>{format(new Date(getValue() as string), 'dd/MM/yyyy HH:mm')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-center'>
          {row.original.status === 'draft' ? 'Draft 📋' : 'Public ✅'}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='bg-surface-1 h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/blogs/editor/${row.original.$id}`);
              }}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/blogs/editor-fullscreen/${row.original.$id}`);
              }}
            >
              <Maximize2 className='mr-2 h-4 w-4' />
              Edit Full Screen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === 'draft' ? (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(row.original.$id, 'published');
                }}
              >
                Publish ✅
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(row.original.$id, 'draft');
                }}
              >
                Unpublish 📋
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.$id);
              }}
              className='text-destructive'
            >
              Delete ❌
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) return <p>Loading blogs...</p>;
  if (error) return <p>Error loading blogs: {(error as Error).message}</p>;

  return <AdminBlogTable columns={columns} data={blogs?.data || []} />;
};
