import { Addon } from "./AddonList";
import DevinsBadges from "./DevinsBadges";
import { Link } from 'react-router-dom';
import Collections from './CollectionHandler';
import '../styles/addon.scss';
import { useTranslation } from "react-i18next";
import LazyImage from "./LazyImage";
import LazyLoad from 'react-lazyload';
import { useEffect, useState } from "react";
import handleAddAddon from "./Collections";
interface AddonListItemProperties {
    addon: Addon;
}

function AddonListItem({ addon }: AddonListItemProperties) {
    const modloaders = ["forge", "fabric", "quilt"];
    const [collection, setCollection] = useState<string[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        const initialCollection = Collections.getCollection();
        setCollection(initialCollection);
    }, []);

    // Function to handle adding an addon
    const handleAddAddon = (addonName: string) => {
        Collections.collectionAdded(addonName);
        const updatedCollection = Collections.getCollection(); // Get the updated collection
        setCollection(updatedCollection); // Update state with the new collection
    };

    
    return (
        <>

            <LazyLoad className="addon">
                <Link to={`/addons/${addon.addon_slug}`} className="addon-link">
                    <h3 className="addon-name">{addon.addon_name}</h3>
                    <LazyImage className={"addonimage"} height="100px" width="100px" src={addon.addon_icon_url} alt={addon.addon_name} />
                    <div className="modloaders">{addon.addon_categories.map((categorie) => {
                        return (
                            <>{modloaders.includes(categorie) ? <DevinsBadges type="compact-minimal" category="supported" name={categorie} format="png" height={46} /> : null}</>
                        )
                    })}</div>
                    <div className="addon-versions">{addon.addon_versions.map((version) => {
                        return (
                            <span className={`addon-version supports-${version.replace(/\./gm, "_")}`}>{version}</span>
                        );
                    })}</div>
                    <span className="addon-description"><b>{t("addons.label.downloads")}:</b> {addon.addon_downloads}</span> <br />
                    <span className="addon-description"><b>{t("addons.label.description")}:</b> {addon.addon_short_descriptions}</span> <br />
                    <span className="addon-description"><b>{t("addons.label.categories")}:</b> {addon.addon_categories.join(', ')}</span> <br />
                    <span className="addon-description"><b>{t("addons.label.followers")}:</b> {addon.addon_followers}</span> <br />
                    <span className="addon-description"><b>{t("addons.label.authors")}:</b> {addon.addon_authors}</span> <br />
                    {addon.note && <span className="addon-note"><b>{t("addons.label.note")}:</b> {addon.note}</span>}
                    <span className="spacer" />
                </Link>
                <a target="_blank" rel="noopener noreferrer" className="addon-button" href={`${" https://modrinth.com/mod/" + addon.addon_slug}`}><DevinsBadges type="compact" category="available" name="modrinth" format="png" height={46} /></a>
                <button className="collection-button" onClick={() => handleAddAddon(addon.addon_slug)}>Add to collection</button>
            </LazyLoad>

        </>
    )
}

export default AddonListItem;