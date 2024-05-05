interface DevinsBadgesProperties {
    type: "cozy" | "cozy-minimal" | "compact" | "compact-minimal",
    category: "available" | "built-with" | "documentation" | "donate" | "requires" | "social" | "supported" | "unsupported" | "translate",
    name: string,
    format: "png" | "svg"
}

function DevinsBadges({ type, category, name, format }: DevinsBadgesProperties) {
    return (
        <>
            <img alt={name} src={`https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/${type}/${category}/_64h.${format}`}></img>
        </>
    );
}

export default DevinsBadges;