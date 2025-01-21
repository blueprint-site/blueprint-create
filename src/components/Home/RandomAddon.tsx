// src/components/Home/RandomAddon.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import neoForgeIcon from "@/assets/neoforge_46h.png";
import "@/styles/homerandomaddon.scss";

import Updater from "../Updater";

interface Addon {
  id: string;
  icon_url: string;
  name: string;
  description: string;
  categories: string[];
  versions: string[];
  slug: string;
}

interface StoredAddon {
  id: string;
  icon_url: string;
  title: string;
  description: string;
  categories: string[];
  versions: string[];
  slug: string;
}

const HomeRandomAddon: React.FC = () => {
  const [randomAddon, setRandomAddon] = useState<Addon | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Call Updater as a component
  Updater();

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = localStorage.getItem("addonList");
        const data: StoredAddon[] = response ? JSON.parse(response) : [];
        
        const addons: Addon[] = data.map(addon => ({
          id: addon.id,
          icon_url: addon.icon_url,
          name: addon.title,
          description: addon.description,
          categories: addon.categories,
          versions: addon.versions,
          slug: addon.slug
        }));

        if (addons.length > 0) {
          const randomIndex = Math.floor(Math.random() * addons.length);
          setRandomAddon(addons[randomIndex]);
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch addons'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddons();
  }, []);

  const displayAddon = (addon: Addon): JSX.Element => {
    const modloaderBadges = {
      forge: {
        url: 'https://forums.minecraftforge.net',
        img: 'https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/forge_46h.png',
        alt: 'Forge support'
      },
      neoforge: {
        url: 'https://neoforged.net',
        img: neoForgeIcon,
        alt: 'NeoForge support'
      },
      fabric: {
        url: 'https://fabricmc.net',
        img: 'https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/fabric_46h.png',
        alt: 'Fabric support'
      },
      quilt: {
        url: 'https://quiltmc.org',
        img: 'https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact-minimal/supported/quilt_46h.png',
        alt: 'Quilt support'
      }
    };

    const modloaders = addon.categories
      .filter(category => ['forge', 'neoforge', 'fabric', 'quilt'].includes(category))
      .map(loader => {
        const badge = modloaderBadges[loader as keyof typeof modloaderBadges];
        return (
          <a
            key={loader}
            className={`supports-${loader}`}
            target="_blank"
            rel="noopener noreferrer"
            href={badge.url}
          >
            <img alt={badge.alt} height={30} src={badge.img} />
          </a>
        );
      });

    return (
      <Link to={`/addons/${addon.slug}`} className="addon-link" style={{ textDecoration: "none" }}>
        <div className="random-addon">
          <img className="random-addon-logo" src={addon.icon_url} alt="" />
          <div className="modloaders">
            <center>{modloaders}</center>
          </div>
          <div className="random-addon-text-box">
            <h3 className="random-addon-name">{addon.name}</h3>
            <h4 className="random-addon-description">{addon.description}</h4>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="addon-button"
            href={`https://modrinth.com/mod/${addon.slug}`}
          >
            <img
              alt="Download on Modrinth"
              height={35}
              src="https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/compact/available/modrinth_46h.png"
            />
          </a>
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading addon data: {error.message}</div>;
  }

  return (
    <div className="random-addons">
      <h1 className="random-addon-header">Here is a Random Addon for you to enjoy!</h1>
      <div className="random-addon" id="random-addon">
        {randomAddon ? displayAddon(randomAddon) : <p>No addon available</p>}
      </div>
    </div>
  );
};

export default HomeRandomAddon;