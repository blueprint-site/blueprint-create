import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import NavItem from "@/components/layout/NavItem";
import UserMenu from "@/components/layout/UserMenu";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import ThemeToggle from "@/components/utility/ThemeToggle";

import BlueprintLogo from "@/assets/logo.webp";
import Blog from "@/assets/sprite-icons/clipboard_and_quill.png";
import AboutIcon from "@/assets/sprite-icons/crafting_blueprint.png";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import { useIsMobile } from "@/api";
import { useLoggedUser } from "@/context/users/logedUserContext";
import {User} from "@/types";

interface NavigationProps {
  className?: string;
}




const NavigationBar = ({ className }: NavigationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LoggedUserInfo = useLoggedUser();
  useEffect(() => {
    if(LoggedUserInfo.user != null) {
      setUserData(LoggedUserInfo.user);
    }

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

  const renderUserSection = () => {
    if (!userData) {
      return (
        <>
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className="flex items-center text-md gap-2"
          >
            <span>{t("navigation.label.login")}</span>
          </Button>
          <ThemeToggle variant="icon" />
        </>
      );
    }

    return <UserMenu  />;
  };

  return (
    <nav className={`fixed h-16 bg-background shadow-md w-full z-30 ${className}`}>
      <div className="md:container mx-auto h-full px-4 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center text-foreground hover:text-foreground transition-colors duration-200"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              loading="lazy"
              src={BlueprintLogo}
              alt="Logo"
              className="max-h-10 w-auto object-contain"
            />
          </div>
          <span className="font-minecraft text-xl font-medium ml-2">
            Blueprint
          </span>
        </NavLink>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggle variant="icon" />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-background hover:bg-foreground/10"
                  >
                    <Menu className="w-6 h-6" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-screen sm:w-80 left-10">
                    {navigationItems.map((item, index) => (
                      <NavItem
                        key={index}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                      />
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="mt-2 px-2">{renderUserSection()}</div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {navigationItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
            {renderUserSection()}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;