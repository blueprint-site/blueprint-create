import React from 'react';
import { Dialog, DialogContent } from './dialog';
import Gallery from './gallery';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose} aria-label="Image lightbox">
      <DialogContent
        className="w-[calc(100vw-8rem)] max-w-[calc(100vw-8rem)] p-0 border-none bg-transparent"
      >
        <Gallery
          images={images}
          enableLightbox={false}
          className="lightbox-gallery"
          initialIndex={currentIndex}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
