import { Button } from '@/components/ui/button';
import type { ModrinthProfileProps } from '../types';
import { useModrinthProfile } from '@/api/external/useModrinth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/loading-overlays/LoadingSpinner';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Step for confirming Modrinth profile identity
 */
export default function ModrinthProfileStep({
  next,
  back,
  modrinthToken,
}: Readonly<ModrinthProfileProps>) {
  const { data: profileData, isLoading, error } = useModrinthProfile(modrinthToken);

  const username = profileData?.username;
  const avatar = profileData?.avatar_url;
  const hasError = error !== null;

  const renderProfileContent = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col items-center py-4 text-center'>
          <LoadingSpinner />
          <p className='text-muted-foreground mt-4 text-sm'>Loading your profile...</p>
        </div>
      );
    }

    if (!username) {
      return (
        <div className='flex flex-col items-center py-4 text-center'>
          <p className='text-red-500'>Failed to load profile</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Please check your API key and try again
          </p>
        </div>
      );
    }

    if (username) {
      return (
        <div className='flex flex-col items-center py-4 text-center'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className='text-lg font-semibold'>{username}</h3>
          <div className='text-muted-foreground text-sm'>Is this your Modrinth profile?</div>
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <DialogHeader>
        <DialogTitle>Modrinth Profile</DialogTitle>
        <DialogDescription>Confirm this is your Modrinth profile</DialogDescription>
      </DialogHeader>

      {renderProfileContent()}

      <DialogFooter>
        <Button variant='outline' onClick={back}>
          Back
        </Button>
        <Button onClick={next} disabled={!username || isLoading || hasError}>
          Yes, it&apos;s Me
        </Button>
      </DialogFooter>
    </div>
  );
}
