import { NavLink } from 'react-router';
import { cn } from '@/config/utils.ts';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'font-minecraft flex items-center justify-center rounded-md p-2 transition-all duration-300 lg:px-4',
          'hover:bg-foreground/10 hover:text-foreground hover:shadow-md',
          isActive ? 'bg-primary/10 text-foreground font-bold' : 'text-foreground-muted'
        )
      }
    >
      <img
        src={icon}
        alt=''
        className='h-8 w-8 rounded-full object-cover shadow-xs transition-all duration-300'
      />
      <span className='font-minecraft ml-3'>{label}</span>
    </NavLink>
  );
};

export default NavItem;
