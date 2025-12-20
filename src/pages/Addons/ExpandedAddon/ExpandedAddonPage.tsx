import { useParams } from 'react-router-dom';
import { useFetchAddonBySlug } from '@/utils/useAddons';
export default function ExpandedAddonPage() {
  const slug = useParams().slug?.toString();
  const addon = useFetchAddonBySlug(slug)?.data;
  return (
    <div className='py-2 px-10'>
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
    </div>
  );
}
