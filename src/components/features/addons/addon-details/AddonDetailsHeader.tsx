import { Download, Heart, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollectionStore } from '@/api/stores/collectionStore';
import { CardHeader } from '@/components/ui/card';

export interface AddonDetailsHeaderProps {
  name: string;
  description: string;
  slug: string;
  icon: string;
  downloads: number;
  follows: number;
}

export const AddonDetailsHeader = ({
  name,
  description,
  slug,
  icon,
  downloads,
  follows,
}: AddonDetailsHeaderProps) => {
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(slug);

  const handleCollectionAction = () => {
    if (!slug) {
      if (isInCollection) {
        return removeAddon(slug);
      } else {
        return addAddon(slug);
      }
    }
  };

  return (
    <CardHeader className='space-y-6'>
      <div className='flex items-start gap-4'>
        <img src={icon} alt={`${name} icon`} className='h-20 w-20 rounded-lg border shadow-sm' />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between'>
            <h1 className='mb-2 text-3xl font-bold'>{name}</h1>
            <Button
              variant={isInCollection ? 'default' : 'outline'}
              size='sm'
              className='gap-1.5'
              onClick={handleCollectionAction}
            >
              {isInCollection ? <Star className='h-4 w-4' /> : <StarOff className='h-4 w-4' />}
              {isInCollection ? 'Saved' : 'Save'}
            </Button>
          </div>
          <p className='text-muted-foreground text-md'>{description}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Download className='text-muted-foreground h-4 w-4' />
          <span className='text-muted-foreground'>{downloads.toLocaleString()} downloads</span>
        </div>
        {follows > 0 && (
          <div className='flex items-center gap-2'>
            <Heart className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground'>{follows.toLocaleString()} followers</span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};
