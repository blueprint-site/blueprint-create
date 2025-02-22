import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/api";
import { databases, ID } from "@/config/appwrite.ts";
import { Query } from "appwrite";
import {Addon} from "@/schemas/addon.schema.tsx";


const DATABASE_ID = "67b1dc430020b4fb23e3";
const COLLECTION_ID = "67b1dc4b000762a0ccc6";


export const useDeleteAddon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "✅ Addon deleted ✅",
                });
            } catch (error) {
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "❌ Error deleting the addon ❌",
                });
                console.error("Error deleting addon:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addons"] });
        },
    });
};


export const useFetchAddon = (slug?: string) => {
    return useQuery<Addon | null>({
        queryKey: ["addon", slug],
        queryFn: async () => {
            if (!slug) return null;


            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("slug", slug)]
            );

            if (response.documents.length === 0) return null;

            const doc = response.documents[0];
            console.log(doc)
            const addonData: Addon = {
                id: doc.$id,
                name: doc.name || "",
                downloads: doc.downloads || "",
                description: doc.description || "",
                slug: doc.slug || "",
                author: doc.author || "",
                categories: Array.isArray(doc.categories) ? doc.categories : [],
                icon: doc.icon || "",
                created_at: doc.created_at,
                updated_at: doc.updated_at,
                curseforge_raw: JSON.parse(doc.curseforge_raw),
                modrinth_raw: JSON.parse(doc.modrinth_raw),
                sources: Array.isArray(doc.sources) ? doc.sources : [],
                isValid: doc.isValid || false,
                isChecked: doc.isChecked || false,
                versions: Array.isArray(doc.versions) ? doc.versions : [],
            }

            return addonData;
        },
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};



export const useFetchAddons = (categories?: string[]) => {
    return useQuery<Addon[]>({
        queryKey: ["addons", categories],
        queryFn: async () => {
            const filters = categories ? [Query.equal("categories", categories)] : [];

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                filters
            );

            const addons: Addon[] = response.documents.map((doc) => ({
                id: doc.$id,
                name: doc.name || "",
                description: doc.description || "",
                slug: doc.slug || "",
                author: doc.author || "",
                categories: doc.categories ? JSON.parse(doc.categories as string) : [],
                downloads: doc.downloads || 0,
                icon: doc.icon || "",
                created_at: doc.created_at,
                updated_at: doc.updated_at,
                curseforge_raw: doc.curseforge_raw ? JSON.parse(doc.curseforge_raw as string) : undefined,
                modrinth_raw: doc.modrinth_raw ? JSON.parse(doc.modrinth_raw as string) : undefined,
                sources: doc.sources ? JSON.parse(doc.sources as string) : [],
                isValid: doc.isValid || false,
                isChecked: doc.isChecked || false,
                versions: doc.versions ? JSON.parse(doc.versions as string) : [],
            }));

            return addons;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};


export const useSaveAddon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (addon: Partial<Addon>) => {

            const serializedAddon = {
                ...addon,
                categories: addon.categories ? JSON.stringify(addon.categories) : undefined,
                sources: addon.sources ? JSON.stringify(addon.sources) : undefined,
                versions: addon.versions ? JSON.stringify(addon.versions) : undefined,
                curseforge_raw: addon.curseforge_raw ? JSON.stringify(addon.curseforge_raw) : undefined,
                modrinth_raw: addon.modrinth_raw ? JSON.stringify(addon.modrinth_raw) : undefined,
            };

            if (!addon.id) {
                return databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    ID.unique(),
                    serializedAddon
                );
            }

            return databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                addon.id,
                serializedAddon
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addons"] });
        },
    });
};
