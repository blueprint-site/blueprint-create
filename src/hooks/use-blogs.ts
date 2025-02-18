import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {BlogType} from "@/types";
import { toast } from "@/hooks/use-toast.ts";
import { databases, ID } from "@/lib/appwrite";
import {Query} from "appwrite";

// Constantes pour votre base de données
const DATABASE_ID = "67b1dc430020b4fb23e3";
const COLLECTION_ID = "67b232540003ed4d8e4f";

// Hook pour supprimer un blog
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "✅ Article deleted ✅",
                });
            } catch (error) {
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "❌ Error deleting the article ❌",
                });
                console.error("Error deleting blog:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

// Hook pour récupérer un seul blog
export const useFetchBlog = (blogId?: string) => {
    return useQuery<BlogType | null>({
        queryKey: ["blog", blogId],
        queryFn: async () => {
            if (!blogId || blogId === "new") return null;

            const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, blogId);
            const blogData: BlogType = {
                $id: response.$id,
                title: response.title || "",
                content: response.content || "",
                slug: response.slug || "",
                authors: response.author || "",
                created_at: response.$createdAt || "",
                img_url: response.img_url || "",
                status: response.status || "",
                links: response.links ? JSON.parse(response.links as string) : [],
                tags: response.tags ? JSON.parse(response.tags as string) : [],
                likes: response.likes || "",
                authors_uuid: response.authors_uuid || "",
            }

            return blogData;
        },
        enabled: Boolean(blogId),
        staleTime: 1000 * 60 * 5,  // Rafraîchissement tous les 5 minutes
        retry: false,  // Ne pas essayer en cas d'échec
    });
};
export const useFetchBlogs = (status?: string) => {
    return useQuery<BlogType[]>({
        queryKey: ["blogs", status],
        queryFn: async () => {
            // Si le status n'est pas défini, ne pas ajouter de filtre
            const filters = status ? [Query.equal("status", status)] : [];

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                filters // Applique le filtre uniquement si `status` est défini
            );

            const blogs: BlogType[] = response.documents.map((doc) => ({
                $id: doc.$id,
                title: doc.title || "",
                content: doc.content || "",
                slug: doc.slug || "",
                authors: doc.authors || [],
                created_at: doc.$createdAt || "",
                img_url: doc.img_url || "",
                status: doc.status || "",
                links: doc.links ? JSON.parse(doc.links as string) : [],
                tags: doc.tags ? JSON.parse(doc.tags as string) : [],
                likes: doc.likes || 0,
                authors_uuid: doc.authors_uuid || [],
            }));

            return blogs;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};



/// Hook pour enregistrer ou mettre à jour un blog
export const useSaveBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (blog: Partial<BlogType>) => {
            // Sérialiser les objets JSON avant de les envoyer à Appwrite
            const serializedBlog = {
                ...blog,
                links: blog.links ? JSON.stringify(blog.links) : undefined,
                tags: blog.tags ? JSON.stringify(blog.tags) : undefined,
            };

            // Si l'ID du blog n'est pas présent, créer un nouveau document
            if (!blog.$id) {
                return databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    ID.unique(),
                    serializedBlog
                );
            }
            // Si un ID existe, mettre à jour le document existant
            return databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                blog.$id,
                serializedBlog
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};
