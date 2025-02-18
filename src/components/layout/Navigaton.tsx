import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import NavItem from "@/components/layout/NavItem";
import UserMenu from "@/components/layout/UserMenu";
import ThemeToggle from "@/components/utility/ThemeToggle";

import BlueprintLogo from "@/assets/logo.webp";
import Blog from "@/assets/sprite-icons/clipboard_and_quill.png";
import AboutIcon from "@/assets/sprite-icons/crafting_blueprint.png";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import { useLoggedUser } from "@/context/users/logedUserContext";

interface NavigationProps {
  className?: string;
}

interface UserData {
  id: string;
  email?: string;
  user_metadata: {
    avatar_url?: string;
    custom_claims?: {
      global_name?: string;
    };
  };
}

const NavigationBar = ({ className }: NavigationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  const LoggedUserInfo = useLoggedUser();
  useEffect(() => {
    setUserData(LoggedUserInfo.user);
  }, [LoggedUserInfo.user]);

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

        <div className="items-center space-x-4 hidden md:flex">
          {navigationItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
          <UserMenu user={userData?.user_metadata} />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
