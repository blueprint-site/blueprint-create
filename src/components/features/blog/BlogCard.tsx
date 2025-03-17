import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay.tsx';
import BlogTagsDisplay from '@/components/utility/blog/BlogTagsDisplay.tsx';
import { Blog } from '@/types';
import { Link } from 'react-router';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Card className='bg-surface-1 flex h-[450px] flex-col'>
      <CardHeader>
        <img src={blog.img_url} alt={blog.title} className='aspect-16/9 object-contain' />
        <CardTitle className='text-2xl font-bold'>{blog.title}</CardTitle>
        <CardDescription>
          <BlogTagsDisplay value={blog.tags || []} />
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow overflow-hidden'>
        {/* The content will automatically be truncated by the parent's fixed height */}
        <MarkdownDisplay content={blog.content} className='line-clamp-[7] text-ellipsis' />
      </CardContent>
      <CardFooter className='mt-auto flex justify-end'>
        <CardDescription className='text-foreground-muted'>
          {blog.authors.map((author: string, index: number) => (
            <div key={index}>{author}</div>
          ))}
        </CardDescription>
        <Link to={`/blog/${blog.$id}/${blog.slug}`} className='text-blue-500 hover:text-blue-700'>
          Read more...
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
