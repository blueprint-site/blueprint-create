import { useState, useEffect } from 'react';
import { useSearchAddons } from '@/api';
import { ListPageLayout, ListPageSidebar, ListPageContent } from '@/layouts/ListPageLayout';
import { SearchFilter } from '@/components/layout/SearchFilter';
import { SelectFilter } from '@/components/layout/SelectFilter';
import { FiltersContainer } from '@/components/layout/FiltersContainer';
import { ItemGrid } from '@/components/layout/ItemGrid';
import AddonCard from '@/components/features/addons/addon-card/AddonCard.tsx';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'; // Import the hook
import { Addon } from '@/schemas/addon.schema.tsx';

const AddonsList = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [loaders, setLoaders] = useState('');
  const [version, setVersion] = useState('');
  const [allAddons, setAllAddons] = useState<Addon[]>([]); // Use correct type

  const {
    data: hits,
    isLoading,
    isFetching,
    hasNextPage,
  } = useSearchAddons(query, page, category, version, loaders);

  // Use the useInfiniteScroll hook
  const { sentinelRef, loadingMore } = useInfiniteScroll({
    loading: isLoading || isFetching, // Use isLoading or isFetching
    hasMore: hasNextPage,
    onLoadMore: () => {
      if (hasNextPage && !isFetching) {
        console.log('Loading more addons. Current page:', page); // Debugging
        setPage((prev) => prev + 1);
      }
    },
  });

  // Reset accumulated addons when filters change (except page)
  useEffect(() => {
    setAllAddons([]);
    setPage(1); // Reset to first page when filters change
  }, [query, category, loaders, version]);

  // Append new addons to the accumulated list
  useEffect(() => {
    if (hits && hits.length > 0) {
      console.log('New hits fetched:', hits); // Debugging
      if (page === 1) {
        setAllAddons(hits); // Replace the list if it's the first page
      } else {
        setAllAddons((prev) => [...prev, ...hits]); // Append new addons for subsequent pages
      }
    }
  }, [hits, page]);

  // Filter options
  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'tech', label: 'Tech' },
    { value: 'energy', label: 'Energy' },
    { value: 'magic', label: 'Magic' },
  ];

  const loaderOptions = [
    { value: 'all', label: 'All' },
    { value: 'Forge', label: 'Forge' },
    { value: 'Fabric', label: 'Fabric' },
    { value: 'NeoForge', label: 'NeoForge' },
    { value: 'Quilt', label: 'Quilt' },
  ];

  const versionOptions = [
    { value: 'all', label: 'All' },
    { value: '1.18.2', label: '1.18.2' },
    { value: '1.19.2', label: '1.19.2' },
    { value: '1.21.1', label: '1.21.1' },
  ];

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setLoaders('');
    setVersion('');
    setPage(1);
  };

  return (
    <ListPageLayout>
      <ListPageSidebar>
        <FiltersContainer>
          <div className='flex items-center justify-between'>
            <div className='text-foreground font-minecraft text-xl font-semibold'>Filters</div>
            <button
              onClick={resetFilters}
              className='text-primary flex items-center gap-1 text-sm'
              aria-label='Reset filters'>
              Reset
            </button>
          </div>

          <SearchFilter value={query} onChange={setQuery} placeholder='Search addons...' />

          <SelectFilter
            label='Category'
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />

          <SelectFilter
            label='Loaders'
            value={loaders}
            onChange={setLoaders}
            options={loaderOptions}
          />

          <SelectFilter
            label='Version'
            value={version}
            onChange={setVersion}
            options={versionOptions}
          />
        </FiltersContainer>
      </ListPageSidebar>

      <ListPageContent>
        <ItemGrid
          items={allAddons}
          renderItem={(hit) => <AddonCard key={hit.$id} addon={hit} />}
          isLoading={true}
          isError={false}
          emptyMessage='No addons found.'
          infiniteScrollEnabled={true}
          loadingMore={loadingMore} // Pass loadingMore state
          sentinelRef={sentinelRef} // Pass sentinelRef
        />
      </ListPageContent>
    </ListPageLayout>
  );
};

export default AddonsList;
