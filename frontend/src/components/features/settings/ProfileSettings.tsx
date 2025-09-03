import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import ProfileImageUpload from '@/components/features/profile/ProfileImageUpload';
import { useUserStore } from '@/api/stores/userStore';
import { account } from '@/config/appwrite.ts';
import logMessage from '@/components/utility/logs/sendLogs.tsx';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  useEffect(() => {
    if (user) {
      setProfile({
        username: user?.name || '',
        bio: preferences?.bio ?? '',
        avatar: preferences?.avatar ?? '',
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
        theme: preferences?.theme ?? 'light',
        language: preferences?.language ?? 'en',
        notificationsEnabled: preferences?.notificationsEnabled || false,
        roles: preferences?.roles || [],
        bio: profile.bio,
        avatar: profile.avatar,
      });

      logMessage('Saving of the profile done', 0, 'action');
    } catch (error) {
      logMessage('Error while saving the profile ', 3, 'action');
      setError('Error while saving the profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [preferences, profile, updatePreferences]);

  const handleAvatarChange = useCallback(
    async (avatarUrl: string) => {
      // Update profile state
      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));

      // Save to preferences
      await updatePreferences({
        theme: preferences?.theme ?? 'light',
        language: preferences?.language ?? 'en',
        notificationsEnabled: preferences?.notificationsEnabled || false,
        roles: preferences?.roles || [],
        bio: profile.bio,
        avatar: avatarUrl,
      });

      logMessage('Avatar updated successfully', 0, 'action');
    },
    [profile.bio, preferences, updatePreferences]
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
        <h2 className='mb-2 text-2xl font-bold'>
          {t('settings.user-settings.public-profile.title')}
        </h2>
        <p className='text-foreground-muted text-sm'>
          {t('settings.user-settings.public-profile.description')}
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <h3 className='mb-4 text-lg font-semibold'>
            {t('settings.user-settings.public-profile.picture.title')}
          </h3>
          <ProfileImageUpload
            currentAvatar={profile.avatar}
            onAvatarChange={handleAvatarChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor='username'>
            {t('settings.user-settings.public-profile.username.title')}
          </Label>
          <p className='text-foreground-muted mb-2 text-sm'>
            {t('settings.user-settings.public-profile.username.description')}
          </p>
          <Input
            id='username'
            value={profile.username}
            onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))}
            className='max-w-md'
          />
        </div>

        <div>
          <Label htmlFor='bio'>{t('settings.user-settings.public-profile.bio.title')}</Label>
          <p className='text-foreground-muted mb-2 text-sm'>
            {t('settings.user-settings.public-profile.bio.description')}
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
            {t('settings.user-settings.public-profile.actions.save')}
          </Button>
          <Button variant='secondary' asChild>
            <a href='/profile'>{t('settings.user-settings.public-profile.actions.visit')}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
