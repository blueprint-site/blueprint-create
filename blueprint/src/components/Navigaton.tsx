import BlueprintLogo from '../assets/logo.webp';
import AddonIcon from '../assets/minecart_coupling.webp';
import SchematicIcon from '../assets/schematic.webp';
import AboutIcon from '../assets/clipboard.webp'
import NavigationLink from './NavigationLink';
import '../styles/navigation.scss';

const Navigation = () => {
    return (
        <>
            <nav>
                <a className="logo" href="/"><img src={BlueprintLogo} alt="Logo" />Blueprint</a>
                <span />
                <NavigationLink destination={'/addons'} icon={AddonIcon} label={'Addons'}></NavigationLink>
                <NavigationLink destination={'/schematics'} icon={SchematicIcon} label={'Schematics'}></NavigationLink>
                <NavigationLink destination={'/about'} icon={AboutIcon} label={'About'}></NavigationLink>
            </nav>
        </>
    );
}

export default Navigation;