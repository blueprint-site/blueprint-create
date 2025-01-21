import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Banner1 from "../assets/banners/banner1.webp";
import Banner2 from "../assets/banners/banner2.webp";
import Banner3 from "../assets/banners/banner3.webp";
import Banner4 from "../assets/banners/banner4.webp";
import Banner5 from "../assets/banners/banner5.webp";
import LazyImage from './LazyImage';

// Styled components for transitions
const SlideImage = styled(LazyImage)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
  object-fit: contain; // Ensures image maintains aspect ratio
  object-position: center;
`;

const SlideshowContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 400px; // Fixed height
  overflow: hidden; // Prevent any overflow
`;

const AddonsSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [Banner1, Banner2, Banner3, Banner4, Banner5];
  
  const sideboxContent = [
    {
      image: "https://cdn.modrinth.com/data/Dq3STxps/011f13a3eaf73d06a26b60a3a6ba858d3735815d.png",
      title: "Create Railways navigator",
      description: "Get train connections in your world from one station to another using the Create Railways Navigator."
    },
    {
      image: "https://cdn.modrinth.com/data/ZzjhlDgM/23d42e3d1c878cb77f9e74a3f78fed2d011ed937.png",
      title: "Create: Steam 'n' Rails",
      description: "Adding depth to Create's rail network & steam system"
    },
    {
      image: "https://cdn.modrinth.com/data/IAnP4np7/0c69bfc4fb1df010c35c02f94ebc275ba0fa9bae.png",
      title: "Create: Structures",
      description: "Add-on for Create that implements naturally generating structures containing early-game Create contraptions and items."
    },
    {
      image: "https://cdn.modrinth.com/data/GmjmRQ0A/9af7f38727e4c1dc30c67fefd80b15000a2b8c07.png",
      title: "Create Slice & Dice",
      description: "Making automation for Farmers Delight more sensible"
    },
    {
      image: "https://cdn.modrinth.com/data/GWp4jCJj/a3c3d5087ac30256a7e98309e322ab4766508ec7.png",
      title: "Create Big Cannons",
      description: "A Minecraft mod for building large cannons with the Create mod."
    }
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SlideshowContainer>
      <div className="flex items-start justify-center h-full gap-4">
        {/* Main image container */}
        <div className="relative flex-1 h-full bg-background rounded-lg overflow-hidden">
          {images.map((image, index) => (
            <SlideImage
              key={index}
              src={image}
              alt=""
              $isVisible={index === currentIndex}
            />
          ))}
        </div>

        {/* Side box */}
        <div className="w-[300px] h-full bg-container p-5 rounded-custom hover:brightness-105 transition-all duration-200 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="h-40 overflow-hidden rounded-lg bg-background">
              <LazyImage 
                className="w-full h-full object-contain" 
                src={sideboxContent[currentIndex].image} 
                alt="" 
              />
            </div>
            <div className="mt-4 overflow-hidden">
              <h3 className="text-xl font-bold mb-2 truncate">
                {sideboxContent[currentIndex].title}
              </h3>
              <p className="text-sm line-clamp-4">
                {sideboxContent[currentIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideshowContainer>
  );
};

export default AddonsSlideshow;