import Experience from "@/assets/block_of_experience.webp";
import '@/styles/addonslist.scss';
import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AddonListItem from "./AddonListItem";
import ErrorAlert from "./ErrorAlert";
import LoadingAnimation from "./LoadingAnimation";


// Define the Addon interface
interface Addon {
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
    note: string;
}

function AddonList() {
    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [versions, setVersions] = useState<string[]>([]);
    const [modloader, setModloader] = useState<"Forge" | "NeoForge" | "Fabric" | "Quilt" | "">("");
    const [version, setVersion] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [addonCount, setAddonCount] = useState<number>(0);
    const { t } = useTranslation();

    useEffect(() => {
        const compareSemanticVersions = (a: string, b: string) => {
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

        const fetchAddons = async () => {
            setIsLoading(true);

            try {
                const response = localStorage.getItem("addonList");
                const data = response ? JSON.parse(response) : [];

                let addons: Addon[] = [];
                let versions: string[] = [];

                for (const item of data) {
                    const addon: Addon = {
                        addon_name: item.title,
                        addon_slug: item.slug,
                        addon_icon_url: item.icon_url,
                        addon_project_id: item.project_id,
                        addon_downloads: item.downloads,
                        addon_short_descriptions: item.description,
                        addon_versions: item.versions,
                        addon_categories: item.categories,
                        addon_followers: item.follows,
                        manual_check: item.BluePrintChecked ? "checked" : "not checked",
                        addon_authors: item.author,
                        note: ""
                    };
                    addons.push(addon);

                    item.versions.forEach((version: string) => {
                        if (!versions.includes(version)) versions.push(version);
                    });
                }

                setVersions(versions.sort(compareSemanticVersions).reverse());
                setAddons(addons);
                setAddonCount(addons.length); 
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddons();
    }, []);

    if (error) {
        return (
            <ErrorAlert heading="Something went wrong" body="Something went wrong." />
        );
    }

    if (isLoading) {
        return (
            <div className="addons-loading">
                <LoadingAnimation />
            </div>
        );
    }

    return (
        <>
            <div className="addon-count-div">
                <h3 className="addon-count">There are {addonCount} Addons on Blueprint!</h3>
                <h5 className="addon-isnt-here">Your addon isn't here? <a href="https://blueprint-site.github.io/blueprint-blog/posts/whyisntmyaddonhere.html">Read why</a></h5>
            </div>
            <div className="form">
                <div className="search-bar">
                    <input type="text" placeholder={t("addons.search.placeholder")} className="search-input" onChange={(e) => { setQuery(e.target.value.toLowerCase()) }} />
                </div>
                <div className="random-addon-bar">
                    <p className="random-addon-bg">{t("addons.random.title")} <a href="/addons/random">{t("addons.random.link")} <img className="experience" src={Experience} alt="" /></a></p>
                </div>
                <div className="dropdown-container">
                    <Dropdown>
                        <Dropdown.Toggle>
                            {modloader === "" ? t("addons.dropdown.modloader.select") : modloader}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item key="all" onClick={() => { setModloader("") }}>{t("addons.dropdown.modloader.all")}</Dropdown.Item>
                            <Dropdown.Item key="Forge" onClick={() => { setModloader("Forge") }}>Forge</Dropdown.Item>
                            <Dropdown.Item key="NeoForge" onClick={() => { setModloader("NeoForge") }}>NeoForge</Dropdown.Item>
                            <Dropdown.Item key="Fabric" onClick={() => { setModloader("Fabric") }}>Fabric</Dropdown.Item>
                            <Dropdown.Item key="Quilt" onClick={() => { setModloader("Quilt") }}>Quilt</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {version === "" ? t("addons.dropdown.version.select") : version}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item key="all" onClick={() => { setVersion("") }}>{t("addons.dropdown.version.all")}</Dropdown.Item>
                            {versions.map((version) => {
                                return <Dropdown.Item key={version} onClick={() => { setVersion(version) }}>{version}</Dropdown.Item>;
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="addon-list">
                {addons.map((addon) => {
                    if ((addon.addon_name.toLowerCase().includes(query) || addon.addon_short_descriptions.toLowerCase().includes(query) || query === "") &&
                        (addon.addon_categories.includes(modloader.toLowerCase()) || modloader === "") &&
                        (addon.addon_versions.includes(version.toLowerCase()) || version === "")) {
                        return <AddonListItem key={addon.addon_project_id} addon={addon} />;
                    }
                    return null;
                })}
            </div>
        </>
    );
}

export default AddonList;
