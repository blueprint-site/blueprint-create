import { Addon } from "./AddonList";
import DevinsBadges from "./DevinsBadges";

import '../styles/addon.scss';
import { useTranslation } from "react-i18next";
import LazyImage from "./LazyImage";
import LazyLoad from 'react-lazyload';

interface AddonListItemProperties {
    addon: Addon;
}

function AddonListItem({ addon }: AddonListItemProperties) {
    const modloaders = ["forge", "fabric", "quilt"];

    const { t } = useTranslation();

    return (
        <>
            <LazyLoad className="addon">
                <h3 className="addon-name">{addon.addon_name}</h3>
                <LazyImage height="100px" width="100px" src={addon.addon_icon_url} alt={addon.addon_name} />
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
                <span className="addon-description"><b>{t("addons.label.downloads")}:</b> {addon.addon_downloads}</span>
                <span className="addon-description"><b>{t("addons.label.description")}:</b> {addon.addon_short_descriptions}</span>
                <span className="addon-description"><b>{t("addons.label.categories")}:</b> {addon.addon_categories.join(', ')}</span>
                <span className="addon-description"><b>{t("addons.label.followers")}:</b> {addon.addon_followers}</span>
                <span className="addon-description"><b>{t("addons.label.authors")}:</b> {addon.addon_authors}</span>
                <span className="spacer" />
                <a target="_blank" rel="noopener noreferrer" className="addon-button" href={`${" https://modrinth.com/mod/" + addon.addon_slug}`}><DevinsBadges type="compact" category="available" name="modrinth" format="png" height={46} /></a>
            </LazyLoad>
        </>
    )
}

export default AddonListItem;