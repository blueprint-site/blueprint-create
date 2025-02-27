// src/pages/ComingSoon.tsx
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BaseLayout from '@/layouts/BaseLayout';
import BlueprintLogo from '@/assets/logo.webp';
import BlueprintBanner from '@/assets/banner.png';

const ComingSoon = () => {
  return (
    <BaseLayout>
      <div className='container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4'>
        <div className='pb-8'>
          <img
            src={BlueprintLogo}
            alt='Blueprint Logo'
            loading='lazy'
            className='h-64 w-64 object-contain md:hidden'
          />
          <img
            src={BlueprintBanner}
            alt='Blueprint Banner'
            loading='lazy'
            className='h-64 w-auto hidden md:block'
          />
        </div>
        <div className='flex max-w-2xl flex-col items-center space-y-8 text-center'>
          {/* Blueprint Logo */}

          {/* Main Content Card */}
          <Card className='bg-surface-1/80 border-blueprint w-full backdrop-blur-sm'>
            <CardContent className='space-y-6 p-6'>
              <h1 className='font-minecraft from-blueprint to-primary bg-gradient-to-r bg-clip-text text-center text-4xl text-transparent md:text-5xl'>
                Coming Soon
              </h1>

              <p className='font-minecraft text-foreground text-center text-xl md:text-2xl'>
                When v2? Sooooooon!
              </p>

              <p className='text-foreground-muted'>
                We're working hard to bring you the next version of Blueprint - your central hub for
                Create Mod content. Stay tuned for an improved experience with more features and a
                refreshed design.
              </p>

              <div className='text-foreground-muted flex items-center justify-center gap-2 text-sm'>
                <Calendar className='h-4 w-4' />
                <span>Expected Release: Q2 2025</span>
              </div>
            </CardContent>
          </Card>

          {/* Return Button */}
          <Button asChild variant='outline' className='font-minecraft'>
            <a href='https://blueprint-site.github.io/' target='_blank' rel='noopener noreferrer'>
              Return to Current Version
            </a>
          </Button>

          {/* Feature Preview */}
          <div className='mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-3'>
            {['Enhanced Addon Browser', 'Improved Schematic Viewer', 'Community Collections'].map(
              (feature, index) => (
                <Card
                  key={index}
                  className='bg-surface-1/60 hover:bg-surface-2/60 transition-colors'>
                  <CardContent className='p-4 text-center'>
                    <p className='font-minecraft text-foreground'>{feature}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ComingSoon;
