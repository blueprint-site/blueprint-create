import { useEffect, useState, useRef, useMemo } from 'react';
import { Addon } from '@/types';
import { useSearchAddons } from '@/api';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useTranslation } from 'react-i18next';

export interface ScrollingAddonBackgroundProps {
  title?: string;
  subtitle?: string;
  query?: string;
  page?: number;
  category?: string;
  loaders?: string;
  version?: string;
  limit?: number;
}

export const ScrollingAddonBackground = ({
  query = '',
  page = 1,
  category = '',
  loaders = '',
  version = '',
  limit = 200, // Increased limit to ensure enough addons
  title = '',
  subtitle = '',
}: ScrollingAddonBackgroundProps) => {
  // Component state
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Addon dimensions for calculations
  const addonWidth = 50;
  const addonHeight = 50;
  const addonMarginRight = 5;
  const addonMarginBottom = 5;
  const totalAddonWidth = addonWidth + addonMarginRight;
  const totalAddonHeight = addonHeight + addonMarginBottom;

  // API hook for fetching addon data with prefetch enabled
  const { data: hits, isLoading: isLoadingAddons } = useSearchAddons(
    query,
    page,
    category,
    version,
    loaders,
    limit
  );

  // Update addons when data is fetched
  useEffect(() => {
    if (hits && hits.length > 0) {
      setAllAddons((prev) => (page === 1 ? hits : [...prev, ...hits]));
      setIsLoading(false);
    }
  }, [hits, page]);

  // Measure container dimensions with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial dimensions
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function hasVersion(versions: unknown, version: string): boolean {
    return Array.isArray(versions) && versions.includes(version);
  }

  // Calculate grid dimensions
  const { rows, cols } = useMemo(() => {
    const { width, height } = dimensions;

    // Use fallback dimensions if component hasn't fully loaded yet
    const effectiveWidth = width || window.innerWidth || 1200;
    const effectiveHeight = height || window.innerHeight || 600;

    // Always ensure we have at least enough rows/cols to fill the screen
    const calculatedCols = Math.ceil(effectiveWidth / totalAddonWidth) + 2; // Add extra columns for safety
    const calculatedRows = Math.ceil(effectiveHeight / totalAddonHeight) + 1; // Add extra row for safety

    // Minimum values to prevent empty grids during loading
    const minCols = 15;
    const minRows = 5;

    return {
      rows: Math.max(calculatedRows, minRows),
      cols: Math.max(calculatedCols, minCols),
    };
  }, [dimensions, totalAddonWidth, totalAddonHeight]);

  // Memoized icon grid creation to avoid recalculation on every render
  const iconGrid = useMemo(() => {
    if (allAddons.length === 0) return [];

    // Ensure we have enough addons to fill multiple rows completely
    // If not, duplicate the existing ones to fill the required space
    let workingAddons = [...allAddons];
    const minRequiredIcons = rows * cols * 2; // Double columns for seamless scrolling

    // If we don't have enough icons, duplicate the array until we do
    while (workingAddons.length < minRequiredIcons) {
      workingAddons = [...workingAddons, ...allAddons];
    }

    // Create grid with addon data - ensure every cell has data
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const rowIcons = [];
      for (let col = 0; col < cols * 2; col++) {
        const addonIndex = (row * cols + col) % workingAddons.length;
        const addon = workingAddons[addonIndex];

        // Create a properly typed version of the addon object
        rowIcons.push({
          ...addon,
          key: `${row}-${col}-${addon.$id || col}`,
          icon: addon.icon || '',
          name: addon.name || 'Addon icon',
          // Ensure create_versions is properly typed as string[]
          create_versions: Array.isArray(addon.create_versions) ? addon.create_versions : [],
        });
      }
      grid.push(rowIcons);
    }

    return grid;
  }, [allAddons, rows, cols]);

  // Generate placeholder grid while loading
  const placeholderGrid = useMemo(() => {
    if (!isLoading && !isLoadingAddons && allAddons.length > 0) return null;

    // Dynamically calculate how many columns we need based on window width
    // Use the same calculation as for the real grid to ensure consistency
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1200;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

    // Calculate how many columns we need to fill the screen with some extra margin
    const placeholderCols = Math.ceil(viewportWidth / totalAddonWidth) + 5; // Add extra columns for safety
    const placeholderRows = Math.ceil(viewportHeight / totalAddonHeight) + 2; // Add extra rows for safety

    // Create placeholder grid with empty cells
    const grid = [];

    for (let row = 0; row < placeholderRows; row++) {
      const rowIcons = [];
      // Duplicate columns for seamless scrolling (3x to handle even very wide screens)
      for (let col = 0; col < placeholderCols * 3; col++) {
        rowIcons.push({
          key: `placeholder-${row}-${col}`,
          icon: '',
          name: 'Addon icon',
          create_versions: [],
        });
      }
      grid.push(rowIcons);
    }

    return grid;
  }, [isLoading, isLoadingAddons, allAddons.length, totalAddonWidth, totalAddonHeight]);

  // Decide which grid to display
  const displayGrid = allAddons.length > 0 ? iconGrid : placeholderGrid;

  // Don't show an empty loading state - show placeholder grid instead
  const showPlaceholderContent = isLoading || isLoadingAddons || allAddons.length === 0;

  const animationDuration = 160; // seconds

  // Define animation keyframes for row scrolling
  const keyframesStyle = `
    @keyframes scrollRow {
      0% {
        transform: translateX(-${cols * totalAddonWidth}px);
      }
      100% {
        transform: translateX(0);
      }
    }
  `;

  const { t } = useTranslation();
  return (
    <div
      className='bg-background relative h-full w-full overflow-hidden rounded-b-2xl'
      ref={containerRef}
    >
      <style>{keyframesStyle}</style>

      <div className='absolute inset-0'>
        <div className='flex h-full w-full flex-col overflow-hidden'>
          {displayGrid?.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className='flex w-fit whitespace-nowrap'
              style={{
                animation: `scrollRow ${animationDuration}s linear infinite`,
                animationDelay: `${((rowIndex % 2) * -animationDuration) / 2}s`, // Alternate row direction
              }}
            >
              {row.map((addon) =>
                addon.icon ? (
                  <img
                    key={addon.key}
                    src={addon.icon}
                    alt={addon.name || 'Addon icon'}
                    className={`mr-[5px] mb-[5px] h-[50px] w-[50px] rounded-full object-contain ${
                      hasVersion(addon.create_versions, '0.6') ? '' : 'opacity-70 grayscale'
                    }`}
                    loading='lazy'
                  />
                ) : (
                  <div
                    key={addon.key}
                    className='mr-[5px] mb-[5px] h-[50px] w-[50px] rounded-full bg-gray-500 opacity-50'
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Semi-transparent overlay */}
      <div className='absolute inset-0 bg-black opacity-30'></div>

      {/* Main content */}
      <div className='relative flex h-full flex-col items-center justify-center font-bold text-white'>
        <h1 className='mb-4 text-center text-4xl'>
          {showPlaceholderContent ? (
            <span className='inline-block animate-pulse'>
              {title || t('scrollingaddonbackground.title')}
            </span>
          ) : (
            title || t('scrollingaddonbackground.title')
          )}
        </h1>
        <p className='text-center text-xl italic'>
          {subtitle || t('scrollingaddonbackground.subtitle')}
        </p>
      </div>

      <div className='absolute top-2 right-2 flex items-center'>
        {/* Info tooltip */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-4 w-4 cursor-pointer text-white' />
            </TooltipTrigger>
            <TooltipContent>{t('scrollingaddonbackground.tooltip')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ScrollingAddonBackground;
