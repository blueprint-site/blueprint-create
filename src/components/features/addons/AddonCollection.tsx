import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCollectionStore } from "@/stores/collectionStore.ts";
import { Download, Info, X } from "lucide-react";
import { useEffect } from "react";

const CollectionSheet = () => {
  const { collection, removeAddon, initializeCollection } =
    useCollectionStore();

  useEffect(() => {
    initializeCollection();
  }, [initializeCollection]);

  const downloadAllAddons = () => {
    collection.forEach((addon, index) => {
      setTimeout(() => {
        window.open(`https://modrinth.com/mod/${addon}`, "_blank");
      }, index * 100);
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed top-20 right-4 w-8 h-8 p-3 rounded-full bg-background shadow-md"
          variant="outline"
        >
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-surface-1">
        <SheetHeader>
          <SheetTitle>My Addon Collection</SheetTitle>
          <SheetDescription>Manage your saved addons here.</SheetDescription>
        </SheetHeader>
        <div className="flex justify-end py-2">
          {collection.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadAllAddons}
              title="Download all addons"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {collection.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Empty Collection
                  </CardTitle>
                  <CardDescription>
                    Add addons to your collection using the "Add to Collection" button on addon cards.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              collection.map((addon) => (
                <Card key={addon} className="group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 truncate mr-2">
                      <span className="text-sm font-medium">{addon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => window.open(`https://modrinth.com/mod/${addon}`, "_blank")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeAddon(addon)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CollectionSheet;
