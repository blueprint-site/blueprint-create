import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { DependencyBadgeProps } from '@/types/addons/dependencies';

/**
 * Renders a badge for a single dependency with an optional external link
 */
export const DependencyBadge = ({ dependency, variant }: DependencyBadgeProps) => {
  const isLightText = variant === 'default' || variant === 'destructive';

  return (
    <Badge key={dependency.project_id} variant={variant} className='flex items-center gap-1'>
      {dependency.name ?? 'Unknown'}
      {dependency.slug && (
        <a
          href={`https://modrinth.com/mod/${dependency.slug}`}
          target='_blank'
          rel='noopener noreferrer'
          className={`${isLightText ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          aria-label={`View ${dependency.name} on Modrinth`}
        >
          <ExternalLink className='h-3 w-3' />
        </a>
      )}
    </Badge>
  );
};
