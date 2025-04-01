import type { Blog } from '@/types';
import { Card, CardContent } from '@/components/ui/card.tsx';
import BlogTagsDisplay from '@/components/utility/blog/BlogTagsDisplay.tsx';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay.tsx';

export interface BlogDetailsContentProps {
  blog: Blog;
}

export const BlogDetailsContent = ({ blog }: BlogDetailsContentProps) => {
  return (
    <Card className={'mt-4'}>
      <CardContent>
        <div className={'flex flex-row items-center justify-items-center'}>
          <div className={'flex items-center justify-center'}>
            <img className={'mx-auto w-1/4 object-cover'} src={blog.img_url} alt={blog.title} />
          </div>
        </div>
        <BlogTagsDisplay value={blog.tags || []}></BlogTagsDisplay>
        <MarkdownDisplay className={'customMarkdown mt-2'} content={blog.content}></MarkdownDisplay>
      </CardContent>
    </Card>
  );
};
