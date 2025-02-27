import ThemeToggle from '@/components/utility/ThemeToggle';

import BlueprintLogo from '@/assets/logo.webp';
import Blog from '@/assets/sprite-icons/clipboard_and_quill.png';
import AboutIcon from '@/assets/sprite-icons/crafting_blueprint.png';
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.png';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const navigationItems = [
    {
      href: '/addons',
      icon: AddonIcon,
      label: 'Addons',
    },
    {
      href: '/schematics',
      icon: SchematicIcon,
      label: 'Schematics',
    },
    {
      href: '/blog',
      icon: Blog,
      label: 'Blog',
    },
    {
      href: '/about',
      icon: AboutIcon,
      label: 'About',
    },
  ];

  return (
    <nav className={`bg-background fixed z-30 h-16 w-full shadow-md ${className}`}>
      <div className='mx-auto flex h-full items-center justify-between px-4 md:container'>
        <div className='text-foreground flex h-8 items-center sm:h-10'>
          <img loading='lazy' src={BlueprintLogo} alt='Logo' className='h-full object-contain' />
          <span className='font-minecraft ml-3 hidden text-2xl font-medium sm:block'>
            Blueprint
          </span>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='hidden items-center space-x-4 md:flex'>
            {navigationItems.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='font-minecraft flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-all duration-300'>
                      <img
                        src={item.icon}
                        alt=''
                        className='h-8 w-8 rounded-full object-cover shadow-xs transition-all duration-300'
                      />
                      {item.label}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Coming soon!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
