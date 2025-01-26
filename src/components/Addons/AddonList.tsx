import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddonStore } from "@/stores/addonStore";
import { Addon } from "@/types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import AddonListItem from "./AddonListItem";

const MODLOADER_OPTIONS = [
  { value: "all", label: "All Modloaders" },
  { value: "forge", label: "Forge" },
  { value: "fabric", label: "Fabric" },
  { value: "quilt", label: "Quilt" },
] as const;

type ModloaderType = (typeof MODLOADER_OPTIONS)[number]["value"];

const AddonList = () => {
  const [query, setQuery] = useState<string>("");
  const [modloader, setModloader] = useState<ModloaderType>("all");
  const [version, setVersion] = useState<string>("all");
  const [debouncedQuery] = useDebounce(query, 300);

  const { addons, versions, isLoading, error, fetchAddons } = useAddonStore();

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  const filteredAddons = useMemo(() => {
    return addons.filter((addon: Addon) => {
      const matchesQuery = addon.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesModloader = modloader === "all" || addon.categories.includes(modloader);
      const matchesVersion = version === "all" || addon.versions.includes(version);
      return matchesQuery && matchesModloader && matchesVersion;
    });
  }, [addons, debouncedQuery, modloader, version]);

  const handleModloaderChange = (value: string) => {
    if (value === "all" || value === "forge" || value === "fabric" || value === "quilt") {
      setModloader(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col font-minecraft items-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">Create Mod Addons</h1>
        <p className="text-lg text-muted-foreground">
          Discover and explore addons for the Create mod
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Addons</CardTitle>
          <CardDescription>
            Find the perfect addon for your Create mod experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search addons..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <Select value={modloader} onValueChange={handleModloaderChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Modloader" />
              </SelectTrigger>
              <SelectContent>
                {MODLOADER_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading addons...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAddons.map((addon) => (
          <AddonListItem key={addon.id} addon={addon} />
        ))}
      </div>
    </div>
  );
};

export default AddonList;