import { Outlet } from "react-router-dom";

import RotatingCogwheel from "@/components/common/Cogwheel.tsx";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/Navigaton.tsx";

import { useThemeStore } from "@/stores/themeStore";

import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <SidebarProvider defaultOpen={true}>
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
    </SidebarProvider>
  );
};

export default Layout;
