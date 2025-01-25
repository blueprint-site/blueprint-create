import { Plus, User, Users, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DevinsBadges from "@/components/utility/DevinsBadges";
import LazyImage from "@/components/utility/LazyImage";
import { Addon } from "@/stores/addonStore";
import { useCollectionStore } from "@/stores/collectionStore";

interface AddonListItemProps {
  addon: Addon;
}

const AddonListItem = ({ addon }: AddonListItemProps) => {
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(addon.slug);
  const { t } = useTranslation();
  const modloaders = ["forge", "fabric", "quilt"];

  return (
    <Card className="overflow-hidden bg-blueprint flex flex-col">
      <CardHeader className="flex flex-row gap-4">
        <div className="flex-shrink-0 w-16 h-16">
          <LazyImage
            src={addon.icon_url}
            alt={addon.title}
            className="w-full h-full rounded-lg overflow-hidden"
            objectFit="cover"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-xl font-semibold text-white/80 truncate">
            {addon.title}
          </h3>
          <p className="text-sm text-white/70 line-clamp-2">
            {addon.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow gap-4">
        <div className="flex flex-wrap gap-2">
          {modloaders.map(
            (loader) =>
              addon.categories.includes(loader) && (
                <DevinsBadges 
                  type="compact-minimal"
                  category="supported"
                  name={loader}
                  format="svg"
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

        <div className="grid grid-cols-2 gap-4 text-sm text-black/30">
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

      <CardFooter className="grid grid-cols-2 flex-grow-0 gap-4">
        <Button
          variant={isInCollection ? "success" : "default"}
          size="sm"
          className="py-0 h-full"
          onClick={() =>
            isInCollection ? removeAddon(addon.slug) : addAddon(addon.slug)
          }
        >
          {isInCollection ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Remove from Collection
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to Collection
            </>
          )}
        </Button>

        <a
          className="flex items-center justify-end"
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
      </CardFooter>
    </Card>
  );
};

export default AddonListItem;
