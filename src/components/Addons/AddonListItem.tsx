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
    <Card className="overflow-hidden bg-blueprint">
      <CardHeader className="flex flex-row gap-4">
        <LazyImage
          src={addon.icon_url}
          alt={addon.title}
          className="w-16 h-16 rounded-lg"
        />
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{addon.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {addon.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {modloaders.map(
            (loader) =>
              addon.categories.includes(loader) && (
                <Badge key={loader} variant="secondary">
                  {loader}
                </Badge>
              )
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {addon.versions.map((version) => (
            <Badge key={version} variant="outline">
              {version}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 border-b border-mute px-2 pb-1">
              <User className="h-4 w-4" />
              <span>{addon.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 border-b px-2 pb-1">
              <Users className="h-4 w-4" />
              <span>{addon.follows.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button
          variant={isInCollection ? "secondary" : "default"}
          size="sm"
          onClick={() => isInCollection ? removeAddon(addon.slug) : addAddon(addon.slug)}
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
          target="_blank"
          rel="noopener noreferrer"
          href={`https://modrinth.com/mod/${addon.slug}`}
        >
          <DevinsBadges
            type="compact"
            category="available"
            name="modrinth"
            format="png"
            height={32}
          />
        </a>
      </CardFooter>
    </Card>
  );
};

export default AddonListItem;