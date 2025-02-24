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
                $id: doc.$id,
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
                minecraft_versions: Array.isArray(doc.minecraft_versions) ? doc.minecraft_versions : [],
            }

            return addonData;
        },
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};





export const useFetchAddons = (page: number, limit: number = 20) => {
    return useQuery<{ addons: Addon[]; total: number }>({
        queryKey: ["addons", page],
        queryFn: async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [
                        Query.limit(limit),
                        Query.offset((page - 1) * limit),
                    ]
                );

                const addons: Addon[] = response.documents.map((doc) => ({
                    $id: doc.$id,
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
                }));
                console.log(addons)
                return {

                    addons,
                    total: response.total, // Nombre total d'addons disponibles
                };
            } catch (err) {
                console.error("Error fetching addons:", err);
                throw new Error("Failed to fetch addons");
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};

export const useSaveAddon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (addon: Partial<Addon>) => {
            console.log(addon);

            const serializedAddon = {
                ...addon,
                curseforge_raw: addon.curseforge_raw ? JSON.stringify(addon.curseforge_raw) : undefined,
                modrinth_raw: addon.modrinth_raw ? JSON.stringify(addon.modrinth_raw) : undefined,
            };
            console.log(serializedAddon);

            if (!addon.$id) {
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
                addon.$id,
                serializedAddon
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addons"] });
        },
    });
};
