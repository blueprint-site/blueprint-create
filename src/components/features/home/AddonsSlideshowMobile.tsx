import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const AddonsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();

  const addons = [
    {
      image:
        "https://cdn.modrinth.com/data/Dq3STxps/10e1b3796f2fcf5b70bb77110e68b59c750310ac_96.webp",
      banner:
        "https://cdn.modrinth.com/data/Dq3STxps/images/f6486f7c9d0b2aee956402a864af9347c607ee0a.png",
      title: "Create Railways Navigator",
      description:
        "Get train connections in your world from one station to another using the Create Railways Navigator.",
    },
    {
      image:
        "https://cdn.modrinth.com/data/ZzjhlDgM/efac0150d612ab52768620dd53a7e8c27ce2fb0d_96.webp",
      banner:
        "https://cdn.modrinth.com/data/ZzjhlDgM/images/b541ced05f30da9024e30f28d3cd83520bb1a45f.webp",
      title: "Create: Steam 'n' Rails",
      description: "Adding depth to Create's rail network & steam system",
    },
    {
      image:
        "https://cdn.modrinth.com/data/IAnP4np7/694d235f12ba11b0c6e6cd9428dab3cfcf233d10_96.webp",
      banner: "https://cdn.modrinth.com/data/IAnP4np7/images/2d9a9fd558fb43cd353877b781c99dbe9bd4c951.png",
      title: "Create: Structures",
      description:
        "Add-on for Create that implements naturally generating structures containing early-game Create contraptions and items.",
    },
    {
      image:
        "https://cdn.modrinth.com/data/qO4lsa4Y/6cde3fe229550facc592976a0ac1852dbde10a7e_96.webp",
      banner:
        "https://raw.githubusercontent.com/Rabbitminers/Extended-Cogwheels/multiloader-1.18.2/showcase/wooden_showcase.png",
      title: "Create: Extended Cogwheels",
      description:
        "This mod is an add-on to Create adding new materials to cogwheels to help with decoration and organisation. For more decorations for create check out Dave's building extended, Powderlogy & Illumination and Extended Flywheels",
    },
    {
      image:
        "https://cdn.modrinth.com/data/GWp4jCJj/39d228c7abac7bb782db7d3f203a24beb164455f_96.webp",
      title: "Create Big Cannons",
      banner: "https://imgur.com/dx9298q.png",
      description:
        "A Minecraft mod for building large cannons with the Create mod.",
    },
  ];

  useEffect(() => {
    if (!api) return;
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000 })]}
      >
        <CarouselContent>
          {addons.map((addon, index) => (
            <CarouselItem key={index}>
              <div className=" flex flex-col relative h-[50vh]">
                <img
                  loading="lazy"
                  src={addon.banner}
                  alt=""
                  className="min-w-full h-64 object-cover"
                />
                <div className="w-full flex-1">
                  <div className="flex gap-4 p-4 h-full items-center justify-center">
                    <img
                      loading="lazy"
                      className="h-20 object-contain"
                      src={addon.image}
                      alt=""
                    />
                    <div className="flex flex-col">
                      <div className="text-xl underline pb-1">
                        {addon.title}
                      </div>
                      <div className="text-sm line-clamp-4">
                        {addon.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AddonsCarousel;
