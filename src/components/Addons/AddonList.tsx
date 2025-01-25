import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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

import AddonListItem from "./AddonListItem";

// Available modloader options
const MODLOADER_OPTIONS = [
  { value: "all", label: "All Modloaders" },
  { value: "forge", label: "Forge" },
  { value: "fabric", label: "Fabric" },
  { value: "quilt", label: "Quilt" },
] as const;

type ModloaderType = (typeof MODLOADER_OPTIONS)[number]["value"];

const AddonList = () => {
  // State management with proper typing
  const [query, setQuery] = useState<string>("");
  const [modloader, setModloader] = useState<ModloaderType>("all");
  const [version, setVersion] = useState<string>("all");

  // Type-safe handlers for select changes
  const handleModloaderChange = (value: string) => {
    // Validate that the value is a valid ModloaderType
    if (value === "all" || value === "forge" || value === "fabric" || value === "quilt") {
      setModloader(value);
    }
  };
  
  const { addons, versions, isLoading, error, fetchAddons } = useAddonStore();

  // Fetch addons on mount
  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]); // Add fetchAddons to dependency array

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="flex flex-col font-minecraft items-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Create Mod Addons
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover and explore addons for the Create mod
        </p>
      </header>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Addons</CardTitle>
          <CardDescription>
            Find the perfect addon for your Create mod experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search addons..."
                  className="pl-10"
                  value={query}
                  startIcon={Search}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Modloader Filter */}
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

            {/* Version Filter */}
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

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading addons...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load addons</p>
        </div>
      )}

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((addon) => (
          <AddonListItem key={addon.id} addon={addon} />
        ))}
      </div>
    </div>
  );
};

export default AddonList;