import { useTranslation } from "react-i18next";

import BlueprintLogo from "@/assets/logo.webp";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import { Equal, Plus } from 'lucide-react';

const WhatIsBlueprint = () => {
  const { t } = useTranslation();

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
            <img
              loading="lazy"
              src={AddonIcon}
              alt="Addon Icon"
              className="object-contain w-8 sm:w-10 md:w-14 lg:w-24"
            />
            <div className="text-base md:text-lg">Addons</div>
          </div>
          <Plus className="h-8 sm:h-10 md:h-14 lg:h-24" />
          <div className="flex flex-col items-center transition-transform hover:scale-110">
            <img
              loading="lazy"
              src={SchematicIcon}
              alt="Schematic Icon"
              className="object-contain w-8 sm:w-10 md:w-14 lg:w-24"
            />
            <div className="text-base md:text-lg">Schematics</div>
          </div>
          <Equal className="h-8 sm:h-10 md:h-14 lg:h-24" />        
          <div className="flex flex-col items-center transition-transform hover:scale-110">
            <img
              loading="lazy"
              src={BlueprintLogo}
              alt="Blueprint Logo"
              className="object-contain w-8 sm:w-10 md:w-14 lg:w-24"
            />
            <div className="text-base md:text-lg">Blueprint</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
