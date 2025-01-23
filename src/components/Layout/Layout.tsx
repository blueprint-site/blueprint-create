import Footer from "@/components/Layout/Footer";
import Navigation from "@/components/Layout/Navigation/Navigaton";
import { useThemeStore } from "@/stores/themeStore";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
        <Navigation />
        <main className="flex-1 w-full pt-[64px]">
          <Outlet />
        </main>
        {location.pathname !== "/schematics/3dviewer" && 
          <Footer />
        }
      </div>
    </div>
  );
};

export default Layout;