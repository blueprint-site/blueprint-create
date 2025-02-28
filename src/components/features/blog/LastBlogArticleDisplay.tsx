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
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay.tsx';
import { Blog } from '@/types';
import { useFetchBlogs } from '@/api';

const LastBlogArticleDisplay = () => {
  const { data: blogs, isLoading, isError, error } = useFetchBlogs('published');

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return (
        <div>
          <p>Error loading blogs: {error?.message}</p>
        </div>
    );
  }

  return (
      <div className='mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 cursor-pointer'>
        {blogs && blogs.length > 0 ? (
            blogs.map((blog: BlogType, index: number) => (
                <Card key={index} className='bg-surface-1'>
                  <CardHeader>
                    <img src={blog.img_url} alt={blog.title} className='w-full object-cover h-48'/>
                    <CardTitle className={'text-foreground'}>
                      <h1> {blog.title} </h1>
                    </CardTitle>
                    <CardDescription>
                      <BlogTagsDisplay value={blog.tags} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MarkdownDisplay content={blog.content} />
                  </CardContent>
                  <CardFooter className={'flex justify-end'}>
                    <CardDescription className={'text-foreground-muted'}>
                      {blog.authors.map((author, index: number) => (
                          <div key={index}>{author}</div>
                      ))}
                    </CardDescription>
                  </CardFooter>
                </Card>
            ))
        ) : (
            <p>No blogs available.</p>
        )}
      </div>
  );
};

export default LastBlogArticleDisplay;
