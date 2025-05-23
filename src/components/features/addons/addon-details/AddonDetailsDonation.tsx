import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  SiGithubsponsors,
  SiKofi,
  SiOpencollective,
  SiPatreon,
  SiPaypal,
} from '@icons-pack/react-simple-icons';
import type { ReactNode } from 'react';

export interface AddonDetailsDonationProps {
  links: {
    id: string;
    platform: string;
    url: string;
  }[];
}

export const AddonDetailsDonation = ({ links }: AddonDetailsDonationProps) => {
  const getPlatformButton = (platform: string, url: string): ReactNode => {
    if (url.includes('opencollective')) {
      platform = 'Open Collective';
    }
    const platformLower = platform.toLowerCase();

    if (platformLower.includes('github')) {
      return (
        <>
          <SiGithubsponsors className='h-4 w-4' />
          <span>{platform}</span>
        </>
      );
    }
    if (platformLower.includes('ko-fi') || platformLower.includes('kofi')) {
      return (
        <>
          <SiKofi className='h-4 w-4' />
          <span>{platform}</span>
        </>
      );
    }
    if (platformLower.includes('patreon')) {
      return (
        <>
          <SiPatreon className='h-4 w-4' />
          <span>{platform}</span>
        </>
      );
    }
    if (platformLower.includes('paypal')) {
      return (
        <>
          <SiPaypal className='h-4 w-4' />
          <span>{platform}</span>
        </>
      );
    }
    if (platformLower.includes('open collective')) {
      return (
        <>
          <SiOpencollective className='h-4 w-4' />
          <span>{platform}</span>
        </>
      );
    }

    // Default icon
    return (
      <>
        <Heart className='h-4 w-4' />;<span>{platform}</span>
      </>
    );
  };

  return (
    <CardContent className='py-6'>
      <h3 className='mb-4 text-lg font-semibold'>Support the Developer</h3>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {links.map((link) => (
          <Button key={link.id} variant='outline' className='justify-start gap-2' asChild>
            <a href={link.url} target='_blank' rel='noopener noreferrer'>
              {getPlatformButton(link.platform, link.url)}
            </a>
          </Button>
        ))}
      </div>
      <p className='text-muted-foreground mt-3 text-sm'>
        Consider supporting the developers if you enjoy this addon!
      </p>
    </CardContent>
  );
};
