import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import DevinsBadges from '@/components/utility/DevinsBadges.tsx';
import { Badge } from '@/components/ui/badge.tsx';

import { useMemo } from 'react';
import { Addon } from '@/types';

const MODLOADERS = ['forge', 'fabric', 'neoforge', 'quilt'];

const LOADER_MAP = {
  1: 'forge',
  4: 'fabric',
  5: 'quilt',
  6: 'neoforge',
} as const;

const ModLoaders = ({ addon }: { addon: Addon }) => {
  const loaderVersions = useMemo(() => {
    // Initialize with Sets for automatic deduplication
    const versions: Record<string, Set<string>> = {
      forge: new Set(),
      fabric: new Set(),
      neoforge: new Set(),
      quilt: new Set(),
    };

    // Process CurseForge files
    addon.curseforge_raw?.latestFilesIndexes?.forEach((file) => {
      const loaderKey = LOADER_MAP[file.modLoader as keyof typeof LOADER_MAP];
      if (loaderKey) {
        versions[loaderKey].add(file.gameVersion);
      }
    });

    // Process Modrinth versions
    const modrinthVersions = addon.modrinth_raw?.versions || [];
    addon.modrinth_raw?.categories
      ?.filter((category: string) => MODLOADERS.includes(category))
      .forEach((category: string) => {
        modrinthVersions.forEach((version) => {
          versions[category].add(version);
        });
      });

    // Convert Sets to sorted arrays for rendering
    return Object.fromEntries(
      Object.entries(versions).map(([key, set]) => [
        key,
        Array.from(set).sort((a, b) => b.localeCompare(a)), // Sort versions in descending order
      ])
    );
  }, [
    addon.curseforge_raw?.latestFilesIndexes,
    addon.modrinth_raw?.categories,
    addon.modrinth_raw?.versions,
  ]);

  return (
    <TooltipProvider>
      <div className='flex gap-2'>
        {Object.entries(loaderVersions)
          .filter(([, versions]) => versions.length > 0)
          .map(([loader, versions]) => (
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
                {versions.map((version) => (
                  <Badge key={version} variant='outline'>
                    {version}
                  </Badge>
                ))}
              </TooltipContent>
            </Tooltip>
          ))}
      </div>
    </TooltipProvider>
  );
};

export default ModLoaders;
