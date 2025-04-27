import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Import DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Import Label

interface InviteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean; // To disable form during external submission
  // Add a callback for when the invite button is clicked
  onInvite: (email: string, name: string) => Promise<void>;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  isOpen,
  onOpenChange,
  isSubmitting = false, // Default to false
  onInvite,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [isInviting, setIsInviting] = useState(false); // Internal loading state

  const handleInviteClick = async () => {
    if (!inviteEmail) {
      // Add basic validation feedback if needed
      return;
    }
    setIsInviting(true);
    try {
      await onInvite(inviteEmail, inviteName);
      // Reset form on success
      setInviteEmail('');
      setInviteName('');
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error('Invitation failed:', error);
      // Keep dialog open on error? Show error message?
    } finally {
      setIsInviting(false);
    }
  };

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInviteEmail('');
      setInviteName('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            {/* Use Label component */}
            <Label htmlFor='invite-name'>Name (Optional)</Label>
            <Input
              id='invite-name'
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder='John Doe'
              disabled={isInviting || isSubmitting}
            />
          </div>
          <div className='grid gap-2'>
            {/* Use Label component */}
            <Label htmlFor='invite-email'>Email</Label>
            <Input
              id='invite-email'
              type='email'
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder='user@example.com'
              required // Add required attribute
              disabled={isInviting || isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          {/* Add a close button */}
          <DialogClose asChild>
            <Button variant='outline' disabled={isInviting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            onClick={handleInviteClick}
            disabled={!inviteEmail || isInviting || isSubmitting} // Disable if no email or submitting
          >
            {isInviting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

InviteUserDialog.displayName = 'InviteUserDialog';
