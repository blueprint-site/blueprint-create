import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/api/stores/themeStore';
import NightVisionIcon from '/src/assets/sprite-icons/night_vision.png';

interface ThemeToggleProps {
  onClick?: () => void;
  variant?:
    | 'outline'
    | 'ghost'
    | 'icon'
    | 'default'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ThemeToggle = ({
  onClick,
  variant = 'outline',
  size = 'default',
  className = '',
}: ThemeToggleProps) => {
  const { toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex cursor-pointer items-center rounded-full p-2 ${className}`}
      aria-label='Change theme'
    >
      <img src={NightVisionIcon} alt='' className='h-6 w-6 object-contain' />
      {variant !== 'icon' && 'Change theme'}
    </Button>
  );
};

export default ThemeToggle;
