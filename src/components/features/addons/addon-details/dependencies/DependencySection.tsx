import { DependencyBadge } from './DependencyBadge';
import { DependencyTooltip } from './DependencyTooltip';
import type { DependencySectionProps } from '@/types';

/**
 * Maps dependency types to badge variants
 */
const variantMap = {
  required: 'default',
  optional: 'outline',
  incompatible: 'destructive',
  embedded: 'secondary',
} as const;

/**
 * Renders a section of dependencies of a specific type (required, optional, etc.)
 */
export const DependencySection = ({ title, type, dependencies }: DependencySectionProps) => {
  if (!dependencies.length) return null;

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-1'>
        <h4 className='text-muted-foreground text-xs font-medium'>{title}</h4>
        <DependencyTooltip type={type} />
      </div>
      <div className='flex flex-wrap gap-2'>
        {dependencies.map((dep) => (
          <DependencyBadge key={dep.project_id} dependency={dep} variant={variantMap[type]} />
        ))}
      </div>
    </div>
  );
};
