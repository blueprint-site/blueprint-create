import { useParams } from 'react-router';
import { BlogDetailsMain } from '@/components/features/blog/blog-details';
import { useFetchBlog } from '@/api';

const BlogDetails = () => {
  const { id } = useParams(); // Récupère le slug de l'URL

  // Utilise le hook pour récupérer les données du blog par son slug
  const { data: blog, isLoading, isError, error } = useFetchBlog(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message || 'Failed to fetch blog'}</div>;

  // Si blog est null ou undefined, afficher un message d'erreur
  if (!blog) return <div>Blog not found</div>;

  // Maintenant, on peut assurer à TypeScript que blog est de type Blog
  return <BlogDetailsMain blog={blog} />;
};

export default BlogDetails;
