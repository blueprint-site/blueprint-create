import { Star, StarOff } from 'lucide-react';
import { memo, useEffect, useState} from 'react';
import { useCollectionStore } from '@/api/stores/collectionStore.ts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModLoaders from '@/components/features/addons/addon-card/ModLoaders';
import CategoryBadges from '@/components/features/addons/addon-card/CategoryBadges';
import { VersionBadges } from './VersionBadges';
import { AddonStats } from './AddonStats';
import { useNavigate } from 'react-router';
import { Addon } from '@/types';
import {ExternalLinks} from "@/components/features/addons/addon-card/ExternalLinks.tsx";

interface AddonListItemProps {
  addon: Addon;
}

const AddonCard = memo(({ addon }: AddonListItemProps) => {
  const navigate = useNavigate(); // Hook called at top level
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(addon.slug);
  const [availableOn, setAvailableOn] = useState<string[]>([]);

  useEffect(() => {
    const platforms: string[] = [];

    if (addon.curseforge_raw) {
      platforms.push('curseforge');
    }
    if (addon.modrinth_raw) {
      platforms.push('modrinth');
    }

    setAvailableOn(platforms);
  }, [addon.curseforge_raw, addon.modrinth_raw]);

  const handleCollectionAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking collection button
    isInCollection ? removeAddon(addon.slug) : addAddon(addon.slug);
  };

  const navigateToAddon = () => {
    navigate(`/addons/${addon.slug}`);
  };

  return (
    <Card className='flex flex-col overflow-hidden hover:shadow-xs h-full'>
      <CardHeader className='relative flex cursor-pointer flex-row gap-3' onClick={navigateToAddon}>
        <img
          src={addon.icon || '/assets/wrench.webp'}
          alt={addon.name}
          loading='lazy'
          className='h-12 w-12 object-cover'
        />
        <h3 className='truncate text-sm font-medium'>{addon.name}</h3>
        <Button
          variant='outline'
          size='icon'
          className='absolute top-3 right-3 h-8 w-8 rounded-full'
          onClick={handleCollectionAction}
        >
          {isInCollection ? <Star /> : <StarOff />}
        </Button>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col gap-3'>
        <div className='flex-1'>
          <p className='text-foreground-muted text-xs'>{addon.description}</p>

          <div className='mt-2 flex gap-2'>
            <ModLoaders addon={addon} />
          </div>

          <CategoryBadges categories={addon.categories} />
        <VersionBadges versions={addon.minecraft_versions || []} />
        </div>


        <AddonStats author={addon.author} downloads={addon.downloads} />

        <ExternalLinks
          slug={addon.slug}
          curseforge={availableOn.includes('curseforge')}
          modrinth={availableOn.includes('modrinth')}
        />
      </CardContent>
    </Card>
  );
});

export default AddonCard;
