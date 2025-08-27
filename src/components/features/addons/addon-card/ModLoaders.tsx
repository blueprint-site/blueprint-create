import DevinsBadges from '@/components/utility/DevinsBadges';
import neoforge from '@/assets/neoforge_46h.png';
import { normalizeLoaderName, STANDARD_LOADER_DISPLAY } from '@/data/modloaders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ensureArray } from '@/utils/arrayUtils';

const ModLoaderDisplay = ({ loaders = [] }: { loaders: string[] | null | undefined }) => {
  // Ensure loaders is always an array and handle null/undefined
  const safeLoaders = ensureArray(loaders);

  if (safeLoaders.length === 0) {
    return <div>No mod loaders found!</div>;
  }

  // Convert to lowercase and deduplicate case-insensitive duplicates
  const lowerCaseLoaders = Array.from(
    new Set(
      safeLoaders
        .filter((loader) => loader && typeof loader === 'string')
        .map((loader) => loader.toLowerCase())
    )
  );

  // Check if "all" is present
  const hasAll = lowerCaseLoaders.includes('all');

  // If "All" is present, show all standard loaders
  let displayLoaders: string[];
  if (hasAll) {
    displayLoaders = ['Forge', 'Fabric', 'Quilt', 'NeoForge'];
  } else {
    // Map to proper display names using STANDARD_LOADER_DISPLAY
    displayLoaders = lowerCaseLoaders
      .map((loader) => STANDARD_LOADER_DISPLAY[loader] || normalizeLoaderName(loader))
      .sort((a, b) => a.localeCompare(b));
  }

  // Create a map of display names to their lowercase values for DevinsBadges
  const loaderDisplayMap = new Map(
    displayLoaders.map((displayName) => [displayName, displayName.toLowerCase()])
  );

  return (
    <div className='flex flex-row gap-2'>
      {displayLoaders.map((loader) => {
        return loader === 'NeoForge' ? (
          <div key={loader}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <img src={neoforge} alt={loader} className='h-8' />
                </TooltipTrigger>
                <TooltipContent className='bg-surface-2 border'>
                  <div>{loader}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <TooltipProvider key={loader} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <DevinsBadges
                    type='compact-minimal'
                    category='supported'
                    className={'h-8'}
                    name={loaderDisplayMap.get(loader) ?? loader.toLowerCase()}
                    format='svg'
                    height={32}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent className='bg-surface-2 border'>
                <div>{loader}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default ModLoaderDisplay;
