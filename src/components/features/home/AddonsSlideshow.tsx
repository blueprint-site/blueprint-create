import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Import your banner images here
import Banner1 from "@/assets/banners/banner1.webp";
import Banner2 from "@/assets/banners/banner2.webp";
import Banner3 from "@/assets/banners/banner3.webp";
import Banner4 from "@/assets/banners/banner4.webp";
import Banner5 from "@/assets/banners/banner5.webp";
import MinecraftIcon from "../../utility/MinecraftIcon";

const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const images = [Banner1, Banner2, Banner3, Banner4, Banner5];

  const sideboxContent = [
    {
      image:
        "https://cdn.modrinth.com/data/Dq3STxps/10e1b3796f2fcf5b70bb77110e68b59c750310ac_96.webp",
      title: "Create Railways navigator",
      description:
        "Get train connections in your world from one station to another using the Create Railways Navigator.",
    },
    {
      image:
        "https://cdn.modrinth.com/data/ZzjhlDgM/efac0150d612ab52768620dd53a7e8c27ce2fb0d_96.webp",
      title: "Create: Steam 'n' Rails",
      description: "Adding depth to Create's rail network & steam system",
    },
    {
      image:
        "https://cdn.modrinth.com/data/IAnP4np7/694d235f12ba11b0c6e6cd9428dab3cfcf233d10_96.webp",
      title: "Create: Structures",
      description:
        "Add-on for Create that implements naturally generating structures containing early-game Create contraptions and items.",
    },
    {
      image:
        "https://cdn.modrinth.com/data/GmjmRQ0A/d2d4a1a5cfc7f1ececf50dc977021c62654ccdc8_96.webp",
      title: "Create Slice & Dice",
      description: "Making automation for Farmers Delight more sensible",
    },
    {
      image:
        "https://cdn.modrinth.com/data/GWp4jCJj/39d228c7abac7bb782db7d3f203a24beb164455f_96.webp",
      title: "Create Big Cannons",
      description:
        "A Minecraft mod for building large cannons with the Create mod.",
    },
  ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    };
  }, [api]);

  const scrollToIndex = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="max-w-6xl mx-auto flex items-center justify-center h-full gap-4">
      <Button
        onClick={() => scrollToIndex(current + 1)}
        className="rounded-full p-0"
        variant="icon"
      >
        <MinecraftIcon name="chevron-left" size={32} />
      </Button>

      <div className="relative flex-1">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img 
                  loading="lazy"
                  src={image}
                  alt=""
                  className="max-h-full h-96 rounded-lg object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="w-80 h-96">
        <Card className="h-full bg-background">
          <CardHeader>
            <CardTitle className="text-2xl text-center underline">
              {sideboxContent[current].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <img 
              loading="lazy"
              className="h-full w-auto object-contain"
              src={sideboxContent[current].image}
              alt=""
            />
            <div className="mt-4 overflow-hidden">
              <p className="text-sm line-clamp-4">
                {sideboxContent[current].description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button
        onClick={() => scrollToIndex(current - 1)}
        className="rounded-full p-0"
        variant="icon"
      >
        <MinecraftIcon name="chevron-right" size={32} />
      </Button>
    </div>
  );
};

export default AddonsCarousel;
