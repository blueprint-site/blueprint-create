import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';
import type { Blog } from '@/types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogEditorPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  blogState: Partial<Blog> | null;
  currentUser?: { name?: string; prefs?: { avatar?: string } };
}

export const BlogEditorPreview = ({
  isOpen,
  onClose,
  blogState,
  currentUser,
}: BlogEditorPreviewProps) => {
  if (!blogState) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Blog Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-full max-h-[calc(90vh-100px)]'>
          <article className='prose prose-gray dark:prose-invert max-w-none p-6'>
            {/* Cover Image */}
            {blogState.img_url && (
              <div className='-mx-6 -mt-6 mb-6'>
                <img
                  src={blogState.img_url}
                  alt={blogState.title || 'Blog cover'}
                  className='h-64 w-full rounded-t-lg object-cover'
                />
              </div>
            )}

            {/* Title */}
            <h1 className='mb-4 text-3xl font-bold'>{blogState.title || 'Untitled'}</h1>

            {/* Metadata */}
            <div className='text-muted-foreground mb-6 flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={currentUser?.prefs?.avatar} />
                  <AvatarFallback>
                    <User className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <span>{currentUser?.name || 'Unknown Author'}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                <span>{format(new Date(), 'MMMM dd, yyyy')}</span>
              </div>
            </div>

            {/* Tags */}
            {blogState.tags && blogState.tags.length > 0 && (
              <div className='mb-6 flex flex-wrap gap-2'>
                {blogState.tags.map((tag, index) => (
                  <Badge key={index} variant='secondary'>
                    {typeof tag === 'object' ? tag.value : tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Content */}
            <div className='markdown-content'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blogState.content || 'No content yet...'}
              </ReactMarkdown>
            </div>
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
