import LazyImage from "./LazyImage";

interface DevinsBadgesProps {
  type: "cozy" | "cozy-minimal" | "compact" | "compact-minimal";
  category: "available" | "built-with" | "documentation" | "donate" | "requires" | "social" | "supported" | "unsupported" | "translate";
  name: string;
  height?: number;
  format: "png" | "svg";
}

const DevinsBadges = ({ type, category, name, height = 0, format }: DevinsBadgesProps) => {
  const badgeSrc = `https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/${type}/${category}/${name}${height > 0 ? `_${height}h` : ""}.${format}`;

  return <LazyImage alt={name} src={badgeSrc} />;
};

export default DevinsBadges;