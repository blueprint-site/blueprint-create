import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay';
import { AddonVersion } from '@/types/addons/addon-details';
import { CREATE_VERSIONS } from '@/data/createVersions';

interface VersionSummaryViewProps {
  filteredMinecraftVersions: string[];
  uniqueLoaders: string[];
  uniqueCreateVersions: string[];
  featuredVersion: AddonVersion | null;
}

export const VersionSummaryView: React.FC<VersionSummaryViewProps> = ({
  filteredMinecraftVersions,
  uniqueLoaders,
  uniqueCreateVersions,
  featuredVersion,
}) => {
  // Debug logging
  console.log('Create versions in Summary:', uniqueCreateVersions);
  console.log('CREATE_VERSIONS mapping:', CREATE_VERSIONS);

  // Sort Create versions based on sortOrder defined in the CREATE_VERSIONS object
  const sortedCreateVersions = [...uniqueCreateVersions].sort(
    (a, b) => (CREATE_VERSIONS[a]?.sortOrder || 99) - (CREATE_VERSIONS[b]?.sortOrder || 99)
  );

  console.log('Sorted Create versions:', sortedCreateVersions);

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='space-y-4'>
        <div>
          <h4 className='mb-2 text-sm font-medium'>Minecraft Versions</h4>
          <div className='flex flex-wrap gap-2'>
            {filteredMinecraftVersions.map((version) => (
              <Badge key={version} variant='outline'>
                {version}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-2 text-sm font-medium'>Mod Loaders</h4>
          <ModLoaderDisplay loaders={uniqueLoaders} />
        </div>

        {sortedCreateVersions.length > 0 && (
          <div>
            <h4 className='mb-2 text-sm font-medium'>Create Versions</h4>
            <div className='flex flex-wrap gap-2'>
              {sortedCreateVersions.map((version) => {
                // Just show the version number without the "Create" prefix
                const displayVersion = version;

                return (
                  <Badge key={version} variant='secondary'>
                    {displayVersion}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {featuredVersion && (
        <div>
          <div className='rounded-md border p-4'>
            <h4 className='mb-2 flex items-center gap-1 text-sm font-medium'>
              Latest Version
              {featuredVersion.is_featured && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant='default' className='ml-2 text-xs'>
                        Featured
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is the recommended version by the developer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h4>

            <div className='space-y-2'>
              <div className='text-lg font-medium'>{featuredVersion.name}</div>
              <div className='text-muted-foreground text-sm'>
                Released {new Date(featuredVersion.date_published).toLocaleDateString()}
              </div>

              <div className='mt-2 flex flex-wrap gap-2'>
                {featuredVersion.game_versions.map((version: string) => (
                  <Badge key={version} variant='outline' className='text-xs'>
                    MC {version}
                  </Badge>
                ))}

                {featuredVersion.loaders.map((loader: string) => (
                  <Badge key={loader} variant='outline' className='text-xs'>
                    {loader}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
