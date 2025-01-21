// src/components/Navigation/Navigation.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';

import LazyImage from "@/components/LazyImage";
import supabase from "@/components/Supabase";
import NavigationLink from "./NavigationLink";

import Blog from "@/assets/blueprint-blog.png";
import AboutIcon from '@/assets/clipboard.webp';
import Goggles from '@/assets/goggles.webp';
import BlueprintLogo from '@/assets/logo.webp';
import AddonIcon from '@/assets/minecart_coupling.webp';
import SchematicIcon from '@/assets/schematic.webp';

interface NavigationProps {
  wrap?: boolean;
  className?: string;
}

interface UserMetadata {
  avatar_url?: string;
  custom_claims?: {
    global_name?: string;
  };
}

interface User {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
  created_at: string;
}

const Navigation = ({ wrap = false, className = '' }: NavigationProps) => {
  const { t } = useTranslation();
  const [userdata, setUserdata] = useState<User | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [linkDestination, setLinkDestination] = useState<string | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setUserIcon(userdata?.user_metadata?.avatar_url ?? null);
    setUserName(userdata?.user_metadata?.custom_claims?.global_name ?? null);
    setLinkDestination(userdata ? '/user' : '/login');
  }, [userdata]);

  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserdata(user as User | null);
  };

  const navClasses = `
    fixed 
    ${wrap ? 'h-auto min-h-[60px]' : 'h-[60px]'} 
    bg-background 
    shadow-md 
    w-full 
    flex 
    ${wrap ? 'flex-wrap justify-center' : 'flex-nowrap'} 
    z-[9998]
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <nav className={navClasses}>
      <div className="container mx-auto flex flex-wrap justify-center sm:justify-between">
        <div className={`flex ${wrap ? 'w-full justify-center sm:w-auto sm:justify-start' : ''}`}>
          <NavLink 
            to="/" 
            className="logo flex items-center text-foreground hover:bg-secondary transition-colors duration-100 no-underline h-[60px]"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <LazyImage 
                src={BlueprintLogo} 
                alt="Logo" 
                className="max-h-10 w-auto object-contain" 
              />
            </div>
            <span className="font-minecraft text-xl font-medium ml-2">Blueprint</span>
          </NavLink>
          
          {!wrap && <span className="flex-grow" />}
        </div>
        
        <div className={`flex flex-wrap gap-4 justify-center ${wrap ? 'w-full sm:w-auto' : ''}`}>
          <NavigationLink 
            destination="/addons" 
            icon={AddonIcon} 
            label={t("navigation.label.addons")} 
          />
          <NavigationLink 
            destination="/schematics" 
            icon={SchematicIcon} 
            label={t("navigation.label.schematics")} 
          />
          <NavigationLink 
            destination="https://blueprint-site.github.io/blueprint-blog/" 
            icon={Blog} 
            label={t("navigation.label.blog")} 
          />
          <NavigationLink 
            destination="/about" 
            icon={AboutIcon} 
            label={t("navigation.label.about")} 
          />
          <NavigationLink 
            destination={linkDestination ?? '/login'} 
            icon={userIcon ?? Goggles} 
            label={userName ?? t("navigation.label.login")} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
