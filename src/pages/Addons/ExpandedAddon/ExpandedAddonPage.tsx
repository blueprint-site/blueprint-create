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
        {addon && (
          <div className='bg-red-500 pt-20 pb-2 p-2s'>
            <div className='flex items-center gap-4'>
              <img src={addon.icon} alt={'Icon for ' + addon.name} className='w-20' />
              <div className='flex flex-col'>
                <span className='font-minecraft text-4xl'>{addon.name}</span>
                <span>{addon.description}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className='hidden lg:block'>
        <div className='flex gap-4 mt-10 flex-col lg:flex-row'>
          <div className=''>
            {addon && (
              <div className=' w-full'>
                <ExpandedAddonDescription description={addon.body || ''} />
              </div>
            )}
          </div>
          <div className=''>
            {addon && (
              <div className=''>
                <ExpandedAddonCompatibilityAndVersions versions={addon.minecraft_versions} />
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
              <TabsTrigger value='compatibility'>Compatibility</TabsTrigger>
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
                  <ExpandedAddonCompatibilityAndVersions versions={addon.minecraft_versions} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
