import { LogIn, LogOut, Menu, Settings, Shield, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu.tsx';
import ThemeToggle from '@/components/utility/ThemeToggle.tsx';

import { useUserStore } from '@/api/stores/userStore';
import { account } from '@/config/appwrite.ts';

import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';
import Blog from '@/assets/sprite-icons/clipboard_and_quill.png';
import AboutIcon from '@/assets/sprite-icons/crafting_blueprint.png';
import { cn } from '@/config/utils.ts';

const UserMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);
  const isAdmin = preferences?.roles?.includes('admin');

  const navigationItems = [
    {
      href: '/addons',
      icon: AddonIcon,
      label: t('navigation.label.addons'),
    },
    {
      href: '/schematics',
      icon: SchematicIcon,
      label: t('navigation.label.schematics'),
    },
    {
      href: '/blog',
      icon: Blog,
      label: t('navigation.label.blog'),
    },
    {
      href: '/about',
      icon: AboutIcon,
      label: t('navigation.label.about'),
    },
  ];

  const handleLogout = async () => {
    await account.deleteSession('current');
    navigate('/login');
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='hover:bg-foreground/10 data-[state=open]:bg-foreground/10 h-10 cursor-pointer bg-transparent px-1 py-0'>
            <div className='flex items-center justify-center'>
              {/* Mobile Menu Icon */}
              <Menu className='block h-6 w-6 md:hidden' aria-hidden='true' />

              {/* Desktop User Avatar/Icon */}
              <div className='hidden md:block'>
                {user ? (
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={preferences?.avatar} />
                    <AvatarFallback>
                      <User className='h-6 w-6' />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className='h-6 w-6' />
                )}
              </div>
            </div>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className='bg-background flex w-48 flex-col gap-2 p-2 pb-3'>
              <div className='md:hidden'>
                {navigationItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'font-minecraft flex rounded-md p-2',
                        isActive
                          ? 'bg-primary/10 text-foreground font-bold'
                          : 'text-foreground-muted'
                      )
                    }
                  >
                    <img
                      src={item.icon}
                      alt=''
                      className='h-6 w-6 rounded-full object-cover shadow-xs transition-all duration-300'
                    />
                    <span className='font-minecraft ml-3'>{item.label}</span>
                  </NavLink>
                ))}
              </div>
              {user ? (
                <>
                  <div className='flex items-center gap-2 border-y p-2 md:border-t-0'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage src={preferences?.avatar} />
                      <AvatarFallback>
                        <User className='h-4 w-4' />
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-foreground text-sm font-medium'>{user?.name}</span>
                  </div>

                  <button
                    onClick={() => navigate('/user')}
                    className='hover:bg-surface-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm'
                  >
                    <User className='h-4 w-4' />
                    {t('user-menu.profile')}
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className='hover:bg-surface-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm'
                  >
                    <Settings className='h-4 w-4' />
                    {t('user-menu.settings')}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className='hover:bg-surface-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm'
                    >
                      <Shield className='h-4 w-4' />
                      {t('user-menu.admin')}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className='hover:bg-surface-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm'
                  >
                    <LogOut className='h-4 w-4' />
                    {t('user-menu.logout')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className='hover:bg-surface-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm'
                >
                  <LogIn className='h-4 w-4' />
                  Login
                </button>
              )}
              <ThemeToggle variant='ghost' />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UserMenu;
