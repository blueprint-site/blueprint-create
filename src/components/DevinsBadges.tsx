import LazyImage from "./LazyImage";

interface DevinsBadgesProperties {
    type: "cozy" | "cozy-minimal" | "compact" | "compact-minimal",
    category: "available" | "built-with" | "documentation" | "donate" | "requires" | "social" | "supported" | "unsupported" | "translate",
    name: string,
    height?: number,
    format: "png" | "svg"
}

function DevinsBadges({ type, category, name, height = 0, format }: DevinsBadgesProperties) {
    return (
        <>
            <LazyImage alt={name} src={`https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/${type}/${category}/${name}${format == "png" ? `_${height}h` : ""}.${format}`} />
        </>
    );
}

export default DevinsBadges;