import { Addon } from '@/types/addons';
import { z } from 'zod';
import { ArrowDown } from 'lucide-react';
type AddonType = z.infer<typeof Addon>;

interface AddonCardProps {
  addon: AddonType;
}

export default function AddonCard({ addon }: AddonCardProps) {
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
      }

      if (normalizedLoader && !normalized.includes(normalizedLoader)) {
        normalized.push(normalizedLoader);
      }
    }
    return normalized.join(' and ');
  }
  return (
    <div className='bg-blueprint/50 p-4'>
      <img src={addon.icon} alt={addon.name} className='w-20' />
      <span className='font-minecraft text-lg font-semibold'>{addon.name}</span>
      <p className='mb-2 -mt-1'>{addon.description}</p>
      <p>{new Intl.NumberFormat('pl-PL').format(addon.downloads)} downloads total</p>
      <p>On {addon.sources.join(' and ')}</p>
      <p>For {normalizeLoaders(addon.loaders)}</p>
      <div className="gap-2 flex mt-2 font-minecraft">
        {addon.sources.includes('Modrinth') && <button className='bg-green-400 px-5 hover:bg-blueprint transition-all'>
          Modrinth
        </button>}
        {addon.sources.includes('CurseForge') && <button className='bg-orange-500 px-5 hover:bg-blueprint transition-all'>
          CurseForge
        </button>}
      </div>
    </div>
  );
}
