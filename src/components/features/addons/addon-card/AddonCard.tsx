import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import CategoryBadges from './CategoryBadges';
import VersionBadges from './VersionBadges';
import AddonStats from './AddonStats';
import ModPageLinks from './ModPageLinks';
import ModLoaders from './ModLoaders';

import type { Addon } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AddonListItemProps {
  addon: Addon;
}

const AddonCard = ({ addon }: AddonListItemProps) => {
  const navigate = useNavigate();
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

  const navigateToAddon = () => {
    navigate(`/addons/${addon.slug}`);
  };

  return (
    <Card className='flex h-full flex-col overflow-hidden hover:shadow-xs'>
      <CardHeader className='relative flex cursor-pointer flex-row gap-3' onClick={navigateToAddon}>
        <img
          src={addon.icon || '/assets/wrench.webp'}
          alt={addon.name}
          loading='lazy'
          className='h-12 w-12 object-cover'
        />
        <h3 className='truncate text-sm font-medium'>{addon.name}</h3>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col gap-3'>
        <div className='flex-1'>
          <p className='text-foreground-muted text-xs'>{addon.description}</p>

          <div className='mt-2 flex gap-2'>
            <ModLoaders loaders={addon.loaders || []} />
          </div>

          <CategoryBadges categories={addon.categories} />
          <VersionBadges versions={addon.minecraft_versions || []} />
        </div>

        <AddonStats
          author={addon.author}
          downloads={addon.downloads}
          claimed_by={addon.claimed_by}
        />

        <ModPageLinks
          slug={addon.slug}
          curseforge={availableOn.includes('curseforge')}
          modrinth={availableOn.includes('modrinth')}
        />
      </CardContent>
    </Card>
  );
};

export default memo(AddonCard);
