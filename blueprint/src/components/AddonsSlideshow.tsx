import Carousel from 'react-bootstrap/Carousel';

import Banner1 from "../assets/banners/banner1.webp";
import Banner2 from "../assets/banners/banner2.webp";
import Banner3 from "../assets/banners/banner3.webp";
import Banner4 from "../assets/banners/banner4.webp";
import Banner5 from "../assets/banners/banner5.webp";
import Banner6 from "../assets/banners/banner6.webp";

function AddonsSlideshow() {
    return (
        <Carousel>
            <Carousel.Item>
                <img src={Banner1} className="d-block w-100" alt="..." />
                <Carousel.Caption>
                    <h3>First slide</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img src={Banner2} className="d-block w-100" alt="..." />
                <Carousel.Caption>
                    <h3>Second slide</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img src={Banner3} className="d-block w-100" alt="..." />
                <Carousel.Caption>
                    <h3>Third slide</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )

}

export default AddonsSlideshow