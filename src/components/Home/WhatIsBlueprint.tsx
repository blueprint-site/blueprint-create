import { useTranslation } from "react-i18next"

import BlueprintLogo from "@/assets/logo.webp"
import AddonIcon from "@/assets/minecart_coupling.webp"
import SchematicIcon from "@/assets/schematic.webp"

import LazyImage from "@/components/LazyImage"
import "@/styles/whatisblueprint.scss"

function WhatIsBlueprint() {
    const { t } = useTranslation();

    return (
        <div className="what-is-blueprint">
            <center>
                <h1>{t("home.info.about.title")}</h1>
                <h4>{t("home.info.about.description")}</h4>
                <div className="images"><LazyImage src={AddonIcon} alt="" />+<LazyImage src={SchematicIcon} alt="" />= <LazyImage src={BlueprintLogo} alt="" /></div>
            </center>
        </div>
    );
}

export default WhatIsBlueprint;