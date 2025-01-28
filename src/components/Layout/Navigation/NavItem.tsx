import { NavLink } from 'react-router-dom';

import LazyImage from '@/components/utility/LazyImage';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
}

const NavItem = ({ href, icon, label, external }: NavItemProps) => {
  const content = (
    <>
      <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
        <LazyImage 
          src={icon} 
          alt={label} 
          width={32}
          height={32}
          pixelated
        />
      </div>
      <span className="ml-2">{label}</span>
    </>
  );

  const className = "flex items-center px-2 lg:px-4 text-sm lg:text-base py-2 text-foreground hover:bg-foreground/10 hover:text-foreground transition-colors duration-200";

  return external ? (
    <a 
      href={href} 
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <NavLink 
      to={href}
      className={className}
    >
      {content}
    </NavLink>
  );
};

export default NavItem;