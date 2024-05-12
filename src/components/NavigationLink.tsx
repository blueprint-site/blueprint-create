import { NavLink } from "react-router-dom";
import LazyImage from "./LazyImage";

interface NavigationLinkProps {
    destination: string,
    icon: string,
    label: string,
}

const NavigationLink = (properties: NavigationLinkProps) => {
    return (
        <>
            <NavLink to={properties.destination}>
                <LazyImage src={properties.icon} alt={properties.label} />
                {properties.label}
            </NavLink>
        </>
    );
}

export default NavigationLink;