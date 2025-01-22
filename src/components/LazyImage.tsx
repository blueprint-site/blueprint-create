import LazyLoad from "react-lazyload";

interface LazyImageProperties {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  height?: number | string;
  width?: number | string;
}

const LazyImage = ({ 
  src, 
  alt, 
  className,
  imgClassName,
  height, 
  width 
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
          objectPosition: 'center'
        }}
      />
    </LazyLoad>
  );
};

export default LazyImage;