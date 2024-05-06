import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Banner1 from "../assets/banners/banner1.webp";
import Banner2 from "../assets/banners/banner2.webp";
import Banner3 from "../assets/banners/banner3.webp";
import Banner4 from "../assets/banners/banner4.webp";
import Banner5 from "../assets/banners/banner5.webp";

const SlideshowContainer = styled.div`
    display: flex;
    align-items: top; 
    justify-content: center; 
`;

const SlideshowImage = styled.img`
    width: 40vw;
    height: 22vw;
    position: relative;
    border-radius: 1.9em;
    transition: 0.5s linear;

    &.hidden {
    }

    &.visible {
        opacity: 1; 
    }
`;

const SideBox = styled.div`
    font-family: Arial, Helvetica, sans-serif;
    width: 20vw;
    height: auto; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    position: relative;
    border-radius: 1.9em;
    background-color: var(--container-background);
    text-align: center;
    vertical-align: sub; 
    margin-left: 1em; 
    padding: 20px; 
    font-family: Arial, Helvetica, sans-serif;
    align-content: left;
    transition: filter 0.3s linear;
    transition: 0.2s linear;

    &:hover {
        filter: brightness(1.05);
    }
`;

const SideBoxImage = styled.img`
    max-height: 200px;
    height: 7vw;
    max-width: 200px;
    position: relative;
        transition: opacity 0.5s linear;

    &.hidden {
        opacity: 0;
    }

    &.visible {
        opacity: 1;
    }
`;

const SideBoxText = styled.h3`
    font-size: 1.5vw;
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
`;

const SideBoxDescription = styled.h4`
    margin-top: -0.5vw;
    font-size: 1.05vw;
    font-family: Arial, Helvetica, sans-serif;
    color: black;
    font-weight: bold;
`;

function AddonsSlideshow() {
  const images = [Banner1, Banner2, Banner3, Banner4, Banner5];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const updateSideBoxContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div>
            <SideBoxImage src="https://cdn.modrinth.com/data/Dq3STxps/011f13a3eaf73d06a26b60a3a6ba858d3735815d.png" alt="" />
            <SideBoxText>Create Railways navigator</SideBoxText>
            <SideBoxDescription>Get train connections in your world from one station to another using the Create Railways Navigator.</SideBoxDescription>
          </div>
        );
      case 1:
        return (
          <div>
            <SideBoxImage src="https://cdn.modrinth.com/data/ZzjhlDgM/23d42e3d1c878cb77f9e74a3f78fed2d011ed937.png" alt="" />
            <SideBoxText>Create: Steam 'n' Rails</SideBoxText>
            <SideBoxDescription>Adding depth to Create's rail network & steam system</SideBoxDescription>
          </div>
        );
      case 2:
        return (
          <div>
            <SideBoxImage src="https://cdn.modrinth.com/data/IAnP4np7/0c69bfc4fb1df010c35c02f94ebc275ba0fa9bae.png" alt="" />
            <SideBoxText>Create: Structures</SideBoxText>
            <SideBoxDescription>Add-on for Create that implements naturally generating structures containing early-game Create contraptions and items.</SideBoxDescription>
          </div>
        );
      case 3:
        return (
          <div>
            <SideBoxImage src="https://cdn.modrinth.com/data/GmjmRQ0A/9af7f38727e4c1dc30c67fefd80b15000a2b8c07.png" alt="" />
            <SideBoxText>Create Slice & Dice</SideBoxText>
            <SideBoxDescription>Making automation for Farmers Delight more sensible</SideBoxDescription>
          </div>
        );
      case 4:
        return (
          <div>
            <SideBoxImage src="https://cdn.modrinth.com/data/GWp4jCJj/a3c3d5087ac30256a7e98309e322ab4766508ec7.png" alt="" />
            <SideBoxText>Create Big Cannons</SideBoxText>
            <SideBoxDescription>A Minecraft mod for building large cannons with the Create mod.</SideBoxDescription>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SlideshowContainer className="home-slideshow-container">
      <SlideshowImage src={images[currentIndex]} alt="" className={currentIndex === 0 ? "home-slideshow-image visible" : "home-slideshow-image hidden"} />
      <SideBox className="side-box">{updateSideBoxContent(currentIndex)}</SideBox>
    </SlideshowContainer>
  );
}

export default AddonsSlideshow;
