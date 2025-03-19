import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import DevinsBadges from '@/components/utility/DevinsBadges.tsx';
import { Badge } from '@/components/ui/badge.tsx';

const MODLOADERS = ['forge', 'fabric', 'neoforge', 'quilt'];

const ModLoaders = ({ modloaders }: { modloaders: string[] }) => {
  const filteredLoaders = [...new Set(modloaders.map((loader) => loader.toLowerCase()))]
    .filter((loader) => MODLOADERS.includes(loader))
    .map((loader) => loader.toLowerCase());

  return (
    <TooltipProvider>
      <div className='flex gap-2'>
        {filteredLoaders.map((loader) => (
          <Tooltip key={loader}>
            <TooltipTrigger asChild>
              <div className='cursor-pointer p-0'>
                {loader === 'neoforge' ? (
                  <img
                    src='@/assets/neoforge_46h.png'
                    alt='NeoForge'
                    loading='lazy'
                    className='h-10 rounded'
                  />
                ) : (
                  <DevinsBadges
                    type='compact-minimal'
                    category='supported'
                    name={loader}
                    format='svg'
                    height={40}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className='flex flex-wrap gap-1 p-2'>
              <Badge variant='outline'>{loader}</Badge>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ModLoaders;
