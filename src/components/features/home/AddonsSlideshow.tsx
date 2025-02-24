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

const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const addons = [
    {
      image:
        'https://cdn.modrinth.com/data/Dq3STxps/10e1b3796f2fcf5b70bb77110e68b59c750310ac_96.webp',
      banner:
        'https://cdn.modrinth.com/data/Dq3STxps/images/f6486f7c9d0b2aee956402a864af9347c607ee0a.png',
      title: 'Create Railways navigator',
      description:
        'Get train connections in your world from one station to another using the Create Railways Navigator.',
    },
    {
      image:
        'https://cdn.modrinth.com/data/ZzjhlDgM/efac0150d612ab52768620dd53a7e8c27ce2fb0d_96.webp',
      banner:
        'https://cdn.modrinth.com/data/ZzjhlDgM/images/b541ced05f30da9024e30f28d3cd83520bb1a45f.webp',
      title: "Create: Steam 'n' Rails",
      description: "Adding depth to Create's rail network & steam system",
    },
    {
      image:
        'https://cdn.modrinth.com/data/IAnP4np7/694d235f12ba11b0c6e6cd9428dab3cfcf233d10_96.webp',
      banner:
        'https://cdn.modrinth.com/data/IAnP4np7/images/2d9a9fd558fb43cd353877b781c99dbe9bd4c951.png',
      title: 'Create: Structures',
      description:
        'Add-on for Create that implements naturally generating structures containing early-game Create contraptions and items.',
    },
    {
      image:
        'https://cdn.modrinth.com/data/qO4lsa4Y/6cde3fe229550facc592976a0ac1852dbde10a7e_96.webp',
      banner:
        'https://raw.githubusercontent.com/Rabbitminers/Extended-Cogwheels/multiloader-1.18.2/showcase/wooden_showcase.png',
      title: 'Create: Extended Cogwheels',
      description:
        "This mod is an add-on to Create adding new materials to cogwheels to help with decoration and organisation. For more decorations for create check out Dave's building extended, Powderlogy & Illumination and Extended Flywheels",
    },
    {
      image:
        'https://cdn.modrinth.com/data/GWp4jCJj/39d228c7abac7bb782db7d3f203a24beb164455f_96.webp',
      title: 'Create Big Cannons',
      banner: 'https://imgur.com/dx9298q.png',
      description: 'A Minecraft mod for building large cannons with the Create mod.',
    },
  ];

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

  return (
    <div className='mx-auto flex h-full max-w-6xl items-center justify-center gap-4'>
      <Button
        onClick={() => scrollToIndex(current - 1)}
        className='rounded-full p-0'
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
                  src={addon.banner}
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
              {addons[current].title}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center p-4'>
            <img
              loading='lazy'
              className='h-full w-auto object-contain'
              src={addons[current].image}
              alt=''
            />
            <div className='mt-4 overflow-hidden'>
              <p className='line-clamp-4 text-sm'>{addons[current].description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button
        onClick={() => scrollToIndex(current + 1)}
        className='rounded-full p-0'
        variant='icon'
      >
        <MinecraftIcon name='chevron-right' size={32} />
      </Button>
    </div>
  );
};

export default AddonsCarousel;
