import { Button } from '@/components/ui/button';
import { Download, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext.tsx';
import { useState } from 'react';
import UserSchematicList from '@/components/features/schematics/UserSchematicList.tsx';

const Profile = () => {
  const [error] = useState<string | null>(null);
  const navigate = useNavigate();
  const LoggedUserInfo = useLoggedUser();

  if (error) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    );
  }

  return (
    <div className='bg-background'>
      <div className='container mx-auto pt-8 sm:px-6 lg:px-8'>
        <div className='border-divider flex flex-col items-start gap-6 border-b pb-3 sm:flex-row'>
          {/* Avatar */}
          <div className='shrink-0'>
            {LoggedUserInfo?.preferences?.avatar ? (
              <img
                src={LoggedUserInfo.preferences?.avatar}
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
                  {LoggedUserInfo?.user?.name ?? 'Anonymous User'}
                </h2>
                <p className='text-foreground-muted text-sm'>{LoggedUserInfo?.user?.name}</p>
                <p className='text-foreground-muted text-xs'>
                  Joined {new Date(LoggedUserInfo?.user?.$createdAt || '').toLocaleDateString()}
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

        {/* Projects Section */}
        <div className='mt-8'>
          <UserSchematicList />
        </div>
      </div>
      <div id='TOREMOVETHHEYSUCKS' className='h-50'></div>
    </div>
  );
};

export default Profile;
