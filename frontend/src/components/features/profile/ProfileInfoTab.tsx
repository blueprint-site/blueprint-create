import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Download, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/api/stores/userStore';

export const ProfileInfoTab: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);

  return (
    <div className='space-y-6'>
      {/* Profile Header */}
      <div className='border-divider flex flex-col items-start gap-6 border-b pb-6 sm:flex-row'>
        {/* Avatar */}
        <div className='shrink-0'>
          {preferences?.avatar ? (
            <img
              src={preferences?.avatar}
              alt='Profile'
              className='ring-border h-16 w-16 rounded-full object-cover ring-2'
            />
          ) : (
            <div className='bg-secondary ring-border flex h-16 w-16 items-center justify-center rounded-full ring-2'>
              <User className='text-secondary-foreground h-8 w-8' />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className='w-full grow'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-foreground text-2xl font-bold'>
                {user?.name ?? 'Anonymous User'}
              </h2>
              <p className='text-foreground-muted text-sm'>{user?.name}</p>
              <p className='text-foreground-muted text-xs'>
                Joined {new Date(user?.$createdAt || '').toLocaleDateString()}
              </p>
            </div>
            <div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate('/settings/profile')}
                className='w-full sm:w-auto'
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className='text-foreground-muted mt-4 flex flex-wrap items-center gap-6 text-sm'>
            <div className='flex items-center'>
              <Download className='mr-1 h-4 w-4' />
              <span>0 downloads</span>
            </div>
            <div className='flex items-center'>
              <Users className='mr-1 h-4 w-4' />
              <span>0 followers</span>
            </div>
          </div>
        </div>
      </div>
      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {preferences?.bio ? (
            <div>
              <p className='text-sm leading-relaxed'>{preferences.bio}</p>
            </div>
          ) : (
            <div className='py-8 text-center'>
              <User className='text-muted-foreground mx-auto h-12 w-12' />
              <p className='text-muted-foreground mt-4 text-sm'>No bio available</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                Add a bio in your profile settings to let others know about you!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            Member Info
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='text-muted-foreground text-sm font-medium'>Joined</label>
              <p className='mt-1 flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <label className='text-muted-foreground text-sm font-medium'>Email Status</label>
              <p className='mt-1'>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user?.emailVerification
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {user?.emailVerification ? 'Verified' : 'Not Verified'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
