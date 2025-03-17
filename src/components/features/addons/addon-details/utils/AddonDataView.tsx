import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AddonDataProps } from '@/types/addons/addon-details';
import { ExternalLinks } from '@/components/features/addons/addon-card/ExternalLinks';
import { Dependencies, Dependency } from '@/types/addons/dependencies';

import { AddonMetaProcessor } from './AddonMetaProcessor';
import { AddonDetailsHeader } from '../AddonDetailsHeader';
import { AddonDetailsContent } from '../AddonDetailsContent';
import { AddonDetailsDescription } from '../AddonDetailsDescription';
import { AddonDetailsGallery } from '../AddonDetailsGallery';
import { AddonDetailsFooter } from '../AddonDetailsFooter';
import { AddonDetailsDonation, DonationLink } from '../AddonDetailsDonation';
import { AddonVersionCompatibility } from '../versions/AddonVersionCompatibility';

/**
 * Renders the addon data with all its sections
 */
export const AddonDataView = ({
  addon,
  modrinthData,
  curseforgeData,
  modrinthProject,
  versionInfo,
  isLoadingVersionInfo,
  slug = '',
  versionDisplay,
}: AddonDataProps) => {
  return (
    <AddonMetaProcessor
      addon={addon}
      modrinthData={modrinthData}
      curseforgeData={curseforgeData}
      modrinthProject={modrinthProject}
      versionInfo={versionInfo}
      slug={slug}
    >
      {({
        gallerySmall,
        galleryHD,
        totalDownload,
        dependencies,
        donationLinks,
        clientSide,
        serverSide,
        bodyContent,
        externalLinks,
        availableOn,
      }) => {
        // Convert generic dependencies to the expected Dependencies type
        const typedDependencies: Dependencies | undefined = dependencies as unknown as Dependencies;

        // Convert generic donationLinks to DonationLink[]
        const typedDonationLinks: DonationLink[] = Array.isArray(donationLinks)
          ? donationLinks.map((link) => ({
              id: (link.id as string) || String(Math.random()),
              platform: (link.platform as string) || 'Donate',
              url: (link.url as string) || '#',
            }))
          : [];

        return (
          <div className='container mx-auto px-4 py-8'>
            <Card className='overflow-hidden'>
              {/* Header */}
              <AddonDetailsHeader
                title={addon.name}
                description={addon.description ?? ''}
                downloads={totalDownload}
                follows={modrinthData?.follows ?? 0}
                icon={addon.icon || ''}
                slug={slug}
              />

              <Separator className='mx-6' />

              {/* Content/Metadata with enhanced version compatibility */}
              {isLoadingVersionInfo ? (
                <AddonDetailsContent
                  versions={addon.minecraft_versions ?? []}
                  loaders={addon.loaders ?? []}
                  categories={addon.categories ?? []}
                  slug={addon.slug}
                  availableOn={availableOn}
                  dependencies={typedDependencies}
                  clientSide={clientSide}
                  serverSide={serverSide}
                />
              ) : (
                <div className='px-6 py-6'>
                  <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <AddonVersionCompatibility
                        versions={versionInfo?.versions || []}
                        minecraftVersions={versionInfo?.game_versions || []}
                        loaders={addon.loaders ?? []}
                        createVersions={versionInfo?.createVersions || []}
                        isLoading={false}
                        versionDisplayData={versionDisplay}
                      />
                    </div>
                    <div className='space-y-6'>
                      <div>
                        <h3 className='mb-4 text-lg font-semibold'>Categories</h3>
                        <div className='flex flex-wrap gap-2'>
                          {(addon.categories || []).map((category: string) => (
                            <Badge key={category} variant='outline'>
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Environment Compatibility */}
                      {(clientSide || serverSide) && (
                        <div>
                          <h3 className='mb-4 text-lg font-semibold'>Environment</h3>
                          <div className='grid grid-cols-2 gap-4'>
                            {clientSide && (
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>Client</h4>
                                <Badge variant={clientSide === 'required' ? 'default' : 'outline'}>
                                  {clientSide.charAt(0).toUpperCase() + clientSide.slice(1)}
                                </Badge>
                              </div>
                            )}

                            {serverSide && (
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>Server</h4>
                                <Badge variant={serverSide === 'required' ? 'default' : 'outline'}>
                                  {serverSide.charAt(0).toUpperCase() + serverSide.slice(1)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dependencies */}
                      {typedDependencies &&
                        typedDependencies.required &&
                        typedDependencies.required.length > 0 && (
                          <div>
                            <h3 className='mb-4 text-lg font-semibold'>Dependencies</h3>
                            {/* Simplified version of dependencies for the right column */}
                            <div className='space-y-2'>
                              {typedDependencies.required &&
                                typedDependencies.required.length > 0 && (
                                  <div className='flex flex-wrap gap-2'>
                                    {typedDependencies.required.map((dep: Dependency) => (
                                      <Badge key={dep.project_id} variant='default'>
                                        {dep.name || 'Unknown'}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                      <div>
                        <h3 className='mb-4 text-lg font-semibold'>Available On</h3>
                        <ExternalLinks
                          slug={addon.slug}
                          curseforge={availableOn.includes('curseforge')}
                          modrinth={availableOn.includes('modrinth')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {gallerySmall && gallerySmall.length > 0 && (
                <AddonDetailsGallery
                  addon_name={addon.name}
                  gallery_small={gallerySmall}
                  gallery_hd={galleryHD}
                />
              )}

              {/* Full Body Content */}
              {bodyContent && (
                <>
                  <Separator className='mx-6' />
                  <AddonDetailsDescription description={bodyContent as string} />
                </>
              )}

              {/* Donation Links */}
              {typedDonationLinks && typedDonationLinks.length > 0 && (
                <>
                  <Separator className='mx-6' />
                  <AddonDetailsDonation donationLinks={typedDonationLinks} />
                </>
              )}

              {/* Footer */}
              <Separator className='mx-6' />
              <AddonDetailsFooter
                authors={curseforgeData?.authors ?? []}
                createdAt={addon.created_at || null}
                updatedAt={addon.updated_at || null}
                licence={modrinthData?.license ?? ''}
                addon_name={addon.name}
                externalLinks={externalLinks}
              />
            </Card>
          </div>
        );
      }}
    </AddonMetaProcessor>
  );
};
