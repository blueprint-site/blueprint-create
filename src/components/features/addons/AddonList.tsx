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
import { Button } from "@/components/ui/button";
import { Addon } from "@/types";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import AddonListItem from "./AddonListItem";
import { useAppStore } from "@/stores/useAppStore.ts";
import AddonCollection from "@/components/features/addons/AddonCollection.tsx";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [debouncedQuery] = useDebounce(query, 300);

  const { addons, isLoading } = useAppStore();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, modloader, version]);

  const queryFilteredAddons = useMemo(() => {
    if (!debouncedQuery) return addons;
    return addons.filter((addon: Addon) =>
      addon.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [addons, debouncedQuery]);

  const modloaderFilteredAddons = useMemo(() => {
    if (modloader === 'all') return queryFilteredAddons;
    return queryFilteredAddons.filter((addon: Addon) =>
      addon.categories.includes(modloader)
    );
  }, [queryFilteredAddons, modloader]);

  const filteredAddons = useMemo(() => {
    if (version === 'all') return modloaderFilteredAddons;
    return modloaderFilteredAddons.filter((addon: Addon) =>
      addon.versions.includes(version)
    );
  }, [modloaderFilteredAddons, version]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage);
  const paginatedAddons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAddons.slice(startIndex, endIndex);
  }, [filteredAddons, currentPage, itemsPerPage]);

  const handleModloaderChange = (value: string) => {
    if (value === "all" || value === "forge" || value === "fabric" || value === "quilt") {
      setModloader(value);
    }
  };

  const visiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
                <SelectItem value="1.20.1">1.20.1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-foreground-muted">Loading addons...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAddons.map((addon, index) => (
              <AddonListItem key={index} addon={addon} />
            ))}
          </div>

          {filteredAddons.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredAddons.length)} of{" "}
                {filteredAddons.length} results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {visiblePages().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          <AddonCollection />
        </>
      )}
    </div>
  );
};

export default AddonList;