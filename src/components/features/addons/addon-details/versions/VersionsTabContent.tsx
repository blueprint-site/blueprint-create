// src/components/features/addons/addon-details/components/versions/VersionsTabContent.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, InfoIcon } from 'lucide-react';
import type { AddonVersion } from '@/types';
import { useDependencyProcessor } from '@/hooks/useDependencyProcessor';
import ModLoaders from '../../addon-card/ModLoaders';

interface VersionsTabContentProps {
  sortedVersions: AddonVersion[];
}

export const VersionsTabContent: React.FC<VersionsTabContentProps> = ({ sortedVersions }) => {
  const { getCreateDependencies, mapVersionIdToReadable } = useDependencyProcessor();

  return (
    <Accordion type='single' collapsible className='max-h-64 w-full overflow-scroll'>
      {sortedVersions.map((version) => {
        const createDeps = getCreateDependencies(version);

        return (
          <AccordionItem key={version.id} value={version.id} className='border-b'>
            <AccordionTrigger className='px-2 py-4 hover:no-underline'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center'>
                  <span className='mr-2 font-medium'>{version.name}</span>
                  {version.featured && (
                    <Badge variant='default' className='text-xs'>
                      Featured
                    </Badge>
                  )}
                </div>
                <div className='text-muted-foreground flex items-center text-sm'>
                  <span className='mr-2'>
                    {new Date(version.date_published).toLocaleDateString()}
                  </span>
                  <ChevronDown className='h-4 w-4' />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className='px-2 pb-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Minecraft Versions</h4>
                  <div className='flex flex-wrap gap-2'>
                    {version.game_versions.map((mcVersion) => (
                      <Badge key={mcVersion} variant='outline'>
                        {mcVersion}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='mb-2 text-sm font-medium'>Mod Loaders</h4>
                  <ModLoaders loaders={version.loaders} />
                </div>

                {createDeps.length > 0 && (
                  <div className='md:col-span-2'>
                    <h4 className='mb-2 flex items-center text-sm font-medium'>
                      Create Compatibility
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className='text-muted-foreground ml-1 h-4 w-4' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Create mod versions required for this addon version</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {createDeps.map((dep) => {
                        // Determine the mod type (Forge Create or Create Fabric) based on project ID
                        let modName = 'Create';
                        if (dep.project_id === 'Xbc0uyRg') {
                          modName = 'Create Fabric';
                        }

                        // Try to get a readable version from the version ID if available
                        let versionDisplay = dep.file_name ?? modName;

                        if (dep.version_id) {
                          const readableVersion = mapVersionIdToReadable(
                            dep.version_id,
                            versionDisplay
                          );
                          versionDisplay = `${modName} ${readableVersion}`;
                        }

                        return (
                          <Badge
                            key={dep.version_id ?? dep.project_id}
                            variant='secondary'
                            className='text-sm'
                          >
                            {versionDisplay}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {version.dependencies && version.dependencies.length > 0 && (
                  <div className='mt-2 md:col-span-2'>
                    <h4 className='mb-2 text-sm font-medium'>Other Dependencies</h4>
                    <div className='flex flex-wrap gap-2'>
                      {version.dependencies
                        .filter((dep) => {
                          // Filter out Create mod as it's shown separately
                          const CREATE_FORGE_ID = 'LNytGWDc';
                          const CREATE_FABRIC_ID = 'Xbc0uyRg';
                          return (
                            dep.project_id !== CREATE_FORGE_ID &&
                            dep.project_id !== CREATE_FABRIC_ID
                          );
                        })
                        .map((dep) => {
                          let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' =
                            'outline';

                          if (dep.dependency_type === 'required') badgeVariant = 'default';
                          if (dep.dependency_type === 'optional') badgeVariant = 'outline';
                          if (dep.dependency_type === 'incompatible') badgeVariant = 'destructive';
                          if (dep.dependency_type === 'embedded') badgeVariant = 'secondary';

                          return (
                            <Badge
                              key={dep.project_id + (dep.version_id ?? '')}
                              variant={badgeVariant}
                              className='text-sm'
                            >
                              {dep.file_name ?? 'Unknown'}
                              {dep.version_id && ` (${dep.version_id})`}
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
