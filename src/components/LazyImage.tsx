import LazyLoad from 'react-lazyload';

interface LazyImageProperties {
    src: string,
    alt: string,
    height?: number | string,
    width?: number | string,
}

const LazyImage = ({ src, alt, height }: LazyImageProperties) => {
    return (
        <LazyLoad height={height} offset={150}>
            {/* The height and offset props control when the image should start loading */}
            <img src={src} alt={alt} height={height} />
        </LazyLoad>
    );
};

export default LazyImage;