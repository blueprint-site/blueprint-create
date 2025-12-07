import { tablesDB } from '@/lib/appwrite';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { toast } from 'sonner';
import { Addon } from '@/types/addons';
import * as z from 'zod';

// parses the zod type to react type
type AddonType = z.infer<typeof Addon>;

const DATABASE_ID = 'main';
const COLLECTION_ID = 'addons';

// This gets only one addon according to it's Appwrite document (row) id
/** 
 @param id Appwrite Addon id (rowId)
 @returns Addon type (singular addon)
*/
export const useFetchAddon = (id?: string) => {
  return useQuery({
    queryKey: ['addon', id],
    queryFn: async (): Promise<AddonType | null> => {
      if (!id) return null;

      try {
        const rawData = await tablesDB.getRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          rowId: id,
        });

        const addon = Addon.parse(rawData);
        return addon;
      } catch (error: Error | any) {
        if (error instanceof z.ZodError) {
          toast.error(`Addon data invalid: ${error.message}`);
          console.error('Zod validation error:', error.issues);
        } else {
          toast.error(`Failed to fetch addon with id ${id}: ${error.message}`);
        }
        return null;
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};

// This gets a page of addons
/**
 * Fetch a page of addons
 * @param page Page to fetch
 * @param limit How many addons per page
 * @returns Addon[] (list with addons)
 */
export const useFetchAddons = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['addons', 'list', page, limit],
    queryFn: async (): Promise<
      (AddonType[] & {
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        currentPage: number;
      })
    > => {
      try {
        const response = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          queries: [Query.limit(limit), Query.offset((page - 1) * limit)],
        });

        const validatedAddons = response.rows.map((doc: any) => Addon.parse(doc)) as AddonType[] & {
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          currentPage: number;
        };

        const total = response.total ?? 0;
        const totalPages = Math.ceil(total / limit) || 0;
        validatedAddons.total = total;
        validatedAddons.totalPages = totalPages;
        validatedAddons.hasNextPage = page < totalPages;
        validatedAddons.hasPreviousPage = page > 1;
        validatedAddons.currentPage = page;

        return validatedAddons;
      } catch (e: Error | any) {
        console.error(e);
        toast.error(`Failed to fetch addons: ${e.message}`);
        const empty = [] as unknown as AddonType[] & {
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          currentPage: number;
        };
        empty.total = 0;
        empty.totalPages = 0;
        empty.hasNextPage = false;
        empty.hasPreviousPage = false;
        empty.currentPage = page;
        return empty;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
};

/**
 *
 * @param searchTerm What to search for
 * @param page Page of the search
 * @param limit How many addons per page
 * @returns Addons[], total, totalPages, hasNextPage, hasPreviousPage
 */
export const useSearchAddons = (searchTerm: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['addons', 'search', searchTerm, page, limit],
    queryFn: async () => {
      try {
        const queries = [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
          Query.orderDesc('downloads'),
        ];
        if (searchTerm.trim()) {
          queries.push(
            Query.or([
              Query.search('name', searchTerm.trim()),
              Query.search('description', searchTerm.trim()),
            ])
          );
        }
        const response = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          queries,
        });
        const validatedAddons = response.rows.map((doc: any) => Addon.parse(doc));
        const totalPages = Math.ceil(response.total / limit);
        return {
          addons: validatedAddons,
          total: response.total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
        };
      } catch (e: Error | any) {
        console.error(e);
        toast.error(`Failed to fetch addons: ${e.message}`);
        return [];
      }
    },
  });
};

/**
 * Updates selected fields of an addon (by id)
 * @returns
 */
export const useUpdateAddon = () => {
  return useMutation({
    mutationFn: async ({ addonId, data }: { addonId: string; data: Partial<AddonType> }) => {
      try {
        const validation = Addon.partial().safeParse(data);
        if (!validation.success) {
          throw new Error(validation.error.message);
        }
        const updateData = { ...validation.data };
        const result = await tablesDB.updateRow({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          rowId: addonId,
          data: updateData,
        });
        return result;
      } catch (e: Error | any) {
        console.error(e);
        toast.error(`Failed to update addon: ${e.message}`);
        return [];
      }
    },
    onSuccess: () => {
      toast.success('Addon updated successfully');
    },
  });
};

/**
 * 
 * @param filters 
 * @param page 
 * @param limit 
 * @returns 
 */
export const useAdminAddons = (
  filters: {
    search?: string;
    reviewStatus?: 'all' | 'reviewed' | 'unreviewed' | 'unsorted';
    isValid?: boolean;
  } = {},
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['addons', 'admin', filters, page, limit],
    queryFn: async () => {
      try {
        const queries = [
          Query.limit(limit),
          Query.offset((page - 1) * limit),
          Query.orderDesc('$createdAt'),
        ];

        if (filters.reviewStatus === 'all') {
          queries.push(Query.equal('isValid', true));
        } else if (filters.reviewStatus === 'reviewed') {
          queries.push(Query.equal('isChecked', true));
        } else if (filters.reviewStatus === 'unreviewed') {
          queries.push(Query.equal('isChecked', false));
        } else if (filters.reviewStatus === 'unsorted') {
          queries.push(Query.equal('isValid', false));
        }

        if (filters.isValid !== undefined) {
          queries.push(Query.equal('isValid', filters.isValid));
        }

        const response = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          queries: queries,
        });
        let addons = response.rows.map((doc: any) => Addon.parse(doc));
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          addons = addons.filter(
            (addon) =>
              addon.name.toLowerCase().includes(searchTerm) ||
              addon.description.toLowerCase().includes(searchTerm) ||
              (addon.authors || []).join(', ').toLowerCase().includes(searchTerm)
          );
        }

        const totalPages = Math.ceil(response.total / limit);

        return {
          addons,
          total: response.total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
        };
      } catch (e: Error | any) {
        console.error(e);
        toast.error(`Failed to fetch admin addons: ${e.message}`);
        return {
          addons: [],
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          currentPage: page,
        };
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });
};
