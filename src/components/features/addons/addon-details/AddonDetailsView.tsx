// src/components/features/addons/addon-details/AddonDetailsView.tsx

import { Bug, Globe } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ProcessedAddonData } from '@/types/addons/addon-details';
import { ExternalLinks } from '@/components/features/addons/addon-card/ExternalLinks';
import { Dependency } from '@/types/addons/dependencies';

import { AddonDetailsHeader } from './AddonDetailsHeader';
import { AddonDetailsDescription } from './AddonDetailsDescription';
import { AddonDetailsGallery } from './AddonDetailsGallery';
import { AddonDetailsFooter } from './AddonDetailsFooter';
import { AddonDetailsDonation } from './AddonDetailsDonation';
import { AddonVersionCompatibility } from './versions/AddonVersionCompatibility';

interface AddonDetailsViewProps {
  data: ProcessedAddonData;
}

/**
 * Unified view component for addon details using processed data
 */
export const AddonDetailsView = ({ data }: AddonDetailsViewProps) => {
  const { basic, versions, gallery, metadata, links, dependencies } = data;

  // Check if we have environment info
  const hasEnvironmentInfo = metadata.clientSide ?? metadata.serverSide;

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='overflow-hidden'>
        {/* Header with direct data access */}
        <AddonDetailsHeader data={{ basic, metadata }} />

        <Separator className='mx-6' />

        {/* Content area with version compatibility and metadata */}
        <div className='px-6 py-6'>
          <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Version compatibility */}
            <div>
              <AddonVersionCompatibility
                versions={versions.all}
                minecraftVersions={versions.minecraft}
                loaders={versions.loaders}
                createVersions={versions.create}
                isLoading={false}
                compatibility={versions.compatibility}
                versionDisplayData={{
                  filteredMinecraftVersions: versions.minecraft,
                  uniqueLoaders: versions.loaders,
                  uniqueCreateVersions: versions.create,
                  sortedVersions: versions.all,
                  featuredVersion: versions.featured,
                  isCompatible: versions.compatibility.isCompatible,
                }}
              />
            </div>

            {/* Right column with categories, environment, etc. */}
            <div className='space-y-6'>
              {/* Categories */}
              <div>
                <h3 className='mb-4 text-lg font-semibold'>Categories</h3>
                <div className='flex flex-wrap gap-2'>
                  {basic.categories.map((category: string) => (
                    <Badge key={category} variant='outline'>
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Environment Compatibility */}
              {hasEnvironmentInfo && (
                <div>
                  <h3 className='mb-4 text-lg font-semibold'>Environment</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    {metadata.clientSide && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>Client</h4>
                        <Badge variant={metadata.clientSide === 'required' ? 'default' : 'outline'}>
                          {metadata.clientSide.charAt(0).toUpperCase() +
                            metadata.clientSide.slice(1)}
                        </Badge>
                      </div>
                    )}

                    {metadata.serverSide && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>Server</h4>
                        <Badge variant={metadata.serverSide === 'required' ? 'default' : 'outline'}>
                          {metadata.serverSide.charAt(0).toUpperCase() +
                            metadata.serverSide.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {dependencies && dependencies.required && dependencies.required.length > 0 && (
                <div>
                  <h3 className='mb-4 text-lg font-semibold'>Dependencies</h3>
                  {/* Simplified version of dependencies for the right column */}
                  <div className='space-y-2'>
                    {dependencies.required && dependencies.required.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {dependencies.required.map((dep: Dependency) => (
                          <Badge key={dep.project_id} variant='default'>
                            {dep.name || 'Unknown'}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Available On */}
              <div>
                <h3 className='mb-4 text-lg font-semibold'>Available On</h3>
                <ExternalLinks
                  slug={basic.slug}
                  curseforge={metadata.availablePlatforms.includes('curseforge')}
                  modrinth={metadata.availablePlatforms.includes('modrinth')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery with direct data access */}
        <AddonDetailsGallery data={{ basic, gallery }} />

        {/* Description */}
        {metadata.bodyContent && (
          <>
            <Separator className='mx-6' />
            <AddonDetailsDescription description={metadata.bodyContent} />
          </>
        )}

        {/* Donation Links with direct data access */}
        {links.donation.length > 0 && (
          <>
            <Separator className='mx-6' />
            <AddonDetailsDonation data={{ links }} />
          </>
        )}

        {/* Footer */}
        <Separator className='mx-6' />
        <AddonDetailsFooter
          authors={[]} // Will need to extract authors from CurseForge data
          createdAt={basic.created_at}
          updatedAt={basic.updated_at}
          licence={''} // Will need to extract license from Modrinth data
          addon_name={basic.name}
          externalLinks={links.external.map((link) => {
            // Convert iconType back to React component
            let icon;
            switch (link.iconType) {
              case 'github':
                icon = <SiGithub className='h-4 w-4' />;
                break;
              case 'bug':
                icon = <Bug className='h-4 w-4' />;
                break;
              case 'globe':
                icon = <Globe className='h-4 w-4' />;
                break;
              default:
                icon = <Globe className='h-4 w-4' />;
            }

            return {
              ...link,
              icon,
            };
          })}
        />
      </Card>
    </div>
  );
};
