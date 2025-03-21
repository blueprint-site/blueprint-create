import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AddonVersion } from '@/types/addons/addon-details';
import ModLoaders from '../../addon-card/ModLoaders';
import { useTranslation } from 'react-i18next';

interface SummaryTabContentProps {
  minecraftVersions: string[];
  uniqueLoaders: string[];
  createVersions: string[];
  featuredVersion: AddonVersion | null;
}

export const SummaryTabContent: React.FC<SummaryTabContentProps> = ({
  minecraftVersions,
  uniqueLoaders,
  createVersions,
  featuredVersion,
}) => {
  const { t } = useTranslation();
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div className='space-y-4'>
        <div>
          <h4 className='mb-2 text-sm font-medium'>{t('addons.details.minecraft-versions')}</h4>
          <div className='flex flex-wrap gap-2'>
            {minecraftVersions.map((version) => (
              <Badge key={version} variant='outline'>
                {version}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-2 text-sm font-medium'>Mod {t('addons.details.loaders')}</h4>
          <ModLoaders loaders={uniqueLoaders} />
        </div>

        {createVersions.length > 0 && (
          <div>
            <h4 className='mb-2 text-sm font-medium'>Create {t('addons.details.versions')}</h4>
            <div className='flex flex-wrap gap-2'>
              {createVersions.map((version) => {
                return (
                  <Badge key={version} variant='secondary'>
                    {version}
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
              {t('addons.details.latest-version')}
              {featuredVersion.featured && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant='default' className='ml-2 text-xs'>
                        {t('addons.details.featured')}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('addons.details.recommended-version')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h4>

            <div className='space-y-2'>
              <div className='text-lg font-medium'>{featuredVersion.name}</div>
              <div className='text-muted-foreground text-sm'>
                {t('addons.details.released')}{' '}
                {new Date(featuredVersion.date_published).toLocaleDateString()}
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
