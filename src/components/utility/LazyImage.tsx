import { cn } from "@/lib/utils";
import LazyLoad from "react-lazyload";

interface LazyImageProperties {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  height?: number | string;
  width?: number | string;
  pixelated?: boolean;
}

interface LazyImageProperties {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  height?: number | string;
  width?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const LazyImage = ({ 
  src, 
  alt, 
  className,
  imgClassName,
  height, 
  width,
  objectFit = 'cover'
}: LazyImageProperties) => {
  return (
    <LazyLoad 
      className={className} 
      height={height} 
      offset={150}
    >
      <img 
        src={src} 
        alt={alt} 
        className={cn(imgClassName, "w-full h-full")}
        height={height}
        width={width}
        style={{ 
          objectFit,
          objectPosition: 'center'
        }}
      />
    </LazyLoad>
  );
};

export default LazyImage;