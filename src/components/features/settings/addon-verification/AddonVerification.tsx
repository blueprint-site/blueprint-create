// Main settings component for addon verification
import { Badge } from '@/components/ui/badge';
import { Puzzle } from 'lucide-react';
import AddonVerificationDialog from './AddonVerificationDialog';

export default function AddonVerification() {
  return (
    <>
      {/* UI Header */}
      <div className='flex flex-col items-center space-x-0 md:flex-row md:items-start md:space-x-4'>
        <Puzzle className='h-6 w-6' />
        <h2 className='inline-flex text-2xl font-bold'>Addon Verifying</h2>
        <Badge variant='outline' className='mt-1 md:mt-0'>
          Beta
        </Badge>
      </div>

      <h3 className='mt-4 text-lg font-medium'>Hey modder! </h3>
      <h4 className='mt-2'>Do you want your addon to be verified?</h4>

      <div className='mt-4'>
        <h4 className='font-medium'>
          Verifying your addon gives you:
          <ul className='mt-2 list-inside list-disc'>
            <li>A cool badge</li>
            <li>Verified Addon Maker role in Discord</li>
            <li>Allows users to see your addon in your Blueprint profile</li>
            <li>+10 points to your ego</li>
          </ul>
        </h4>
      </div>

      <div className='mt-6'>
        <AddonVerificationDialog />
      </div>
    </>
  );
}
