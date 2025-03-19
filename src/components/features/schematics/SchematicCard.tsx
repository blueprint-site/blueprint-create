import { Link } from 'react-router';
import { Download } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useIncrementDownloads } from '@/api/endpoints/useSchematics.tsx';
import { Schematic } from '@/types';
import ModLoaders from '../addons/addon-card/ModLoaders';

interface SchematicCardProps {
  schematic: Schematic;
  onClick: () => void;
}

const SchematicCard = ({ schematic, onClick }: SchematicCardProps) => {
  const renderVersionBadges = (versions: string[]) => {
    return versions.map((version, i) => (
      <Badge key={`mc-version-${version}-${i}`} variant='mcVersion'>
        {version}
      </Badge>
    ));
  };
  const { mutate: incrementDownloads } = useIncrementDownloads();

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
        <Link
          className={buttonVariants({
            variant: 'default',
            className: 'w-full text-center',
          })}
          to={schematic.schematic_url}
          onClick={(e) => {
            incrementDownloads(schematic.$id);
            e.stopPropagation();
          }}
        >
          <Download /> Download
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchematicCard;
