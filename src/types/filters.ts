import type { CategoriesDistribution } from 'meilisearch';

export interface AddonFilters {
  categories: string[];
  loaders: string[];
  minecraft_versions: string[];
  authors: string[];
  downloads?: {
    min?: number;
    max?: number;
  };
  lastUpdated?: {
    from?: Date;
    to?: Date;
  };
  sort?: SortOption;
}

export type SortOption =
  | 'relevance'
  | 'downloads:desc'
  | 'downloads:asc'
  | 'updated_at:desc'
  | 'created_at:desc'
  | 'name:asc'
  | 'name:desc';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  title: string;
  key: keyof AddonFilters;
  options: FilterOption[];
  searchable?: boolean;
  multiSelect?: boolean;
  collapsed?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: Partial<AddonFilters>;
  icon?: string;
}

export interface FacetResults {
  categories?: CategoriesDistribution;
  loaders?: CategoriesDistribution;
  minecraft_versions?: CategoriesDistribution;
  authors?: CategoriesDistribution;
}

export interface SearchFiltersProps {
  filters: AddonFilters;
  facets?: FacetResults;
  onFilterChange: <K extends keyof AddonFilters>(key: K, value: AddonFilters[K]) => void;
  onClearFilters: () => void;
  onApplyPreset?: (preset: FilterPreset) => void;
}

export const defaultFilters: AddonFilters = {
  categories: [],
  loaders: [],
  minecraft_versions: [],
  authors: [],
  sort: 'relevance',
};

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'downloads:desc', label: 'Most Downloaded' },
  { value: 'downloads:asc', label: 'Least Downloaded' },
  { value: 'updated_at:desc', label: 'Recently Updated' },
  { value: 'created_at:desc', label: 'Recently Added' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
];

export const filterPresets: FilterPreset[] = [
  {
    id: 'popular-tech',
    name: 'Popular Tech Mods',
    description: 'Most downloaded technology mods',
    filters: {
      categories: ['tech', 'industrial', 'automation'],
      sort: 'downloads:desc',
    },
    icon: '⚙️',
  },
  {
    id: 'latest-magic',
    name: 'Latest Magic Mods',
    description: 'Recently updated magic mods',
    filters: {
      categories: ['magic', 'enchantment', 'alchemy'],
      sort: 'updated_at:desc',
    },
    icon: '✨',
  },
  {
    id: 'adventure-content',
    name: 'Adventure Content',
    description: 'Exploration and dungeon mods',
    filters: {
      categories: ['adventure', 'exploration', 'dungeons', 'structures'],
      sort: 'downloads:desc',
    },
    icon: '🗺️',
  },
  {
    id: 'performance',
    name: 'Performance Mods',
    description: 'Optimization and performance improvements',
    filters: {
      categories: ['utility', 'performance', 'optimization'],
      sort: 'downloads:desc',
    },
    icon: '⚡',
  },
];

export const categoryGroups = {
  Technology: ['tech', 'industrial', 'automation', 'energy', 'redstone'],
  Magic: ['magic', 'magical', 'enchantment', 'alchemy', 'dimensions'],
  Adventure: ['adventure', 'exploration', 'dungeons', 'structures', 'biomes'],
  Decoration: ['building', 'decoration', 'furniture', 'cosmetic'],
  Gameplay: ['mechanics', 'combat', 'food', 'farming'],
  Utility: ['library', 'api', 'performance', 'ui', 'optimization'],
  'World Gen': ['worldgen', 'terrain', 'ores', 'plants', 'mobs'],
};

export const versionGroups = {
  Latest: ['1.21.1', '1.21', '1.20.6', '1.20.4', '1.20.1'],
  LTS: ['1.19.2', '1.18.2', '1.16.5', '1.12.2'],
  Legacy: ['1.7.10', '1.6.4', '1.5.2', '1.4.7'],
};
