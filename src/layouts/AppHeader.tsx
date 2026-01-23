import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import Logo from '@/assets/logo.webp';
import { NavLink } from 'react-router-dom';
// TODO: Implement about page
const navigationItems = [
  {
    href: '/addons',
    icon: AddonIcon,
    label: 'Addons',
  },
  // {
  //   href: '/about',
  //   icon: AboutIcon,
  //   label: 'About',
  // },
];

export default function AppHeader() {
  return (
    <nav className='font-minecraft font-bold bg-header text-foreground text-lg w-full flex items-center px-4 h-12 shadow-md dark:shadow-white/10 dark:shadow-md'>
      <NavLink to='/' className='flex items-center mr-8 hover:bg-accent transition-colors'>
        <img src={Logo} alt='Blueprint logo' className='w-8 h-8 mr-2' />
        <span>Blueprint</span>
        <span className='opacity-50 ml-1'>vRe</span>
      </NavLink>
      <div className='flex items-center gap-5 ml-auto'>
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className='flex items-center hover:bg-accent transition-colors'
          >
            <img src={item.icon} alt={`${item.label} icon`} className='w-8 h-8 mr-2' />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <NavLink to='/auth' className='flex items-center ml-5 hover:bg-accent transition-colors'>
        <span>Account</span>
      </NavLink>
    </nav>
  );
}
