import { useTranslation } from "react-i18next";

import BlueprintLogo from '../assets/logo.webp';
import AddonIcon from '../assets/minecart_coupling.webp';
import SchematicIcon from '../assets/schematic.webp';
import AboutIcon from '../assets/clipboard.webp'

import NavigationLink from './NavigationLink';
import { NavLink } from 'react-router-dom';

import '../styles/navigation.scss';
import LazyImage from "./LazyImage";

const Navigation = () => {
    const { t } = useTranslation();

    return (
        <>
            <nav>
                <NavLink className="logo" to="/"><LazyImage src={BlueprintLogo} alt="Logo" /><span>Blueprint</span></NavLink>
                <span />
                <NavigationLink destination={'/addons'} icon={AddonIcon} label={t("navigation.label.addons")}></NavigationLink>
                <NavigationLink destination={'/schematics'} icon={SchematicIcon} label={t("navigation.label.schematics")}></NavigationLink>
                <NavigationLink destination={'/about'} icon={AboutIcon} label={t("navigation.label.about")}></NavigationLink>
            </nav>
        </>
    );
}

export default Navigation;