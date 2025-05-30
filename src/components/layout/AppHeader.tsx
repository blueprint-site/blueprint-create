// src/components/layout/AppHeader.tsx
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import NavItem from '@/components/layout/NavItem';
import HeaderNavMenu from '@/components/layout/HeaderNavMenu';
import { useLogo } from '@/hooks';

import Blog from '@/assets/sprite-icons/clipboard_and_quill.png';
import AboutIcon from '@/assets/sprite-icons/crafting_blueprint.png';
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';

interface AppHeaderProps {
  className?: string;
  fullWidth?: boolean;
}

const AppHeader = ({ className, fullWidth }: AppHeaderProps) => {
  const { t } = useTranslation();
  // Use non-clickable logo (default behavior)
  const { logoSrc } = useLogo();

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

  return (
    <nav className={`bg-background fixed z-30 h-16 w-full shadow-md ${className}`}>
      <div
        className={`flex h-full items-center justify-between px-4 ${fullWidth ? '' : 'lg:container lg:mx-auto'}`}
      >
        <NavLink to='/' className='text-foreground flex h-8 items-center sm:h-10'>
          <img
            loading='lazy'
            src={logoSrc}
            alt='Blueprint Logo'
            className='h-full object-contain'
          />
          <span className='font-minecraft ml-3 hidden text-2xl font-bold sm:block'>Blueprint</span>
        </NavLink>

        <div className='flex items-center space-x-4'>
          <div className='hidden items-center space-x-4 md:flex'>
            {navigationItems.map((item, index) => (
              <NavItem key={index} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </div>
          <HeaderNavMenu />
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
