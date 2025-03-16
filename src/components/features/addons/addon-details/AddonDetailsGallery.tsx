import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ModrinthGalleryImage } from '@/api/endpoints/useModrinthProject';

export interface AddonDetailsGalleryParams {
  addon_name: string;
  gallery_small: string[] | ModrinthGalleryImage[];
  gallery_hd?: string[];
}

export const AddonDetailsGallery = ({
  gallery_small = [],
  gallery_hd,
  addon_name = '',
}: AddonDetailsGalleryParams) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Handle both string arrays and ModrinthGalleryImage arrays
  const normalizedGallery = gallery_small.map((item) => {
    if (typeof item === 'string') {
      return { url: item };
    }
    return item;
  });

  // Use HD images if available, otherwise use the gallery from the main API
  const displayImages = gallery_hd || normalizedGallery.map((img) => img.url);

  const navigateGallery = (direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : normalizedGallery.length - 1;
      }
      return prev < normalizedGallery.length - 1 ? prev + 1 : 0;
    });
  };

  const openFullscreen = () => {
    setFullscreenIndex(currentImageIndex);
  };

  const navigateFullscreen = (direction: 'prev' | 'next') => {
    setFullscreenIndex((prev) => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : normalizedGallery.length - 1;
      }
      return prev < normalizedGallery.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <CardContent className='py-6'>
      <h2 className='mb-4 text-xl font-semibold'>Gallery</h2>

      <div className='relative'>
        <div className='aspect-video overflow-hidden rounded-lg'>
          <img
            src={displayImages[currentImageIndex]}
            alt={`${addon_name} screenshot ${currentImageIndex + 1}`}
            className='h-full w-full object-cover transition-all duration-300 hover:scale-105'
            loading='lazy'
          />
        </div>

        {/* Navigation Controls */}
        <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => navigateGallery('prev')}
            disabled={normalizedGallery.length <= 1}
            className='bg-background/70 hover:bg-background/90 h-9 w-9 rounded-full border-white/20 shadow-md backdrop-blur-sm'
            aria-label='Previous image'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>

          <div className='flex gap-2'>
            {/* Fullscreen Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={openFullscreen}
                  className='bg-background/70 hover:bg-background/90 h-9 w-9 rounded-full border-white/20 shadow-md backdrop-blur-sm'
                  aria-label='View fullscreen'
                >
                  <Maximize2 className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-background/95 max-w-4xl p-0 backdrop-blur-md'>
                <div className='relative'>
                  <img
                    src={displayImages[fullscreenIndex]}
                    alt={`${addon_name} screenshot ${fullscreenIndex + 1}`}
                    className='w-full object-contain'
                  />
                  <div className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => navigateFullscreen('prev')}
                      disabled={normalizedGallery.length <= 1}
                      className='bg-background/70 h-9 w-9 rounded-full shadow-md backdrop-blur-sm'
                    >
                      <ChevronLeft className='h-5 w-5' />
                    </Button>

                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => navigateFullscreen('next')}
                      disabled={normalizedGallery.length <= 1}
                      className='bg-background/70 h-9 w-9 rounded-full shadow-md backdrop-blur-sm'
                    >
                      <ChevronRight className='h-5 w-5' />
                    </Button>
                  </div>

                  <div className='absolute inset-x-0 bottom-4 flex justify-center'>
                    <div className='bg-background/80 rounded-full px-3 py-1 text-sm backdrop-blur-sm'>
                      {fullscreenIndex + 1} / {normalizedGallery.length}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant='outline'
              size='icon'
              onClick={() => navigateGallery('next')}
              disabled={normalizedGallery.length <= 1}
              className='bg-background/70 hover:bg-background/90 h-9 w-9 rounded-full border-white/20 shadow-md backdrop-blur-sm'
              aria-label='Next image'
            >
              <ChevronRight className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Thumbnail Indicators */}
        {normalizedGallery.length > 1 && (
          <div className='absolute inset-x-0 bottom-4 flex justify-center gap-2'>
            <div className='bg-background/70 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-sm'>
              {normalizedGallery.map((image, idx) => (
                <button
                  key={`dot-${idx}-${image.url.substring(0, 8)}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'bg-primary w-6'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                  aria-current={idx === currentImageIndex}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {normalizedGallery.length > 1 && (
        <div className='mt-4 hidden gap-2 overflow-x-auto py-2 sm:flex'>
          {normalizedGallery.map((image, idx) => (
            <button
              key={`thumb-${idx}-${image.url.substring(0, 8)}`}
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                idx === currentImageIndex
                  ? 'border-primary scale-105 shadow-md'
                  : 'hover:border-primary/30 border-transparent'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${idx + 1}`}
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </button>
          ))}
        </div>
      )}
    </CardContent>
  );
};
