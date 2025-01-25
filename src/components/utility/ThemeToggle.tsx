import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";
import NightVisionIcon from '/src/assets/sprite-icons/night_vision.png';

interface ThemeToggleProps {
  onClick?: () => void;
  variant?: 'outline' | 'ghost' | 'icon';
}

const ThemeToggle = ({ onClick, variant = 'outline' }: ThemeToggleProps) => {
  const { toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className='rounded-full flex items-center p-2'
      aria-label="Change theme"
    >
      <img 
        src={NightVisionIcon}
        alt=""
        className="w-6 h-6 object-contain"
      />
      {variant !== 'icon' && "Change theme"}
    </Button>
  );
};

export default ThemeToggle;