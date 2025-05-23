import { MINECRAFT_VERSIONS } from '@/data/minecraftVersions';
import { Badge } from '@/components/ui/badge';

const VersionsDisplay = ({ versions = [] }: { versions?: string[] }) => {
  if (versions.length === 0) {
    return <div>No versions found!</div>;
  }

  const showAll = versions.includes('All');

  const versionsToDisplay = showAll
    ? MINECRAFT_VERSIONS.filter((version) => version.value !== 'All').map(
        (version) => version.value
      )
    : versions;

  return (
    <div className='flex flex-row flex-wrap gap-2'>
      {versionsToDisplay.map((version) => (
        <Badge key={version}>{version} </Badge>
      ))}
    </div>
  );
};

export default VersionsDisplay;
