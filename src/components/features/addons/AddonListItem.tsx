import { Plus, User, Download, X } from "lucide-react";
import { memo } from "react";

import { useCollectionStore } from "@/stores/collectionStore.ts";
import { Addon } from "@/types";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";


interface AddonListItemProps {
  addon: Addon;
}

const AddonListItem = memo(({ addon }: AddonListItemProps) => {
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(addon.slug);
  const modloaderIcons = {
    forge: "⚒️",
    fabric: "🧵",
    quilt: "🛋️",
  };

  const handleCollectionAction = () => {
    isInCollection ? removeAddon(addon.slug) : addAddon(addon.slug);
  };

  return (
      <Card className="group relative overflow-hidden transition-all hover:border-primary/20 hover:shadow-sm">
        <CardHeader className="flex flex-row items-start gap-3 p-3 pb-0">
          <img
              src={addon.icon}
              alt={addon.name}
              loading="lazy"
              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-sm"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm font-medium truncate">{addon.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {addon.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(modloaderIcons).map(
                ([loader, icon]) =>
                    addon.categories.includes(loader) && (
                        <Badge
                            key={loader}
                            variant="outline"
                            className="gap-1.5 px-2 py-1 text-xs"
                        >
                          <span className="text-base">{icon}</span>
                          {loader}
                        </Badge>
                    )
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {addon.versions?.map((version) => (
                <Badge
                    key={version}
                    variant="secondary"
                    className="text-xs font-mono px-1.5 py-0.5"
                >
                  {version}
                </Badge>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{addon.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>{addon.downloads.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 p-3 pt-0">
          <Button
              variant={isInCollection ? "outline" : "default"}
              size="sm"
              className="h-8 w-full gap-1.5 text-xs"
              onClick={handleCollectionAction}
          >
            {isInCollection ? (
                <X className="h-3.5 w-3.5" />
            ) : (
                <Plus className="h-3.5 w-3.5" />
            )}
            {isInCollection ? "Remove" : "Add to Collection"}
          </Button>
          <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5"
              asChild
          >
            <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://modrinth.com/mod/${addon.slug}`}
            >
              <span className="text-xs">Details</span>
            </a>
          </Button>
        </CardFooter>
      </Card>
  );
});

export default AddonListItem;