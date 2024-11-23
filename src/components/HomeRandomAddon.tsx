import React, { useEffect, useState } from "react";
import "../styles/homerandomaddon.scss";
import neoForgeIcon from "../assets/neoforge_46h.png";
import { Link } from "react-router-dom";
import Updater from "./Updater";

function HomeRandomAddon() {
    const [randomAddon, setRandomAddon] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    Updater();
    useEffect(() => {
        const fetchAddons = async () => {
            const compareSemanticVersions = (a, b) => {
                const a1 = a.split('.');
                const b1 = b.split('.');
                const len = Math.min(a1.length, b1.length);
                for (let i = 0; i < len; i++) {
                    const a2 = +a1[i] || 0;
                    const b2 = +b1[i] || 0;
                    if (a2 !== b2) {
                        return a2 > b2 ? 1 : -1;
                    }
                }
                return b1.length - a1.length;
            };

            try {
                const response = localStorage.getItem("addonList");
                const data = response ? JSON.parse(response) : [];                
                const addons = data.map(addon => ({
                  id: addon.id,
                  icon_url: addon.icon_url,
                  name: addon.title,
                  description: addon.description,
                  categories: addon.categories,
                  versions: addon.versions,
                  slug: addon.slug
                }));
                setRandomAddon(addons[Math.floor(Math.random() * addons.length)]);;
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddons();
    }, []);

    const displayAddon = (addon) => {
        let modloaders = "";
        if (addon.categories.includes("forge")) modloaders += `<a className="supports-forge" target="_blank" rel="noopener noreferrer" href="https://forums.minecraftforge.net"><img alt="Forge support" height="30" src="https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/forge_46h.png"></a>`;
        if (addon.categories.includes("neoforge")) modloaders += `<a className="supports-neoforge" target="_blank" rel="noopener noreferrer" href="https://neoforged.net"><img alt="NeoForge support" height="30" src=${neoForgeIcon}></a>`;
        if (addon.categories.includes("fabric")) modloaders += `<a className="supports-fabric" target="_blank" rel="noopener noreferrer" href="https://fabricmc.net"><img alt="Fabric support" height="30" src="https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/fabric_46h.png"></a>`;
        if (addon.categories.includes("quilt")) modloaders += `<a className="supports-quilt" target="_blank" rel="noopener noreferrer" href="https://quiltmc.org"><img alt="Quilt support" height="30" src="https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/quilt_46h.png"></a>`;

        return (
            <Link to={`/addons/${addon?.slug}`} className="addon-link" style={{ textDecoration: "none" }}>
            <div className="random-addon">
                <img className="random-addon-logo" src={addon.icon_url} alt="" />
                <div className="modloaders"><center dangerouslySetInnerHTML={{ __html: modloaders }} /></div>
                <div className="random-addon-text-box">
                    <h3 className="random-addon-name">{addon.name}</h3>
                    <h4 className="random-addon-description">{addon.description}</h4>
                </div>
                <a target="_blank" rel="noopener noreferrer" className="addon-button" href={`https://modrinth.com/mod/${addon.slug}`}>
                    <img alt="Download on Modrinth" height="35" src="https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/available/modrinth_46h.png" />
                </a>
            </div>
            </Link>
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading addon data</div>;
    }

    return (
        <div className="random-addons">
            <h1 className="random-addon-header">Here is a Random Addon for you to enjoy!</h1>
            <div className="random-addon" id="random-addon">
                {randomAddon ? displayAddon(randomAddon) : <p>No addon available</p>}
            </div>
        </div>
    );
}

export default HomeRandomAddon;
