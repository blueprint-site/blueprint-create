import { Card, CardContent } from '@/components/ui/card.tsx';
import { Avatar } from '@/components/ui/avatar.tsx';
import SocialSharing from '@/components/features/social-sharing/SocialSharing.tsx';
import { Author } from '@/types';
import { BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface AddonDetailsFooterProps {
  authors: Author[];
  createdAt: string | null;
  updatedAt: string | null;
  licence: string;
  addon_name: string;
  claimed_by: string | null | undefined;
}
export const AddonDetailsFooter = ({
  authors = [],
  createdAt = '',
  updatedAt = '',
  licence = '',
  addon_name = '',
  claimed_by = '',
}: AddonDetailsFooterProps) => {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Author Information</h3>
            {authors && (
              <div className='mt-4'>
                <h4 className='mb-2 text-sm font-semibold'>Contributors</h4>
                <div className='flex flex-wrap items-center gap-2'>
                  {authors.map((author) => (
                    <>
                      <Avatar className={'h-8 w-8'}>
                        <img src={author.avatarUrl || ''} alt={author.name} />
                      </Avatar>
                      <a
                        key={author.id}
                        href={author.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary text-sm hover:underline'
                      >
                        {author.name}
                      </a>
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
                    </>
                  ))}
                </div>
                <SocialSharing title={addon_name} />
              </div>
            )}
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>Project Details</h3>
            <div className='space-y-2 text-sm'>
              <p>
                <span className='font-semibold'>Created:</span>{' '}
                {new Date(createdAt || Date.now()).toLocaleDateString()}
              </p>
              <p>
                <span className='font-semibold'>Last Updated:</span>{' '}
                {new Date(updatedAt || Date.now()).toLocaleDateString()}
              </p>
              {licence && (
                <p>
                  <span className='font-semibold'>License:</span> {licence}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
