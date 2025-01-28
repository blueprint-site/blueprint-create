import { Plus, User, Users, X } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import DevinsBadges from "@/components/utility/DevinsBadges";
import { useCollectionStore } from "@/stores/collectionStore";
import { Addon } from "@/types";

interface AddonListItemProps {
  addon: Addon;
}

const AddonListItem = memo(({ addon }: AddonListItemProps) => {
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(addon.slug);
  const modloaders = ["forge", "fabric", "quilt"];

  const handleCollectionAction = () => {
    if (isInCollection) {
      removeAddon(addon.slug);
    } else {
      addAddon(addon.slug);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden bg-blueprint shadow-lg">
      <CardHeader className="flex flex-row gap-4 items-center p-4">
        <img
          src={addon.icon_url}
          alt={addon.title}
          loading="lazy"
          className="flex-shrink-0 w-16 h-16 overflow-hidden object-cover"
        />
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-xl font-semibold truncate">{addon.title}</h3>
          <h3 className="text-xl font-semibold truncate">{addon.slug}</h3>
          <p className="text-sm line-clamp-4">{addon.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow gap-4">
        <div className="flex flex-wrap gap-2">
          {modloaders.map(
            (loader) =>
              addon.categories.includes(loader) && (
                <DevinsBadges
                  key={loader}
                  type="compact-minimal"
                  category="supported"
                  name={loader}
                  format="svg"
                  height={32}
                />
              )
          )}
        </div>

        <div className="flex-grow self-start">
          <div className="flex flex-wrap gap-2">
            {addon.versions.map((version) => (
              <Badge key={version} variant="outline">
                {version}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 border-b border-black/30 hover:text-black/50 px-2 pb-1">
              <User className="h-4 w-4" />
              <span>{addon.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 border-b border-black/30 hover:text-black/50 px-2 pb-1">
              <Users className="h-4 w-4" />
              <span>{addon.follows.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid sm:grid-cols-2 grid-cols-1 flex-grow-0 gap-4 align-center">
        <a
          className="flex items-center justify-center sm:justify-start"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://modrinth.com/mod/${addon.slug}`}
        >
          <DevinsBadges
            type="compact"
            category="available"
            name="modrinth"
            format="png"
            height={46}
          />
        </a>
        <Button
          variant={isInCollection ? "success" : "default"}
          size="sm"
          className="sm:py-0 sm:h-full h-[46px]"
          onClick={handleCollectionAction}
        >
          {isInCollection ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isInCollection ? "Remove from" : "Add to"} Collection
        </Button>
      </CardFooter>
    </Card>
  );
});

export default AddonListItem;
