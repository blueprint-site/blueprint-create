import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogClose } from './dialog';
import { Button } from './button';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  Loader2
} from 'lucide-react';
import { cn } from '@/config/utils.ts';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  alt?: string;
}

const Lightbox: React.FC<LightboxProps> = ({ 
  images, 
  currentIndex: initialIndex, 
  onClose,
  alt = 'Gallery image'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom, rotation, and position when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setLastPosition({ x: 0, y: 0 });
    setVelocity({ x: 0, y: 0 });
    setImageLoading(true);
    setImageError(false);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          resetTransform();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5);
    const zoomRatio = newZoom / zoom;
    setZoom(newZoom);
    setPosition(prev => ({ x: prev.x * zoomRatio, y: prev.y * zoomRatio }));
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    const zoomRatio = newZoom / zoom;
    setZoom(newZoom);
    setPosition(prev => ({ x: prev.x * zoomRatio, y: prev.y * zoomRatio }));
  }, [zoom]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setLastPosition({ x: 0, y: 0 });
    setVelocity({ x: 0, y: 0 });
  }, []);

  // Handle mouse drag for panning - much more responsive implementation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setDragStart({ 
      x: startX - position.x, 
      y: startY - position.y 
    });
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const newX = currentX - dragStart.x;
    const newY = currentY - dragStart.y;
    
    // Calculate velocity for smoother feel
    const velocityX = e.clientX - lastPosition.x;
    const velocityY = e.clientY - lastPosition.y;
    
    setPosition({ x: newX, y: newY });
    setVelocity({ x: velocityX, y: velocityY });
    setLastPosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, zoom, lastPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Apply momentum/inertia effect
    if (Math.abs(velocity.x) > 2 || Math.abs(velocity.y) > 2) {
      const momentumFactor = 0.85;
      let currentVelX = velocity.x * momentumFactor;
      let currentVelY = velocity.y * momentumFactor;
      
      const applyMomentum = () => {
        if (Math.abs(currentVelX) < 0.5 && Math.abs(currentVelY) < 0.5) return;
        
        setPosition(prev => ({
          x: prev.x + currentVelX,
          y: prev.y + currentVelY
        }));
        
        currentVelX *= 0.92;
        currentVelY *= 0.92;
        
        requestAnimationFrame(applyMomentum);
      };
      
      requestAnimationFrame(applyMomentum);
    }
  }, [isDragging, velocity]);

  // Touch handlers for mobile responsiveness
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    setDragStart({ 
      x: touchX - position.x, 
      y: touchY - position.y 
    });
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  }, [zoom, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    const newX = currentX - dragStart.x;
    const newY = currentY - dragStart.y;
    
    // Calculate velocity for momentum
    const velocityX = touch.clientX - lastPosition.x;
    const velocityY = touch.clientY - lastPosition.y;
    
    setPosition({ x: newX, y: newY });
    setVelocity({ x: velocityX, y: velocityY });
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  }, [isDragging, dragStart, zoom, lastPosition]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Apply stronger momentum for touch
    if (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1) {
      const momentumFactor = 1.2; // Stronger initial momentum for touch
      let currentVelX = velocity.x * momentumFactor;
      let currentVelY = velocity.y * momentumFactor;
      
      const applyMomentum = () => {
        if (Math.abs(currentVelX) < 0.3 && Math.abs(currentVelY) < 0.3) return;
        
        setPosition(prev => ({
          x: prev.x + currentVelX,
          y: prev.y + currentVelY
        }));
        
        currentVelX *= 0.9;
        currentVelY *= 0.9;
        
        requestAnimationFrame(applyMomentum);
      };
      
      requestAnimationFrame(applyMomentum);
    }
  }, [isDragging, velocity]);

  // Handle wheel zoom - center-based zooming (much better UX)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Calculate zoom factor - more responsive
    const zoomSpeed = 0.15;
    const delta = e.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
    const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
    
    if (newZoom === zoom) return; // No change needed
    
    // For center-based zooming, we maintain the current position
    // and only adjust it slightly to keep the image centered
    const zoomRatio = newZoom / zoom;
    const newX = position.x * zoomRatio;
    const newY = position.y * zoomRatio;
    
    setZoom(newZoom);
    setPosition({ x: newX, y: newY });
  }, [zoom, position]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [images, currentIndex]);

  const currentImage = images[currentIndex];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent 
        ref={containerRef}
        className={cn(
          "w-screen h-screen max-w-none max-h-none p-0 border-none bg-black/95 backdrop-blur-sm",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200"
        )}
        aria-label={`Image ${currentIndex + 1} of ${images.length}`}
      >
        {/* Header with controls */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.1}
                className="text-white hover:bg-white/20"
                title="Zoom out (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-white text-sm min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="text-white hover:bg-white/20"
                title="Zoom in (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              {/* Transform Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/20"
                title="Rotate (R)"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Download */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </Button>

              {/* Close */}
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>

        {/* Main image container */}
        <div 
          className={cn(
            "flex-1 flex items-center justify-center relative overflow-hidden transition-transform duration-75",
            isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: zoom > 1 ? 'none' : 'auto' }}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {imageError ? (
            <div className="text-white text-center">
              <X className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Failed to load image</p>
            </div>
          ) : (
            <img
              ref={imageRef}
              src={currentImage}
              alt={`${alt} ${currentIndex + 1}`}
              className={cn(
                "max-w-full max-h-full object-contain select-none pointer-events-none",
                "transition-transform duration-75 ease-out"
              )}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
              title="Previous image (←)"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
              title="Next image (→)"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Thumbnail strip at bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex justify-center gap-2 overflow-x-auto max-w-full">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all",
                    index === currentIndex 
                      ? "border-white shadow-lg scale-110" 
                      : "border-white/30 hover:border-white/60"
                  )}
                  title={`Go to image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center opacity-60 animate-pulse">
          <p>Arrow keys: navigate • Mouse wheel: zoom • Drag: pan • R: rotate • 0: reset</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
