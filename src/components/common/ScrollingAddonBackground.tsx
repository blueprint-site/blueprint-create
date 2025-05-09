import { useEffect, useState, useRef, useMemo } from 'react';
import type { Addon } from '@/types';
import { useSearchAddons } from '@/api';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks';
import { Button } from '../ui/button';

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
  const { toast } = useToast();
  // Component state
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayPopup, setDisplayPopup] = useState(false);

  // Addon dimensions for calculations
  const addonWidth = 50;
  const addonHeight = 50;
  const addonMarginRight = 5;
  const addonMarginBottom = 5;
  const totalAddonWidth = addonWidth + addonMarginRight;
  const totalAddonHeight = addonHeight + addonMarginBottom;

  // API hook for fetching addon data with prefetch enabled
  const { data: hits, isLoading: isLoadingAddons } = useSearchAddons({
    query,
    page,
    category,
    version,
    loaders,
    limit,
  });

  // Update addons when data is fetched
  useEffect(() => {
    if (hits && hits.length > 0) {
      setAllAddons((prev) => (page === 1 ? hits : [...prev, ...hits]));
      setIsLoading(false);
    } else if (hits && hits.length === 0 && !isLoadingAddons) {
      // No data was returned from the API, but the request finished
      setIsLoading(false);
    }
  }, [hits, page, isLoadingAddons]);

  // Initialize dimensions and set up ResizeObserver
  useEffect(() => {
    // Set initial dimensions immediately using window size as fallback
    const initialWidth = containerRef.current?.clientWidth ?? window.innerWidth;
    const initialHeight = containerRef.current?.clientHeight ?? window.innerHeight;

    setDimensions({
      width: initialWidth,
      height: initialHeight,
    });

    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Konami Code detection with overlay
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A
    let konamiIndex = 0;

    const keyMap: { [key: number]: string } = {
      38: '↑',
      40: '↓',
      37: '←',
      39: '→',
      66: 'B',
      65: 'A',
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = keyMap[event.keyCode];
      if (key) {
        setSequence((prev) => [...prev, key]);
      }

      if (event.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          setSequence([]); // Clear sequence on success
          console.log('Konami Code activated!');
          toast({
            title: 'Easter egg activated!',
            description: 'Let the dance begin!',
          });
          setDisplayPopup(true);
        }
      } else {
        konamiIndex = 0;
        setSequence([]); // Reset sequence on failure
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function hasVersion(versions: unknown, version: string): boolean {
    return Array.isArray(versions) && versions.includes(version);
  }

  // Calculate grid dimensions
  const { rows, cols } = useMemo(() => {
    const { width, height } = dimensions;

    // Use actual dimensions if available, otherwise use fallback
    const effectiveWidth = width || window.innerWidth;
    const effectiveHeight = height || window.innerHeight;

    // Calculate the required number of columns and rows to fill the screen
    // Add extra columns/rows to ensure no empty space during animation
    const calculatedCols = Math.ceil(effectiveWidth / totalAddonWidth) + 3;
    const calculatedRows = Math.ceil(effectiveHeight / totalAddonHeight) + 2;

    // Minimum values to ensure adequate coverage
    const minCols = 15;
    const minRows = 5;

    return {
      rows: Math.max(calculatedRows, minRows),
      cols: Math.max(calculatedCols, minCols),
    };
  }, [dimensions, totalAddonWidth, totalAddonHeight]);

  // Prepare addon grid for display
  const iconGrid = useMemo(() => {
    if (allAddons.length === 0) return [];

    // Create a working copy of addons with enough duplicated content
    let workingAddons = [...allAddons];
    const minRequiredIcons = rows * cols * 2; // Double columns for seamless scrolling

    // If we don't have enough icons, duplicate the array until we do
    while (workingAddons.length < minRequiredIcons) {
      workingAddons = [...workingAddons, ...allAddons];
    }

    // Pre-shuffle the working array to avoid repetitive patterns
    const shuffledAddons = [...workingAddons].sort(() => Math.random() - 0.5);

    // Create grid with addon data - ensure every cell has data
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const rowIcons = [];
      for (let col = 0; col < cols * 2; col++) {
        // Use shuffled addons for more randomness in the grid
        const addonIndex = (row * cols + col) % shuffledAddons.length;
        const addon = shuffledAddons[addonIndex];

        // Create a properly typed version of the addon object
        rowIcons.push({
          ...addon,
          key: `${row}-${col}-${addon.$id || `placeholder-${col}`}`,
          icon: addon.icon || '',
          name: addon.name || 'Addon icon',
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

    // Use dimensions from the dimensions state or window as fallback
    const { width: viewportWidth, height: viewportHeight } = dimensions;

    // Calculate placeholders needed to fill the screen with extra margin
    const placeholderCols = Math.ceil(viewportWidth / totalAddonWidth) + 5;
    const placeholderRows = Math.ceil(viewportHeight / totalAddonHeight) + 2;

    // Create placeholder grid
    const grid = [];

    // Generate placeholder items for the grid
    // Using fixed opacity placeholders to simulate loading state
    for (let row = 0; row < placeholderRows; row++) {
      const rowIcons = [];
      // Duplicate columns for seamless scrolling
      for (let col = 0; col < placeholderCols * 3; col++) {
        rowIcons.push({
          key: `placeholder-${row}-${col}`,
          icon: '', // Empty icon for placeholder
          name: 'Loading addon',
          create_versions: [],
        });
      }
      grid.push(rowIcons);
    }

    return grid;
  }, [isLoading, isLoadingAddons, allAddons.length, dimensions, totalAddonWidth, totalAddonHeight]);

  // Decide which grid to display based on data state
  const displayGrid = allAddons.length > 0 ? iconGrid : placeholderGrid;

  // Flag to determine whether to show placeholder content
  const showPlaceholderContent = isLoading || isLoadingAddons || allAddons.length === 0;

  // Animation duration in seconds (adjust as needed)
  const animationDuration = 160;

  // Define keyframes for row scrolling animation
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

  return (
    <div
      className='bg-background relative h-full w-full overflow-hidden rounded-b-2xl'
      ref={containerRef}
    >
      <style>{keyframesStyle}</style>
      {displayPopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50'>
          <div className='rounded-lg border border-gray-800 bg-black/80 p-6 shadow-lg'>
            <h1 className='text-3xl font-bold text-white'>Party time!</h1>
            <span className='text-lg text-gray-300'>You entered the Konami code, congrats!</span>
            <iframe
              width='560'
              height='315'
              src='https://www.youtube.com/embed/SoI_ETK30OU?si=fevfOnoovPqMZt5K&amp;controls=0'
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              className='mt-4 rounded-lg'
            />
            <br />
            <Button className='mt-4' onClick={() => setDisplayPopup(false)}>
              Close embed
            </Button>
          </div>
        </div>
      )}
      <div className='absolute inset-0'>
        <div className='flex h-full w-full flex-col overflow-hidden'>
          {displayGrid?.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}-${row[0]?.key || rowIndex}`}
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
                    onError={(e) => {
                      // Replace broken images with placeholder
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Crect width="50" height="50" fill="%23555555" rx="25" /%3E%3C/svg%3E';
                      (e.target as HTMLImageElement).className =
                        'mr-[5px] mb-[5px] h-[50px] w-[50px] rounded-full opacity-30';
                    }}
                  />
                ) : (
                  <div
                    key={addon.key}
                    className='mr-[5px] mb-[5px] h-[50px] w-[50px] rounded-full bg-gray-500 opacity-30'
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
              {title || '0% of addons have support for Create 0.6'}
            </span>
          ) : (
            title || '0% of addons have support for Create 0.6'
          )}
        </h1>
        <p className='text-center text-xl italic'>
          {subtitle || '"That accounts to ~0 addons totally" - Says our expert'}
        </p>
      </div>

      {/* Konami Code overlay */}
      <div className='konami-overlay'>
        {sequence.map((key, index) => (
          <span key={index} className='konami-key'>
            {key}
          </span>
        ))}
      </div>

      <div className='absolute top-2 right-2 flex items-center'>
        {/* Info tooltip */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='h-4 w-4 cursor-pointer text-white' />
            </TooltipTrigger>
            <TooltipContent>Grayed icons do not support Create 0.6</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ScrollingAddonBackground;
