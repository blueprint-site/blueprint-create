import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModLoaderDisplay from "@/components/common/ModLoaderDisplay";
import { Schematic } from "@/types";

interface SchematicCardProps {
  schematic: Schematic;
  onClick: () => void;
}

const SchematicCard = ({ schematic, onClick }: SchematicCardProps) => {
  const renderVersionBadges = (versions: string[]) => {
    return versions.map((version, i) => (
      <Badge key={i} variant="mcVersion">
        {version}
      </Badge>
    ));
  };

  return (
    <Card
      className="flex flex-col h-full bg rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-t-md"
          alt={schematic.title}
          src={schematic.image_url}
        />
      </div>

      <CardHeader className="grow">
        <CardTitle>{schematic.title}</CardTitle>
        <CardDescription>
          {schematic.description.slice(0, 150)}...
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div>
          Modloader: <ModLoaderDisplay loaders={schematic.modloaders} />
        </div>
        <div>
          Made for Minecraft:
          <div className="flex grow gap-2">
            {renderVersionBadges(schematic.game_versions)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Link
          className={buttonVariants({
            variant: "default",
            className: "w-full text-center"
          })}
          to={schematic.schematic_url}
          onClick={(e) => e.stopPropagation()}
        >
          <Download /> Download
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchematicCard;