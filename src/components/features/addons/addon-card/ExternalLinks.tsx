import DevinsBadges from "@/components/utility/DevinsBadges";

interface ExternalLinksProps {
  slug: string;
  curseforge_raw: object;
  modrinth_raw: object;
}

export const ExternalLinks = ({ slug, curseforge_raw, modrinth_raw }: ExternalLinksProps) => (
  <div className="flex flex-col md:flex-row justify-between gap-2">
    {curseforge_raw && (
      <a
        className="h-full w-full md:w-1/2 flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.curseforge.com/minecraft/mc-mods/${slug}`}
      >
        <DevinsBadges
          type="compact"
          category="available"
          name="curseforge"
          format="svg"
        />
      </a>
    )}
    {modrinth_raw && (
      <a
        className="h-full w-full md:w-1/2 flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://modrinth.com/mod/${slug}`}
      >
        <DevinsBadges
          type="compact"
          category="available"
          name="modrinth"
          format="svg"
        />
      </a>
    )}
  </div>
);
