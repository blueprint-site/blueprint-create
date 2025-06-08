import type React from 'react';
import { Button } from '@/components/ui/button';
import { Download, User, Users, Package, Award } from 'lucide-react';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  usePublicUser,
  usePublicUserSchematics,
  usePublicUserAddons,
  usePublicUserBadges,
} from '@/api/appwrite/usePublicUsers';
import { useUserStore } from '@/api/stores/userStore';
import PublicUserSchematicList from '@/components/features/schematics/PublicUserSchematicList';
import type { Schematic } from '@/types';

interface PublicProfileProps {
  userId?: string; // Optional prop to directly pass user ID
}

const PublicProfile: React.FC<PublicProfileProps> = ({ userId: propUserId }) => {
  const { username } = useParams<{ username: string }>();
  const [error] = useState<string | null>(null);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  // Get current user to check if viewing own profile
  const currentUser = useUserStore((state) => state.user);
  const isOwnProfile =
    currentUser && (currentUser.$id === resolvedUserId || currentUser.name === username);

  // Effect to resolve user ID from username or use provided ID
  useEffect(() => {
    if (propUserId) {
      setResolvedUserId(propUserId);
    } else if (username) {
      // TODO: Implement username to user ID resolution
      // For now, assume username is actually the user ID
      // In a real app, you'd need a lookup service
      setResolvedUserId(username);
    } else if (currentUser) {
      // If no username and no prop, show current user's profile
      setResolvedUserId(currentUser.$id);
    }
  }, [propUserId, username, currentUser]);

  // Fetch public user data (when implemented)
  const { data: publicUser, isLoading: userLoading } = usePublicUser(resolvedUserId || undefined);

  // Fetch user data using public hooks
  const { data: userSchematics, isLoading: schematicsLoading } = usePublicUserSchematics(
    resolvedUserId || undefined
  );
  const { data: userAddons, isLoading: addonsLoading } = usePublicUserAddons(
    resolvedUserId || undefined
  );
  const { data: userBadges, isLoading: badgesLoading } = usePublicUserBadges(
    resolvedUserId || undefined
  );

  if (error) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    );
  }

  if (userLoading || schematicsLoading || addonsLoading || badgesLoading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Use current user data if viewing own profile, otherwise use public data
  const displayUser = isOwnProfile ? currentUser : publicUser;
  const displayName = displayUser?.name || username || 'Unknown User';
  const joinDate = displayUser?.$createdAt
    ? new Date(displayUser.$createdAt).toLocaleDateString()
    : 'Unknown';
  const avatar = displayUser?.prefs?.avatar;
  const bio = displayUser?.prefs?.bio;

  return (
    <div className='bg-background'>
      <div className='container mx-auto pt-8 sm:px-6 lg:px-8'>
        <div className='border-divider flex flex-col items-start gap-6 border-b pb-3 sm:flex-row'>
          {/* Avatar */}
          <div className='shrink-0'>
            {avatar ? (
              <img
                src={avatar}
                alt={`${displayName}'s profile`}
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
                <h2 className='text-foreground text-2xl font-bold'>{displayName}</h2>
                {bio && <p className='text-foreground-muted mt-1 text-sm'>{bio}</p>}
                <p className='text-foreground-muted text-xs'>Joined {joinDate}</p>
              </div>

              {/* Show edit button only for own profile */}
              {isOwnProfile && (
                <div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => (window.location.href = '/settings/profile')}
                    className='w-full sm:w-auto'
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>

            <div className='text-foreground-muted mt-4 flex flex-wrap items-center gap-6 text-sm'>
              <div className='flex items-center'>
                <Download className='mr-1 h-4 w-4' />
                <span>{userSchematics?.length || 0} schematics</span>
              </div>
              <div className='flex items-center'>
                <Package className='mr-1 h-4 w-4' />
                <span>{userAddons?.length || 0} addons</span>
              </div>
              <div className='flex items-center'>
                <Award className='mr-1 h-4 w-4' />
                <span>{userBadges?.length || 0} badges</span>
              </div>
              <div className='flex items-center'>
                <Users className='mr-1 h-4 w-4' />
                <span>0 followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schematics Section */}
        <div className='mt-8'>
          <h3 className='text-foreground mb-4 text-xl font-semibold'>
            {isOwnProfile ? 'My Schematics' : `${displayName}'s Schematics`}
          </h3>

          {/* Use existing UserSchematicList if own profile, or create public version */}
          {resolvedUserId && (
            <PublicUserSchematicList
              userId={resolvedUserId}
              isOwnProfile={isOwnProfile ?? false}
              schematics={(userSchematics as Schematic[]) || []}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
