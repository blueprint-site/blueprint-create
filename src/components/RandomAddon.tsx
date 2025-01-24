import "@/styles/randomaddon.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DevinsBadges from "./utility/DevinsBadges";
import LoadingAnimation from "./utility/LoadingAnimation";
import Updater from "./utility/Updater";

function RandomAddon() {
    Updater();
    
    var [addons, setAddons] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    var randomAddon =
        addons && addons.length > 0
            ? addons[Math.floor(Math.random() * addons.length)]
            : null;
    const [isLoading, setIsLoading] = useState(true);

    const fetchAddons = async () => {
        setIsLoading(true);
        try {
            const response = localStorage.getItem("addonList");
            const data = response ? JSON.parse(response) : [];
            setAddons(data);
            await new Promise((resolve) => setTimeout(resolve, 800)); // add a 0.8-second delay
            setIsLoading(false);
            console.log(addons[10]);
            if (addons !== undefined) {
                console.log("Everything is ok!");
                setIsLoading(false);
            } else {
                console.error("HEY! Something went wrong!!!! try refetching");
                setIsLoading(false);
            }
        } catch (error) {
            setError(error);
            console.error(error);
        }
    };

    const returnAddons = () => {
        if (addons) {
            console.log(addons[Math.floor(Math.random() * addons.length)]);
        }
    };

    // UseEffect to run fetchAddons on mount as early as possible
    useEffect(() => {
        fetchAddons(); // Fetch data immediately when the component is mounted
    }, []); // Empty dependency array to ensure it runs only once on mount

    if (isLoading) {
        return (
            <div className="addons-loading">
                <center>
                    <LoadingAnimation />
                    <h1 className="loading-text">Loading your random addon!</h1>
                    <h6>
                        This is a fake loading page just to slow you down. Too
                        fast animations are awfull
                    </h6>
                </center>
            </div>
        );
    }
    function checkBackgroundDarkness() {
        const textElement = document.querySelector(".dynamic-text");
        const computedStyle = window.getComputedStyle(textElement);
        const backgroundColor = computedStyle.backgroundColor;

        // You might need a more sophisticated algorithm to determine darkness
        // For simplicity, let's assume a threshold for dark backgrounds
        const isDark =
            backgroundColor.startsWith("#00") ||
            backgroundColor.startsWith("#00");

        if (isDark) {
            textElement.classList.add("dark-background");
        } else {
            textElement.classList.remove("dark-background");
        }
    }

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    };

    const backgroundRgba = randomAddon?.color
        ? `rgba(${parseInt(randomAddon?.color.substring(1, 3), 16)}, ${parseInt(
              randomAddon?.color.substring(3, 5),
              16
          )}, ${parseInt(randomAddon?.color.substring(5, 7), 16)}, 0.7)` // Convert to RGBA with 0.7 opacity
        : "transparent"; // Set a default color if conversion fails

    const setLoadingValue = () => {
        setIsLoading(true);
    };

    return (
        <div onLoad={checkBackgroundDarkness}>
            <center>
            <Link to={`/addons/${randomAddon?.slug}`} className="addon-link" style={{ textDecoration: "none" }}>
                <div
                    className="random-addon"
                    style={{ backgroundColor: backgroundRgba }}
                >
                    <img
                        src={randomAddon?.icon_url}
                        className="addon-image"
                        alt=""
                    />
                    <br />
                    <br />
                    <div className="text-div">
                        <span className="addon-title">
                            {randomAddon?.title}
                        </span>
                        <br />
                        <span className="addon-text">
                            {randomAddon?.description}
                        </span>
                        <br />
                        <span className="addon-text">
                            Author: {randomAddon?.author}
                        </span>
                        <br />
                        <span className="addon-text">
                            Versions: {randomAddon?.versions?.join(", ")}
                        </span>
                        <br /> <br />
                        <a target="_blank" rel="noopener noreferrer" className="addon-button"
                            href={`${
                                " https://modrinth.com/mod/" + randomAddon?.slug
                            }`}
                        >
                            <DevinsBadges
                                type="compact"
                                category="available"
                                name="modrinth"
                                format="png"
                                height={46}
                            />
                        </a>
                    </div>
                </div>
            </Link>
            </center>
            <br />
            <br />
            <center>
                <button className="get-an-addon" onClick={fetchAddons}>
                    Get a random addon!
                </button>
            </center>
            <br />
            <br />
        </div>
    );
}

export default RandomAddon;
