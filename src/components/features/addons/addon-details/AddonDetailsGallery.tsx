import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProcessedAddonData } from '@/types/addons/addon-details';
import { ModrinthGalleryImage } from '@/api/endpoints/useModrinth';

export interface AddonDetailsGalleryProps {
  data: Pick<ProcessedAddonData, 'basic' | 'gallery'>;
}

export const AddonDetailsGallery = ({ data }: AddonDetailsGalleryProps) => {
  const { basic, gallery } = data;

  // Initialize states early - before any conditional returns
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  // Make sure we have a reference to the name that works with conditionals
  const name = useMemo(() => basic.name, [basic]);

  // Handle both string arrays and ModrinthGalleryImage arrays
  // Moved all hooks to the top level, before any conditionals
  const normalizedGallery = useMemo(() => {
    if (!gallery) return [];

    const gallery_small = gallery.small;
    return gallery_small.map((item) => {
      if (typeof item === 'string') {
        return { url: item };
      }
      return item as unknown as ModrinthGalleryImage;
    });
  }, [gallery]);

  // Use HD images if available, otherwise use the gallery from the main API
  const displayImages = useMemo(() => {
    if (!gallery) return [];
    return gallery.hd || normalizedGallery.map((img) => img.url);
  }, [gallery, normalizedGallery]);

  // Initialize image loading state
  useEffect(() => {
    if (normalizedGallery.length > 0) {
      setImagesLoaded(new Array(normalizedGallery.length).fill(false));
    }
  }, [normalizedGallery.length]);

  // All hooks are now at the top level, so this is safe
  // Now we use a render-time conditional instead of early return
  if (!gallery) {
    return null;
  }

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

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
      <div className='relative'>
        <div className='bg-muted/30 aspect-video overflow-hidden rounded-lg'>
          {/* Using a container with fixed aspect ratio to prevent layout shifts */}
          <img
            src={displayImages[currentImageIndex]}
            alt={`${name} screenshot ${currentImageIndex + 1}`}
            className={`h-full w-full object-cover transition-all duration-300 hover:scale-105 ${
              imagesLoaded[currentImageIndex] ? 'opacity-100' : 'opacity-0'
            }`}
            loading='lazy'
            onLoad={() => handleImageLoad(currentImageIndex)}
            width={800}
            height={450}
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
                    alt={`${name} screenshot ${fullscreenIndex + 1}`}
                    className='w-full object-contain'
                    width={1200}
                    height={800}
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
              {normalizedGallery.map((_, idx) => (
                <button
                  key={`dot-${normalizedGallery[idx]?.url || idx}`}
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
              key={`thumb-${normalizedGallery[idx]?.url || idx}`}
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
                width={96}
                height={64}
              />
            </button>
          ))}
        </div>
      )}
    </CardContent>
  );
};
