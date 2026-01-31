import { useTheme } from './theme-provider';
import DarkIcon from '@/assets/sprite-icons/Lit_Empty_Blaze_Burner_Soul_100x100.webp';
import LightIcon from '@/assets/sprite-icons/Lit_Empty_Blaze_Burner_100x100.webp';
import SystemIcon from '@/assets/sprite-icons/blazeburner_system.webp';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  function setTheTheme(theme: string) {
    setTheme(theme as 'light' | 'dark' | 'system');
  }
  return (
    // <div className='fixed bottom-2 z-10 right-2 bg-surface-4 w-20 h-20 rounded'>
    //   <button onClick={toggleTheme} className='relative w-20 h-20'>
    //     <img
    //       src={LightIcon}
    //       alt='Light theme icon'
    //       className={`absolute inset-0 w-20 h-20 transition-opacity duration-300 ease-in-out ${
    //         theme === 'light' ? 'opacity-100' : 'opacity-0'
    //       }`}
    //     />
    //     <img
    //       src={DarkIcon}
    //       alt='Dark theme icon'
    //       className={`absolute inset-0 w-20 h-20 transition-opacity duration-300 ease-in-out ${
    //         theme === 'dark' ? 'opacity-100' : 'opacity-0'
    //       }`}
    //     />
    //   </button>
    // </div>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        asChild
        className='fixed bottom-2 z-10 right-2 bg-surface-4 w-20 h-20 rounded'
      >
        <button >
          {theme === 'dark' ? (
            <img src={DarkIcon} alt='Dark mode icon' />
          ) : theme === 'light' ? (
            <img src={LightIcon} alt='Light mode icon' />
          ) : (
            <img src={SystemIcon} alt='System mode icon' />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='left' sideOffset={10}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='opacity-50'>Select Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheTheme}>
            <DropdownMenuRadioItem value='light'>Light<img src={LightIcon} alt="Light mode icon" width={20} /></DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='dark'>Dark<img src={DarkIcon} alt="Dark mode icon" width={20} /></DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='system'>System<img src={SystemIcon} alt="System mode icon" width={20} /></DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
