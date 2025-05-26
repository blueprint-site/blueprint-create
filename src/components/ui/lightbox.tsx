import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import Gallery from './gallery';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  setCurrent: (idx: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, setCurrent }) => {
  return (
    <Dialog open onOpenChange={onClose} aria-label="Image lightbox">
      <DialogContent
        className="w-[calc(100vw-8rem)] max-w-[calc(100vw-8rem)] p-0 border-none bg-transparent"
      >
        <Gallery 
          images={images}
          enableLightbox={false}
          className="lightbox-gallery"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
