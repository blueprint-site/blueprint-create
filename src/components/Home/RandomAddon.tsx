import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DevinsBadges from "@/components/utility/DevinsBadges";
import LazyImage from "@/components/utility/LazyImage";
import Updater from "@/components/utility/Updater";
import "@/styles/homerandomaddon.scss";
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

const HomeRandomAddon = () => {
  const [randomAddon, setRandomAddon] = useState<Addon | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  Updater();

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = localStorage.getItem("addonList");
        const data: StoredAddon[] = response ? JSON.parse(response) : [];

        const addons: Addon[] = data.map((addon) => ({
          id: addon.id,
          icon_url: addon.icon_url,
          name: addon.title,
          description: addon.description,
          categories: addon.categories,
          versions: addon.versions,
          slug: addon.slug,
        }));

        if (addons.length > 0) {
          const randomIndex = Math.floor(Math.random() * addons.length);
          setRandomAddon(addons[randomIndex]);
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch addons"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddons();
  }, []);

  const displayAddon = (addon: Addon): JSX.Element => {
    const modloaderBadges = {
      forge: {
        url: "https://forums.minecraftforge.net",
        label: "Forge support",
      },
      neoforge: {
        url: "https://neoforged.net",
        label: "NeoForge support",
      },
      fabric: {
        url: "https://fabricmc.net",
        label: "Fabric support",
      },
      quilt: {
        url: "https://quiltmc.org",
        label: "Quilt support",
      },
    };

    const modloaders = addon.categories
      .filter((category) =>
        ["forge", "neoforge", "fabric", "quilt"].includes(category)
      )
      .map((loader) => {
        const badge = modloaderBadges[loader as keyof typeof modloaderBadges];
        return (
          <a
            key={loader}
            className={`supports-${loader}`}
            target="_blank"
            rel="noopener noreferrer"
            href={badge.url}
          >
            <DevinsBadges
              type="compact-minimal"
              category="supported"
              name={loader}
              format="png"
              height={46}
            />
          </a>
        );
      });

    return (
      <Link to={`/addons/${addon.slug}`} className="addon-link">
        <div className="random-addon">
          <LazyImage
            className="random-addon-logo"
            src={addon.icon_url}
            alt=""
          />
          <div className="modloaders">
            <div className="flex justify-center gap-2">{modloaders}</div>
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
            <DevinsBadges
              type="compact"
              category="available"
              name="modrinth"
              format="png"
              height={46}
            />
          </a>
        </div>
      </Link>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading addon data: {error.message}</div>;

  return (
    <div className="random-addons">
      <h1 className="random-addon-header">
        Here is a Random Addon for you to enjoy!
      </h1>
      <div className="random-addon" id="random-addon">
        {randomAddon ? displayAddon(randomAddon) : <p>No addon available</p>}
      </div>
    </div>
  );
};

export default HomeRandomAddon;
