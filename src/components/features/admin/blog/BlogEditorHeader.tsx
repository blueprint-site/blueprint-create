import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Loader2, 
  Eye, 
  ArrowLeft,
  FileText,
  Calendar,
  Maximize2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import type { Blog } from '@/types';
import { format } from 'date-fns';

interface BlogEditorHeaderProps {
  blogState: Partial<Blog> | null;
  isNew: boolean;
  isSaving: boolean;
  onSave: () => void;
  onPreview?: () => void;
}

export const BlogEditorHeader = ({
  blogState,
  isNew,
  isSaving,
  onSave,
  onPreview,
}: BlogEditorHeaderProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className='sticky top-0 z-10 bg-background border-b'>
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/admin/blogs')}
            disabled={isSaving}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          
          <div className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-muted-foreground' />
            <div>
              <h1 className='text-lg font-semibold'>
                {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
              </h1>
              {blogState?.title && (
                <p className='text-sm text-muted-foreground'>{blogState.title}</p>
              )}
            </div>
          </div>

          {blogState && (
            <div className='flex items-center gap-2'>
              <Badge variant={getStatusColor(blogState.status)}>
                {blogState.status || 'draft'}
              </Badge>
              {blogState.$createdAt && (
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <Calendar className='h-3 w-3' />
                  {format(new Date(blogState.$createdAt), 'MMM dd, yyyy')}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate(`/admin/blogs/editor-fullscreen/${id}`)}
            title='Full Screen Editor'
          >
            <Maximize2 className='h-4 w-4' />
            <span className='ml-2 hidden sm:inline'>Full Screen</span>
          </Button>
          
          {onPreview && (
            <Button
              variant='outline'
              onClick={onPreview}
              disabled={isSaving || !blogState?.content}
            >
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </Button>
          )}
          
          <Button 
            onClick={onSave} 
            disabled={isSaving || !blogState?.title || !blogState?.content}
          >
            {isSaving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                {isNew ? 'Create' : 'Save'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};