import { Plus, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Collections from "@/components/CollectionHandler";
import DevinsBadges from "@/components/DevinsBadges"; // Adjust the import path as necessary
import LazyImage from "@/components/LazyImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Addon } from "@/stores/addonStore";

interface AddonListItemProps {
  addon: Addon;
  onCollectionUpdate?: () => void;
}

const AddonListItem = ({ addon, onCollectionUpdate }: AddonListItemProps) => {
  const [isInCollection, setIsInCollection] = useState(false);
  const { t } = useTranslation();
  const modloaders = ["forge", "fabric", "quilt"];

  useEffect(() => {
    const collection = Collections.getCollection();
    setIsInCollection(collection.includes(addon.slug));
  }, [addon.slug]);

  const handleAddToCollection = () => {
    Collections.collectionAdded(addon.slug);
    setIsInCollection(true);
    onCollectionUpdate?.();
  };

  return (
    <Card className="overflow-hidden bg-blueprint font-minecraft">
      <CardHeader className="flex flex-row gap-4">
        <LazyImage
          src={addon.icon_url}
          alt={addon.title}
          className=" rounded-lg"
          imgClassName="w-24 h-24"
        />
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{addon.title}</h3>
          <p className="text-sm text-muted line-clamp-2">
            {addon.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {modloaders.map(
            (loader) =>
              addon.categories.includes(loader) && (
                <DevinsBadges type="compact-minimal" category="supported" name={loader} format="png" height={46} />
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
          onClick={handleAddToCollection}
        >
          <Plus className="h-5 w-5 mr-2" />
          {isInCollection ? "In Collection" : "Add to Collection"}
        </Button>

        <a
          target="_blank"
          rel="noopener noreferrer"
          className="addon-button"
          href={`${" https://modrinth.com/mod/" + addon.addon_slug}`}
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
