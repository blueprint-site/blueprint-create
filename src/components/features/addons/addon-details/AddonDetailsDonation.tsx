import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { SiGithubsponsors, SiKofi, SiPatreon, SiPaypal } from '@icons-pack/react-simple-icons';
import { ReactNode } from 'react';

export interface DonationLink {
  id: string;
  platform: string;
  url: string;
}

export interface AddonDetailsDonationProps {
  donationLinks?: DonationLink[];
}

export const AddonDetailsDonation = ({ donationLinks }: AddonDetailsDonationProps) => {
  if (!donationLinks || donationLinks.length === 0) {
    return null;
  }

  // Map platforms to their icons
  const getPlatformIcon = (platform: string): ReactNode => {
    const platformLower = platform.toLowerCase();

    if (platformLower.includes('github') || platformLower.includes('sponsor')) {
      return <SiGithubsponsors className='h-4 w-4' />;
    }
    if (platformLower.includes('ko-fi') || platformLower.includes('kofi')) {
      return <SiKofi className='h-4 w-4' />;
    }
    if (platformLower.includes('patreon')) {
      return <SiPatreon className='h-4 w-4' />;
    }
    if (platformLower.includes('paypal')) {
      return <SiPaypal className='h-4 w-4' />;
    }

    // Default icon
    return <Heart className='h-4 w-4' />;
  };

  return (
    <CardContent className='py-6'>
      <h3 className='mb-4 text-lg font-semibold'>Support the Developer</h3>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {donationLinks.map((link) => (
          <Button key={link.id} variant='outline' className='justify-start gap-2' asChild>
            <a href={link.url} target='_blank' rel='noopener noreferrer'>
              {getPlatformIcon(link.platform)}
              <span>{link.platform}</span>
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
