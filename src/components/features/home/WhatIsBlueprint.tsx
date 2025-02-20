import { useTranslation } from "react-i18next";
import { Equal, Plus } from "lucide-react";
import BlueprintLogo from "@/assets/logo.webp";
import AddonIcon from "@/assets/sprite-icons/minecart_coupling.webp";
import SchematicIcon from "@/assets/sprite-icons/schematic.webp";
import React from "react";

interface FeatureIconProps {
  src: string;
  alt: string;
  label: string;
}

const FeatureIcon = ({ src, alt, label }: FeatureIconProps) => (
  <div className="flex flex-col items-center mt-4 transition-transform duration-200 hover:scale-110">
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="object-contain w-8 sm:w-10 md:w-14 lg:w-20"
    />
    <div className="mt-2 text-base md:text-lg">{label}</div>
  </div>
);

const Separator = ({ type }: { type: "plus" | "equal" }) => {
  const Icon = type === "plus" ? Plus : Equal;
  return <Icon className="h-8 sm:h-10 md:w-14 lg:h-24" />;
};

const WhatIsBlueprint = () => {
  const { t } = useTranslation();

  const features = [
    { src: AddonIcon, alt: "Addon Icon", label: "Addons" },
    { src: SchematicIcon, alt: "Schematic Icon", label: "Schematics" },
    { src: BlueprintLogo, alt: "Blueprint Logo", label: "Blueprint" },
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-5">
      <div className="text-3xl sm:text-4xl md:text-5xl md:py-4 font-bold tracking-tighter text-white/90">
        {t("home.info.about.title")}
      </div>

      <p className="text-xl text-white/80 font-italic">
        {t("home.info.about.description")}
      </p>

      <div className="flex items-center justify-center gap-4  px-2">
        {features.map((feature, index) => (
          <React.Fragment key={feature.label}>
            <FeatureIcon {...feature} />
            {index < features.length - 1 && (
              <Separator type={index === 0 ? "plus" : "equal"} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
