import { Badge } from "@/components/ui/badge";

interface VersionBadgesProps {
  versions: string[];
}

export const VersionBadges = ({ versions }: VersionBadgesProps) => {
  if (!versions?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {versions.map((version) => (
        <Badge
          key={version}
          variant="secondary"
          className="text-xs font-mono px-1.5 py-0.5"
        >
          {version}
        </Badge>
      ))}
    </div>
  );
};