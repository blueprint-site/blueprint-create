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
import { Dropdown } from "react-bootstrap";

function AddonList() {
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);

    const [modloader, setModloader] = useState<"Forge" | "NeoForge" | "Fabric" | "Quilt" | "">("");
    const [version, setVersion] = useState<string>("");

    const [versions, setVersions] = useState<string[]>([]);

    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const fetchAddons = async () => {
            setIsLoading(true);

            try {

                const response = await fetch("https://blueprint-site.github.io/static/data/final_data.json");
                const data: Addons = await response.json();

                let addons: Addon[] = [];
                let versions: string[] = [];

                for (const key in data) {
                    addons.push(data[key]);
                }

                for (const addon of addons) {
                    addon.addon_versions.map((version) => {
                        if (!versions.includes(version)) versions.push(version);
                    });
                }

                setVersions(versions);
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
            <div className="form">
                <div className="search-bar">
                    <input type="text" placeholder="Search addons..." className="search-input" onChange={(e) => { setQuery(e.target.value) }} />
                </div>
                <div className="dropdown-container">
                    <Dropdown>
                        <Dropdown.Toggle>
                            {modloader == "" ? "Select Modloader" : modloader}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setModloader("") }}>All modloaders</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Forge") }}>Forge</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("NeoForge") }}>NeoForge</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Fabric") }}>Fabric</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Quilt") }}>Quilt</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {version == "" ? "Select Version" : version}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setVersion("") }}>All Versions</Dropdown.Item>
                            {versions.map((version) => {
                                return <Dropdown.Item onClick={() => { setVersion(version) }}>{version}</Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="addon-list">
                {addons.map((addon) => {
                    if ((addon.addon_name.toLowerCase().includes(query) || addon.addon_short_descriptions.toLowerCase().includes(query) || query == "") && (addon.addon_categories.includes(modloader.toLowerCase()) || modloader == "") && (addon.addon_versions.includes(version.toLowerCase()) || version == "")) return <AddonListItem addon={addon} />
                })}
            </div>
        </>
    )
}

export default AddonList;