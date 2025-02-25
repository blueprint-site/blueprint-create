import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Label } from '@/components/ui/label.tsx';
import ModLoaderDisplay from '@/components/common/ModLoaderDisplay.tsx';
import minecraftVersion from '@/config/minecraft.ts';
import { useEffect } from 'react';

interface Step3Props {
  gameVersions: string[];
  setGameVersions: (versions: string[]) => void;
  loaders: string[];
  setLoaders: (loaders: string[]) => void;
}

function Step3({ gameVersions, setGameVersions, loaders, setLoaders }: Step3Props) {
  // Function to update compatible loaders based on selected game versions
  const updateCompatibleLoaders = (selectedVersions: string[]) => {
    const compatibleLoaders: string[] = [];

    selectedVersions.forEach((version) => {
      const versionInfo = minecraftVersion.find((v) => v.version === version);
      if (versionInfo) {
        versionInfo.compatibility.forEach((loader) => {
          if (!compatibleLoaders.includes(loader)) {
            compatibleLoaders.push(loader);
          }
        });
      }
    });

    setLoaders(compatibleLoaders);
  };

  // Update loaders whenever gameVersions changes
  useEffect(() => {
    updateCompatibleLoaders(gameVersions);
  }, [gameVersions]);

  return (
    <>
      <h2 className='text-center'>Game Versions</h2>
      <ToggleGroup
        variant='outline'
        type='multiple'
        value={gameVersions}
        onValueChange={(selectedVersions) => {
          setGameVersions(selectedVersions);
          updateCompatibleLoaders(selectedVersions); // Update loaders when versions change
        }}
        className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
      >
        {minecraftVersion.map((version, index) => (
          <ToggleGroupItem key={index} value={version.version} className='flex items-center space-x-2'>
            <Label>{version.version}</Label>
            <div>
              <ModLoaderDisplay loaders={version.compatibility} />
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <h3 className='mt-4 text-center'>Select Loaders</h3>
      <ToggleGroup
        variant='outline'
        type='multiple'
        value={loaders}
        onValueChange={setLoaders}
        className='grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
      >
        {['fabric', 'forge', 'quilt'].map((loader, index) => (
          <ToggleGroupItem
            key={index}
            value={loader}
            className='flex items-center space-x-2'
            disabled={!loaders.includes(loader)} // Disable loaders that are not compatible
          >
            {loader}
            <ModLoaderDisplay loaders={[`${loader}`]} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  );
}

export default Step3;