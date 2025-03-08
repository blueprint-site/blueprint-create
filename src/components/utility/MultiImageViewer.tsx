import { useState, useEffect } from 'react';

interface MultiImageViewerProps {
  images: string[];
}

export function MultiImageViewer({ images }: MultiImageViewerProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Update the active image when the images array changes
  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    } else {
      setActiveImage(null);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className='bg-surface-2 flex h-48 w-full items-center justify-center rounded-lg'>
        <p className='text-foreground-muted'>No images to display</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Large Active Image */}
      <div className='w-full'>
        <img
          src={activeImage || images[0]}
          alt='Active Preview'
          className='h-auto w-full rounded-lg object-cover shadow-md'
        />
      </div>

      {/* Thumbnails */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(image)}
            className={`flex-shrink-0 ${
              activeImage === image ? 'ring-primary ring-2' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className='h-16 w-16 rounded-lg object-cover' />
          </button>
        ))}
      </div>
    </div>
  );
}
