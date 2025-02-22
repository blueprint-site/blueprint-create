import { NavLink } from "react-router-dom";
import { cn } from "@/config/utils.ts";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => cn(
        "font-minecraft flex items-center justify-center transition-all duration-300 px-4 py-2 rounded-md",
        "hover:bg-foreground/10 hover:text-foreground hover:shadow-md",
        isActive
          ? "bg-primary/10 font-bold text-foreground"
          : "text-foreground-muted"
      )}
    >
      <img
        src={icon}
        alt=""
        className="w-8 h-8 object-cover rounded-full shadow-xs transition-all duration-300"
      />
      <span className="ml-3 font-minecraft">
        {label}
      </span>
    </NavLink>
  );
};

export default NavItem;