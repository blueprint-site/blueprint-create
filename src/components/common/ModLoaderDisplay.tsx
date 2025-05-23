import DevinsBadges from '@/components/utility/DevinsBadges';
import neoforge from '@/assets/neoforge_46h.png';
import { normalizeLoaderName } from '@/data/modloaders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ModLoaderDisplay = ({ loaders = [] }: { loaders: string[] }) => {
  if (loaders.length === 0) {
    return <div>No mod loaders found!</div>;
  }

  // Create a map of standardized names to their lowercase values
  // This is needed because DevinsBadges expects lowercase loader names
  const loaderDisplayMap = new Map(
    Array.from(new Set(loaders.map((loader) => loader.toLowerCase()))).map((loader) => [
      normalizeLoaderName(loader),
      loader.toLowerCase(),
    ])
  );

  // Get a sorted array of unique normalized loader names
  const uniqueLoaders = Array.from(loaderDisplayMap.keys()).sort((a, b) => a.localeCompare(b));

  return (
    <div className='flex flex-row gap-2'>
      {uniqueLoaders.map((loader) => {
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
