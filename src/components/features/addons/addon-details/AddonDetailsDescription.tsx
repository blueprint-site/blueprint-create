import { useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Skeleton } from '@/components/ui/skeleton';

export interface AddonDetailsDescriptionProps {
  description: string;
}

export const AddonDetailsDescription = ({ description = '' }: AddonDetailsDescriptionProps) => {
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

        // Process markdown description
        const markedHtml = await marked(description, {
          gfm: true, // GitHub Flavored Markdown
          breaks: true, // Convert line breaks to <br>
        });

        const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
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
          ],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'style'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick'],
          ADD_ATTR: ['target'], // Allow target="_blank" for links
          ADD_URI_SAFE_ATTR: ['target'], // Safe attributes for links
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
        <div
          className='prose prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-img:rounded prose-code:text-muted-foreground prose-pre:bg-muted prose-pre:text-muted-foreground max-w-none'
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
      )}
    </CardContent>
  );
};
