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
        <span className='opacity-50 text-xs font-minecraft'>This page's design is a work in progress. Expect it to get better!</span>
        {addon && (
          <div className='bg-linear-to-t text-white from-surface-3 to-surface-1 pt-20 pb-2 p-2 border'>
            <div className='flex items-center gap-4'>
              {addon.icon && <img src={addon.icon} alt={'Icon for ' + addon.name} className='w-20' />}
              <div className='flex flex-col'>
                <span className='font-minecraft text-4xl'>{addon.name}</span>
                <span className='opacity-80 font-minecraft'>{addon.description}</span>
              </div>
              <div className='gap-2 flex-col flex mt-2 font-minecraft ml-auto'>
                {addon.sources.includes('Modrinth') && (
                  <button
                    className='bg-green-400 px-5 hover:bg-accent transition-all text-black'
                    onClick={() => window.open(`https://modrinth.com/mod/${addon.slug}`)}
                  >
                    Modrinth
                  </button>
                )}
                {addon.sources.includes('CurseForge') && (
                  <button
                    className='bg-orange-500 px-5 hover:bg-accent transition-all text-black'
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
        <div className='flex gap-4 mt-10 flex-col lg:flex-row'>
          <div className='mr-auto w-full'>
            {addon && (
              <div className='w-full'>
                <ExpandedAddonDescription description={addon.body || ''} />
              </div>
            )}
          </div>
          <div className=''>
            {addon && (
              <div className='ml-auto'>
                <ExpandedAddonCompatibilityAndVersions versions={addon.minecraft_versions} authors={addon.authors}/>
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
                  <ExpandedAddonCompatibilityAndVersions versions={addon.minecraft_versions} authors={addon.authors}/>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
