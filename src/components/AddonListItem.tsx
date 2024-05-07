import { Addon } from "./AddonList";
import DevinsBadges from "./DevinsBadges";

import '../styles/addon.scss';
import { useTranslation } from "react-i18next";

interface AddonListItemProperties {
    addon: Addon;
}

function AddonListItem({ addon }: AddonListItemProperties) {
    const modloaders = ["forge", "fabric", "quilt"];

    const { t } = useTranslation();

    return (
        <>
            <div className="addon">
                <h3 className="addon-name">{addon.addon_name}</h3>
                <img height="100px" width="100px" src={addon.addon_icon_url} alt={addon.addon_name} />
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
                <p className="addon-description"><b>{t("addons.label.downloads")}:</b> {addon.addon_downloads}</p>
                <p className="addon-description"><b>{t("addons.label.description")}:</b> {addon.addon_short_descriptions}</p>
                <p className="addon-description"><b>{t("addons.label.categories")}:</b> {addon.addon_categories.join(', ')}</p>
                <p className="addon-description"><b>{t("addons.label.followers")}:</b> {addon.addon_followers}</p>
                <p className="addon-description"><b>{t("addons.label.authors")}:</b> {addon.addon_authors}</p>
                <span />
                <a target="_blank" rel="noopener noreferrer" className="addon-button" href={`${" https://modrinth.com/mod/" + addon.addon_slug}`}><DevinsBadges type="compact" category="available" name="modrinth" format="png" height={46} /></a>

            </div >
        </>
    )
}

export default AddonListItem;