import { Search } from "lucide-react";
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

export const MODLOADER_OPTIONS = [
  { value: "all", label: "All Modloaders" },
  { value: "forge", label: "Forge" },
  { value: "fabric", label: "Fabric" },
  { value: "quilt", label: "Quilt" },
] as const;

export type ModloaderType = (typeof MODLOADER_OPTIONS)[number]["value"];

interface AddonSearchCardProps {
  query: string;
  onQueryChange: (query: string) => void;
  modloader: ModloaderType;
  onModloaderChange: (value: ModloaderType) => void;
  version: string;
  onVersionChange: (version: string) => void;
}

export function AddonSearchCard({
  query,
  onQueryChange,
  modloader,
  onModloaderChange,
  version,
  onVersionChange,
}: AddonSearchCardProps) {
  const handleModloaderChange = (value: string) => {
    if (value === "all" || value === "forge" || value === "fabric" || value === "quilt") {
      onModloaderChange(value as ModloaderType);
    }
  };

  return (
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search addons..."
              className="pl-10"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
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

          <Select value={version} onValueChange={onVersionChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Versions</SelectItem>
              <SelectItem value="1.20.1">1.20.1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}