import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import AddonCard from "./addon-card/AddonCard";
import { AddonListSkeleton } from "./AddonListSkeleton";
import { AddonSearchCard, ModloaderType } from "./AddonSearchCard";
import AddonCollection from "@/components/features/addons/AddonCollection";
import { useEntityManager } from "@/hooks/useData";
import { Addon, AddonSchema } from "@/schemas/addon.schema";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const AddonList = () => {
  const [query, setQuery] = useState<string>("");
  const [modloader, setModloader] = useState<ModloaderType>("all");
  const [version, setVersion] = useState<string>("all");
  const [debouncedQuery] = useDebounce(query, 300);
  const [localAddons, setLocalAddons] = useState<Addon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data: addons, isLoading, error } = useEntityManager<Addon>("mods", AddonSchema, {
    filters: {
      isValid: true
    },
    pageSize: 1000,
  });

  useEffect(() => {
    if (addons.length) {
      setLocalAddons(addons);
    }
  }, [addons]);

  const filteredAddons = localAddons.filter(addon => {
    const searchMatch = addon.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        addon.description?.toLowerCase().includes(debouncedQuery.toLowerCase());

    const modloaderMatch = modloader === 'all' || addon.categories?.includes(modloader);
    return searchMatch && modloaderMatch;
  });

  const totalPages = Math.ceil(filteredAddons.length / pageSize);
  const paginatedAddons = filteredAddons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

        {error && (
            <div className="text-red-500 text-center">
              Error loading addons: {error.message}
            </div>
        )}

        {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedAddons.map((addon) => (
                    <AddonCard key={addon.id} addon={addon} />
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                          onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                          className={currentPage === 1 ? "pointer-events-none cursor-pointer opacity-50" : ""}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-sm">Page {currentPage} sur {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                          onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                          className={currentPage === totalPages ? "pointer-events-none cursor-pointer opacity-50" : ""}
                      />

                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-sm text-foreground-muted">
                  {filteredAddons.length} résultats sur {localAddons.length}
                </div>
              </div>

              <AddonCollection />
            </>
        )}
      </div>
  );
};

export default AddonList;
