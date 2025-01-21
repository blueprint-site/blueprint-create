// /src/components/UsefulLinks.tsx

import { useTranslation } from "react-i18next";

import WikiLogo from "@/assets/brass_ingot.webp";
import CreateLogo from "@/assets/create_mod_logo.webp";

import LazyImage from "@/components/LazyImage";

const UsefulLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      href: "https://create.fandom.com/wiki/Create_Mod_Wiki",
      icon: WikiLogo,
      text: "Create Mod wiki"
    },
    {
      href: "https://modrinth.com/mod/create",
      icon: CreateLogo,
      text: "Create Mod (Forge)"
    },
    {
      href: "https://modrinth.com/mod/create-fabric",
      icon: CreateLogo,
      text: "Create Mod (Fabric)"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          {t("home.info.links")}
        </h2>
        
        <div className="flex flex-col items-center gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:bg-secondary rounded-lg p-2 transition-colors duration-200 text-foreground font-minecraft text-lg"
            >
              <LazyImage
                src={link.icon}
                alt=""
                className="w-8 h-8 mr-2 object-contain"
              />
              <span>{link.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsefulLinks;