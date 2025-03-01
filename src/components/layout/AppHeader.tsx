import ThemeToggle from '@/components/utility/ThemeToggle';
import BlueprintLogo from '@/assets/logo.webp';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  return (
    <nav className={`bg-background fixed z-30 h-16 w-full shadow-md ${className}`}>
      <div className='mx-auto flex h-full items-center justify-between px-4 md:container'>
        <div className='text-foreground flex h-8 items-center sm:h-10'>
          <img loading='lazy' src={BlueprintLogo} alt='Logo' className='h-full object-contain' />
          <span className='font-minecraft ml-3 hidden text-2xl font-medium sm:block'>
            Blueprint
          </span>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default AppHeader;
