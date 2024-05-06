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

import { useTranslation } from "react-i18next";

function AddonList() {
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);

    const [versions, setVersions] = useState<string[]>([]);

    const [modloader, setModloader] = useState<"Forge" | "NeoForge" | "Fabric" | "Quilt" | "">("");
    const [version, setVersion] = useState<string>("");
    const [query, setQuery] = useState<string>("");

    const { t } = useTranslation();

    useEffect(() => {
        const compareSemanticVersions = (a: string, b: string) => {

            // 1. Split the strings into their parts.
            const a1 = a.split('.');
            const b1 = b.split('.');
            // 2. Contingency in case there's a 4th or 5th version
            const len = Math.min(a1.length, b1.length);
            // 3. Look through each version number and compare.
            for (let i = 0; i < len; i++) {
                const a2 = +a1[i] || 0;
                const b2 = +b1[i] || 0;

                if (a2 !== b2) {
                    return a2 > b2 ? 1 : -1;
                }
            }

            // 4. We hit this if the all checked versions so far are equal
            //
            return b1.length - a1.length;
        };

        const fetchAddons = async () => {
            setIsLoading(true);

            function sleep(ms: number) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            try {
                await sleep(5000);

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

                setVersions(versions.sort(compareSemanticVersions).reverse());
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
                    <input type="text" placeholder={t("addons.search.placeholder")} className="search-input" onChange={(e) => { setQuery(e.target.value) }} />
                </div>
                <div className="dropdown-container">
                    <Dropdown>
                        <Dropdown.Toggle>
                            {modloader == "" ? t("addons.dropdown.modloader.select") : modloader}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setModloader("") }}>{t("addons.dropdown.modloader.all")}</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Forge") }}>Forge</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("NeoForge") }}>NeoForge</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Fabric") }}>Fabric</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setModloader("Quilt") }}>Quilt</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {version == "" ? t("addons.dropdown.version.select") : version}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setVersion("") }}>{t("addons.dropdown.version.all")}</Dropdown.Item>
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