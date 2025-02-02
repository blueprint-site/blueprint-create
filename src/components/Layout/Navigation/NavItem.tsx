import { NavLink } from "react-router-dom";
import {cn} from "@/lib/utils.ts";


interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
  isActive?: boolean;
}

const NavItem = ({ href, icon, label, external, isActive }: NavItemProps) => {

  const content = (
      <NavLink
          to={href}
          className={cn(
              "font-minecraft flex items-center justify-center transition-all duration-300 transform  cursor-pointer rounded-md px-4 py-2",
              isActive
                  ? "bg-blue-600 bg-opacity-10 font-bold "
                  : "text-gray-500 hover:bg-gray-700 hover:text-white hover:shadow-md"
          )}
      >
        <img
            src={icon}
            alt={label}
            className="w-8 h-8 object-cover rounded-full shadow-sm transition-all duration-300"
        />
        <div className="ml-3 font-minecraft decoration-from-font"> {label}</div>
      </NavLink>
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
