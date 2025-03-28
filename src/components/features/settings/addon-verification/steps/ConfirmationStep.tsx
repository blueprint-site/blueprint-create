import { Button } from '@/components/ui/button';
import type { ConfirmationProps } from '../types';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CheckCircle2, Disc3, BadgeCheck, Users } from 'lucide-react';

/**
 * Final confirmation step before applying the changes
 */
export default function ConfirmationStep({
  back,
  next,
  selectedAddonSlugs,
}: Readonly<ConfirmationProps>) {
  return (
    <div className='flex flex-col gap-4'>
      <DialogHeader>
        <DialogTitle className='text-lg font-medium'>Review and Confirm</DialogTitle>
        <DialogDescription className='text-muted-foreground text-sm'>
          Review your selected addons before completing verification
        </DialogDescription>
      </DialogHeader>

      <div>
        <h4 className='text-base font-medium'>Selected Addons</h4>
        <div className='bg-muted/50 mt-2 max-h-48 overflow-y-auto rounded-md border p-3'>
          {selectedAddonSlugs.length === 0 ? (
            <p className='text-muted-foreground text-sm italic'>No addons selected</p>
          ) : (
            <ul className='space-y-2'>
              {selectedAddonSlugs.map((slug) => (
                <li key={slug} className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                  <span className='text-sm font-medium'>{slug}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='mt-2 space-y-3'>
        <h4 className='text-base font-medium'>What happens next?</h4>
        <div className='bg-muted/50 rounded-lg border p-4'>
          <ul className='space-y-4'>
            <li className='flex items-start gap-3'>
              <div className='bg-primary/10 mt-0.5 rounded-full p-1'>
                <Disc3 className='text-primary h-4 w-4' />
              </div>
              <div>
                <div className='text-sm font-medium'>Addon Verification</div>
                <div className='text-muted-foreground text-sm'>
                  Your user ID will be permanently linked to the selected addons
                </div>
              </div>
            </li>
            <li className='flex items-start gap-3'>
              <div className='bg-primary/10 mt-0.5 rounded-full p-1'>
                <BadgeCheck className='text-primary h-4 w-4' />
              </div>
              <div>
                <div className='text-sm font-medium'>Verification Badge</div>
                <div className='text-muted-foreground text-sm'>
                  A verification badge will appear next to your addons in our marketplace
                </div>
              </div>
            </li>
            <li className='flex items-start gap-3'>
              <div className='bg-primary/10 mt-0.5 rounded-full p-1'>
                <Users className='text-primary h-4 w-4' />
              </div>
              <div>
                <div className='text-sm font-medium'>Discord Perks</div>
                <div className='text-muted-foreground text-sm'>
                  You'll receive the "Verified Creator" role on our Discord server
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button onClick={next} disabled={selectedAddonSlugs.length === 0} className='gap-1'>
          Confirm
        </Button>
      </DialogFooter>
    </div>
  );
}
