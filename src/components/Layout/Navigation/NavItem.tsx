import { NavLink } from "react-router-dom";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
}

const NavItem = ({ href, icon, label, external }: NavItemProps) => {
  const content = (
    <div className="flex items-center justify-center transition-transform duration-100 hover:scale-105">
      <img
        src={icon}
        alt={label}
        className="w-8 h-8 pixelated object-cover"
      />
      <span className="ml-2">{label}</span>
    </div>
  );

  const className =
    "flex items-center px-2 md:px-4 py-2 text-foreground hover:bg-foreground/10 hover:text-foreground transition-colors duration-200";

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
    <NavLink to={href} className={className}>
      {content}
    </NavLink>
  );
};

export default NavItem;
