import { Addon } from "@/types/addons";
import { z } from "zod";

type AddonType = z.infer<typeof Addon>;

interface AddonCardProps {
  addon: AddonType;
}

export default function AddonCard({ addon }: AddonCardProps) {
  return (
    <div className="bg-blueprint/50 p-4">
      <img src={addon.icon} alt={addon.name} className="w-10"/>
      <h3>{addon.name}</h3>
      <p>{addon.description}</p>
    </div>
  );
}