import { Outlet } from 'react-router';

import RotatingCogwheel from '@/components/common/Cogwheel';
import AppFooter from '@/components/layout/AppFooter';
import AppHeader from '@/components/layout/AppHeader';

import { useThemeStore } from '@/api/stores/themeStore';

const BaseLayout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={`bg-background text-foreground min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}
    >
      <AppHeader />
      <main id='main' className='flex h-screen flex-col justify-between overflow-y-auto pt-16'>
        <div
          className={`flex-1 ${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}
        >
          <Outlet />
        </div>
        <AppFooter />
      </main>

      <RotatingCogwheel />
    </div>
  );
};

export default BaseLayout;
