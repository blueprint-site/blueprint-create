/**
 * Types for addon dependencies and compatibility information
 */

/**
 * Represents a dependency relationship between addons
 */
export interface Dependency {
  project_id: string;
  version_id?: string;
  file_name?: string;
  dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded';
  name?: string;
  slug?: string;
}

/**
 * Groups dependencies by their type
 */
export interface Dependencies {
  required?: Dependency[];
  optional?: Dependency[];
  incompatible?: Dependency[];
  embedded?: Dependency[];
}

/**
 * Props for the AddonDetailsDependencies component
 */
export interface AddonDetailsDependenciesProps {
  dependencies?: Dependencies;
  serverSide?: string;
  clientSide?: string;
}

/**
 * Props for the DependencyTooltip component
 */
export interface DependencyTooltipProps {
  type: 'required' | 'optional' | 'incompatible' | 'embedded';
}

/**
 * Props for the DependencyBadge component
 */
export interface DependencyBadgeProps {
  dependency: Dependency;
  variant: 'default' | 'outline' | 'destructive' | 'secondary';
}

/**
 * Props for the DependencySection component
 */
export interface DependencySectionProps {
  title: string;
  type: 'required' | 'optional' | 'incompatible' | 'embedded';
  dependencies: Dependency[];
}

/**
 * Props for the EnvironmentCompatibility component
 */
export interface EnvironmentCompatibilityProps {
  clientSide?: string;
  serverSide?: string;
}
