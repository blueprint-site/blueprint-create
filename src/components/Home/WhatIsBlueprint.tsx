import BlueprintLogo from "@/assets/logo.webp";
import AddonIcon from "@/assets/minecart_coupling.webp";
import SchematicIcon from "@/assets/schematic.webp";
import LazyImage from "@/components/LazyImage";
import { useTranslation } from "react-i18next";

const WhatIsBlueprint = () => {
  const { t } = useTranslation();

  return (
    <div className="container font-minecraft">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bold">
          {t("home.info.about.title")}
        </h1>

        <h4 className="text-xl text-muted-foreground max-w-[700px] font-italic">
          {t("home.info.about.description")}
        </h4>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <LazyImage
            src={AddonIcon}
            alt="Addon Icon"
            className="w-16 h-16 object-contain transition-transform hover:scale-110"
          />

          <span className="text-2xl font-bold text-muted-foreground">+</span>

          <LazyImage
            src={SchematicIcon}
            alt="Schematic Icon"
            className="w-16 h-16 object-contain transition-transform hover:scale-110"
          />

          <span className="text-2xl font-bold text-muted-foreground">=</span>

          <LazyImage
            src={BlueprintLogo}
            alt="Blueprint Logo"
            className="w-16 h-16 object-contain transition-transform hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
