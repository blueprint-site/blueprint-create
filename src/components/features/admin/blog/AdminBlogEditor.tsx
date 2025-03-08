import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Blog, Tag } from '@/types';
import { useUserStore } from '@/api/stores/userStore';
import ImageUploader from '@/components/utility/ImageUploader.tsx';
import MarkdownEditor from '@/components/utility/MarkdownEditor.tsx';
import TagSelector from '@/components/utility/blog/TagSelector.tsx';
import { useToast } from '@/api';
import { useFetchBlog, useSaveBlog } from '@/api';

export const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const { data: blog, isLoading } = useFetchBlog(id);
  const saveBlogMutation = useSaveBlog();
  const [blogState, setBlogState] = useState<Partial<Blog> | null>(null);

  useEffect(() => {
    if (!user) return;

    if (id && !isNew && blog) {
      console.log(blog);
      setBlogState(blog);
    } else {
      setBlogState({
        title: '',
        content: '',
        slug: '',
        img_url: '',
        status: 'draft',
        tags: [],
        likes: 0,
        authors_uuid: [user?.$id || ''],
        authors: [user?.name || ''],
      });
    }
  }, [id, blog, isNew, user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogState((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!blogState || !blogState.title || !blogState.content) {
      toast({
        className: 'bg-surface-3 border-ring text-foreground',
        title: '⚠️ Missing Fields ⚠️',
        description: 'Title and content are required!',
      });
      return;
    }
    saveBlogMutation.mutate(blogState, {
      onSuccess: async (response) => {
        console.log(response);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Success ✅',
          description: `${blogState.title} has been saved successfully!`,
        });
      },
      onError: async (error) => {
        console.log(error);
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '❌ Error ❌',
          description: `Failed to save ${blogState.title}. Please try again!`,
        });
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className='mx-auto w-full p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Blog Article Editor</h1>
        <Button onClick={handleSave} disabled={saveBlogMutation.isPending} className='ml-auto'>
          {saveBlogMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        {/* Sidebar (Metadata) */}
        <div className='md:col-span-1'>
          <CardContent className='space-y-4'>
            <ImageUploader
              value={blogState?.img_url}
              onChange={(base64) => setBlogState((prev) => (prev ? { ...prev, img_url: base64 ?? undefined } : null))}
            />
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Title</h3>
              <Input
                name='title'
                value={blogState?.title || ''}
                onChange={handleChange}
                placeholder='Title'
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Slug</h3>
              <Input
                name='slug'
                value={blogState?.slug || ''}
                onChange={handleChange}
                placeholder='Slug'
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Tags</h3>
              <TagSelector
                value={blogState?.tags || []}
                db='blog'
                onChange={(value: Tag[]) =>
                  setBlogState((prev) => (prev ? { ...prev, tags: value ?? undefined } : null))
                }
              />
            </div>
          </CardContent>
        </div>

        {/* Main Content (Markdown Editor) */}
        <div className='md:col-span-3'>
          <div className='h-[calc(100vh-200px)] overflow-auto'>
            <MarkdownEditor
              value={blog?.content ?? ''}
              onChange={(value) => setBlogState((prev) => (prev ? { ...prev, content: value ?? undefined } : null))}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
