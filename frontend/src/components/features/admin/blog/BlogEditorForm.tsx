import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Blog, BlogTag } from '@/types';
import type { TagFormValues } from '@/schemas/tag.schema';
import ImageUploader from '@/components/utility/ImageUploader';
import MarkdownEditor from '@/components/utility/MarkdownEditor';
import TagSelector from '@/components/utility/TagSelector';

interface BlogEditorFormProps {
  blogState: Partial<Blog> | null;
  blogTags: BlogTag[];
  isLoadingTags: boolean;
  onFieldChange: (field: keyof Blog, value: Blog[keyof Blog]) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTagsChange: (tags: BlogTag[]) => void;
  onCreateTag: (data: TagFormValues) => Promise<BlogTag>;
  onDeleteTag: (tagId: string) => Promise<void>;
}

export const BlogEditorForm = ({
  blogState,
  blogTags,
  isLoadingTags,
  onFieldChange,
  onInputChange,
  onTagsChange,
  onCreateTag,
  onDeleteTag,
}: BlogEditorFormProps) => {
  if (!blogState) return null;

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
    if (!blogState.slug || blogState.slug === '') {
      onFieldChange('slug', generateSlug(e.target.value));
    }
  };

  return (
    <div className='space-y-6'>
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                name='title'
                value={blogState.title || ''}
                onChange={handleTitleChange}
                placeholder='Enter blog title'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug</Label>
              <Input
                id='slug'
                name='slug'
                value={blogState.slug || ''}
                onChange={onInputChange}
                placeholder='auto-generated-slug'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select
              value={blogState.status || 'draft'}
              onValueChange={(value) => onFieldChange('status', value as 'draft' | 'published')}
            >
              <SelectTrigger id='status'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='published'>Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Media and Tags Card */}
      <Card>
        <CardHeader>
          <CardTitle>Media & Categorization</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 lg:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Cover Image</Label>
              <ImageUploader
                value={blogState.img_url}
                onChange={(base64) => onFieldChange('img_url', base64 ?? undefined)}
              />
            </div>
            <div className='space-y-2'>
              <Label>Tags</Label>
              <TagSelector
                tags={blogTags}
                selectedTags={blogState.tags || []}
                isLoading={isLoadingTags}
                onCreate={onCreateTag}
                onDelete={onDeleteTag}
                onChange={onTagsChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Content *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <MarkdownEditor
              value={blogState.content ?? ''}
              onChange={(value) => onFieldChange('content', value ?? undefined)}
              className='min-h-[400px]'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
