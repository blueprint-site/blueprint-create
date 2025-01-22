import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";
import NightVisionIcon from '/src/assets/night_vision.png';

interface ThemeToggleProps {
  onClick?: () => void;
}

const ThemeToggle = ({ onClick }: ThemeToggleProps) => {
  const { toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      className="rounded-full p-2 hover:bg-secondary transition-colors duration-200 shadow-lg flex items-center gap-2"
      aria-label="Change theme"
    >
      <img 
        src={NightVisionIcon}
        alt=""
        className="w-6 h-6 object-contain"
      />
      Change theme
    </Button>
  );
};

export default ThemeToggle;