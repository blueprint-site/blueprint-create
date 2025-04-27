import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { Blog, BlogTag } from '@/types';
import { useUserStore } from '@/api/stores/userStore';
import ImageUploader from '@/components/utility/ImageUploader';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import TagSelector from '@/components/utility/TagSelector';
import { useToast } from '@/hooks';
import { useFetchBlog, useSaveBlog, useBlogTags, useCreateBlogTag, useDeleteBlogTag } from '@/api';

export const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const { data: blog, isLoading } = useFetchBlog(id);
  const saveBlogMutation = useSaveBlog();
  const [blogState, setBlogState] = useState<Partial<Blog> | null>(null);

  const { data: blogTags = [], isLoading: isLoadingTags } = useBlogTags();
  const createTagMutation = useCreateBlogTag();
  const deleteTagMutation = useDeleteBlogTag();

  useEffect(() => {
    if (!user) return;

    if (id && !isNew && blog) {
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

  const handleTagsChange = (selectedTags: BlogTag[]) => {
    setBlogState((prev) => (prev ? { ...prev, tags: selectedTags } : null));
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
      onSuccess: () => {
        toast({
          className: 'bg-surface-3 border-ring text-foreground',
          title: '✅ Success ✅',
          description: `${blogState.title} has been saved successfully!`,
        });
      },
      onError: () => {
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
    <Card className='h-full w-full space-y-4 p-4'>
      {/* Header button */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={saveBlogMutation.isPending}>
          {saveBlogMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Inputs + Image */}
      <div className='flex w-full flex-col gap-6 md:flex-row md:items-start'>
        {/* Left: Inputs */}
        <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              name='title'
              value={blogState?.title || ''}
              onChange={handleChange}
              placeholder='Enter a title'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='slug'>Slug</Label>
            <Input
              id='slug'
              name='slug'
              value={blogState?.slug || ''}
              onChange={handleChange}
              placeholder='auto-generated-slug'
            />
          </div>
          <div className='space-y-2 md:col-span-2'>
            <Label>Tags</Label>
            <TagSelector
              tags={blogTags}
              selectedTags={blogState?.tags || []}
              isLoading={isLoadingTags}
              onCreate={createTagMutation.mutateAsync}
              onDelete={deleteTagMutation.mutateAsync}
              onChange={handleTagsChange}
            />
          </div>
        </div>

        {/* Right: Cover image */}
        <div className='w-full space-y-2 md:w-1/3'>
          <Label>Cover Image</Label>
          <div className='flex flex-col gap-2'>
            <ImageUploader
              value={blogState?.img_url}
              onChange={(base64) =>
                setBlogState((prev) => (prev ? { ...prev, img_url: base64 ?? undefined } : null))
              }
            />
          </div>
        </div>
      </div>

      {/* Markdown Editor */}
      <div className='space-y-2'>
        <Label className='text-base'>Content</Label>
        <div className='rounded-md border'>
          <MarkdownEditor
            value={blogState?.content ?? ''}
            onChange={(value) =>
              setBlogState((prev) => (prev ? { ...prev, content: value ?? undefined } : null))
            }
          />
        </div>
      </div>
    </Card>
  );
};
