import { useFetchAddons, useSearchAddons } from '@/utils/useAddons';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import AddonGrid from './AddonGrid';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import type { Addon } from '@/types/addons';
import type { z } from 'zod';
type AddonType = z.infer<typeof Addon>;

export default function AddonsPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const limit = 12;
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const searchResponse = useSearchAddons(debouncedSearch, page, limit);
  const listResponse = useFetchAddons(page, limit);

  const addons: AddonType[] = useMemo(() => {
    if (debouncedSearch) {
      const r = (searchResponse as unknown as { data?: { addons?: AddonType[] } }).data;
      return (r?.addons ?? []) as AddonType[];
    }
    return ((listResponse as unknown as { data?: AddonType[] }).data ?? []) as AddonType[];
  }, [listResponse, searchResponse, debouncedSearch]);

  const totalPages = useMemo(() => {
    if (debouncedSearch) {
      const r = (searchResponse as unknown as { data?: { totalPages?: number } }).data;
      return r?.totalPages ?? 0;
    }
    const lr = (listResponse as unknown as { data?: { totalPages?: number; length?: number } })
      .data;
    return lr?.totalPages ?? Math.ceil((lr?.length || 0) / limit);
  }, [listResponse, searchResponse, debouncedSearch]);

  const isFirstPage = page === 1;
  const isLastPage = totalPages ? page >= totalPages : (addons?.length || 0) < limit;

  return (
    <div className='xl:mx-40 flex flex-col'>
      <div className='bg-blueprint/50 p-4 flex flex-col items-start'>
        <Input
          placeholder='Search addons...'
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className='bg-gray-200! dark:bg-gray-700!'
        />
        <div className='flex gap-2 mt-2 justify-end w-full'>
          <div className='flex flex-col'>
            <span className='text-xs opacity-80'>
              Note: Not all addons are reviewed yet. Some may be not reviewed yet. (and that feature
              isnt implemented yet) <br />
            </span>
            <span className='text-xs opacity-80'>
              Disclaimer: this is a rewrite of the old codebase. Some functions are copied while
              most are new. Site isnt polished right now <br />
            </span>
          </div>
          <button
            onClick={() => window.open('https://discord.gg/SvFYYtFbky', '_blank')}
            className='bg-accent ml-auto text-white text-xs font-minecraft px-3 py- hover:cursor-pointer'
          >
            Follow our discord for updates
          </button>
        </div>
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
