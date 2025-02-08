import { Menu } from "lucide-react";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NavItem from "@/components/layout/NavItem.tsx";
import UserMenu from "@/components/layout/UserMenu.tsx";

import { Button } from "@/components/ui/button.tsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.tsx";

import ThemeToggle from "@/components/utility/ThemeToggle.tsx";

import BlueprintLogo from "@/assets/logo.webp";
import Blog from "@/assets/sprite-icons/clipboard_and_quill.png";
import AboutIcon from "@/assets/sprite-icons/crafting_blueprint.png";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import { useIsMobile } from "@/hooks/useBreakpoints.tsx";
import {useLoggedUser} from "@/context/users/logedUserContext.tsx";


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
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LoggedUserInfo = useLoggedUser();
  useEffect(() => {
    setUserData(LoggedUserInfo.user);
  }, [LoggedUserInfo.user]);


  // Fonction pour déterminer l'état actif des éléments de navigation
  const useActiveNavItems = (navigationItems: Array<{ href: string; icon: string; label: string; external: boolean }>) => {
    const location = useLocation();

    // Fonction qui retourne l'état d'activation des items
    const getActiveNavItem = (href: string) => {
      return location.pathname === href;
    };

    // Ajouter l'état d'activation à chaque item de navigation
    const activeNavigationItems = navigationItems.map((item) => ({
      ...item,
      active: getActiveNavItem(item.href),
    }));

    return activeNavigationItems;
  };

  const baseNavigationItems = [
    {
      href: "/addons",
      icon: AddonIcon,
      label: t("navigation.label.addons"),
      external: false,
      active: false,
    },
    {
      href: "/schematics",
      icon: SchematicIcon,
      label: t("navigation.label.schematics"),
      external: false,
      active: false,
    },
    {
      href: "/blog",
      icon: Blog,
      label: t("navigation.label.blog"),
      external: false,
      active: false,
    },
    {
      href: "/about",
      icon: AboutIcon,
      label: t("navigation.label.about"),
      external: false,
      active: false,
    },
  ];

  const activeNavigationItems = useActiveNavItems(baseNavigationItems); // Récupérer les éléments actifs

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

    return (

        <UserMenu user={userData.user_metadata} />

    );
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
                          className="bg-background hover:bg-background:/10 "
                      >
                        <Menu className="w-6 h-6" />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-screen sm:w-80 left-10">

                        {activeNavigationItems.map((item, index) => (

                            <NavItem
                                key={index}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                external={item.external}
                                isActive={item.active} // Passer l'état actif à NavItem
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
                {activeNavigationItems.map((item, index) => (
                    <NavItem
                        key={index}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        external={item.external}
                        isActive={item.active} // Passer l'état actif à NavItem
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
