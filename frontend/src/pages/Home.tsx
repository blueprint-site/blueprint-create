// src/pages/home/home.tsx

import { Skeleton } from '@/components/ui/skeleton'; // Assuming Shadcn Skeleton component is available
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const AddonsSlideshow = lazy(() => import('@/components/features/home/AddonsSlideshow'));
const AddonsSlideshowMobile = lazy(
  () => import('@/components/features/home/AddonsSlideshowMobile')
);
const WhatIsBlueprint = lazy(() => import('@/components/features/home/WhatIsBlueprint'));
const UsefulLinks = lazy(() => import('@/components/features/home/UsefulLinks'));
const ForCreators = lazy(() => import('@/components/features/home/ForCreators'));

function Home() {
  const { t } = useTranslation();

  return (
    <div className='font-minecraft flex flex-col md:container'>
      <Suspense fallback={<HomeSkeleton />}>
        {/* Mobile version */}
        <section className='p-0 md:hidden'>
          <AddonsSlideshowMobile />
        </section>

        {/* Desktop version */}
        <section className='hidden py-12 md:block'>
          <div className='mx-auto'>
            <div className='text-foreground text-center text-4xl font-bold drop-shadow-lg'>
              {t('home.discover')}
            </div>
            <div className='my-5'>
              <AddonsSlideshow />
            </div>
          </div>
        </section>

        <WhatIsBlueprint />

        <section className='py-12'>
          <div className='mx-auto px-4'>
            <div className='grid gap-8 md:grid-cols-2'>
              <ForCreators />
              <UsefulLinks />
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
}

// Skeleton component for the loading state
function HomeSkeleton() {
  return (
    <div className='flex flex-col space-y-12'>
      {/* Skeleton for the Discover section */}
      <section className='py-12'>
        <div className='container mx-auto'>
          <Skeleton className='mx-auto h-10 w-1/2 bg-gray-300' />
          <div className='my-5'>
            <Skeleton className='h-64 w-full bg-gray-300' />
          </div>
        </div>
      </section>

      {/* Skeleton for the WhatIsBlueprint section */}
      <section className='bg-blueprint py-12'>
        <div className='container mx-auto'>
          <Skeleton className='h-96 w-full bg-gray-300' />
        </div>
      </section>

      {/* Skeleton for the ForCreators and UsefulLinks section */}
      <section className='bg-background py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-8 md:grid-cols-2'>
            <Skeleton className='h-96 w-full bg-gray-300' />
            <Skeleton className='h-96 w-full bg-gray-300' />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
