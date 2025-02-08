import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/Navigaton";

import { useThemeStore } from "@/stores/themeStore";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen w-full bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      <NavBar />

      <main className="w-full pt-[64px]">
        <Outlet />
      </main>
      
      <Footer />
      <RotatingCogwheel />
    </div>
  );
};

export default Layout;
