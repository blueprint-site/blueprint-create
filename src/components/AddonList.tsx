export interface Addon {
    addon_name: string;
    addon_slug: string;
    addon_icon_url: string;
    addon_project_id: string;
    addon_downloads: number;
    addon_short_descriptions: string;
    addon_versions: string[];
    addon_categories: string[];
    addon_followers: number;
    manual_check: string;
    addon_authors: string;
};

interface Addons {
    [key: string]: Addon
}

import { useEffect, useState } from "react";
import LoadingAnimation from "./LoadingAnimation";
import ErrorAlert from "./ErrorAlert";
import Addons from "../pages/Addons/Addons";

import '../styles/addonslist.scss';
import AddonListItem from "./AddonListItem";

function AddonList() {
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);

    useEffect(() => {
        const fetchAddons = async () => {
            setIsLoading(true);

            try {

                const response = await fetch("https://blueprint-site.github.io/static/data/final_data.json");
                const data: Addons = await response.json();

                let addons: Addon[] = [];

                for (const key in data) {
                    addons.push(data[key]);
                }

                console.log(addons);

                setAddons(addons);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }

        }

        fetchAddons();
    }, [])

    if (error) {
        return (
            <ErrorAlert heading="Something went wrong" body="Something went wrong." />
        )
    }

    if (isLoading) {
        return (
            <div className="addons-loading">
                <LoadingAnimation />
            </div>
        )
    }

    return (
        <>
            <div className="addon-list">
                {addons.map((addon) => {
                    console.log(addon.addon_name);
                    return (
                        <>
                            <AddonListItem addon={addon} />
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default AddonList;