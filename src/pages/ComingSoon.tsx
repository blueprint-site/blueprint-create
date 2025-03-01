// src/pages/ComingSoon.tsx
import { useState } from 'react';
import { Calendar, Bell, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BaseLayout from '@/layouts/BaseLayout';
import { useSaveEmail } from '@/api/endpoints/useEmailList';

import BlueprintBanner from '@/assets/banner.png';

const ComingSoon = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { mutateAsync: saveEmail } = useSaveEmail();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        saveEmail({ email });
        setIsSubscribed(true);
        setEmail('');
      } catch (error) {
        console.error('Error saving email:', error);
        throw new Error('Failed to save email');
      }
    }
  };

  const features = [
    {
      title: 'Enhanced Addon Browser',
      description: 'Find the perfect addons with advanced filtering and search',
    },
    {
      title: 'Improved Schematic Database',
      description: 'Explore community-made schematics and upload your own',
    },
    {
      title: 'Modern Design',
      description: 'A fresh new look with improved usability and accessibility',
    },
  ];

  return (
    <BaseLayout>
      <main className='container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-8 sm:py-12 lg:py-16'>
        {/* Logo Section - Responsive sizing */}
        <div className='pb-8 transition-transform duration-300 hover:scale-105'>
          <div className='my-4 flex justify-center px-4'>
            <img
              src={BlueprintBanner}
              alt='Blueprint - Explore Addons'
              className='max-h-[200px] object-contain md:container'
            />
          </div>
        </div>

        <div className='flex w-full max-w-5xl flex-col gap-8'>
          {/* Main Content Section */}
          <div className='container mx-auto flex flex-col items-center justify-center gap-8'>
            <Card className='max-w-160'>
              <CardContent className='space-y-6 p-6'>
                <h1
                  className='font-minecraft from-blueprint to-primary bg-gradient-to-r bg-clip-text text-center text-4xl text-transparent md:text-5xl'
                  aria-label='Coming Soon'>
                  When v2?
                </h1>

                <p className='font-minecraft text-foreground text-center text-xl md:text-2xl'>
                  Soooooooooon!™
                </p>

                <p className='text-foreground-muted text-center'>
                  We're working hard to bring you the next version of Blueprint - your central hub
                  for Create Mod content. Stay tuned for an improved experience with more features
                  and a refreshed design.
                </p>

                {/* Enhanced countdown display */}
                <div className='flex items-center justify-center text-sm'>
                  <Badge
                    variant='outline'
                    className='text-foreground-muted flex items-center gap-2 p-2'>
                    <Calendar className='h-4 w-4' />
                    <span>Expected Release: Q2 2025</span>
                  </Badge>
                </div>

                {/* Newsletter Signup */}
                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className='w-full'>
                    <p className='text-foreground-muted mb-2 text-sm font-medium'>
                      Get notified when we launch:
                    </p>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                      <Input
                        type='email'
                        placeholder='Your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button type='submit' className='whitespace-nowrap'>
                        <Bell className='mr-2 h-4 w-4' />
                        Notify Me
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className='bg-success/10 text-success rounded-md p-4 text-center text-sm'>
                    Thanks for subscribing! We'll notify you when we launch.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Return Button */}
            <div className='mt-6 flex justify-center'>
              <Button
                asChild
                variant='outline'
                className='font-minecraft group hover:bg-primary/10 transition-all duration-300'>
                <a
                  href='https://blueprint-site.github.io/'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Return to current Blueprint version'>
                  Return to Current Version
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </a>
              </Button>
            </div>
          </div>

          {/* Feature Preview Section */}
          <div>
            <h2 className='font-minecraft text-foreground mb-4 text-center text-xl lg:text-left'>
              Feature Preview
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className='bg-surface-1/60 group hover:bg-surface-2/70 cursor-pointer transition-all duration-300 hover:shadow-md'>
                  <CardContent className='p-4'>
                    <h3 className='font-minecraft text-foreground text-lg'>{feature.title}</h3>
                    <Separator className='my-2 opacity-50' />
                    <p className='text-foreground-muted text-sm'>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default ComingSoon;
