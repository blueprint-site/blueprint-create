import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel";
import AppFooter from "@/components/layout/AppFooter";
import NavBar from "@/components/layout/AppHeader";

import { useThemeStore } from "@/stores/themeStore";

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
