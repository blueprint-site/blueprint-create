import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';
import Lightbox from './lightbox';

export interface GalleryProps {
  images: string[];
  enableLightbox?: boolean;
  alt?: string;
  showNavigation?: boolean;
  className?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, enableLightbox = false, alt = '', showNavigation = false, className }) => {
  const [mainApi, setMainApi] = useState<any>(null);
  const [thumbApi, setThumbApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Sync thumbnail carousel when main carousel changes
  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    const onMainSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbApi.scrollTo(selected);
    };
    mainApi.on('select', onMainSelect);
    return () => mainApi.off('select', onMainSelect);
  }, [mainApi, thumbApi]);

  // Sync main carousel when thumbnail is clicked
  const onThumbClick = useCallback((index: number) => {
    mainApi?.scrollTo(index);
  }, [mainApi]);

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

  return (
    <div className={className}>
      {/* Main image carousel */}
      <Carousel setApi={setMainApi} aria-label="Image gallery">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex justify-center items-center">
              <img
                src={image}
                alt={alt || `Image ${index + 1}`}
                loading="lazy"
                onClick={enableLightbox ? () => setLightboxOpen(true) : undefined}
                style={{ cursor: enableLightbox ? 'zoom-in' : undefined }}
                tabIndex={0}
                aria-label={`Open image ${index + 1} in lightbox`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation && (
          <>
            <CarouselPrevious />
            <CarouselNext />}
          </>
        )}
      </Carousel>

      {/* Thumbnail carousel */}
      <Carousel setApi={setThumbApi} opts={{ dragFree: true }} aria-label="Image thumbnails">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-1/6 flex justify-center items-center aspect-video">
              <button
                onClick={() => onThumbClick(index)}
                className={current === index ? 'ring-2 ring-primary' : ''}
                aria-label={`Select image ${index + 1}`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} loading="lazy" />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Optional lightbox */}
      {enableLightbox && lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={current}
          onClose={() => setLightboxOpen(false)}
          setCurrent={setCurrent}
        />
      )}
    </div>
  );
};

export default Gallery;
