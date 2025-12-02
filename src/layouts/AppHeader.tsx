import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import AboutIcon from '@/assets/sprite-icons/goggles.webp';
import Logo from '@/assets/logo.webp';
import { NavLink } from 'react-router-dom';
const navigationItems = [
  {
    href: '/addons',
    icon: AddonIcon,
    label: 'Addons',
  },
  {
    href: '/about',
    icon: AboutIcon,
    label: 'About',
  },
];

export default function AppHeader() {
  return (
    <nav className='font-minecraft font-bold bg-header text-foreground w-full flex items-center px-4 h-12 shadow-md'>
      <NavLink to='/' className='flex items-center mr-8 hover:text-accent transition-colors'>
        <img src={Logo} alt='Blueprint logo' className='w-6 h-6 mr-2' />
        <span>Blueprint</span>
      </NavLink>
      <div className='flex items-center gap-5 ml-auto'>
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className='flex items-center hover:text-accent transition-colors'
          >
            <img src={item.icon} alt={`${item.label} icon`} className='w-5 h-5 mr-2' />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
