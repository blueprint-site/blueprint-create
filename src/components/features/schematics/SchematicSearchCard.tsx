
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CardContent,
} from "@/components/ui/card";
import React from "react";

interface SchematicSearchCardProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SchematicSearchCard = ({ searchQuery, onSearchChange }: SchematicSearchCardProps) => {
  return (
      <CardContent>
          <Input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search schematics..."
            startIcon={Search}
            className="w-full"
          />
      </CardContent>
  );
};

export default SchematicSearchCard;