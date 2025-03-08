import { CardHeader } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Download, Heart, Star, StarOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator.tsx';
import { useCollectionStore } from '@/api/stores/collectionStore.ts';
import { useParams } from 'react-router';

export interface AddonDetailsHeaderParams {
  title: string;
  description: string;
  downloads: number;
  follows: number;
  icon: string;
}
export const AddonDetailsHeader = ({
  title = '',
  description = '',
  downloads = 0,
  follows = 0,
  icon = '',
}: AddonDetailsHeaderParams) => {
  const { slug } = useParams();
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(slug || '');
  const handleCollectionAction = () => {
    if (!slug) return;
    isInCollection ? removeAddon(slug) : addAddon(slug);
  };
  return (
    <CardHeader className='space-y-6'>
      <div className='flex items-start gap-4'>
        <img src={icon} alt={`${title} icon`} className='h-16 w-16 rounded-lg border' />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between'>
            <h1 className='mb-2 truncate text-2xl font-bold'>{title}</h1>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={handleCollectionAction}
            >
              {isInCollection ? <Star /> : <StarOff />}
            </Button>
          </div>
          <p className='text-foreground-muted'>{description}</p>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Download className='h-4 w-4' />
          <span className='text-foreground-muted'>{downloads.toLocaleString()} downloads</span>
        </div>
        {follows && (
          <div className='flex items-center gap-2'>
            <Heart className='h-4 w-4' />
            <span className='text-foreground-muted'>{follows.toLocaleString()} followers</span>
          </div>
        )}
        <Separator />
      </div>
    </CardHeader>
  );
};
