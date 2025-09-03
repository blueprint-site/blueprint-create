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
import { Link } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks';
import { OctagonX } from 'lucide-react';
const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { data: addons, isLoading, error } = useFetchFeaturedAddons(true);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());

    api.on('select', updateCurrent);
    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  const scrollToIndex = (index: number) => {
    api?.scrollTo(index);
  };

  if (isLoading) {
    return (
      <div className='mx-auto flex h-full max-w-6xl items-center justify-center gap-4'>
        <Skeleton className='h-96 w-160 rounded-lg' />
        <Skeleton className='h-96 w-80 rounded-lg' />
      </div>
    );
  }

  if (error) {
    toast({
      className: 'bg-red-600 text-white',
      title: 'Error',
      description: (
        <div className='flex items-center gap-2'>
          <OctagonX className='h-5 w-5 text-white' />
          <span>Error loading addons!</span>
        </div>
      ),
    });
  }
  if (!addons || addons.length === 0) return <p>No featured addons available.</p>;

  const currentAddon = addons[current];
  const currentSlug = currentAddon?.slug ?? '#';

  return (
    <div className='mx-auto flex h-full max-w-6xl items-center justify-center gap-4'>
      <Button
        onClick={() => scrollToIndex(current - 1)}
        className='cursor-pointer rounded-full p-0'
        variant='icon'
      >
        <MinecraftIcon name='chevron-left' size={32} />
      </Button>

      <Link
        to={`/addons/${currentSlug}`}
        className='group relative flex-1 text-inherit no-underline'
      >
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
                  className='h-96 max-h-full w-full rounded-lg object-cover transition group-hover:brightness-80'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Link>

      <Link to={`/addons/${currentSlug}`} className='group h-96 w-80 text-inherit no-underline'>
        <Card className='bg-background h-full cursor-pointer transition'>
          <CardHeader>
            <CardTitle className='text-center text-2xl underline'>{currentAddon?.title}</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center p-4'>
            <img
              loading='lazy'
              className='h-auto max-h-30 w-full object-contain'
              src={currentAddon?.image_url}
              alt=''
            />
            <div className='mt-4 overflow-hidden'>
              <p className='line-clamp-4 text-sm'>{currentAddon?.description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>

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
