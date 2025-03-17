import { useState, useEffect, ReactNode } from 'react';
import { CurseForgeAddon, ModrinthAddon } from '@/types';
import { Addon } from '@/types/addons/addon-details';

interface AddonDataParserProps {
  addon: Addon;
  children: (props: {
    modrinthData: ModrinthAddon | null;
    curseforgeData: CurseForgeAddon | null;
  }) => ReactNode;
}

/**
 * Parses raw addon data from API into usable objects
 */
export const AddonDataParser = ({ addon, children }: AddonDataParserProps) => {
  const [parsedData, setParsedData] = useState<{
    modrinthData: ModrinthAddon | null;
    curseforgeData: CurseForgeAddon | null;
  }>({
    modrinthData: null,
    curseforgeData: null,
  });

  useEffect(() => {
    if (!addon) return;

    // Parse Modrinth data
    let modrinthData: ModrinthAddon | null = null;
    if (addon.modrinth_raw) {
      if (typeof addon.modrinth_raw === 'string') {
        try {
          modrinthData = JSON.parse(addon.modrinth_raw);
        } catch (error) {
          console.error('Error parsing Modrinth data:', error);
        }
      } else if (addon.modrinth_raw !== null) {
        modrinthData = addon.modrinth_raw as unknown as ModrinthAddon;
      }
    }

    // Parse CurseForge data
    let curseforgeData: CurseForgeAddon | null = null;
    if (addon.curseforge_raw) {
      if (typeof addon.curseforge_raw === 'string') {
        try {
          curseforgeData = JSON.parse(addon.curseforge_raw);
        } catch (error) {
          console.error('Error parsing CurseForge data:', error);
        }
      } else if (addon.curseforge_raw !== null) {
        curseforgeData = addon.curseforge_raw as unknown as CurseForgeAddon;
      }
    }

    setParsedData({ modrinthData, curseforgeData });
  }, [addon]);

  return children(parsedData);
};
