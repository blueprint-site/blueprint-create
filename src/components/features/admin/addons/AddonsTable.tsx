'use no memo';
import { Input } from '@/components/ui/input.tsx';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { Button } from '@/components/ui/button.tsx';
import { useFetchAllAddons, useUpdateAddon } from '@/api/appwrite/useAddons';
import { toast } from '@/hooks';
import type { Addon } from '@/types';
import { Switch } from '@/components/ui/switch';

export const AddonsTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, error, refetch } = useFetchAllAddons();
  const { mutateAsync: updateAddon } = useUpdateAddon();

  const addons: Addon[] = data || [];

  const filteredAddons = addons.filter(
    (addon) =>
      addon.name.toLowerCase().includes(search.toLowerCase()) ||
      addon.author?.toLowerCase().includes(search.toLowerCase()) ||
      addon.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAddons.length / limit);
  const paginatedAddons = filteredAddons.slice((page - 1) * limit, page * limit);

  const handleStatusChange = async (addon: Addon, newIsValid: boolean) => {
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

  const columns: ColumnDef<Addon>[] = [
    {
      accessorKey: 'icon',
      header: 'Icone',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.icon || ''} />
          <AvatarFallback>ADDON</AvatarFallback>
        </Avatar>
      ),
    },
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'author', header: 'Auteur' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'isValid',
      header: 'Status',
      cell: ({ row }) => (
        <Switch
          checked={row.original.isValid}
          onCheckedChange={(checked) => handleStatusChange(row.original, checked)}
        />
      ),
    },
    {
      accessorKey: 'downloads',
      header: 'Téléchargements',
    },
  ];

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error?.message}</div>;

  return (
    <div className='space-y-4 px-4 md:px-8'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='🔍 Search addon...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 when search changes
          }}
          className='w-full max-w-xs'
        />
      </div>

      <DataTable columns={columns} data={paginatedAddons} />

      <div className='mt-4 flex items-center justify-between'>
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          ◀ Précédent
        </Button>
        <span>
          Page {totalPages === 0 ? 0 : page} / {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Suivant ▶
        </Button>
      </div>
    </div>
  );
};

export default AddonsTable;
