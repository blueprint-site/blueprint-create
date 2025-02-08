import { Link } from "react-router-dom";
import { Search, Upload, View } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SchematicSearchCardProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SchematicSearchCard = ({ searchQuery, onSearchChange }: SchematicSearchCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explore Schematics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row md:flex-row gap-4 mx-16 mt-4 items-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search schematics..."
            startIcon={Search}
            className="w-1/3 md:w-1/2"
          />
          <div className="w-full">
            <h1 className="text-2xl font-bold w-full"></h1>
          </div>
          <div>
            <Link
              className={buttonVariants({variant: "default"})}
              to="../schematics/upload"
            >
              <Upload /> Upload Schematic
            </Link>
          </div>
          <div>
            <Link
              className={buttonVariants({variant: "link"})}
              to="../schematics/3dviewer"
            >
              <View /> View in 3D
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchematicSearchCard;