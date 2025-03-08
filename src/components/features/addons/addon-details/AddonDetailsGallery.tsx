import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface AddonDetailsGalleryParams {
  addon_name: string;
  gallery_small: string[];
  gallery_hd?: string[];
}

export const AddonDetailsGallery = ({
  gallery_small = [],
  addon_name = '',
}: AddonDetailsGalleryParams) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log('gallery', gallery_small);

  const navigateGallery = async (direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : gallery_small.length - 1;
      }
      return prev < gallery_small.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='relative'>
          <div className='aspect-video overflow-hidden'>
            <img
              src={gallery_small[currentImageIndex]}
              alt={`${addon_name} screenshot ${currentImageIndex + 1}`}
              className='h-full w-full object-cover'
              loading='lazy'
            />
          </div>

          <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => navigateGallery('prev')}
              disabled={currentImageIndex === 0}
              className='bg-background/80 rounded-full backdrop-blur-xs'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              size='icon'
              onClick={() => navigateGallery('next')}
              disabled={currentImageIndex === gallery_small.length - 1}
              className='bg-background/80 rounded-full backdrop-blur-xs'
              aria-label='Next image'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          <div className='absolute inset-x-0 bottom-4 flex justify-center gap-1'>
            {gallery_small.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-primary' : 'bg-primary/30'
                }`}
                aria-label={`Go to image ${idx + 1}`}
                aria-current={idx === currentImageIndex}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
