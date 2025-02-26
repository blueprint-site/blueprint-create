import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogType } from '@/types';
import { toast } from '@/api';
import { databases, ID } from '@/config/appwrite.ts';
import { Query } from 'appwrite';
import logMessage from "@/components/utility/logs/sendLogs.tsx";

// Constantes pour votre base de données
const DATABASE_ID = '67b1dc430020b4fb23e3';
const COLLECTION_ID = '67b232540003ed4d8e4f';

// Hook pour supprimer un blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Article deleted ✅',
        });
        logMessage(`✅ Article ${id} deleted ✅`, 0 , 'action')
      } catch (error) {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error deleting the article ❌',
        });
        logMessage(`❌ Error deleting the article ${id} ❌`, 2 , 'action', error || 'No error retrieved')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      logMessage('🔎 Query "blogs" invalidated successfully.❌');
    },
  });
};

// Hook pour récupérer un seul blog
export const useFetchBlog = (blogId?: string) => {
  return useQuery<BlogType | null>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      if (!blogId || blogId === 'new') return null;

      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, blogId);
      const blogData: BlogType = {
        $id: response.$id,
        title: response.title || '',
        content: response.content || '',
        slug: response.slug || '',
        authors: response.author || '',
        created_at: response.$createdAt || '',
        img_url: response.img_url || '',
        status: response.status || '',
        links: response.links ? JSON.parse(response.links as string) : [],
        tags: response.tags ? JSON.parse(response.tags as string) : [],
        likes: response.likes || '',
        authors_uuid: response.authors_uuid || '',
      };

      return blogData;
    },
    enabled: Boolean(blogId),
    staleTime: 1000 * 60 * 5, // Rafraîchissement tous les 5 minutes
    retry: false, // Ne pas essayer en cas d'échec
  });
};
export const useFetchBlogs = (status?: string) => {
  logMessage(`🔎 useFetchBlogs with status : ${status}`, 0 , 'data');
  return useQuery<BlogType[]>({
    queryKey: ['blogs', status],
    queryFn: async () => {
      // Si le status n'est pas défini, ne pas ajouter de filtre
      const filters = status ? [Query.equal('status', status)] : [];

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        filters // Applique le filtre uniquement si `status` est défini
      );

      const blogs: BlogType[] = response.documents.map((doc) => ({
        $id: doc.$id,
        title: doc.title || '',
        content: doc.content || '',
        slug: doc.slug || '',
        authors: doc.authors || [],
        created_at: doc.$createdAt || '',
        img_url: doc.img_url || '',
        status: doc.status || '',
        links: doc.links ? JSON.parse(doc.links as string) : [],
        tags: doc.tags ? JSON.parse(doc.tags as string) : [],
        likes: doc.likes || 0,
        authors_uuid: doc.authors_uuid || [],
      }));
      logMessage('🔎 result of useFetchBlogs ', 0, 'data' , blogs)
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
        authors: blog.authors ? blog.authors : [],
        likes: blog.likes ? blog.likes : 0,
        links: blog.links ? JSON.stringify(blog.links) : undefined,
        tags: blog.tags ? JSON.stringify(blog.tags) : undefined,
      };

      // Si l'ID du blog n'est pas présent, créer un nouveau document
      if (!blog.$id) {
        return databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), serializedBlog);
      }
      // Si un ID existe, mettre à jour le document existant
      return databases.updateDocument(DATABASE_ID, COLLECTION_ID, blog.$id, serializedBlog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
