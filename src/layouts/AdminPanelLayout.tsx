import { Outlet } from "react-router-dom";
import NavBar from "@/components/layout/AppHeader";
import { useThemeStore } from "@/stores/themeStore";

const Layout = () => {
    const { isDarkMode } = useThemeStore();

    return (
        <div className={`h-screen w-full flex flex-col bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
            <NavBar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 pt-[64px] flex flex-col w-full  px-4">
                    <Outlet />
                </div>
            </main>
            <div className="text-center">
                Blueprint Admin Panel made with 🫀
            </div>
        </div>
    );
};

export default Layout;
