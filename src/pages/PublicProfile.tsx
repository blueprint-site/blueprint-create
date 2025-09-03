import React from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Users } from 'lucide-react';
import { useUser } from '@/api/appwrite/useUser';
import { useFollowersCount, useFollowingCount } from '@/api/appwrite/useUserFollow';
import { UserStatsDisplay } from '@/components/features/profile/UserStatsDisplay';
import { FollowButton } from '@/components/features/profile/FollowButton';
import { Skeleton } from '@/components/ui/skeleton';

export const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading: isLoadingUser } = useUser(userId || '');
  const { data: followersCount, isLoading: isLoadingFollowers } = useFollowersCount(userId || '');
  const { data: followingCount, isLoading: isLoadingFollowing } = useFollowingCount(userId || '');

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">User not found</h3>
              <p className="text-muted-foreground">The user you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinedDate = new Date(user.$createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary ring-2 ring-border">
                  <User className="h-10 w-10 text-secondary-foreground" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold truncate">{user.name}</h1>
                {user.emailVerification && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              
              {user.username && (
                <p className="text-muted-foreground mb-2">@{user.username}</p>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>

            {/* Follow Button */}
            <div className="shrink-0">
              <FollowButton 
                targetUserId={user.$id} 
                targetUserName={user.name}
                size="default"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <p className="text-sm leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                {isLoadingFollowing ? (
                  <Skeleton className="h-4 w-8 inline-block" />
                ) : (
                  followingCount || 0
                )}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                {isLoadingFollowers ? (
                  <Skeleton className="h-4 w-8 inline-block" />
                ) : (
                  followersCount || 0
                )}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <UserStatsDisplay userId={user.$id} variant="full" />
    </div>
  );
};