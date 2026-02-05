import type { Addon } from '@/types/addons';
import type { z } from 'zod';
import AddonCard from './AddonCard';
import { Skeleton } from '@/components/ui/skeleton';
// import { Input } from '@/components/ui/input';

type AddonType = z.infer<typeof Addon>;

type AddonGridProps = {
  data: AddonType[];
  isLoading?: boolean;
};

export default function AddonGrid({ data, isLoading = false }: AddonGridProps) {
  if (isLoading) {
    return (
      <div
        className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'
        aria-busy='true'
        aria-label='Loading addons'
        role='status'
        aria-live='polite'
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={`addon-skeleton-${index}`}
            className='bg-surface-1 border text-white p-4'
          >
            <Skeleton className='w-20 h-20 mb-3 rounded-full bg-surface-2' />
            <Skeleton className='h-5 w-2/3 mb-2 bg-surface-2' />
            <Skeleton className='h-4 w-full mb-2 bg-surface-2' />
            <Skeleton className='h-4 w-5/6 mb-2 bg-surface-2' />
            <Skeleton className='h-4 w-1/2 mb-2 bg-surface-2' />
            <div className='gap-2 flex mt-2'>
              <Skeleton className='h-8 w-28 rounded-none bg-surface-2' />
              <Skeleton className='h-8 w-28 rounded-none bg-surface-2' />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
