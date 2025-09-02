import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/config/utils';
import { useToggleSchematicLike, useRateSchematic } from '@/api/appwrite/useSchematicVoting';
import { useUserStore } from '@/api/stores/userStore';
import { useStatsTracking } from '@/providers/StatsTrackingProvider';
import type { Schematic } from '@/types';

interface SchematicVotingProps {
  schematic: Schematic;
  className?: string;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SchematicVoting = ({
  schematic,
  className,
  showRating = true,
  size = 'md',
}: SchematicVotingProps) => {
  const user = useUserStore((state) => state.user);
  const { mutate: toggleLike, isPending: isLiking } = useToggleSchematicLike();
  const { mutate: rateSchematic, isPending: isRating } = useRateSchematic();
  const { trackLike } = useStatsTracking();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(schematic.likes || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  // Check if current user has liked this schematic
  useEffect(() => {
    if (user && schematic.liked_by) {
      setIsLiked(schematic.liked_by.includes(user.$id));
    }
  }, [user, schematic.liked_by]);

  // Update like count when schematic changes
  useEffect(() => {
    setLikeCount(schematic.likes || 0);
  }, [schematic.likes]);

  const handleLike = () => {
    if (!user) {
      // You might want to show a login modal here
      return;
    }

    toggleLike({
      schematicId: schematic.$id,
      currentLikes: likeCount,
      likedBy: schematic.liked_by || [],
    });

    // Track the like if we're adding a like (not removing)
    if (!isLiked && schematic.user_id) {
      trackLike(schematic.user_id, schematic.$id);
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleRating = (rating: number) => {
    if (!user) {
      return;
    }

    setSelectedRating(rating);
    rateSchematic({
      schematicId: schematic.$id,
      rating,
      currentRating: schematic.rating || 0,
      totalRatings: schematic.totalRatings || 0,
    });

    setShowRatingDialog(false);
  };

  const sizeClasses = {
    sm: {
      button: 'h-8 px-3 text-sm',
      icon: 'h-3 w-3',
      gap: 'gap-1',
    },
    md: {
      button: 'h-10 px-4',
      icon: 'h-4 w-4',
      gap: 'gap-2',
    },
    lg: {
      button: 'h-12 px-6 text-lg',
      icon: 'h-5 w-5',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex items-center', currentSize.gap, className)}>
      {/* Like Button */}
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size='default'
        onClick={handleLike}
        disabled={isLiking || !user}
        className={cn(
          'transition-all duration-300',
          currentSize.button,
          currentSize.gap,
          isLiked && 'border-red-500 bg-red-500 hover:bg-red-600'
        )}
      >
        <Heart
          className={cn(currentSize.icon, 'transition-all duration-300', isLiked && 'fill-current')}
        />
        <span className='font-medium'>{likeCount}</span>
      </Button>

      {/* Rating Display/Button */}
      {showRating && (
        <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='default'
              disabled={!user}
              className={cn('transition-all duration-300', currentSize.button, currentSize.gap)}
            >
              <Star className={cn(currentSize.icon, 'text-yellow-500')} />
              <span className='font-medium'>
                {schematic.rating ? schematic.rating.toFixed(1) : 'Rate'}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Rate this Schematic</DialogTitle>
              <DialogDescription>
                How would you rate &quot;{schematic.title}&quot;?
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center gap-4 py-4'>
              {/* Star Rating Selector */}
              <div className='flex gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={isRating}
                    className='transition-all duration-200 hover:scale-110'
                  >
                    <Star
                      className={cn(
                        'h-10 w-10 transition-all duration-200',
                        hoveredRating >= star || selectedRating >= star
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Description */}
              <div className='text-center'>
                <p className='text-muted-foreground text-sm'>
                  {hoveredRating === 1 && 'Poor'}
                  {hoveredRating === 2 && 'Fair'}
                  {hoveredRating === 3 && 'Good'}
                  {hoveredRating === 4 && 'Very Good'}
                  {hoveredRating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Current Rating Info */}
              {schematic.rating && (
                <div className='flex items-center gap-2 pt-2'>
                  <Badge variant='secondary'>Current Rating: {schematic.rating.toFixed(1)}/5</Badge>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Compact version for lists
export const SchematicVotingCompact = ({ schematic }: { schematic: Schematic }) => {
  const user = useUserStore((state) => state.user);
  const { mutate: toggleLike, isPending } = useToggleSchematicLike();
  const { trackLike } = useStatsTracking();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(schematic.likes || 0);

  useEffect(() => {
    if (user && schematic.liked_by) {
      setIsLiked(schematic.liked_by.includes(user.$id));
    }
  }, [user, schematic.liked_by]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    toggleLike({
      schematicId: schematic.$id,
      currentLikes: likeCount,
      likedBy: schematic.liked_by || [],
    });

    // Track the like if we're adding a like (not removing)
    if (!isLiked && schematic.user_id) {
      trackLike(schematic.user_id, schematic.$id);
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending || !user}
      className={cn(
        'flex items-center gap-1 rounded-md px-2 py-1 transition-all duration-200',
        'hover:bg-muted disabled:opacity-50',
        isLiked && 'text-red-500'
      )}
    >
      <Heart className={cn('h-4 w-4 transition-all duration-200', isLiked && 'fill-current')} />
      <span className='text-sm font-medium'>{likeCount}</span>
    </button>
  );
};
