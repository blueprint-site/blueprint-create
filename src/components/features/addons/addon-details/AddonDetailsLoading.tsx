import { Skeleton } from '@/components/ui/skeleton.tsx';

export const AddonDetailsLoading = () => {
  return (
    <div className='container mx-auto space-y-6 px-4 py-8'>
      <div className='flex gap-4'>
        <Skeleton className='h-16 w-16 rounded-lg' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </div>
      <Skeleton className='h-96 w-full' />
      <Skeleton className='h-48 w-full' />
    </div>
  );
};
