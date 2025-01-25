import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/Cogwheel";
import Footer from "@/components/Layout/Footer";
import NavBar from "@/components/Layout/Navigation/Navigaton";

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