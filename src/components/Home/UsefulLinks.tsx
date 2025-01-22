import { useTranslation } from "react-i18next";

import WikiLogo from "@/assets/brass_ingot.webp";
import CreateLogo from "@/assets/create_mod_logo.webp";

import LazyImage from "@/components/LazyImage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UsefulLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      href: "https://create.fandom.com/wiki/Create_Mod_Wiki",
      icon: WikiLogo,
      text: "Create Mod wiki",
      description: "Complete documentation and guides"
    },
    {
      href: "https://modrinth.com/mod/create",
      icon: CreateLogo,
      text: "Create Mod (Forge)",
      description: "Download for Forge modloader"
    },
    {
      href: "https://modrinth.com/mod/create-fabric",
      icon: CreateLogo,
      text: "Create Mod (Fabric)",
      description: "Download for Fabric modloader"
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {t("home.info.links")}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Essential resources for Create mod developers and users
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Useful Resources</CardTitle>
          <CardDescription>
            Documentation, downloads, and community links
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 rounded-lg hover:bg-secondary transition-colors duration-200"
            >
              <div className="flex-shrink-0">
                <LazyImage
                  src={link.icon}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-minecraft text-lg text-foreground">
                  {link.text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsefulLinks;