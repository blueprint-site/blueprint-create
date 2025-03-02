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
import { Blog } from '@/schemas/blog.schema.tsx';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Card className='bg-surface-1 h-[450px] flex flex-col'>
      <CardHeader>
        <img src={blog.img_url} alt={blog.title} className='object-contain aspect-16/9' />
        <CardTitle className='text-2xl font-bold'>
            {blog.title}
        </CardTitle>
        <CardDescription>
          <BlogTagsDisplay value={blog.tags || []} />
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow overflow-hidden'>
        {/* The content will automatically be truncated by the parent's fixed height */}
        <MarkdownDisplay
          content={blog.content}
          className="line-clamp-[7] text-ellipsis"
        />
      </CardContent>
      <CardFooter className='flex justify-end mt-auto'>
        <CardDescription className='text-foreground-muted'>
          {blog.authors.map((author: string, index: number) => (
            <div key={index}>{author}</div>
          ))}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;