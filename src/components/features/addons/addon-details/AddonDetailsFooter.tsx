import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SocialSharing from '@/components/features/social-sharing/SocialSharing';
import type { Author, License } from '@/types';
import { BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { ExternalLink } from '@/types/addons/addon-details';

export interface AddonDetailsFooterProps {
  addon_name: string;
  authors: Author[] | string;
  externalLinks: ExternalLink[];
  licence: License | null;
  createdAt: string | null;
  updatedAt: string | null;
  claimed_by?: string | null;
}

export const AddonDetailsFooter = ({
  authors = [],
  createdAt = '',
  updatedAt = '',
  licence = { id: '', name: '', url: '' },
  addon_name = '',
  claimed_by = null,
  externalLinks = [],
}: AddonDetailsFooterProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      console.error('Error parsing date:', e);
      return 'Invalid date';
    }
  };

  // Check if avatar URL is valid (not containing 404-user)
  const isValidAvatarUrl = (url: string | null | undefined) => {
    if (!url) return false;
    return !url.includes('404-user') && !url.includes('404_user');
  };

  // Handle both string and array formats for authors
  const renderAuthors = () => {
    // If authors is a string, convert it to array of simple author objects
    const authorArray =
      typeof authors === 'string'
        ? authors.split(',').map((name, index) => ({
            id: `author-${index}`,
            name: name.trim(),
            url: '#',
            avatarUrl: null,
          }))
        : authors;

    if (!authorArray || authorArray.length === 0) {
      return <p className='text-muted-foreground text-sm'>No author information available</p>;
    }

    return (
      <div className='space-y-4'>
        <div className='flex flex-col gap-2'>
          {authorArray.map((author) => (
            <div key={author.id} className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                {isValidAvatarUrl(author.avatarUrl) ? (
                  <AvatarImage src={author.avatarUrl ?? ''} alt={author.name} />
                ) : null}
                <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <a
                href={author.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary text-sm hover:underline'
              >
                {author.name}
                {claimed_by && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className='text-primary inline text-xs'>
                          <BadgeCheck className='ml-1 inline' />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        The addon has been verified and it is owned by that user
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <CardContent className='py-6'>
      <h2 className='mb-6 text-xl font-semibold'>Additional Information</h2>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {/* Author Information */}
        <div>
          <h3 className='mb-4 text-lg font-semibold'>Author Information</h3>
          {renderAuthors()}
        </div>

        {/* Project Details */}
        <div>
          <h3 className='mb-4 text-lg font-semibold'>Project Details</h3>
          <div className='space-y-3 text-sm'>
            <div>
              <div className='font-medium'>Created</div>
              <div className='text-muted-foreground'>{formatDate(createdAt)}</div>
            </div>
            <div>
              <div className='font-medium'>Last Updated</div>
              <div className='text-muted-foreground'>{formatDate(updatedAt)}</div>
            </div>
            {licence?.name && (
              <div>
                <div className='font-medium'>License</div>
                <div className='text-muted-foreground'>{licence.name}</div>
              </div>
            )}
          </div>
        </div>

        {/* External Links */}
        <div>
          <h3 className='mb-4 text-lg font-semibold'>Links</h3>
          {externalLinks.length > 0 ? (
            <div className='grid grid-cols-1 gap-2'>
              {externalLinks.map((link) => (
                <Button
                  key={link.id ?? `link-${link.label.toLowerCase().replace(/\\s+/g, '-')}`}
                  variant='outline'
                  className='w-full justify-start'
                  asChild
                >
                  <a href={link.url} target='_blank' rel='noopener noreferrer'>
                    {link.icon}
                    <span className='ml-2'>{link.label}</span>
                  </a>
                </Button>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground text-sm'>No external links available</p>
          )}

          <div className='mt-4'>
            <SocialSharing title={addon_name} />
          </div>
        </div>
      </div>
    </CardContent>
  );
};
