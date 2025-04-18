import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

import { useFetchFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';

const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: addons, isLoading, error } = useFetchFeaturedAddons();

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  if (isLoading) return <p>Loading featured addons...</p>;
  if (error) return <p>Error loading addons!</p>;
  if (!addons || addons.length === 0) return <p>No featured addons found.</p>;

  return (
    <div className='w-full'>
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
      >
        <CarouselContent>
          {addons.map((addon, index) => (
            <CarouselItem key={index}>
              <Link
                to={`/addons/${addon.slug}`}
                className='relative flex h-[50vh] flex-col text-inherit no-underline transition hover:brightness-90'
              >
                <img
                  loading='lazy'
                  src={addon.banner_url}
                  alt={`${addon.title} banner`}
                  className='h-64 min-w-full object-cover'
                />
                <div className='bg-background w-full flex-1'>
                  <div className='flex h-full items-center justify-center gap-4 p-4'>
                    <img
                      loading='lazy'
                      className='h-20 object-contain'
                      src={addon.image_url}
                      alt={`${addon.title} logo`}
                    />
                    <div className='flex flex-col'>
                      <div className='pb-1 text-xl underline'>{addon.title}</div>
                      <div className='line-clamp-4 text-sm'>{addon.description}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AddonsCarousel;
