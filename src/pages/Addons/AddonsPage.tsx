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
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Addon } from '@/types/addons';
import type { z } from 'zod';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
type AddonType = z.infer<typeof Addon>;

export default function AddonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchParam = searchParams.get('q') || '';
  const [page, setPage] = useState<number>(pageParam);
  const [search, setSearch] = useState<string>(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchParam);
  const limit = 12;
  const vFilterMcVersions = ['1.18.2', '1.19.2', '1.20.1', '1.21.1'];
  const anchor = useComboboxAnchor();
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) {
      params.page = page.toString();
    }
    if (search.trim()) {
      params.q = search.trim();
    }
    setSearchParams(params);
  }, [page, search, setSearchParams]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const searchResponse = useSearchAddons(debouncedSearch, page, limit);
  const listResponse = useFetchAddons(page, limit);

  const isLoading = debouncedSearch ? searchResponse.isLoading : listResponse.isLoading;

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
      <div className='bg-surface-1 text-white p-4 flex flex-col items-start border'>
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
              Note: Not all addons are reviewed yet. Some may be not reviewed.
              <br />
            </span>
            <span className='text-xs opacity-80'>
              Disclaimer: this is a rewrite of the old codebase. Some functions are copied while
              most are new. Site isn't polished right now.
            </span>
          </div>
          <button
            onClick={() => window.open('https://discord.gg/SvFYYtFbky', '_blank')}
            className='bg-surface-3 ml-auto text-black dark:text-white text-xs font-minecraft px-3 hover:cursor-pointer'
          >
            Follow our discord for updates
          </button>
        </div>
        <div className='w-full mt-4'>
          <span className='text-xs opacity-80'>Filters:</span>
          <div className='flex gap-2'>
            <Combobox multiple autoHighlight items={vFilterMcVersions}>
              <ComboboxChips ref={anchor} className='w-full max-w-xs'>
                <ComboboxValue>
                  {(values) => (
                    <Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip key={value}>{value}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder='Filter by version...' />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No versions found</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
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
      <AddonGrid data={addons || []} isLoading={isLoading} />
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
    </div>
  );
}
