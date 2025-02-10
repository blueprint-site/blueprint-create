import { Star, StarOff } from "lucide-react";
import React, { memo } from "react";
import { useCollectionStore } from "@/stores/collectionStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModLoaders from "@/components/features/addons/addon-card/ModLoaders";
import CategoryBadges from "@/components/features/addons/addon-card/CategoryBadges";
import { VersionBadges } from "./VersionBadges";
import { AddonStats } from "./AddonStats";
import { ExternalLinks } from "./ExternalLinks";
import { useNavigate } from "react-router-dom";
import {Addon} from "@/schemas/addon.schema.tsx";

interface AddonListItemProps {
  addon: Addon;
}

const AddonCard = memo(({ addon }: AddonListItemProps) => {
  const navigate = useNavigate(); // Hook called at top level
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(addon.slug);

  const handleCollectionAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking collection button
    isInCollection ? removeAddon(addon.slug) : addAddon(addon.slug);
  };

  const navigateToAddon = () => {
    navigate(`/addons/${addon.slug}`);
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-sm">
      <CardHeader
        className="flex flex-row gap-3 relative cursor-pointer"
        onClick={navigateToAddon}
      >
        <img
          src={addon.icon || "/assets/wrench.webp"}
          alt={addon.name}
          loading="lazy"
          className="h-12 w-12 object-cover"
        />
        <h3 className="text-sm font-medium truncate">{addon.name}</h3>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full absolute z-1000 right-3 top-3"
          onClick={handleCollectionAction}
        >
          {isInCollection ? <Star /> : <StarOff />}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <p className="text-xs text-foreground-muted">
            {addon.description}
          </p>

          <div className="flex gap-2 mt-2">
            <ModLoaders addon={addon} />
          </div>

          <CategoryBadges categories={addon.categories} />
        </div>

        <VersionBadges versions={addon.versions || []} />

        <AddonStats
          author={addon.author}
          downloads={addon.downloads}
        />

        <ExternalLinks
          slug={addon.slug}
          curseforge_raw={addon.curseforge_raw || {}}
          modrinth_raw={addon.modrinth_raw || {}}
        />
      </CardContent>
    </Card>
  );
});

export default AddonCard;