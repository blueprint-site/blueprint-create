import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { useCollectionStore } from "@/stores/collectionStore.ts";
import { Download, Info, X } from "lucide-react";
import { useEffect } from "react";

const CollectionSidebar = () => {
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
    <Sidebar side="right" className="mt-16">
      <SidebarTrigger
        className="absolute w-8 h-8 top-6 -left-11 text-lg p-3 rounded-full bg-background shadow-md"
        size="lg"
        variant="outline"
      />
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">My Addon Collection</h3>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
              New
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
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
        </div>
      </SidebarHeader>

      <SidebarContent>
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
                    Add addons to your collection using the "Add to Collection"
                    button on addon cards
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
                        onClick={() =>
                          window.open(
                            `https://modrinth.com/mod/${addon}`,
                            "_blank"
                          )
                        }
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default CollectionSidebar;
