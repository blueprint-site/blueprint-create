// Main settings component for addon verification
import { Badge } from '@/components/ui/badge';
import { Puzzle } from 'lucide-react';
import AddonVerificationDialog from './AddonVerificationDialog';
import { CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddonVerification() {
  return (
    <>
      {/* UI Header */}
      <CardHeader className='flex flex-row items-center justify-between'>
        <div className='flex-1'>
          <CardTitle className='flex items-center gap-2'>
            <Puzzle className='h-6 w-6' />
            <h2 className='inline-flex text-2xl font-bold'>Addon Verifying</h2>
          </CardTitle>
          <CardDescription>Verify your addon to get a cool badge and more!</CardDescription>
        </div>
        <Badge variant='outline' className='mt-1 md:mt-0'>
          Beta
        </Badge>
      </CardHeader>
      <CardContent>
        <h4>Hey modder! </h4>
        <h6>Do you want your addon to be verified?</h6>

        <div className='mt-4'>
          <div className='font-medium'>
            Verifying your addon gives you:
            <ul className='mt-2 list-inside list-disc'>
              <li>A cool badge</li>
              <li>Verified Addon Maker role in Discord</li>
              <li>Allows users to see your addon in your Blueprint profile</li>
              <li>+10 points to your ego</li>
            </ul>
          </div>
        </div>

        <div className='mt-6'>
          <AddonVerificationDialog />
        </div>
      </CardContent>
    </>
  );
}
