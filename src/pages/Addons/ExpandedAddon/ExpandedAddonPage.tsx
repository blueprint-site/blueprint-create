import { useParams } from 'react-router-dom';
import { useFetchAddonBySlug } from '@/utils/useAddons';
import { ExpandedAddonDescription } from './ExpandedAddonDescription';

export default function ExpandedAddonPage() {
  const slug = useParams().slug?.toString();
  const addon = useFetchAddonBySlug(slug)?.data;
  return (
    <div className='py-2 px-5 lg:px-20 xl:px-30 2xl:px-40'>
      <div className=''>
        {addon && (
          <div className=''>
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
      {/* bottom container */}
      <div className="flex ">
        <div className="">
          {addon && (
            <div className="bg-blueprint/50 dark:bg-blueprint">
              <ExpandedAddonDescription description={addon.body || ''} />
            </div>
          )}
        </div>
        <div className=""></div>
      </div>
    </div>
  );
}
