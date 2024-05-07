import { NavLink } from "react-router-dom";

interface NavigationLinkProps {
    destination: string,
    icon: string,
    label: string,
}

const NavigationLink = (properties: NavigationLinkProps) => {
    return (
        <>
            <NavLink to={properties.destination}>
                <img src={properties.icon} alt={properties.label} />
                {properties.label}
            </NavLink>
        </>
    );
}

export default NavigationLink;