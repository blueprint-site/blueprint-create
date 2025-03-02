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
    <Card className='bg-surface-1'>
      <CardHeader>
        <img src={blog.img_url} alt={blog.title} className='h-48 w-full object-cover' />
        <CardTitle className={'text-foreground'}>
          <h1> {blog.title} </h1>
        </CardTitle>
        <CardDescription>
          <BlogTagsDisplay value={blog.tags || []} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MarkdownDisplay content={blog.content} />
      </CardContent>
      <CardFooter className={'flex justify-end'}>
        <CardDescription className={'text-foreground-muted'}>
          {blog.authors.map((author: string, index: number) => (
            <div key={index}>{author}</div>
          ))}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
