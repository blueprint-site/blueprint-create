import { useEffect, useState, useRef } from 'react';
import { Addon } from '@/types';
import { useSearchAddons } from '@/api';
import { Info } from 'lucide-react';

export interface DynamicBgProps {
  title?: string;
  subtitle?: string;
  query?: string;
  page?: number;
  category?: string;
  loaders?: string;
  version?: string;
  limit?: number;
}

export const DynamicBg = ({
  query = '',
  page = 1,
  category = '',
  loaders = '',
  version = '',
  limit = 100,
  title = '',
  subtitle = '',
}: DynamicBgProps) => {
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: hits } = useSearchAddons(query, page, category, version, loaders, limit);

  useEffect(() => {
    if (hits && hits.length > 0) {
      if (page === 1) {
        setAllAddons(hits);
      } else {
        setAllAddons((prev) => [...prev, ...hits]);
      }
    }
  }, [hits, page]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        setContainerWidth(entries[0].contentRect.width);
        setContainerHeight(entries[0].contentRect.height);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const addonWidth = 50; // Width of each addon icon in pixels
  const addonHeight = 50; // Height of each addon icon in pixels
  const addonMarginRight = 5; // Margin right of each addon icon in pixels
  const addonMarginBottom = 5; // Margin bottom of each addon icon in pixels
  const totalAddonWidth = addonWidth + addonMarginRight;
  const totalAddonHeight = addonHeight + addonMarginBottom;

  // Calculate the number of icons needed for a complete grid
  const calculateGridDimensions = () => {
    if (!containerWidth || !containerHeight || allAddons.length === 0) return { rows: 5, cols: 20 };

    const cols = Math.ceil(containerWidth / totalAddonWidth) + 1; // Add 1 extra column to ensure seamless looping
    const rows = Math.ceil(containerHeight / totalAddonHeight);

    return { rows, cols };
  };

  const { rows, cols } = calculateGridDimensions();

  // Create a grid of icons that repeats the available addons
  const createIconGrid = () => {
    if (allAddons.length === 0) return [];

    // Create enough rows to fill the container
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const rowIcons = [];
      // Create enough columns for each row, and then duplicate it for smooth scrolling
      for (let col = 0; col < cols * 2; col++) {
        // double the columns for seamless scrolling
        const addonIndex = (row * cols + col) % allAddons.length;
        rowIcons.push({
          ...allAddons[addonIndex],
          key: `${row}-${col}-${allAddons[addonIndex].name}`,
        });
      }
      grid.push(rowIcons);
    }

    return grid;
  };

  const iconGrid = createIconGrid();
  const animationDuration = 160; // seconds - much slower now (80s instead of 20s)

  return (
    <div className='relative h-full w-full overflow-hidden rounded-b-2xl' ref={containerRef}>
      {/* Background with icons in a grid */}
      <div className='absolute inset-0'>
        <div className='grid-container'>
          {iconGrid.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}  `}
              className={`icon-row`}
              style={{
                animation: `scrollRow ${animationDuration}s linear infinite`,
                animationDelay: `${((rowIndex % 2) * -animationDuration) / 2}s`, // Alternate row direction
              }}
            >
              {row.map((addon, colIndex) => (
                <img
                  key={`${addon.key}-${colIndex}`}
                  src={addon.icon}
                  alt={addon.name}
                  className={`addon-icon rounded-full ${addon?.create_versions?.includes('0.6') ? undefined : 'grayscale'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Semi-transparent black filter */}
      <div className='absolute inset-0 bg-black opacity-30'></div>

      {/* Main content */}
      <div className='relative flex h-full flex-col items-center justify-center font-bold text-white'>
        <h1 className='mb-4 text-4xl'>{title || '0% of addons have support for Create 0.6'}</h1>
        <p className='text-xl italic'>
          {subtitle || '"That accounts to ~0 addons totally" - Says our expert'}
        </p>
      </div>
      <div className='absolute top-2 right-2 flex items-center'>
        <div className='group relative mr-1'>
          <Info className='h-4 w-4 cursor-pointer' />
          <div className='absolute right-full z-10 mr-2 hidden rounded bg-gray-800 p-2 text-sm text-white shadow-lg group-hover:block'>
            Grayed icons do not support Create 0.6
          </div>
        </div>
      </div>

      {/* Styles for grid and image animation */}
      <style>
        {`
        .grid-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .icon-row {
          display: flex;
          white-space: nowrap;
          width: fit-content;
        }

        .addon-icon {
          width: ${addonWidth}px;
          height: ${addonHeight}px;
          object-fit: contain;
          margin-right: ${addonMarginRight}px;
          margin-bottom: ${addonMarginBottom}px;
        }

        @keyframes scrollRow {
          0% {
            transform: translateX(-${cols * totalAddonWidth}px);
          }
          100% {
            transform: translateX(0);
          }
        }
        `}
      </style>
    </div>
  );
};
