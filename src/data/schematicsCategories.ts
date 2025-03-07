export const SCHEMATIC_CATEGORIES = [
  {
    category: 'All',
    subcategories: ['All'],
  },
  {
    category: 'Buildings',
    subcategories: [
      'Houses',
      'Castles',
      'Towers',
      'Modern Buildings',
      'Medieval Buildings',
      'Temples',
      'Ruins',
      'Others',
    ],
  },
  {
    category: 'Landscapes',
    subcategories: [
      'Gardens',
      'Parks',
      'Mountains',
      'Forests',
      'Deserts',
      'Caves',
      'Islands',
      'Others',
    ],
  },
  {
    category: 'Technical Structures',
    subcategories: [
      'Automatic Farms',
      'Redstone Systems',
      'Generators',
      'Factories',
      'Mob Traps',
      'Transportation Systems',
      'Others',
    ],
  },
  {
    category: 'Decoration',
    subcategories: [
      'Furniture',
      'Lighting',
      'Street Details',
      'Statues',
      'Planters',
      'Interiors',
      'Others',
    ],
  },
  {
    category: 'Infrastructure',
    subcategories: ['Bridges', 'Roads', 'Harbors', 'Airports', 'Railways', 'Tunnels', 'Others'],
  },
  {
    category: 'Fantasy & Themes',
    subcategories: [
      'Futuristic',
      'Steampunk',
      'Medieval Fantasy',
      'Post-apocalyptic',
      'Halloween',
      'Christmas',
      'Others',
    ],
  },
  {
    category: 'Monuments & Replicas',
    subcategories: [
      'Historical Monuments',
      'Real Building Replicas',
      'Landmarks',
      'Giant Statues',
      'Others',
    ],
  },
  {
    category: 'Cities & Villages',
    subcategories: ['Medieval Villages', 'Modern Cities', 'Ancient Cities', 'Base Camps', 'Others'],
  },
  {
    category: 'Factories',
    subcategories: [
      'Item Factories',
      'Food Production',
      'Ore Processing',
      'Wood Processing',
      'Villager Trading Halls',
      'Mob Farming Facilities',
      'Others',
    ],
  },
  {
    category: 'Automation Systems',
    subcategories: [
      'Redstone Machines',
      'Sorting Systems',
      'Automatic Storage',
      'Crafting Systems',
      'Furnace Arrays',
      'Automation with Create Mod',
      'Others',
    ],
  },
  {
    category: 'Energy & Power',
    subcategories: [
      'Redstone Power Plants',
      'Waterwheel Systems',
      'Windmill Designs',
      'Lava-based Generators',
      'Renewable Energy Farms',
      'Battery & Power Storage',
      'Others',
    ],
  },
  {
    category: 'Resource Farms',
    subcategories: [
      'Iron Farms',
      'Gold Farms',
      'Crop Farms',
      'Animal Farms',
      'Mob Farms',
      'XP Farms',
      'Others',
    ],
  },
  {
    category: 'Transportation & Logistics',
    subcategories: [
      'Minecart Systems',
      'Boat Transport Systems',
      'Elytra Launchers',
      'Item Transport Pipes',
      'Elevators',
      'Conveyor Belts (Create Mod)',
      'Others',
    ],
  },
  {
    category: 'Processing Plants',
    subcategories: [
      'Smelting Facilities',
      'Brewing Stations',
      'Enchanting Stations',
      'Recycling & Disposal Units',
      'Composting Systems',
      'Others',
    ],
  },
  {
    category: 'Industrial Decorations',
    subcategories: [
      'Pipes & Conduits',
      'Control Rooms',
      'Factory Interiors',
      'Production Lines',
      'Machinery Details',
      'Others',
    ],
  },
  {
    category: 'Utility Structures',
    subcategories: [
      'Storage Warehouses',
      'Maintenance Rooms',
      'Control Panels',
      'Monitoring Stations',
      'Backup Power Rooms',
      'Others',
    ],
  },
] as const;

export type SchematicCategory = (typeof SCHEMATIC_CATEGORIES)[number]['category'];
export type SchematicSubcategory = (typeof SCHEMATIC_CATEGORIES)[number]['subcategories'][number];
