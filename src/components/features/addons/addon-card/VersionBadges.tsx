import { Badge } from '@/components/ui/badge';
import { ensureArray } from '@/utils/arrayUtils';

interface VersionBadgesProps {
  versions: string[] | null | undefined;
}

const VersionBadges = ({ versions }: VersionBadgesProps) => {
  const safeVersions = ensureArray(versions);

  if (safeVersions.length === 0) return null;

  return (
    <div className='mt-3 flex flex-wrap gap-1.5'>
      {safeVersions.map((version) => (
        <Badge key={version} variant='secondary' className='px-1.5 py-0.5 font-mono text-xs'>
          {version}
        </Badge>
      ))}
    </div>
  );
};

export default VersionBadges;
