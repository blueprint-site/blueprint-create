import LazyImage from "@/components/utility/LazyImage";
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
}

const NavItem = ({ href, icon, label, external }: NavItemProps) => {
  const content = (
    <>
      <div className="w-8 h-8 flex items-center justify-center transition-transform duration-500 hover:scale-105">
        <LazyImage 
          src={icon} 
          alt={label} 
          width={32}
          height={32}
          pixelated
          className="max-h-8 w-auto object-contain transform scale-100" 
        />
      </div>
      <span className="ml-2">{label}</span>
    </>
  );

  const className = "flex items-center px-2 md:px-4 py-2 text-foreground hover:bg-foreground/10 hover:text-foreground transition-colors duration-200";

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