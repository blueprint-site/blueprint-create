import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/components/utility/Supabase";
import { BlogType } from "@/types";
import {toast} from "@/hooks/use-toast.ts";


export const useBlogs = () => {
    return useQuery<BlogType[]>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("blog_articles")
                .select("*")
                .range(0, 9);

            if (error) throw new Error(error.message);
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });
};


export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("blog_articles").delete().eq("id", id);
            if (error) {
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "❌ Error while deleting the article ❌",
                });
                console.error(error.message);
            }
        },
        onSuccess: () => {
            // 🔄 Met à jour le cache en invalidant la requête des blogs
            queryClient.invalidateQueries({ queryKey: ["blogs"] }).then();
            toast({
                className: "bg-surface-3 border-ring text-foreground",
                title: "✅ Article have been deleted ✅",
            });
        },
    });
};

export const useFetchBlog = (blogId?: string) => {
    return useQuery<BlogType | null>({
        queryKey: ["blog", blogId],
        queryFn: async () => {
            if (!blogId || blogId === "new") return null;

            const { data, error } = await supabase
                .from("blog_articles")
                .select("*")
                .eq("id", blogId)
                .single();

            if (error) {
                console.error("Erreur lors de la récupération du blog:", error);
                throw error;
            }

            return data;
        },
        enabled: Boolean(blogId),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};

export const useSaveBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (blog: Partial<BlogType>) => {
            if (!blog.id) {
                return supabase.from("blog_articles").insert([blog]);
            }
            return supabase.from("blog_articles").update(blog).eq("id", blog.id);
        },
        onSuccess: () => {
            // Invalide la query 'blogs' avec le bon type attendu par queryClient
            queryClient.invalidateQueries({queryKey: "blogs"}).then();
        },
    });
};

