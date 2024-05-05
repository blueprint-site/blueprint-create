import i18next from 'i18next';

import EnglishTranslation from '../assets/en_us.json';

import BlueprintLogo from '../assets/logo.webp';
import AddonIcon from '../assets/minecart_coupling.webp';
import SchematicIcon from '../assets/schematic.webp';
import AboutIcon from '../assets/clipboard.webp'
import NavigationLink from './NavigationLink';
import '../styles/navigation.scss';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    i18next.init({
        lng: 'en', // if you're using a language detector, do not define the lng option
        debug: true,
        resources: {
            en: EnglishTranslation
        }
    });

    return (
        <>
            <nav>
                <NavLink className="logo" to="/"><img src={BlueprintLogo} alt="Logo" />Blueprint</NavLink>
                <span />
                <NavigationLink destination={'/addons'} icon={AddonIcon} label={i18next.t("navigation.label.addons")}></NavigationLink>
                <NavigationLink destination={'/schematics'} icon={SchematicIcon} label={i18next.t("navigation.label.schematics")}></NavigationLink>
                <NavigationLink destination={'/about'} icon={AboutIcon} label={i18next.t("navigation.label.about")}></NavigationLink>
            </nav>
        </>
    );
}

export default Navigation;