import { Skeleton } from '@/components/ui/skeleton';
import type { Addon } from '@/types/addons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { z } from 'zod';
import { Download, FileCog, AlertTriangle } from 'lucide-react';
type AddonType = z.infer<typeof Addon>;
import Humanize from 'humanize-plus';
interface AddonCardProps {
  addon: AddonType;
}

export default function AddonCard({ addon }: AddonCardProps) {
  const [imgLoading, setImgLoading] = useState<boolean>(true);

  useEffect(() => {
    setImgLoading(true);
  }, [addon.icon]);

  function normalizeLoaders(loaders: string[]): string {
    let normalized: string[] = [];
    for (let loader of loaders) {
      let normalizedLoader = '';
      if (loader.toLowerCase() === 'fabric') {
        normalizedLoader = 'Fabric';
      } else if (loader.toLowerCase() === 'forge') {
        normalizedLoader = 'Forge';
      } else if (loader.toLowerCase() === 'quilt') {
        normalizedLoader = 'Quilt';
      } else if (loader.toLowerCase() === 'neoforge') {
        normalizedLoader = 'NeoForge';
      }

      if (normalizedLoader && !normalized.includes(normalizedLoader)) {
        normalized.push(normalizedLoader);
      }
    }
    return normalized.join(' and ');
  }
  return (
    <div className='bg-surface-1 flex flex-col border text-white p-4 hover:scale-102 transition-all'>
      <Link to={`/addons/${addon.slug}`} className='flex flex-col'>
        {addon.icon && (
          <img
            src={addon.icon}
            alt={addon.name}
            className='w-20'
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            style={{ display: imgLoading ? 'none' : 'block' }}
          />
        )}
        {addon.icon && imgLoading && (
          <Skeleton className='w-20 h-20 mb-3 rounded-full bg-surface-2' />
        )}
        <span className='font-minecraft text-lg font-semibold mt-3'>{addon.name}</span>
        <p className='mb-2 -mt-1'>{addon.description}</p>
        <p className='flex items-center gap-1'>
          <Download size={18} />
          {Humanize.compactInteger(addon.downloads, 1)}
          {addon.downloads_is_fallback && (
            <span
              title='Downloads fetched from Modrinth as fallback'
              aria-label='Downloads fallback from Modrinth'
            >
              <AlertTriangle size={14} className='text-amber-400' />
            </span>
          )}
        </p>
        {/*<p className='flex items-center gap-1'>
          <Globe size={18} />
          {addon.sources.join(' and ')}
        </p>*/}
        <p className='flex items-center gap-1'>
          <FileCog size={18} />
          For {normalizeLoaders(addon.loaders)}
        </p>
      </Link>
      <div className='gap-2 flex pt-2 font-minecraft mt-auto'>
        {addon.sources.includes('Modrinth') && (
          <button
            className='bg-green-400 hover:cursor-pointer px-5 hover:bg-accent transition-all text-black'
            onClick={() => window.open(`https://modrinth.com/mod/${addon.slug}`)}
          >
            Modrinth
          </button>
        )}
        {addon.sources.includes('CurseForge') && (
          <button
            className='bg-orange-500 hover:cursor-pointer px-5 hover:bg-accent transition-all text-black'
            onClick={() =>
              window.open(`https://www.curseforge.com/minecraft/mc-mods/${addon.slug}`)
            }
          >
            CurseForge
          </button>
        )}
      </div>
    </div>
  );
}
