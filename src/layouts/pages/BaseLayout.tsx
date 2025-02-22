import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel.tsx";
import AppFooter from "@/layouts/components/AppFooter.tsx";
import NavBar from "@/layouts/components/AppHeader.tsx";

import { useThemeStore } from "@/api/stores/themeStore.tsx";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen  w-full bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      <NavBar />

        <main className="w-full pt-[64px] h-screen overflow-hidden">
            <div
                className={`${
                    isDarkMode ? "bg-shadow_steel_casing" : "bg-refined_radiance_casing"
                } h-full w-full overflow-y-auto scrollable-container`}
            >
                <Outlet />
                <AppFooter />
            </div>

        </main>
      <RotatingCogwheel />
    </div>
  );
};

export default Layout;
