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

const LazyImage = ({ 
  src, 
  alt, 
  className,
  imgClassName,
  height, 
  width,
  pixelated = false
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
        className={imgClassName}
        height={height}
        width={width}
        style={{ 
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          imageRendering: pixelated ? 'pixelated' : 'auto'
        }}
      />
    </LazyLoad>
  );
};

export default LazyImage;