import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Addon } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import AddonCard from "./addon-card/AddonCard.tsx";
import { useAppStore } from "@/stores/useAppStore.ts";
import { AddonListSkeleton } from "./AddonListSkeleton";
import { AddonSearchCard, ModloaderType } from "./AddonSearchCard";
import AddonCollection from "@/components/features/addons/AddonCollection.tsx";


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
      <AddonSearchCard
        query={query}
        onQueryChange={setQuery}
        modloader={modloader}
        onModloaderChange={setModloader}
        version={version}
        onVersionChange={setVersion}
      />

      {isLoading && <AddonListSkeleton />}

      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAddons.map((addon, index) => (
              <AddonCard key={index} addon={addon} />
            ))}
          </div>

          {filteredAddons.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-muted">Show</span>
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
                <span className="text-sm text-foreground-muted">per page</span>
              </div>

              <div className="text-sm text-foreground-muted">
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