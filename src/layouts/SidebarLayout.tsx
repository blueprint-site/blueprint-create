import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/Navigaton";

import { useThemeStore } from "@/stores/themeStore";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <NavBar />
        <div className="flex flex-col ">
          <main className="flex-1 w-full pt-[64px]">
            <Outlet />
          </main>
          <Footer />
        </div>
        <RotatingCogwheel />
      </div>
    </div>
  );
};

export default Layout;
