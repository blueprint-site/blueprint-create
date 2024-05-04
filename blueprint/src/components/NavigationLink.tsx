interface NavigationLinkProps {
    destination: string,
    icon: string,
    label: string,
}

const NavigationLink = (properties: NavigationLinkProps) => {
    return (
        <>
            <a href={properties.destination}>
                <img src={properties.icon} alt={properties.label} />
                {properties.label}
            </a>
        </>
    );
}

export default NavigationLink;