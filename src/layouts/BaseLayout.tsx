import RotatingCogwheel from '@/components/common/Cogwheel.tsx';
import AppFooter from '@/components/layout/AppFooter';
import AppHeader from '@/components/layout/AppHeader';

import { useThemeStore } from '@/api/stores/themeStore.tsx';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={`bg-background text-foreground min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}
    >
      <AppHeader />
      <main className='h-screen overflow-y-auto pt-16'>
        <div className={`${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}>
        {children}
        </div>
        <AppFooter />
      </main>

      <RotatingCogwheel />
    </div>
  );
};

export default BaseLayout;
