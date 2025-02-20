import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel";
import AppFooter from "@/components/layout/AppFooter";
import NavBar from "@/components/layout/AppHeader";

import { useThemeStore } from "@/stores/themeStore";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen w-full bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      <NavBar />

      <main className="w-full pt-[64px]">
        <div className={`${isDarkMode ? 'bg-shadow_steel_casing' : 'bg-refined_radiance_casing'}`}>
          <Outlet />

        </div>
      </main>

      <AppFooter />
      <RotatingCogwheel />
    </div>
  );
};

export default Layout;
