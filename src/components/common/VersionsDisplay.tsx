import { MINECRAFT_VERSIONS } from '@/data/minecraftVersions';

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
    <div className='flex flex-row gap-2'>
      {versions.includes('All') ? 'All' : null}
      {versionsToDisplay.map((version, i) => (
        <div key={i}>{version} </div>
      ))}
    </div>
  );
};

export default VersionsDisplay;
