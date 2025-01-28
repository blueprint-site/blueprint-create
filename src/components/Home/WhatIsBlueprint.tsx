import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/useBreakpoints";

import BlueprintLogo from "@/assets/logo.webp";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import LazyImage from "@/components/utility/LazyImage";
import MinecraftIcon from "@/components/utility/MinecraftIcon";


const WhatIsBlueprint = () => {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();

  return (
    <div className="container font-minecraft py-6">
      <div className="flex flex-col gap-5 items-center text-center">
        <h1 className="my-2 font-bold tracking-tighter text-white/90 text-3xl sm:text-4xl md:text-5xl ">
          {t("home.info.about.title")}
        </h1>
        <div className="text-xl text-white/80 font-italic">
          {t("home.info.about.description")}
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex flex-col items-center transition-transform hover:scale-110">
            <LazyImage
              src={AddonIcon}
              alt="Addon Icon"
              className="w-10 lg:w-24 object-contain"
            />
            <div className="text-base md:text-lg">Addons</div>
          </div>
          <MinecraftIcon name="plus" size={isMobile ? 24 : 44} /> 
          <div className="flex flex-col items-center transition-transform hover:scale-110">
            <LazyImage
              src={SchematicIcon}
              alt="Schematic Icon"
              className="w-10 lg:w-24 object-contain"
            />
            <div className="text-base md:text-lg">Schematics</div>
          </div>
          <MinecraftIcon name="equals" size={isMobile ? 24 : 44} /> 
          <div className="flex flex-col items-center transition-transform hover:scale-110">
            <LazyImage
              src={BlueprintLogo}
              alt="Blueprint Logo"
              className="w-10 lg:w-24 object-contain"
            />
            <div className="text-base md:text-lg">Blueprint</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
