import { useTranslation } from "react-i18next";

import CreateFabricLogo from "@/assets/create_fabric.webp";
import CreateLogo from "@/assets/create_mod_logo.webp";
import WikiLogo from "@/assets/sprite-icons/brass_ingot.webp";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import LazyImage from "@/components/utility/LazyImage";

const UsefulLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      href: "https://create.fandom.com/wiki/Create_Mod_Wiki",
      icon: WikiLogo,
      text: "Create Mod wiki",
      description: "Complete documentation and guides",
      color: "success",
    },
    {
      href: "https://modrinth.com/mod/create",
      icon: CreateLogo,
      text: "Create Mod (Forge)",
      description: "Download for Forge modloader",
      color: "warning",
    },
    {
      href: "https://modrinth.com/mod/create-fabric",
      icon: CreateFabricLogo,
      text: "Create Mod (Fabric)",
      description: "Download for Fabric modloader",
      color: "destructive",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {t("home.info.links")}
        </h2>
        <p className="mx-auto max-w-[700px] text-foreground-muted">
          Essential resources for Create mod developers and users
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="flex flex-col p-6 gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-${link.color} flex items-center justify-center p-4 rounded-lg gap-5 hover:bg-${link.color}/80 transition-colors duration-200`}
            >
                <LazyImage
                  src={link.icon}
                  alt={link.icon}
                  width={64}
                  height={64}
                  pixelated={link.icon === WikiLogo ? true : false}
                  className="object-contain"
                />
                <div className="text-center">
                  <div className="font-minecraft text-xl font-bold text-white/90">
                    {link.text}
                  </div>
                  <div className="text-sm text-white/80">
                    {link.description}
                  </div>
                </div>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsefulLinks;
