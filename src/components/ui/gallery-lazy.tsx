import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from './carousel';
import { Skeleton } from './skeleton';
import Lightbox from './lightbox';
import { cn } from '@/config/utils';

export interface GalleryLazyProps {
  images: string[];
  enableLightbox?: boolean;
  alt?: string;
  showNavigation?: boolean;
  className?: string;
  initialIndex?: number;
  priority?: boolean; // Load first image immediately
}

interface ImageState {
  [key: string]: 'loading' | 'loaded' | 'error';
}

const GalleryLazy: React.FC<GalleryLazyProps> = ({
  images,
  enableLightbox = false,
  alt = '',
  showNavigation = false,
  className,
  initialIndex = 0,
  priority = false,
}) => {
  const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
  const [thumbApi, setThumbApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageStates, setImageStates] = useState<ImageState>({});
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set([initialIndex]));

  // Track which images should be loaded based on viewport
  useEffect(() => {
    if (!mainApi) return;
    
    const updateVisibleImages = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      
      // Load current, previous, and next images
      const toLoad = new Set<number>();
      toLoad.add(selected);
      if (selected > 0) toLoad.add(selected - 1);
      if (selected < images.length - 1) toLoad.add(selected + 1);
      
      setVisibleImages(prev => new Set([...prev, ...toLoad]));
    };

    mainApi.on('select', updateVisibleImages);
    updateVisibleImages(); // Initial load
    
    return () => {
      mainApi.off('select', updateVisibleImages);
    };
  }, [mainApi, images.length]);

  // Sync thumbnail carousel when main carousel changes
  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    const onMainSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbApi.scrollTo(selected);
    };
    mainApi.on('select', onMainSelect);
    return () => {
      mainApi.off('select', onMainSelect);
    };
  }, [mainApi, thumbApi]);

  // Sync main carousel when thumbnail is clicked
  const onThumbClick = useCallback((index: number) => {
    mainApi?.scrollTo(index);
    // Preload the clicked image
    setVisibleImages(prev => new Set([...prev, index]));
  }, [mainApi]);

  // Handle image load states
  const handleImageLoad = useCallback((src: string) => {
    setImageStates(prev => ({ ...prev, [src]: 'loaded' }));
  }, []);

  const handleImageError = useCallback((src: string) => {
    setImageStates(prev => ({ ...prev, [src]: 'error' }));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!enableLightbox || !lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') mainApi?.scrollTo((current + 1) % images.length);
      if (e.key === 'ArrowLeft') mainApi?.scrollTo((current - 1 + images.length) % images.length);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enableLightbox, lightboxOpen, current, images.length, mainApi]);

  // Preload images when they become visible
  useEffect(() => {
    visibleImages.forEach(index => {
      if (images[index] && !imageStates[images[index]]) {
        setImageStates(prev => ({ ...prev, [images[index]]: 'loading' }));
      }
    });
  }, [visibleImages, images, imageStates]);

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Main image carousel */}
      <Carousel setApi={setMainApi} opts={{ startIndex: initialIndex }} aria-label="Image gallery" className="w-full h-full">
        <CarouselContent className="h-full -ml-0">
          {images.map((image, index) => {
            const shouldLoad = priority && index === 0 ? true : visibleImages.has(index);
            const isLoaded = imageStates[image] === 'loaded';
            const hasError = imageStates[image] === 'error';
            
            return (
              <CarouselItem key={index} className="h-full pl-0 basis-full">
                <div className="relative w-full h-full">
                  {/* Skeleton loader */}
                  {!isLoaded && !hasError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Skeleton className="w-full h-full rounded-lg" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {hasError && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted rounded-lg p-8">
                      <svg
                        className="w-16 h-16 text-muted-foreground mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-muted-foreground">Failed to load image</p>
                    </div>
                  )}
                  
                  {/* Actual image */}
                  {shouldLoad && !hasError && (
                    <img
                      src={image}
                      alt={alt || `Image ${index + 1}`}
                      loading={priority && index === 0 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(image)}
                      onError={() => handleImageError(image)}
                      onClick={enableLightbox && isLoaded ? () => setLightboxOpen(true) : undefined}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0",
                        enableLightbox && isLoaded && "cursor-zoom-in"
                      )}
                      tabIndex={0}
                      aria-label={`Open image ${index + 1} in lightbox`}
                    />
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {showNavigation && images.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      {/* Thumbnail carousel - only show if more than one image */}
      {images.length > 1 && (
        <Carousel setApi={setThumbApi} opts={{ dragFree: true, startIndex: initialIndex }} aria-label="Image thumbnails" className="mt-4">
          <CarouselContent className="-ml-2">
            {images.map((image, index) => {
              const isThumbLoaded = imageStates[`thumb-${image}`] === 'loaded';
              
              return (
                <CarouselItem key={index} className="basis-1/5 sm:basis-1/6 md:basis-1/7 pl-2">
                  <button
                    onClick={() => onThumbClick(index)}
                    className={cn(
                      "relative overflow-hidden rounded-md border-2 transition-all",
                      current === index 
                        ? "border-primary ring-2 ring-primary ring-offset-2" 
                        : "border-transparent hover:border-muted-foreground/50"
                    )}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <div className="relative aspect-video">
                      {!isThumbLoaded && (
                        <Skeleton className="absolute inset-0" />
                      )}
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`} 
                        loading="lazy"
                        onLoad={() => setImageStates(prev => ({ ...prev, [`thumb-${image}`]: 'loaded' }))}
                        onError={() => setImageStates(prev => ({ ...prev, [`thumb-${image}`]: 'error' }))}
                        className={cn(
                          "w-full h-full object-cover transition-opacity duration-200",
                          isThumbLoaded ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}

      {/* Optional lightbox */}
      {enableLightbox && lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={current}
          onClose={() => setLightboxOpen(false)}
          alt={alt}
        />
      )}
    </div>
  );
};

export default GalleryLazy;