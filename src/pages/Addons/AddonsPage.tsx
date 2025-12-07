import { useFetchAddons, useSearchAddons } from '@/utils/useAddons';
import AddonCard from './AddonCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import AddonGrid from './AddonGrid';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';


export default function AddonsPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const limit = 12;
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const listResponse = debouncedSearch
    ? useSearchAddons(debouncedSearch, page, limit)
    : useFetchAddons(page, limit);

  const addons = useMemo(() => {
    if (debouncedSearch) {
      const r = (listResponse as any).data;
      return r?.addons ?? [];
    }
    return (listResponse as any).data ?? [];
  }, [listResponse, debouncedSearch]);

  const totalPages = useMemo(() => {
    if (debouncedSearch) return (listResponse as any).data?.totalPages ?? 0;
    return (listResponse as any).data?.totalPages ?? Math.ceil(((listResponse as any).data?.length || 0) / limit);
  }, [listResponse, debouncedSearch]);

  const isFirstPage = page === 1;
  const isLastPage = totalPages ? page >= totalPages : (addons?.length || 0) < limit;

  return (
    <div className='xl:mx-40'>
      <div className='bg-blueprint p-4'>
        <Input
          placeholder='Search addons...'
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className='dark:text-white bg-gray-300!'
        />
      </div>
      <div className='mt-2 -mb-2'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                aria-disabled={isFirstPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isFirstPage) setPage((p) => p - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href='#'
                aria-disabled={isLastPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLastPage) setPage((p) => p + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <AddonGrid data={addons || []} />
    </div>
  );
}
