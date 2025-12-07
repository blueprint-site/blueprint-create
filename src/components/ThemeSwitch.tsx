import { useTheme } from "./theme-provider";
import DarkIcon from "@/assets/sprite-icons/Lit_Empty_Blaze_Burner_(Soul).webp";
import LightIcon from "@/assets/sprite-icons/Lit_Empty_Blaze_Burner.webp";
export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <div className="fixed bottom-2 z-10 right-2 bg-blueprint w-20 h-20 rounded">
            <button onClick={toggleTheme} className="relative w-20 h-20">
                <img 
                    src={LightIcon} 
                    alt="Light theme icon" 
                    className={`absolute inset-0 w-20 h-20 transition-opacity duration-300 ease-in-out ${
                        theme === "light" ? "opacity-100" : "opacity-0"
                    }`}
                />
                <img 
                    src={DarkIcon} 
                    alt="Dark theme icon" 
                    className={`absolute inset-0 w-20 h-20 transition-opacity duration-300 ease-in-out ${
                        theme === "dark" ? "opacity-100" : "opacity-0"
                    }`}
                />
            </button>
        </div>
    )
}