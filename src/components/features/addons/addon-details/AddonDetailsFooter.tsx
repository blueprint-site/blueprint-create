import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SocialSharing from '@/components/features/social-sharing/SocialSharing';
import { Author } from '@/types';
import { BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ExternalLink } from '@/types/addons/addon-details';

export interface AddonDetailsFooterProps {
  addon_name: string;
  authors: Author[];
  externalLinks: ExternalLink[];
  licence: string;
  createdAt: string | null;
  updatedAt: string | null;
  claimed_by?: string | null;
}

export const AddonDetailsFooter = ({
  authors = [],
  createdAt = '',
  updatedAt = '',
  licence = '',
  addon_name = '',
  claimed_by = null,
  externalLinks = [],
}: AddonDetailsFooterProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid date';
    }
  };

  return (
    <CardContent className='py-6'>
      <h2 className='mb-6 text-xl font-semibold'>Additional Information</h2>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {/* Author Information */}
        <div>
          <h3 className='mb-4 text-lg font-semibold'>Author Information</h3>
          {authors && authors.length > 0 ? (
            <div className='space-y-4'>
              <div className='flex flex-col gap-2'>
                {authors.map((author) => (
                  <div key={author.id} className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={author.avatarUrl ?? ''} alt={author.name} />
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
                                <BadgeCheck />
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
          ) : (
            <p className='text-muted-foreground text-sm'>No author information available</p>
          )}
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
            {licence && (
              <div>
                <div className='font-medium'>License</div>
                <div className='text-muted-foreground'>{licence}</div>
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
                  key={link.id ?? `link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
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
