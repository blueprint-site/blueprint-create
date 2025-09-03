import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

import { Skeleton } from '@/components/ui/skeleton';

import { useFetchFeaturedAddons } from '@/api/endpoints/useFeaturedAddons';
import { toast } from '@/hooks';
import { OctagonX } from 'lucide-react';

const AddonsCarousel = () => {
  const { data: addons, isLoading, error } = useFetchFeaturedAddons(true);

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
  if (isLoading) {
    return (
      <div className='w-full'>
        <Skeleton className='h-[50vh]' />
      </div>
    );
  }
  if (!addons || addons.length === 0) return <p>No featured addons found.</p>;

  return (
    <div className='w-full'>
      <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 5000 })]}>
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
