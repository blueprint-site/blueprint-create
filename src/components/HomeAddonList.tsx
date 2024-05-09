import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash'; // Import the shuffle function from lodash or any other library you prefer
import Banner1 from "../assets/banners/banner1.webp";
import Banner2 from "../assets/banners/banner2.webp";
import Banner3 from "../assets/banners/banner3.webp";
import Banner4 from "../assets/banners/banner4.webp";
import Banner5 from "../assets/banners/banner5.webp";
import Banner6 from "../assets/banners/banner6.webp";
import '../styles/homeaddonlist.scss';

function HomeAddonList() {
    const imgs = [Banner1, Banner2, Banner3, Banner4, Banner5, Banner6];
    const [shuffledImgs, setShuffledImgs] = useState([]);

    useEffect(() => {
        setShuffledImgs(shuffle(imgs)); // Shuffle the array of images when the component mounts
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShuffledImgs(shuffle(imgs)); // Reshuffle the array every cycle
        }, 5000); // Change the interval time as needed (5000 milliseconds = 5 seconds)

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="addon-list-container">
            {shuffledImgs.map((img, index) => (
                <img key={index} src={img} alt="" className="addon-list-image"/>
            ))}
        </div>
    )
}

export default HomeAddonList;
