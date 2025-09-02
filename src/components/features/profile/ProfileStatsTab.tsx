import React from 'react';
import { UserStatsDisplay } from '@/components/features/profile/UserStatsDisplay';
import { useUserStore } from '@/api/stores/userStore';

export const ProfileStatsTab: React.FC = () => {
  const user = useUserStore((state) => state.user);

  if (!user?.$id) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>No user data available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <UserStatsDisplay userId={user.$id} variant='full' />
    </div>
  );
};