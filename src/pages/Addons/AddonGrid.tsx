import { Addon } from '@/types/addons';
import { z } from 'zod';
import AddonCard from './AddonCard';
import { Input } from '@/components/ui/input';

type AddonType = z.infer<typeof Addon>;

export default function AddonGrid({ data }: { data: AddonType[] }) {
  return (
    <div className=''>
      
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
        {data.map((addon) => (
          <AddonCard key={addon.$id} addon={addon} />
        ))}
      </div>
      
    </div>
  );
}
