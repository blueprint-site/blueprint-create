import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import NavItem from '@/components/layout/NavItem';
import HeaderNavMenu from '@/components/layout/HeaderNavMenu';

import BlueprintLogo from '@/assets/logo.webp';
import OldLogo from '@/assets/legacy_logo.webp';
import Blog from '@/assets/sprite-icons/clipboard_and_quill.png';
import AboutIcon from '@/assets/sprite-icons/crafting_blueprint.png';
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { t } = useTranslation();
  const [easterEgg, setEasterEgg] = useState(localStorage.getItem("oldLogo") === "true");


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
      <div className='mx-auto flex h-full items-center justify-between px-4 lg:container'>
        <NavLink to='/' className='text-foreground flex h-8 items-center sm:h-10'>
          <img
            loading='lazy'
            src={easterEgg ? OldLogo : BlueprintLogo}
            alt={easterEgg ? 'Old Logo' : 'Blueprint Logo'}
            className='h-full object-contain'
          />
          <span className='font-minecraft ml-3 hidden text-2xl font-medium sm:block'>
            Blueprint
          </span>
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

