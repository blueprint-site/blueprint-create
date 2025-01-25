import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import NavItem from "@/components/Layout/Navigation/NavItem";
import UserMenu from "@/components/Layout/Navigation/UserMenu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import LazyImage from "@/components/utility/LazyImage";
import supabase from "@/components/utility/Supabase";
import ThemeToggle from "@/components/utility/ThemeToggle";

import BlueprintLogo from "@/assets/logo.webp";
import Blog from "@/assets/sprite-icons/clipboard_and_quill.png";
import AboutIcon from "@/assets/sprite-icons/crafting_blueprint.png";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import { Button } from "@/components/ui/button";

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

const NavigationBar = ({ className = "" }: NavigationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getUserData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserData(user as UserData | null);
  };

  const baseNavigationItems = [
    {
      href: "/addons",
      icon: AddonIcon,
      label: t("navigation.label.addons"),
      external: false,
    },
    {
      href: "/schematics",
      icon: SchematicIcon,
      label: t("navigation.label.schematics"),
      external: false,
    },
    {
      href: "https://blueprint-site.github.io/blueprint-blog/",
      icon: Blog,
      label: t("navigation.label.blog"),
      external: true,
    },
    {
      href: "/about",
      icon: AboutIcon,
      label: t("navigation.label.about"),
      external: false,
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

    return <UserMenu user={userData.user_metadata} />;
  };

  return (
    <nav className={`fixed h-16 bg-background shadow-md w-full z-50 ${className}`}>
      <div className="md:container mx-auto h-full px-4 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center text-foreground hover:bg-foreground/10 transition-colors duration-200"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <LazyImage
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
                    className="bg-transparent hover:bg-secondary"
                  >
                    <Menu className="w-6 h-6" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-screen sm:w-80">
                    <div className="flex flex-col p-2 bg-background">
                      {baseNavigationItems.map((item, index) => (
                        <NavItem
                          key={index}
                          href={item.href}
                          icon={item.icon}
                          label={item.label}
                          external={item.external}
                        />
                      ))}
                      <div className="mt-2 px-2">{renderUserSection()}</div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {baseNavigationItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                label={item.label}
                external={item.external}
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
