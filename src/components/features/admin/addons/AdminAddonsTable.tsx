"use no memo"
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/tables/addonChecks/data-table';
import { Button } from '@/components/ui/button.tsx';
import { useFetchAddons, useSaveAddon } from '@/api/endpoints/useAddons.tsx';
import { toast } from '@/api';
import { Addon } from "@/types";
import { Switch } from '@/components/ui/switch';

const AdminAddonsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useFetchAddons(page);
  const { mutateAsync: saveAddon } = useSaveAddon();

  const addons: Addon[] = data?.addons || [];



  const handleStatusChange = async (addon: Addon, newIsValid: boolean) => {
    try {
      await saveAddon(
          { ...addon, isValid: newIsValid, isChecked: true },
          {
            onSuccess: () => {
              toast({
                className: 'bg-surface-3 border-ring text-foreground',
                title: `✅ Addon ${newIsValid ? 'activé' : 'désactivé'} ✅`,
              });
              refetch();
            },
            onError: (error) => {
              toast({
                className: 'bg-surface-3 border-ring text-foreground',
                title: '❌ Erreur de mise à jour ❌',
              });
              console.error('Error:', error);
            },
          }
      );
    } catch (error) {
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
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'author',
      header: 'Auteur',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'isValid',
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
              checked={row.original.isValid}
              onCheckedChange={(checked) =>
                  handleStatusChange(row.original, checked)
              }
          />
      ),
    },
    {
      accessorKey: 'downloads',
      header: ({ column }) => (
          <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Téléchargements
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
      ),
    },
  ];

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error?.message}</div>;

  return (
      <div className='px-4 md:px-8'>
        <DataTable
            columns={columns}
            data={addons}
        />

        <div className='flex justify-between items-center mt-4'>
          <Button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Précédent
          </Button>
          <span>Page {page}</span>
          <Button
              onClick={() => setPage(prev => prev + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
  );
};

export default AdminAddonsTable;