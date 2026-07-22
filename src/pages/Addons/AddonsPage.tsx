import { useFetchAddonsWithFilters, useSearchAddons } from '@/utils/useAddons';
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
import { Button } from '@/components/ui/button';

type AddonType = z.infer<typeof Addon>;
const parseListParam = (value: string | null) => (value ? value.split(',').filter(Boolean) : []);

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export default function AddonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParamRaw = parseInt(searchParams.get('page') || '1', 10);
  const pageParam = Number.isNaN(pageParamRaw) || pageParamRaw < 1 ? 1 : pageParamRaw;
  const searchParam = searchParams.get('q') || '';
  const versionsFromUrl = parseListParam(searchParams.get('versions'));
  const modloadersFromUrl = parseListParam(searchParams.get('modloaders'));
  const sitesFromUrl = parseListParam(searchParams.get('sites'));
  const searchParamsString = searchParams.toString();
  const versionsFromUrlKey = versionsFromUrl.join(',');
  const modloadersFromUrlKey = modloadersFromUrl.join(',');
  const sitesFromUrlKey = sitesFromUrl.join(',');
  const [page, setPage] = useState<number>(pageParam);
  const [search, setSearch] = useState<string>(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchParam);
  const limit = 12;

  const vFilterMcVersions = ['1.18.2', '1.19.2', '1.20.1', '1.21.1'];
  const vFilterModloaders = ['Fabric', 'Forge', 'NeoForge', 'Quilt'];
  const vFilterSites = ['Modrinth', 'CurseForge'];
  const versionsAnchor = useComboboxAnchor();
  const modloadersAnchor = useComboboxAnchor();
  const sitesAnchor = useComboboxAnchor();

  const [filterVersions, setFilterVersions] = useState<string[]>(versionsFromUrl);
  const [filterModloaders, setFilterModloaders] = useState<string[]>(modloadersFromUrl);
  const [filterSites, setFilterSites] = useState<string[]>(sitesFromUrl);

  useEffect(() => {
    setPage((prev) => (prev === pageParam ? prev : pageParam));
    setSearch((prev) => (prev === searchParam ? prev : searchParam));
    setFilterVersions((prev) => (arraysEqual(prev, versionsFromUrl) ? prev : versionsFromUrl));
    setFilterModloaders((prev) =>
      arraysEqual(prev, modloadersFromUrl) ? prev : modloadersFromUrl
    );
    setFilterSites((prev) => (arraysEqual(prev, sitesFromUrl) ? prev : sitesFromUrl));
  }, [pageParam, searchParam, versionsFromUrlKey, modloadersFromUrlKey, sitesFromUrlKey]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) {
      params.page = page.toString();
    }
    if (search.trim()) {
      params.q = search.trim();
    }
    if (filterVersions.length) {
      params.versions = filterVersions.join(',');
    }
    if (filterModloaders.length) {
      params.modloaders = filterModloaders.join(',');
    }
    if (filterSites.length) {
      params.sites = filterSites.join(',');
    }
    const nextParams = new URLSearchParams(params);
    if (nextParams.toString() !== searchParamsString) {
      setSearchParams(params, { replace: true });
    }
  }, [
    page,
    search,
    filterVersions,
    filterSites,
    filterModloaders,
    searchParamsString,
    setSearchParams,
  ]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(id);
  }, [search]);

  const searchResponse = useSearchAddons(
    debouncedSearch,
    page,
    limit,
    filterVersions,
    filterModloaders,
    filterSites
  );
  const listResponse = useFetchAddonsWithFilters(
    page,
    limit,
    filterVersions,
    filterModloaders,
    filterSites
  );

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
  const totalPagesSafe = Math.max(totalPages, 1);
  const pageItems = useMemo<Array<number | 'ellipsis'>>(() => {
    if (totalPagesSafe <= 7) {
      return Array.from({ length: totalPagesSafe }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPagesSafe];
    }

    if (page >= totalPagesSafe - 2) {
      return [
        1,
        'ellipsis',
        totalPagesSafe - 3,
        totalPagesSafe - 2,
        totalPagesSafe - 1,
        totalPagesSafe,
      ];
    }

    return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPagesSafe];
  }, [page, totalPagesSafe]);

  const renderPagination = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            aria-disabled={isFirstPage}
            className={isFirstPage ? 'pointer-events-none opacity-50' : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!isFirstPage) setPage((p) => p - 1);
            }}
          />
        </PaginationItem>
        {pageItems.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={item === page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href='#'
            aria-disabled={isLastPage}
            className={isLastPage ? 'pointer-events-none opacity-50' : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!isLastPage) setPage((p) => p + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className=' flex flex-col'>
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

        <div className='w-full mt-2'>
          <span className='text-xs opacity-80 flex gap-1 items-center mb-1'>Filters:</span>
          <div className='flex gap-2'>
            {/* versions */}
            <Combobox
              value={filterVersions}
              onValueChange={(values) => {
                setPage(1);
                setFilterVersions(values);
              }}
              multiple
              autoHighlight
              items={vFilterMcVersions}
            >
              <ComboboxChips ref={versionsAnchor} className='w-full max-w-xs not-dark:bg-surface-2'>
                <ComboboxValue>
                  {(values) => (
                    <Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip className='not-dark:bg-surface-4' key={value}>
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder='Filter by version...' />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={versionsAnchor}>
                <ComboboxEmpty>No versions found</ComboboxEmpty>
                <ComboboxList className='not-dark:bg-surface-2 not-dark:text-white'>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {/* loaders */}
            <Combobox
              value={filterModloaders}
              multiple
              autoHighlight
              items={vFilterModloaders}
              onValueChange={(values) => {
                setPage(1);
                setFilterModloaders(values);
              }}
            >
              <ComboboxChips
                ref={modloadersAnchor}
                className='w-full max-w-xs not-dark:bg-surface-2'
              >
                <ComboboxValue>
                  {(values) => (
                    <Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip className='not-dark:bg-surface-4' key={value}>
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder='Filter by modloader...' />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={modloadersAnchor}>
                <ComboboxEmpty>No modloaders found</ComboboxEmpty>
                <ComboboxList className='not-dark:bg-surface-2 not-dark:text-white'>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {/* platforms */}
            <Combobox
              value={filterSites}
              multiple
              autoHighlight
              items={vFilterSites}
              onValueChange={(values) => {
                setPage(1);
                setFilterSites(values);
              }}
            >
              <ComboboxChips ref={sitesAnchor} className='w-full max-w-xs not-dark:bg-surface-2'>
                <ComboboxValue>
                  {(values) => (
                    <Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip className='not-dark:bg-surface-4' key={value}>
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder='Filter by site...' />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={sitesAnchor}>
                <ComboboxEmpty>No sites found</ComboboxEmpty>
                <ComboboxList className='not-dark:bg-surface-2 not-dark:text-white'>
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
      <div className='mt-2 -mb-2'>{renderPagination()}</div>
      <AddonGrid data={addons || []} isLoading={isLoading} />
      <div className='flex gap-2 mt-2 justify-end w-full'>
        <div className='flex flex-col'>
          <span className='text-xs opacity-80'>
            Note: Not all addons are reviewed yet. Some may be not reviewed.
            <br />
          </span>
          <span className='text-xs opacity-80'>
            Disclaimer: this is a rewrite of the old codebase. Some functions are copied while most
            are new. Site isn`t polished right now.
          </span>
        </div>
        <Button
          onClick={() => window.open('https://discord.gg/SvFYYtFbky', '_blank')}
          className='bg-surface-3 ml-auto text-black dark:text-white text-xs font-minecraft px-3 hover:cursor-pointer'
        >
          Follow our discord for updates
        </Button>
      </div>
      <div className='mt-2 -mb-2'>{renderPagination()}</div>
    </div>
  );
}
