import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import MinecraftIcon from '../../utility/MinecraftIcon';
import { useFetchFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';

const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { data: addons, isLoading, error } = useFetchFeaturedAddons();
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off('select', () => {
        setCurrent(api.selectedScrollSnap());
      });
    };
  }, [api]);

  const scrollToIndex = (index: number) => {
    api?.scrollTo(index);
  };

  if (isLoading) return <p>Loading addons...</p>;
  if (error) return <p>Error loading addons!</p>;
  if (!addons || addons.length === 0) return <p>No featured addons available.</p>;

  return (
    <div className='mx-auto flex h-full max-w-6xl items-center justify-center gap-4'>
      <Button
        onClick={() => scrollToIndex(current - 1)}
        className='cursor-pointer rounded-full p-0'
        variant='icon'
      >
        <MinecraftIcon name='chevron-left' size={32} />
      </Button>

      <div className='relative flex-1'>
        <Carousel
          setApi={setApi}
          opts={{ align: 'end', loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
        >
          <CarouselContent>
            {addons.map((addon, index) => (
              <CarouselItem key={index}>
                <img
                  loading='lazy'
                  src={addon.banner_url}
                  alt=''
                  className='h-96 max-h-full rounded-lg'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='h-96 w-80'>
        <Card className='bg-background h-full'>
          <CardHeader>
            <CardTitle className='text-center text-2xl underline'>
              {addons[current]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center p-4'>
            <img
              loading='lazy'
              className='h-full w-auto object-contain'
              src={addons[current]?.image_url}
              alt=''
            />
            <div className='mt-4 overflow-hidden'>
              <p className='line-clamp-4 text-sm'>{addons[current]?.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={() => scrollToIndex(current + 1)}
        className='cursor-pointer rounded-full p-0'
        variant='icon'
      >
        <MinecraftIcon name='chevron-right' size={32} />
      </Button>
    </div>
  );
};

export default AddonsCarousel;
