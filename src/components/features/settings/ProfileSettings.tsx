import React, { useCallback, useEffect, useState } from 'react';
import { Upload, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import imageCompression from 'browser-image-compression';
import { useUserStore } from '@/api/stores/userStore';
import { account, storage } from '@/config/appwrite.ts';
import logMessage from '@/components/utility/logs/sendLogs.tsx';

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    avatar: '',
  });

  // Get user data and the updatePreferences function from the store
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);
  const updatePreferences = useUserStore((state) => state.updatePreferences);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user?.name || '',
        bio: preferences?.bio || '',
        avatar: preferences?.avatar || '',
      });
    }
  }, [user, preferences]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      logMessage('Saving of the profile in progress', 0, 'action');

      await account.updateName(profile.username);

      // Use the store's updatePreferences function
      await updatePreferences({
        theme: preferences?.theme || 'light',
        language: preferences?.language || 'en',
        notificationsEnabled: preferences?.notificationsEnabled || false,
        roles: preferences?.roles || [],
        bio: profile.bio,
        avatar: profile.avatar,
      });

      logMessage('Saving of the profile done', 0, 'action');
    } catch (error) {
      logMessage('Error while saving the profile ', 3, 'action');
      setError('Error while saving the profile');
    } finally {
      setIsLoading(false);
    }
  }, [preferences, profile, updatePreferences]);

  const onUploadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setIsLoading(true);

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const compressedFileAsFile = new File([compressedFile], file.name, {
          type: compressedFile.type,
        });

        logMessage('Image compressed successfully.', 0, 'action');
        if (profile.avatar) {
          const oldFileId = profile.avatar.match(/\/files\/([^/]+)/)?.[1];
          if (oldFileId) {
            logMessage(`Old image file id found (${oldFileId}) !`, 0, 'action');
            try {
              await storage.deleteFile('67aee2b30000b9e21407', oldFileId);
              logMessage(`Old image have been deleted (${oldFileId}) !`, 0, 'action');
            } catch (deleteError) {
              logMessage(`Error while deleting old file (${oldFileId}) !`, 3, 'action');
            }
          } else {
            logMessage(`Any file found , skipping suppression ! (${oldFileId}) !`, 0, 'action');
          }
        }

        const fileId = crypto.randomUUID();
        const response = await storage.createFile('67aee2b30000b9e21407', fileId, compressedFileAsFile);

        const avatarUrl = storage.getFilePreview('67aee2b30000b9e21407', response.$id).toString();
        console.log(avatarUrl);
        setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      } catch (error) {
        logMessage('Error while uploading avatar image', 3, 'action');
        setError('Error while uploading avatar image');
      } finally {
        setIsLoading(false);
        handleSave().then(() => {
          logMessage('Saving of the image done', 0, 'action');
        });
      }
    },
    [profile.avatar, handleSave]
  );

  if (error) {
    return <div className='text-destructive'>{error}</div>;
  }

  // Show loading state if user data isn't available yet
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-2 text-2xl font-bold'>Profile information</h2>
        <p className='text-foreground-muted text-sm'>
          Your profile information is publicly viewable on Blueprint and through the Blueprint API.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <h3 className='mb-2 text-lg font-semibold'>Profile picture</h3>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>
                <User2 className='h-8 w-8' />
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor='picture' className='cursor-pointer'>
                <div className='bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm'>
                  <Upload className='h-4 w-4' />
                  Upload image
                </div>
                <input
                  id='picture'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={onUploadImage}
                  disabled={isLoading}
                />
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor='username'>Username</Label>
          <p className='text-foreground-muted mb-2 text-sm'>A unique case-insensitive name to identify your profile.</p>
          <Input
            id='username'
            value={profile.username}
            onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))}
            className='max-w-md'
          />
        </div>

        <div>
          <Label htmlFor='bio'>Bio</Label>
          <p className='text-foreground-muted mb-2 text-sm'>
            A short description to tell everyone a little bit about you.
          </p>
          <Textarea
            id='bio'
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            className='min-h-[100px]'
          />
        </div>

        <div className='flex gap-4'>
          <Button onClick={handleSave} disabled={isLoading}>
            Save changes
          </Button>
          <Button variant='secondary' asChild>
            <a href='/profile'>Visit your profile</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
