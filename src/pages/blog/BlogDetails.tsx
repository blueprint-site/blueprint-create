import { useParams } from 'react-router';
import { BlogDetailsMain } from '@/components/features/blog/blog-details';
import { useFetchBlogBySlug } from '@/api';

const BlogDetails = () => {
  const { slug } = useParams();

  const { data: blog, isLoading, isError, error } = useFetchBlogBySlug(slug);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message || 'Failed to fetch blog'}</div>;

  if (!blog) return <div>Blog not found</div>;

  return <BlogDetailsMain blog={blog} />;
};

export default BlogDetails;
