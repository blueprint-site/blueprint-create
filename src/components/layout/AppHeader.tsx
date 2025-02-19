import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import NavItem from "@/components/layout/NavItem";
import HeaderNavMenu from "@/components/layout/HeaderNavMenu";

import BlueprintLogo from "@/assets/logo.webp";
import Blog from "@/assets/sprite-icons/clipboard_and_quill.png";
import AboutIcon from "@/assets/sprite-icons/crafting_blueprint.png";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { t } = useTranslation();

  const navigationItems = [
    {
      href: "/addons",
      icon: AddonIcon,
      label: t("navigation.label.addons"),
    },
    {
      href: "/schematics",
      icon: SchematicIcon,
      label: t("navigation.label.schematics"),
    },
    {
      href: "/blog",
      icon: Blog,
      label: t("navigation.label.blog"),
    },
    {
      href: "/about",
      icon: AboutIcon,
      label: t("navigation.label.about"),
    },
  ];

  return (
    <nav
      className={`fixed h-16 bg-background shadow-md w-full z-30 ${className}`}
    >
      <div className="md:container mx-auto h-full px-4 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex text-foreground items-center h-8 sm:h-10"
        >
          <img
            loading="lazy"
            src={BlueprintLogo}
            alt="Logo"
            className="h-full object-contain"
          />
          <span className="font-minecraft text-2xl font-medium ml-3 hidden sm:block">
            Blueprint
          </span>
        </NavLink>

        <div className="flex items-center space-x-4">
          <div className="items-center space-x-4 hidden md:flex">
            {navigationItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
          <HeaderNavMenu />
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
