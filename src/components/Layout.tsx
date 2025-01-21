// Layout.tsx
import { useThemeStore } from "@/stores/themeStore";
import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "./BottomBar";
import Navigation from "./Navigation/Navigaton";
import SchemeToggle from "./SchemeToggle";

function Layout() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
        <Navigation />
        
        <main className="flex-1 w-full pt-[60px]">
          <Outlet />
        </main>

        {location.pathname !== "/schematics/3dviewer" && <BottomBar />}
        
        <SchemeToggle onClick={toggleTheme} />
      </div>
    </div>
  );
}

export default Layout;