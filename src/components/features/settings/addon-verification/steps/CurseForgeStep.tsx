import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { StepProps } from '../types';

/**
 * CurseForge verification step (currently not implemented)
 */
export default function CurseForgeStep({ next, back }: StepProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-lg font-medium'>CurseForge Verification</h3>

      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Not Yet Available</AlertTitle>
        <AlertDescription>CurseForge verification is not implemented yet.</AlertDescription>
      </Alert>

      <div className='mt-2 space-y-3'>
        <p className='text-sm'>
          While we work on direct CurseForge integration, here are alternative options:
        </p>

        <ul className='list-inside list-disc space-y-2 text-sm'>
          <li>
            Get verified manually on our{' '}
            <a
              href='https://discord.gg/AvAWFU5rhB'
              className='text-primary hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              Discord
            </a>
          </li>
          <li>
            Publish your addon on{' '}
            <a
              href='https://modrinth.com/'
              className='text-primary hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              Modrinth
            </a>
          </li>
          <li>
            <a href='mailto:contact@blueprint-create.com' className='text-primary hover:underline'>
              Email us
            </a>{' '}
            with proof that you created the addon
          </li>
        </ul>
      </div>

      <div className='mt-4 flex justify-between'>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button disabled onClick={next}>
          Verify
        </Button>
      </div>
    </div>
  );
}
