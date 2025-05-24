import { useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Skeleton } from '@/components/ui/skeleton';

interface AddonDetailsDescriptionProps {
  description: string;
}

const AddonDetailsDescription = ({ description = '' }: AddonDetailsDescriptionProps) => {
  const [formattedDescription, setFormattedDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const processMarkdown = async () => {
      setIsLoading(true);

      try {
        if (!description) {
          setFormattedDescription('<p class="text-muted-foreground">No description available.</p>');
          return;
        }

        const markedHtml = await marked(description, {
          gfm: true,
          breaks: true,
        });

        const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
          // or wrappedHtml if you keep it
          ALLOWED_TAGS: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'p',
            'a',
            'ul',
            'ol',
            'li',
            'blockquote',
            'code',
            'pre',
            'strong',
            'em',
            'img',
            'hr',
            'br',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'dl',
            'dt',
            'dd',
            'div',
            'span',
            'iframe',
          ],
          ALLOWED_ATTR: [
            'href',
            'src',
            'alt',
            'title',
            'class',
            'id',
            'target',
            'rel',
            'style',
            'allowfullscreen',
            'frameborder',
            'height',
            'width',
            'scrolling',
            'loading',
          ],
          FORBID_ATTR: ['onerror', 'onload', 'onclick'],
        });

        setFormattedDescription(sanitizedHtml);
      } catch (err) {
        console.error('Error processing markdown:', err);
        setFormattedDescription('<p class="text-red-500">Error rendering description.</p>');
      } finally {
        setIsLoading(false);
      }
    };

    processMarkdown();
  }, [description]);

  return (
    <CardContent className='py-6'>
      <h2 className='mb-4 text-xl font-semibold'>Description</h2>

      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-6 w-2/3' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      ) : (
        <div className='markdown-body' dangerouslySetInnerHTML={{ __html: formattedDescription }} />
      )}
    </CardContent>
  );
};

export default AddonDetailsDescription;
