// Schematic Filter Types and Interfaces

export interface SchematicCategory {
  id: string;
  name: string;
  subcategories: SchematicSubcategory[];
  count: number;
  keywords: string[];
}

export interface SchematicSubcategory {
  id: string;
  name: string;
  parentId: string;
  count: number;
  keywords: string[];
}

export interface SchematicDimensions {
  width: { min?: number; max?: number };
  height: { min?: number; max?: number };
  depth: { min?: number; max?: number };
  blockCount: { min?: number; max?: number };
}

export interface SchematicMaterials {
  primary: string[];
  exclude: string[];
  includeModded: boolean;
}

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'extreme';

export interface SchematicComplexity {
  levels: ComplexityLevel[];
  buildTime: { min?: number; max?: number };
}

export interface SchematicCompatibility {
  minecraftVersions: string[];
  createVersions: string[];
  requiredMods: string[];
  allowRedstone: boolean;
  allowCommandBlocks: boolean;
}

export interface SchematicMeta {
  authors: string[];
  minRating: number;
  minDownloads: number;
  uploadedAfter?: Date;
  uploadedBefore?: Date;
  featured: boolean;
}

export type SchematicSortField =
  | 'relevance'
  | 'downloads'
  | 'rating'
  | 'date'
  | 'size'
  | 'complexity'
  | 'name';

export interface SchematicSort {
  field: SchematicSortField;
  order: 'asc' | 'desc';
}

export interface SchematicFilters {
  query: string;
  categories: string[];
  subcategories: string[];
  dimensions: SchematicDimensions;
  materials: SchematicMaterials;
  complexity: SchematicComplexity;
  compatibility: SchematicCompatibility;
  meta: SchematicMeta;
  sort: SchematicSort;
}

export interface SchematicFacetDistribution {
  categories: Record<string, number>;
  subcategories: Record<string, number>;
  materials_primary: Record<string, number>;
  complexity_level: Record<string, number>;
  requirement_mods: Record<string, number>; // Keep this key for interface compatibility
  requirements_minecraftVersion: Record<string, number>;
  authors: Record<string, number>;
}

export interface SchematicFilterPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  filters: Partial<SchematicFilters>;
}

export interface SchematicAnalysis {
  dimensions: {
    width: number;
    height: number;
    depth: number;
    volume: number;
    blockCount: number;
  };
  composition: {
    primaryMaterial: string;
    materials: Map<string, number>;
    modBlocks: Map<string, number>;
    decorativeRatio: number;
    functionalRatio: number;
  };
  complexity: {
    detailLevel: ComplexityLevel;
    symmetry: number;
    patterns: string[];
    estimatedBuildTime: number;
  };
  requirements: {
    mods: string[];
    minecraftVersion: string;
    createModVersion?: string;
    hasRedstone: boolean;
    hasCommandBlocks: boolean;
  };
}

export interface CategorySuggestion {
  category: string;
  subcategory?: string;
  confidence: number;
  reasoning: string;
}

// Default filter values
export const defaultSchematicFilters: SchematicFilters = {
  query: '',
  categories: [],
  subcategories: [],
  dimensions: {
    width: {},
    height: {},
    depth: {},
    blockCount: {},
  },
  materials: {
    primary: [],
    exclude: [],
    includeModded: true,
  },
  complexity: {
    levels: [],
    buildTime: {},
  },
  compatibility: {
    minecraftVersions: [],
    createVersions: [],
    requiredMods: [],
    allowRedstone: true,
    allowCommandBlocks: true,
  },
  meta: {
    authors: [],
    minRating: 0,
    minDownloads: 0,
    featured: false,
  },
  sort: {
    field: 'relevance',
    order: 'desc',
  },
};

// Schematic categories hierarchy
export const schematicCategories: Record<string, SchematicCategory> = {
  buildings: {
    id: 'buildings',
    name: 'Buildings',
    subcategories: [
      {
        id: 'houses',
        name: 'Houses',
        parentId: 'buildings',
        count: 0,
        keywords: ['house', 'home', 'residence'],
      },
      {
        id: 'castles',
        name: 'Castles',
        parentId: 'buildings',
        count: 0,
        keywords: ['castle', 'fortress', 'keep'],
      },
      {
        id: 'towers',
        name: 'Towers',
        parentId: 'buildings',
        count: 0,
        keywords: ['tower', 'spire', 'lighthouse'],
      },
      {
        id: 'shops',
        name: 'Shops',
        parentId: 'buildings',
        count: 0,
        keywords: ['shop', 'store', 'market'],
      },
      {
        id: 'churches',
        name: 'Churches',
        parentId: 'buildings',
        count: 0,
        keywords: ['church', 'cathedral', 'temple'],
      },
      {
        id: 'skyscrapers',
        name: 'Skyscrapers',
        parentId: 'buildings',
        count: 0,
        keywords: ['skyscraper', 'highrise', 'building'],
      },
      {
        id: 'villages',
        name: 'Villages',
        parentId: 'buildings',
        count: 0,
        keywords: ['village', 'town', 'settlement'],
      },
      {
        id: 'cities',
        name: 'Cities',
        parentId: 'buildings',
        count: 0,
        keywords: ['city', 'metropolis', 'urban'],
      },
      {
        id: 'ruins',
        name: 'Ruins',
        parentId: 'buildings',
        count: 0,
        keywords: ['ruins', 'ancient', 'abandoned'],
      },
    ],
    count: 0,
    keywords: ['building', 'structure', 'construction'],
  },
  machines: {
    id: 'machines',
    name: 'Machines & Contraptions',
    subcategories: [
      {
        id: 'farms',
        name: 'Farms',
        parentId: 'machines',
        count: 0,
        keywords: ['farm', 'harvester', 'grinder'],
      },
      {
        id: 'redstone',
        name: 'Redstone',
        parentId: 'machines',
        count: 0,
        keywords: ['redstone', 'circuit', 'piston'],
      },
      {
        id: 'create-mod',
        name: 'Create Mod',
        parentId: 'machines',
        count: 0,
        keywords: ['create', 'contraption', 'mechanical'],
      },
      {
        id: 'industrial',
        name: 'Industrial',
        parentId: 'machines',
        count: 0,
        keywords: ['industrial', 'factory', 'processing'],
      },
      {
        id: 'automation',
        name: 'Automation',
        parentId: 'machines',
        count: 0,
        keywords: ['automatic', 'auto', 'sorter'],
      },
      {
        id: 'sorting-systems',
        name: 'Sorting Systems',
        parentId: 'machines',
        count: 0,
        keywords: ['sorting', 'storage', 'organizer'],
      },
      {
        id: 'doors',
        name: 'Doors',
        parentId: 'machines',
        count: 0,
        keywords: ['door', 'gate', 'entrance'],
      },
      {
        id: 'elevators',
        name: 'Elevators',
        parentId: 'machines',
        count: 0,
        keywords: ['elevator', 'lift', 'vertical'],
      },
    ],
    count: 0,
    keywords: ['machine', 'contraption', 'mechanism', 'device'],
  },
  decoration: {
    id: 'decoration',
    name: 'Decoration & Aesthetics',
    subcategories: [
      {
        id: 'statues',
        name: 'Statues',
        parentId: 'decoration',
        count: 0,
        keywords: ['statue', 'sculpture', 'monument'],
      },
      {
        id: 'fountains',
        name: 'Fountains',
        parentId: 'decoration',
        count: 0,
        keywords: ['fountain', 'water feature', 'pool'],
      },
      {
        id: 'gardens',
        name: 'Gardens',
        parentId: 'decoration',
        count: 0,
        keywords: ['garden', 'park', 'landscaping'],
      },
      {
        id: 'paths',
        name: 'Paths',
        parentId: 'decoration',
        count: 0,
        keywords: ['path', 'road', 'walkway'],
      },
      {
        id: 'lighting',
        name: 'Lighting',
        parentId: 'decoration',
        count: 0,
        keywords: ['light', 'lamp', 'lantern'],
      },
      {
        id: 'furniture',
        name: 'Furniture',
        parentId: 'decoration',
        count: 0,
        keywords: ['furniture', 'chair', 'table'],
      },
      {
        id: 'art',
        name: 'Art',
        parentId: 'decoration',
        count: 0,
        keywords: ['art', 'painting', 'mural'],
      },
      {
        id: 'monuments',
        name: 'Monuments',
        parentId: 'decoration',
        count: 0,
        keywords: ['monument', 'memorial', 'landmark'],
      },
    ],
    count: 0,
    keywords: ['decoration', 'aesthetic', 'ornamental', 'decorative'],
  },
  vehicles: {
    id: 'vehicles',
    name: 'Vehicles & Transport',
    subcategories: [
      {
        id: 'trains',
        name: 'Trains',
        parentId: 'vehicles',
        count: 0,
        keywords: ['train', 'locomotive', 'railway'],
      },
      {
        id: 'cars',
        name: 'Cars',
        parentId: 'vehicles',
        count: 0,
        keywords: ['car', 'automobile', 'vehicle'],
      },
      {
        id: 'planes',
        name: 'Planes',
        parentId: 'vehicles',
        count: 0,
        keywords: ['plane', 'aircraft', 'airplane'],
      },
      {
        id: 'ships',
        name: 'Ships',
        parentId: 'vehicles',
        count: 0,
        keywords: ['ship', 'boat', 'vessel'],
      },
      {
        id: 'spacecraft',
        name: 'Spacecraft',
        parentId: 'vehicles',
        count: 0,
        keywords: ['spacecraft', 'spaceship', 'rocket'],
      },
      {
        id: 'railways',
        name: 'Railways',
        parentId: 'vehicles',
        count: 0,
        keywords: ['railway', 'track', 'rail'],
      },
      {
        id: 'stations',
        name: 'Stations',
        parentId: 'vehicles',
        count: 0,
        keywords: ['station', 'terminal', 'depot'],
      },
      {
        id: 'bridges',
        name: 'Bridges',
        parentId: 'vehicles',
        count: 0,
        keywords: ['bridge', 'crossing', 'viaduct'],
      },
    ],
    count: 0,
    keywords: ['vehicle', 'transport', 'transportation'],
  },
  landscapes: {
    id: 'landscapes',
    name: 'Landscapes & Terrain',
    subcategories: [
      {
        id: 'mountains',
        name: 'Mountains',
        parentId: 'landscapes',
        count: 0,
        keywords: ['mountain', 'peak', 'hill'],
      },
      {
        id: 'valleys',
        name: 'Valleys',
        parentId: 'landscapes',
        count: 0,
        keywords: ['valley', 'canyon', 'gorge'],
      },
      {
        id: 'caves',
        name: 'Caves',
        parentId: 'landscapes',
        count: 0,
        keywords: ['cave', 'cavern', 'underground'],
      },
      {
        id: 'custom-trees',
        name: 'Custom Trees',
        parentId: 'landscapes',
        count: 0,
        keywords: ['tree', 'forest', 'woods'],
      },
      {
        id: 'terraforming',
        name: 'Terraforming',
        parentId: 'landscapes',
        count: 0,
        keywords: ['terraforming', 'terrain', 'landscaping'],
      },
      {
        id: 'islands',
        name: 'Islands',
        parentId: 'landscapes',
        count: 0,
        keywords: ['island', 'archipelago', 'atoll'],
      },
      {
        id: 'floating-islands',
        name: 'Floating Islands',
        parentId: 'landscapes',
        count: 0,
        keywords: ['floating', 'sky', 'airborne'],
      },
    ],
    count: 0,
    keywords: ['landscape', 'terrain', 'environment', 'nature'],
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy & Fiction',
    subcategories: [
      {
        id: 'magic-builds',
        name: 'Magic Builds',
        parentId: 'fantasy',
        count: 0,
        keywords: ['magic', 'magical', 'wizard'],
      },
      {
        id: 'dragons',
        name: 'Dragons',
        parentId: 'fantasy',
        count: 0,
        keywords: ['dragon', 'drake', 'wyvern'],
      },
      {
        id: 'dungeons',
        name: 'Dungeons',
        parentId: 'fantasy',
        count: 0,
        keywords: ['dungeon', 'crypt', 'catacomb'],
      },
      {
        id: 'portals',
        name: 'Portals',
        parentId: 'fantasy',
        count: 0,
        keywords: ['portal', 'gateway', 'dimension'],
      },
      {
        id: 'mythical',
        name: 'Mythical',
        parentId: 'fantasy',
        count: 0,
        keywords: ['mythical', 'legendary', 'folklore'],
      },
      {
        id: 'steampunk',
        name: 'Steampunk',
        parentId: 'fantasy',
        count: 0,
        keywords: ['steampunk', 'steam', 'victorian'],
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        parentId: 'fantasy',
        count: 0,
        keywords: ['cyberpunk', 'futuristic', 'sci-fi'],
      },
      {
        id: 'medieval',
        name: 'Medieval',
        parentId: 'fantasy',
        count: 0,
        keywords: ['medieval', 'middle ages', 'historic'],
      },
    ],
    count: 0,
    keywords: ['fantasy', 'fiction', 'imaginative', 'creative'],
  },
};

// Filter presets
export const schematicFilterPresets: SchematicFilterPreset[] = [
  {
    id: 'small-builds',
    name: 'Small Builds',
    icon: '📦',
    description: 'Perfect for survival mode',
    filters: {
      dimensions: {
        width: {},
        height: {},
        depth: {},
        blockCount: { max: 5000 },
      },
      complexity: {
        levels: ['simple', 'moderate'] as ComplexityLevel[],
        buildTime: {},
      },
    },
  },
  {
    id: 'create-contraptions',
    name: 'Create Mod',
    icon: '⚙️',
    description: 'Mechanical marvels',
    filters: {
      categories: ['machines'],
      compatibility: {
        minecraftVersions: [],
        createVersions: [],
        requiredMods: ['create'],
        allowRedstone: true,
        allowCommandBlocks: true,
      },
    },
  },
  {
    id: 'mega-builds',
    name: 'Mega Builds',
    icon: '🏙️',
    description: 'Massive structures',
    filters: {
      dimensions: {
        width: {},
        height: {},
        depth: {},
        blockCount: { min: 50000 },
      },
      complexity: {
        levels: ['complex', 'extreme'] as ComplexityLevel[],
        buildTime: {},
      },
    },
  },
  {
    id: 'vanilla-friendly',
    name: 'Vanilla Friendly',
    icon: '🌿',
    description: 'No mods required',
    filters: {
      materials: {
        primary: [],
        exclude: [],
        includeModded: false,
      },
      compatibility: {
        minecraftVersions: [],
        createVersions: [],
        requiredMods: [],
        allowRedstone: true,
        allowCommandBlocks: false,
      },
    },
  },
  {
    id: 'redstone',
    name: 'Redstone Builds',
    icon: '🔴',
    description: 'Redstone contraptions',
    filters: {
      categories: ['machines'],
      subcategories: ['redstone'],
      compatibility: {
        minecraftVersions: [],
        createVersions: [],
        requiredMods: [],
        allowRedstone: true,
        allowCommandBlocks: true,
      },
    },
  },
  {
    id: 'featured',
    name: 'Featured',
    icon: '⭐',
    description: 'Staff picks',
    filters: {
      meta: {
        authors: [],
        minRating: 0,
        minDownloads: 0,
        featured: true,
      },
    },
  },
];
