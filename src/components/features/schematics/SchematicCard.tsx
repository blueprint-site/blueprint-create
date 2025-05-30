import React from 'react';
import { useNavigate } from 'react-router';
import { Download } from 'lucide-react';

import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import ModLoaders from '../addons/addon-card/ModLoaders';

import { useIncrementDownloads } from '@/api/appwrite/useSchematics';
import type { Schematic } from '@/types';

interface SchematicCardProps {
  schematic: Schematic;
  onClick: () => void;
}

const SchematicCard = ({ schematic, onClick }: SchematicCardProps) => {
  const navigate = useNavigate();
  const renderVersionBadges = (versions: string[]) => {
    return versions.map((version, i) => (
      <Badge key={`mc-version-${version}-${i}`} variant='accent'>
        {version}
      </Badge>
    ));
  };
  const { mutate: incrementDownloads } = useIncrementDownloads();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementDownloads(schematic.$id);
    navigate(schematic.schematic_url);
  };

  return (
    <Card
      className='bg flex h-full cursor-pointer flex-col rounded-lg transition-shadow hover:shadow-lg'
      onClick={onClick}
    >
      <div className='h-40 overflow-hidden'>
        <img
          className='h-full w-full rounded-t-md object-cover'
          alt={schematic.title}
          src={
            Array.isArray(schematic.image_urls) && schematic.image_urls.length > 0
              ? schematic.image_urls[0]
              : ''
          }
        />
      </div>
      <CardHeader className='grow'>
        <CardTitle>{schematic.title}</CardTitle>
        <CardDescription>{schematic.description.slice(0, 150)}...</CardDescription>
      </CardHeader>

      <CardContent>
        <div>
          Modloader: <ModLoaders loaders={schematic.modloaders} />
        </div>
        <div>
          Made for Minecraft:
          <div className='flex grow gap-2'>{renderVersionBadges(schematic.game_versions)}</div>
        </div>
      </CardContent>

      <CardFooter className='mt-auto'>
        <Button variant='default' className='w-full text-center' onClick={handleDownload}>
          <Download /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchematicCard;
