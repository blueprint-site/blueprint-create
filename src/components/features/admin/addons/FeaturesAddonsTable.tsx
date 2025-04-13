'use no memo';
import { useFetchFeaturedAddons } from '@/api/endpoints/useFeaturedAddons.tsx';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { Button } from '@/components/ui/button.tsx';
import { useUpdateAddon } from '@/api/appwrite/useAddons';
import { toast } from '@/hooks';
import type { FeaturedAddon } from '@/types';
import { Switch } from '@/components/ui/switch';

export const FeaturedAddonsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useFetchFeaturedAddons();
  const { mutateAsync: updateAddon } = useUpdateAddon();

  const addons: FeaturedAddon[] = data || [];

  const handleStatusChange = async (addon: FeaturedAddon, newIsValid: boolean) => {
    try {
      await updateAddon({ addonId: addon.$id, data: { isValid: newIsValid, isChecked: true } });
      toast({
        className: 'bg-surface-3 border-ring text-foreground',
        title: `✅ Addon ${newIsValid ? 'activé' : 'désactivé'} ✅`,
      });
      refetch();
    } catch (error) {
      toast({
        className: 'bg-surface-3 border-ring text-foreground',
        title: '❌ Erreur de mise à jour ❌',
      });
      console.error('Unexpected error:', error);
    }
  };

  const columns: ColumnDef<FeaturedAddon>[] = [
    {
      accessorKey: 'image_url',
      header: 'Image',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.image_url || ''} />
          <AvatarFallback>ADDON</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'addon_id',
      header: 'Addon ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <span className='font-medium'>{row.original.title}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <Switch
          checked={row.original.active}
          onCheckedChange={(checked) => handleStatusChange(row.original, checked)}
        />
      ),
    },
  ];

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error?.message}</div>;

  return (
    <div>
      <div className={'float-end'}>
        <Button variant={'success'} className={'cursor-pointer'}>
          <PlusIcon /> ADD ADDON
        </Button>
      </div>
      <div className='px-4 md:px-8'>
        <DataTable columns={columns} data={addons} />

        <div className='mt-4 flex items-center justify-between'>
          <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Précédent</Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage((prev) => prev + 1)}>Suivant</Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAddonsTable;
