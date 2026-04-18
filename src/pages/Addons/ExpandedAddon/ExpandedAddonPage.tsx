import { useParams } from 'react-router-dom';
import { useFetchAddonBySlug } from '@/utils/useAddons';
import { ExpandedAddonDescription } from './ExpandedAddonDescription';
import { ExpandedAddonCompatibilityAndVersions } from './ExpandedAddonCompatibilityAndVersions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export default function ExpandedAddonPage() {
  const slug = useParams().slug?.toString();
  const addon = useFetchAddonBySlug(slug)?.data;
  return (
    <div className='py-5 px-5 lg:px-5 xl:px-10 2xl:px-40'>
      <div className=''>
        <span className='opacity-50 text-xs font-minecraft'>
          This page`s design is a work in progress. Expect it to get better!
        </span>
        {addon && (
          <div className='w-full border bg-linear-to-t from-surface-3 to-surface-1 p-5 pt-20 pb-2 text-white'>
            <div className='md:flex items-center gap-4'>
              <div className=''>
                {addon.icon && (
                  <img src={addon.icon} alt={'Icon for ' + addon.name} className='w-20' />
                )}
                <div className='flex flex-col'>
                  <span className='font-minecraft text-4xl'>{addon.name}</span>
                  <span className='opacity-80 font-minecraft'>{addon.description}</span>
                </div>
              </div>

              <div className='gap-2 flex-col flex mt-2 font-minecraft ml-auto'>
                {addon.sources.includes('Modrinth') && (
                  <button
                    className='bg-green-400 p-2 md:p-1 md:px-7 hover:cursor-pointer hover:bg-accent transition-all text-black'
                    onClick={() => window.open(`https://modrinth.com/mod/${addon.slug}`)}
                  >
                    Modrinth
                  </button>
                )}
                {addon.sources.includes('CurseForge') && (
                  <button
                    className='bg-orange-500 p-2 md:p-1 md:px-7 hover:cursor-pointer hover:bg-accent transition-all text-black'
                    onClick={() =>
                      window.open(`https://www.curseforge.com/minecraft/mc-mods/${addon.slug}`)
                    }
                  >
                    CurseForge
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='hidden lg:block'>
        <div className='mt-10 flex flex-col gap-4 lg:flex-row'>
          <div className='lg:flex-[4_1_0%] lg:min-w-0'>
            {addon && (
              <div className='w-full'>
                <ExpandedAddonDescription description={addon.body || ''} />
              </div>
            )}
          </div>
          <div className='lg:flex-[1_1_0%] lg:min-w-0'>
            {addon && (
              <div className='w-full'>
                <ExpandedAddonCompatibilityAndVersions
                  versions={addon.minecraft_versions ?? []}
                  authors={addon.authors ?? []}
                  modloaders={addon.loaders ?? []}
                  lastUpdated={addon.updated_at ?? undefined}
                  modrinthId={addon.modrinth_id ?? undefined}
                  curseforgeId={addon.curseforge_id ?? undefined}
                  downloads={addon.downloads ?? 0}
                  downloadsIsFallback={addon.downloads_is_fallback ?? false}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='lg:hidden'>
        <div className='mt-10'>
          <Tabs defaultValue='description' className='w-full'>
            <TabsList>
              <TabsTrigger value='description' className=''>
                Description
              </TabsTrigger>
              <TabsTrigger value='compatibility'>Versions & Info</TabsTrigger>
            </TabsList>
            <TabsContent value='description'>
              {addon && (
                <div className=' w-full'>
                  <ExpandedAddonDescription description={addon.body || ''} />
                </div>
              )}
            </TabsContent>
            <TabsContent value='compatibility'>
              {addon && (
                <div className=''>
                  <ExpandedAddonCompatibilityAndVersions
                    versions={addon.minecraft_versions ?? []}
                    authors={addon.authors ?? []}
                    modloaders={addon.loaders ?? []}
                    lastUpdated={addon.updated_at ?? undefined}
                    modrinthId={addon.modrinth_id ?? undefined}
                    curseforgeId={addon.curseforge_id ?? undefined}
                    downloads={addon.downloads ?? 0}
                    downloadsIsFallback={addon.downloads_is_fallback ?? false}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
