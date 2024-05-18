import LazyLoad from "react-lazyload";

interface LazyImageProperties {
  src: string;
  alt: string;
  className?: string;
  height?: number | string;
  width?: number | string;
}

const LazyImage = ({ src, alt, className, height }: LazyImageProperties) => {
  return (
    <LazyLoad className={className} height={height} offset={150}>
      {/* The height and offset props control when the image should start loading */}
      <img src={src} alt={alt} height={height} />
    </LazyLoad>
  );
};

export default LazyImage;
