import React, { useEffect, useRef } from 'react';
import { Dialog } from './dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  setCurrent: (idx: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, setCurrent }) => {
  const mainApiRef = useRef<any>(null);

  useEffect(() => {
    if (!mainApiRef.current) return;
    mainApiRef.current.scrollTo(currentIndex);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrent((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, images.length, onClose, setCurrent]);

  return (
    <Dialog open onOpenChange={onClose} aria-label="Image lightbox">
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="relative max-w-3xl w-full">
          <Carousel setApi={api => (mainApiRef.current = api)} initialIndex={currentIndex}>
            <CarouselContent>
              {images.map((image, idx) => (
                <CarouselItem key={idx}>
                  <img
                    src={image}
                    alt={`Lightbox image ${idx + 1}`}
                    className="max-h-[80vh] mx-auto"
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/80 rounded-full p-2"
            aria-label="Close lightbox"
            autoFocus
          >
            ×
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Lightbox;
