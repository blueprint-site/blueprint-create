import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';

import LazyImage from "@/components/LazyImage";
import supabase from "@/components/Supabase";
import ThemeToggle from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import Blog from "@/assets/blueprint-blog.png";
import AboutIcon from '@/assets/clipboard.webp';
import Goggles from '@/assets/goggles.webp';
import BlueprintLogo from '@/assets/logo.webp';
import AddonIcon from '@/assets/minecart_coupling.webp';
import SchematicIcon from '@/assets/schematic.webp';

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

const NavigationBar = ({ className = '' }: NavigationProps) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getUserData();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserData(user as UserData | null);
  };

  const navigationItems = [
    {
      href: "/addons",
      icon: AddonIcon,
      label: t("navigation.label.addons")
    },
    {
      href: "/schematics",
      icon: SchematicIcon,
      label: t("navigation.label.schematics")
    },
    {
      href: "https://blueprint-site.github.io/blueprint-blog/",
      icon: Blog,
      label: t("navigation.label.blog"),
      external: true
    },
    {
      href: "/about",
      icon: AboutIcon,
      label: t("navigation.label.about")
    },
    {
      href: userData ? '/user' : '/login',
      icon: userData?.user_metadata?.avatar_url ?? Goggles,
      label: userData?.user_metadata?.custom_claims?.global_name ?? t("navigation.label.login")
    }
  ];

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const content = (
      <>
        <div className="w-8 h-8 flex items-center justify-center">
          <LazyImage 
            src={item.icon} 
            alt={item.label} 
            className="max-h-8 w-auto object-contain transform scale-100 transition-transform duration-500 hover:scale-105" 
          />
        </div>
        <span className="ml-2">{item.label}</span>
      </>
    );

    return item.external ? (
      <a 
        href={item.href} 
        className="flex items-center px-2 md:px-4 py-2 text-foreground hover:bg-secondary transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      <NavLink 
        to={item.href}
        className="flex items-center px-2 md:px-4 py-2 text-foreground hover:bg-secondary transition-colors duration-200"
      >
        {content}
      </NavLink>
    );
  };

  return (
    <nav className={`fixed h-16 bg-background shadow-md w-full z-50 ${className}`}>
      <div className="md:container mx-auto h-full px-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center text-foreground hover:bg-secondary transition-colors duration-200">
          <div className="w-10 h-10 flex items-center justify-center">
            <LazyImage src={BlueprintLogo} alt="Logo" className="max-h-10 w-auto object-contain" />
          </div>
          <span className="font-minecraft text-xl font-medium ml-2">Blueprint</span>
        </NavLink>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggle icon={true} />
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
                      {navigationItems.map((item, index) => (
                        <NavItem key={index} item={item} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
            <ThemeToggle icon={true} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;