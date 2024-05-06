import { Addon } from "./AddonList";
import DevinsBadges from "./DevinsBadges";

import '../styles/addon.scss';

interface AddonListItemProperties {
    addon: Addon;
}

function AddonListItem({ addon }: AddonListItemProperties) {
    const modloaders = ["forge", "fabric", "quilt"];

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
                <p className="addon-description"><b>Downloads:</b> {addon.addon_downloads}</p>
                <p className="addon-description"><b>Description:</b> {addon.addon_short_descriptions}</p>
                <p className="addon-description"><b>Categories:</b> {addon.addon_categories.join(', ')}</p>
                <p className="addon-description"><b>Followers:</b> {addon.addon_followers}</p>
                <p className="addon-description"><b>Created by:</b> {addon.addon_authors}</p>
                <span />
                <a target="_blank" rel="noopener noreferrer" className="addon-button" href={`${" https://modrinth.com/mod/" + addon.addon_slug}`}><DevinsBadges type="compact" category="available" name="modrinth" format="png" height={46} /></a>

            </div >
        </>
    )
}

export default AddonListItem;