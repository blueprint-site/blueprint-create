import Banner1 from "../assets/banners/banner1.webp";
import Banner2 from "../assets/banners/banner2.webp";
import Banner3 from "../assets/banners/banner3.webp";
import Banner4 from "../assets/banners/banner4.webp";
import Banner5 from "../assets/banners/banner5.webp";
import Banner6 from "../assets/banners/banner6.webp";

function AddonsSlideshow() {
    return (
        <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src={Banner1} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                    <img src={Banner2} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                    <img src={Banner3} className="d-block w-100" alt="..." />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )

}

export default AddonsSlideshow