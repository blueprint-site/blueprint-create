import { Badge } from '@/components/ui/badge';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay';
import CategoryBadges from '@/components/features/addons/addon-card/CategoryBadges';
import { ExternalLinks } from '@/components/features/addons/addon-card/ExternalLinks';
import { CardContent } from '@/components/ui/card';

export interface AddonDetailsParams {
  versions: string[];
  loaders: string[];
  categories: string[];
  slug: string;
  availableOn: string[];
}

export const AddonDetailsContent = ({
  versions = [],
  loaders = [],
  categories = [],
  slug = '',
  availableOn = [],
}: AddonDetailsParams) => {
  return (
    <CardContent className='py-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-6'>
          <div>
            <h3 className='mb-3 text-sm font-semibold'>Minecraft Versions</h3>
            <div className='flex flex-wrap gap-2'>
              {versions?.map((version) => (
                <Badge key={version} variant='outline'>
                  {version}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className='mb-3 text-sm font-semibold'>Mod Loaders</h3>
            <ModLoaderDisplay loaders={loaders} />
          </div>

          <div>
            <h3 className='mb-3 text-sm font-semibold'>Categories</h3>
            <CategoryBadges categories={categories} />
          </div>
        </div>

        <div>
          <div>
            <div className='mb-6'>
              <ExternalLinks
                slug={slug}
                curseforge={availableOn.includes('curseforge')}
                modrinth={availableOn.includes('modrinth')}
              />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
