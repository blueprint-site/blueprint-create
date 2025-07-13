import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';
import { SocialSharing } from './SocialSharing';

export interface SocialSharingDialogProps {
  /** The title of the content to share */
  title: string;
  /** Optional description for the shared content */
  description?: string;
  /** Custom trigger button text (defaults to "Share") */
  triggerText?: string;
  /** Custom trigger button variant */
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  /** Custom trigger button size */
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  /** Show icon in trigger button */
  showTriggerIcon?: boolean;
  /** Custom dialog title (defaults to "Share this content") */
  dialogTitle?: string;
  /** Optional dialog description */
  dialogDescription?: string;
  /** Social sharing variant to use inside dialog */
  sharingVariant?: 'default' | 'compact' | 'expanded';
  /** Size of social sharing icons */
  iconSize?: number;
  /** Whether to show copy link functionality */
  showCopyLink?: boolean;
  /** Custom CSS class for the trigger button */
  triggerClassName?: string;
  /** Whether the dialog is controlled externally */
  open?: boolean;
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
}

export const SocialSharingDialog = ({
  title,
  description,
  triggerText = 'Share',
  triggerVariant = 'outline',
  triggerSize = 'default',
  showTriggerIcon = true,
  dialogTitle = 'Share this content',
  dialogDescription,
  sharingVariant = 'default',
  iconSize = 32,
  showCopyLink = true,
  triggerClassName,
  open,
  onOpenChange,
}: SocialSharingDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize} className={triggerClassName}>
          {showTriggerIcon && <Share2 className='mr-2 h-4 w-4' />}
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
        </DialogHeader>

        <div className='mt-4'>
          <SocialSharing
            title={title}
            description={description}
            details={false}
            size={iconSize}
            variant={sharingVariant}
            showCopyLink={showCopyLink}
            showShareDialog={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharingDialog;
