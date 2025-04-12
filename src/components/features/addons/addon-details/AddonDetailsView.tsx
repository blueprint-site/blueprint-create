// src/components/features/addons/addon-details/AddonDetailsView.tsx

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { ExternalLink, IntegratedAddonData } from '@/types';
import { ModPageLinks } from '@/components/features/addons/addon-card/ModPageLinks';

import { AddonDetailsHeader } from './AddonDetailsHeader';
import { AddonDetailsDescription } from './AddonDetailsDescription';
import { AddonDetailsGallery } from './AddonDetailsGallery';
import { AddonDetailsFooter } from './AddonDetailsFooter';
import { AddonDetailsDonation } from './AddonDetailsDonation';
import { AddonVersionCompatibility } from './versions/AddonVersionCompatibility';
import type { ModrinthProject } from '@/types';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import { Bug, Globe } from 'lucide-react';
interface AddonDetailsViewProps {
  addon: IntegratedAddonData;
  createVersions?: string[];
}

/**
 * Unified view component for addon details using processed data
 */
export const AddonDetailsView = ({ addon, createVersions = [] }: AddonDetailsViewProps) => {
  // Check if we have environment info
  const hasEnvironmentInfo = addon.modrinth?.client_side ?? addon.modrinth?.server_side;
  const createdAt =
    addon.created_at ??
    addon.modrinth?.published ??
    addon.modrinthObject?.date_created ??
    addon.curseforgeObject?.dateCreated ??
    '';
  const updatedAt =
    addon.updated_at ??
    addon.modrinth?.updated ??
    addon.modrinthObject?.date_modified ??
    addon.curseforgeObject?.dateModified ??
    '';
  const authors = addon.curseforgeObject?.authors ?? addon.author;

  const externalLinks: ExternalLink[] = [
    {
      icon: <Bug className='h-4 w-4' />,
      label: 'GitHub',
      url: addon.modrinth.issues_url ?? '',
    },
    {
      icon: <SiDiscord className='h-4 w-4' />,
      label: 'Discord',
      url: addon.modrinth.discord_url ?? '',
    },
    {
      icon: <Globe className='h-4 w-4' />,
      label: 'Wiki',
      url: addon.modrinth.wiki_url ?? '',
    },
    {
      icon: <SiGithub className='h-4 w-4' />,
      label: 'Source',
      url: addon.modrinth.source_url ?? '',
    },
  ].filter((link) => link.url !== '');

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='overflow-hidden'>
        {/* Header with direct data access */}
        <AddonDetailsHeader
          name={addon.name}
          slug={addon.slug}
          downloads={addon.downloads}
          description={addon.description}
          icon={addon.icon}
          follows={addon.modrinth.followers ?? 0}
        />

        <Separator className='mx-6' />

        {/* Content area with version compatibility and metadata */}
        <div className='px-6 py-6'>
          <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Version compatibility */}
            <div>
              <AddonVersionCompatibility
                versions={addon.modrinth.versions ?? []}
                minecraftVersions={addon.minecraft_versions ?? []}
                loaders={addon.loaders ?? []}
                createVersions={createVersions}
                isLoading={false}
              />
            </div>

            {/* Right column with categories, environment, etc. */}
            <div className='space-y-6'>
              {/* Categories */}
              <div>
                <h3 className='mb-4 text-lg font-semibold'>Categories</h3>
                <div className='flex flex-wrap gap-2'>
                  {addon.categories.map((category: string) => (
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
                    {addon.modrinth.client_side && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>Client</h4>
                        <Badge
                          variant={
                            addon.modrinth.client_side === 'required' ? 'default' : 'outline'
                          }
                        >
                          {addon.modrinth.client_side.charAt(0).toUpperCase() +
                            addon.modrinth.client_side.slice(1)}
                        </Badge>
                      </div>
                    )}

                    {addon.modrinth.server_side && (
                      <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>Server</h4>
                        <Badge
                          variant={
                            addon.modrinth.server_side === 'required' ? 'default' : 'outline'
                          }
                        >
                          {addon.modrinth.server_side.charAt(0).toUpperCase() +
                            addon.modrinth.server_side.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {addon.modrinth.dependencies && addon.modrinth.dependencies.length > 0 && (
                <div>
                  <h3 className='mb-4 text-lg font-semibold'>Dependencies</h3>
                  {/* Simplified version of dependencies for the right column */}
                  <div className='space-y-2'>
                    {addon.modrinth.dependencies.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {addon.modrinth.dependencies.map((dep: ModrinthProject) => (
                          <Badge key={dep.slug} variant='default'>
                            {dep.title ?? 'Unknown'}
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
                <ModPageLinks
                  slug={addon.slug}
                  curseforge={addon.sources.includes('CurseForge')}
                  modrinth={addon.sources.includes('Modrinth')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery with direct data access */}
        {addon.modrinth.gallery.length > 0 ? (
          <AddonDetailsGallery gallery={addon.modrinth.gallery} name={addon.name} />
        ) : null}

        {/* Description */}
        {addon.modrinth.body && (
          <>
            <Separator className='mx-6' />
            <AddonDetailsDescription description={addon.modrinth.body} />
          </>
        )}

        {/* Donation Links with direct data access */}
        {addon.modrinth.donation_urls.length > 0 && (
          <>
            <Separator className='mx-6' />
            <AddonDetailsDonation links={addon.modrinth.donation_urls} />
          </>
        )}

        {/* Footer */}
        <Separator className='mx-6' />
        <AddonDetailsFooter
          authors={authors}
          createdAt={createdAt}
          updatedAt={updatedAt}
          licence={addon.modrinth.license ?? null}
          addon_name={addon.name}
          claimed_by={addon.claimed_by}
          externalLinks={externalLinks}
        />
      </Card>
    </div>
  );
};
