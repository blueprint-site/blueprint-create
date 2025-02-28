// src/components/ForCreators.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import DevinsBadges from '../../utility/DevinsBadges';

const ForCreators = () => {
  return (
    <div className='flex flex-col items-center space-y-4 text-center'>
      <div className='font-minecraft space-y-2'>
        <h2 className='text-3xl font-bold sm:text-4xl'>For Creators</h2>
        <p className='text-foreground/90 bg-background/10 mx-auto max-w-[700px]'>
          We're here to help showcase your addons to the Blueprint community
        </p>
      </div>

      <Card className='md:bg-background h-full w-full'>
        <CardHeader>
          <CardTitle className='text-xl'>Can't find your addon?</CardTitle>
          <CardDescription>Let us know and we'll help get your addon listed</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <p className='text-foreground-muted text-sm'>
            Our addon scanning process is fully automated. Contact us to request a rescan and get
            your addon included in our directory.
          </p>

          <div className='mx-auto mt-4 grid gap-4 md:grid-cols-2'>
            <div className='flex items-center justify-center'>
              <DevinsBadges
                type='cozy'
                category='social'
                name='discord-plural'
                height={64}
                format='svg'
                className='hidden md:block cursor-pointer'
              />
              <DevinsBadges
                type='compact'
                category='social'
                name='discord-plural'
                height={40}
                format='svg'
                className='md:hidden cursor-pointer'
              />
            </div>

            <Button
              className='h-[40px] text-xl text-white/90 md:h-[56px] cursor-pointer'
              onClick={() => (window.location.href = 'mailto:blueprint-site@proton.me')}
            >
              <Mail className='mr-2' size={24} />
              Email Us
            </Button>
          </div>

          <div className='mt-4 flex items-center justify-center'>
            <p className='text-foreground-muted text-center text-xs tracking-wide'>
              Email: blueprint-site@proton.me
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForCreators;
