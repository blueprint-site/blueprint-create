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
import { BlogType } from '@/types';
import { useFetchBlogs } from '@/api';

const LastBlogArticleDisplay = () => {
  const { data: blogs, isLoading, isError, error } = useFetchBlogs('published'); // Utilisation du hook `useFetchBlogs` de `Appwrite`

  if (isLoading) {
    return <LoadingOverlay />; // Affichage du loader pendant le chargement
  }

  if (isError) {
    return (
      <div>
        <p>Error loading blogs: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className='mx-4 flex flex-row flex-wrap gap-4 py-4'>
      {blogs && blogs.length > 0 ? (
        blogs.map((blog: BlogType, index: number) => (
          <Card key={index} className='bg-surface-1 w-full md:w-1/4'>
            <CardHeader>
              <img src={blog.img_url} alt={blog.title} />
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
            <CardFooter className={'float-end'}>
              <CardDescription className={'text-foreground-muted'}>
                {blog.authors.map((author, index: number) => (
                  <div key={index}>{author}</div>
                ))}
              </CardDescription>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No blogs available.</p> // Message si aucun blog n'est trouvé
      )}
    </div>
  );
};

export default LastBlogArticleDisplay;
