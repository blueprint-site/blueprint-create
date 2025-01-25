import { Outlet } from "react-router-dom";

import NavBar from "@/components/Layout/Navigation/Navigaton";

import { useThemeStore } from "@/stores/themeStore";

const Layout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
        <NavBar />
        <main className="flex-1 w-full pt-[64px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;