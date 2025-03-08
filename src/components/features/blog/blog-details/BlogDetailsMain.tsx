import { BlogDetailsHeader } from '@/components/features/blog/blog-details/BlogDetailsHeader.tsx';
import { BlogDetailsContent } from '@/components/features/blog/blog-details/BlogDetailsContent.tsx';
import { BlogDetailsFooter } from '@/components/features/blog/blog-details/BlogDetailsFooter.tsx';
import { Blog } from '@/types';

export interface BlogDetailsMainProps {
  blog: Blog;
}

export const BlogDetailsMain = ({ blog }: BlogDetailsMainProps) => {
  console.log(blog);
  return (
    <div className='container'>
      <BlogDetailsHeader title={blog.title} />
      <BlogDetailsContent blog={blog} />
      <BlogDetailsFooter />
    </div>
  );
};
