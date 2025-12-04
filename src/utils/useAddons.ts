import { tablesDB } from "@/lib/appwrite";
import { useQuery, useMutation} from "@tanstack/react-query";
import { Query } from "appwrite";
import { toast } from "sonner";
import { Addon } from "@/types/addons";
import * as z from "zod";

// parses the zod type to react type
type AddonType = z.infer<typeof Addon>;

const DATABASE_ID = "main";
const COLLECTION_ID = "addons";


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
