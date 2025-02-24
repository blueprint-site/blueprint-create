import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';

export function AddonListSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-start gap-3 p-3 pb-0'>
                <Skeleton className='h-12 w-12 shrink-0 rounded-lg' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-3 w-5/6' />
                </div>
              </CardHeader>
              <CardContent className='p-3'>
                <div className='space-y-3'>
                  <div className='flex gap-2'>
                    <Skeleton className='h-6 w-16 rounded-full' />
                    <Skeleton className='h-6 w-16 rounded-full' />
                  </div>
                  <div className='flex gap-1.5'>
                    <Skeleton className='h-5 w-14' />
                    <Skeleton className='h-5 w-14' />
                    <Skeleton className='h-5 w-14' />
                  </div>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
