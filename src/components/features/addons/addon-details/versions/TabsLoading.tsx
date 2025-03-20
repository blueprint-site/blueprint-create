// src/components/features/addons/addon-details/components/versions/TabsLoading.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const TabsLoading: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-4'>
          <div>
            <h4 className='mb-2 text-sm font-medium'>Minecraft Versions</h4>
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-6 w-16 rounded-full' />
              ))}
            </div>
          </div>

          <div>
            <h4 className='mb-2 text-sm font-medium'>Mod Loaders</h4>
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-6 w-20 rounded-full' />
              ))}
            </div>
          </div>

          <div>
            <h4 className='mb-2 text-sm font-medium'>Create Versions</h4>
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className='h-6 w-16 rounded-full' />
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <div className='space-y-4 p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-16 rounded-full' />
              </div>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-40' />
              <div className='mt-4 flex flex-wrap gap-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-5 w-14 rounded-full' />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
