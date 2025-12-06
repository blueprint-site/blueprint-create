import { tablesDB } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";
import { toast } from "sonner";
import { Addon } from "@/types/addons";
import * as z from "zod";

// parses the zod type to react type
type AddonType = z.infer<typeof Addon>;

const DATABASE_ID = "main";
const COLLECTION_ID = "addons";

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
                    rowId: id
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
        retry: false
    })
}

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
        queryFn: async (): Promise<AddonType[]> => {
            try {
                const response = await tablesDB.listRows({
                    databaseId: DATABASE_ID,
                    tableId: COLLECTION_ID,
                    queries: [
                        Query.limit(limit),
                        Query.offset((page - 1) * limit)
                    ]
                });
                
                const validatedAddons = response.rows.map((doc: any) => Addon.parse(doc));
                return validatedAddons;
            }
            catch (e: Error | any) {
                console.error(e);
                toast.error(`Failed to fetch addons: ${e.message}`);
                return []; 
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 60
    })
}

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
                    Query.orderDesc('$createdAt'),
                ]
                if (searchTerm.trim()) {
                    queries.push(
                        Query.or([
                            Query.search('name', searchTerm.trim()),
                            Query.search('description', searchTerm.trim()),
                            Query.search('tags', searchTerm.trim())
                        ])
                    )
                }
                const response = await tablesDB.listRows({
                    databaseId: DATABASE_ID,
                    tableId: COLLECTION_ID,
                    queries,
                })
                const validatedAddons = response.rows.map((doc: any) => Addon.parse(doc));
                const totalPages = Math.ceil(response.total / limit);
                return {
                    addons: validatedAddons,
                    total: response.total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                    currentPage: page
                };
            }
            catch (e: Error | any) {
                console.error(e);
                toast.error(`Failed to fetch addons: ${e.message}`);
                return []; 
            }
        }
    })
}
