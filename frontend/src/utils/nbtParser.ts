export interface BlockData {
  id: string;
  name: string;
  displayName: string;
  namespace: string;
  mod: string;
  count: number;
  isVanilla: boolean;
  isRedstone: boolean;
  isCommand: boolean;
}

export interface MaterialData {
  name: string;
  displayName: string;
  count: number;
  percentage: number;
}

export interface ModStats {
  name: string;
  blockTypes: number;
  totalBlocks: number;
}

export interface MostUsedBlock {
  name: string;
  count: number;
  percentage: number;
  mod: string;
}

interface NBTCompound {
  [key: string]: NBTValue;
}

type NBTValue = number | string | boolean | Uint8Array | number[] | NBTCompound | NBTValue[];

export interface SchematicMetadata {
  dimensions: {
    width: number;
    height: number;
    depth: number;
    blockCount: number;
  };
  blocks: BlockData[];
  blockStats?: {
    total: number;
    vanilla: number;
    modded: number;
    redstone: number;
    command: number;
  };
  materials: {
    primary: MaterialData[] | string[];
    hasModded: boolean;
    mostUsed?: MostUsedBlock[];
  };
  requirements: {
    mods: ModStats[] | string[];
    hasRedstone: boolean;
    hasCommandBlocks: boolean;
    minecraftVersion?: string;
  };
  complexity: {
    level: 'simple' | 'moderate' | 'complex' | 'extreme';
    estimatedBuildTime: number;
  };
  summary?: {
    title: string;
    description: string;
    tags: string[];
  };
}

const VANILLA_NAMESPACE = 'minecraft';

const MOD_MAPPING: Record<string, string> = {
  create: 'Create Mod',
  supplementaries: 'Supplementaries',
  quark: 'Quark',
  decorative_blocks: 'Decorative Blocks',
  immersive_engineering: 'Immersive Engineering',
  botania: 'Botania',
  thermal: 'Thermal Series',
  mekanism: 'Mekanism',
  applied_energistics: 'Applied Energistics 2',
  ae2: 'Applied Energistics 2',
  chisel: 'Chisel',
  twilightforest: 'Twilight Forest',
  biomesoplenty: 'Biomes O Plenty',
  tconstruct: 'Tinkers Construct',
  architects_palette: "Architect's Palette",
  createaddition: 'Create Crafts & Additions',
  createdeco: 'Create Deco',
  createbigcannons: 'Create Big Cannons',
  dustrial_decor: 'Dustrial Decor',
  adorn: 'Adorn',
  another_furniture: 'Another Furniture',
  mcwbridges: "Macaw's Bridges",
  mcwdoors: "Macaw's Doors",
  mcwfences: "Macaw's Fences",
  mcwlights: "Macaw's Lights",
  mcwpaths: "Macaw's Paths",
  mcwroofs: "Macaw's Roofs",
  mcwtrpdoors: "Macaw's Trapdoors",
  mcwwindows: "Macaw's Windows",
};

const REDSTONE_BLOCKS = [
  'redstone_wire',
  'redstone_torch',
  'redstone_block',
  'repeater',
  'comparator',
  'piston',
  'sticky_piston',
  'observer',
  'hopper',
  'dropper',
  'dispenser',
  'redstone_lamp',
  'tnt',
  'powered_rail',
  'detector_rail',
  'activator_rail',
  'daylight_detector',
  'tripwire_hook',
  'trapped_chest',
  'note_block',
  'target',
  'sculk_sensor',
  'calibrated_sculk_sensor',
];

const PRIMARY_MATERIALS = [
  'stone',
  'cobblestone',
  'wood',
  'oak',
  'spruce',
  'birch',
  'jungle',
  'acacia',
  'dark_oak',
  'mangrove',
  'cherry',
  'bamboo',
  'crimson',
  'warped',
  'brick',
  'iron',
  'gold',
  'diamond',
  'netherite',
  'copper',
  'quartz',
  'glass',
  'wool',
  'concrete',
  'terracotta',
  'andesite',
  'granite',
  'diorite',
  'deepslate',
  'blackstone',
  'basalt',
  'calcite',
  'tuff',
  'dripstone',
];

// Simple NBT parser for browser
class NBTReader {
  private data: DataView;
  private offset: number = 0;

  constructor(buffer: ArrayBuffer) {
    this.data = new DataView(buffer);
  }

  private readByte(): number {
    return this.data.getInt8(this.offset++);
  }

  private readShort(): number {
    const value = this.data.getInt16(this.offset, false);
    this.offset += 2;
    return value;
  }

  private readInt(): number {
    const value = this.data.getInt32(this.offset, false);
    this.offset += 4;
    return value;
  }

  private readString(): string {
    const length = this.readShort();
    const bytes = new Uint8Array(this.data.buffer, this.offset, length);
    this.offset += length;
    return new TextDecoder().decode(bytes);
  }

  private skipBytes(count: number): void {
    this.offset += count;
  }

  private readCompound(): NBTCompound {
    const compound: NBTCompound = {};

    while (this.offset < this.data.byteLength) {
      const tagType = this.readByte();
      if (tagType === 0) break; // TAG_End

      const name = this.readString();
      const value = this.readTag(tagType);
      compound[name] = value;
    }

    return compound;
  }

  private readTag(type: number): NBTValue {
    switch (type) {
      case 1: // TAG_Byte
        return this.readByte();
      case 2: // TAG_Short
        return this.readShort();
      case 3: // TAG_Int
        return this.readInt();
      case 4: // TAG_Long
        this.skipBytes(8);
        return 0;
      case 5: {
        // TAG_Float
        const floatVal = this.data.getFloat32(this.offset, false);
        this.offset += 4;
        return floatVal;
      }
      case 6: {
        // TAG_Double
        const doubleVal = this.data.getFloat64(this.offset, false);
        this.offset += 8;
        return doubleVal;
      }
      case 7: {
        // TAG_Byte_Array
        const byteLength = this.readInt();
        const bytes = new Uint8Array(this.data.buffer, this.offset, byteLength);
        this.offset += byteLength;
        return bytes;
      }
      case 8: // TAG_String
        return this.readString();
      case 9: {
        // TAG_List
        const listType = this.readByte();
        const listLength = this.readInt();
        const list = [];
        for (let i = 0; i < listLength; i++) {
          list.push(this.readTag(listType));
        }
        return list;
      }
      case 10: // TAG_Compound
        return this.readCompound();
      case 11: {
        // TAG_Int_Array
        const intLength = this.readInt();
        const ints = [];
        for (let i = 0; i < intLength; i++) {
          ints.push(this.readInt());
        }
        return ints;
      }
      case 12: {
        // TAG_Long_Array
        const longLength = this.readInt();
        this.skipBytes(longLength * 8);
        return [];
      }
      default:
        throw new Error(`Unknown tag type: ${type}`);
    }
  }

  parse(): NBTCompound {
    // Check for GZIP header
    if (this.data.getUint8(0) === 0x1f && this.data.getUint8(1) === 0x8b) {
      throw new Error('GZIP compressed NBT files need to be decompressed first');
    }

    // Read root tag
    const rootType = this.readByte();
    if (rootType !== 10) {
      throw new Error('Invalid NBT file: root tag must be TAG_Compound');
    }

    this.readString(); // Root name (usually empty)
    return this.readCompound();
  }
}

async function decompressGzip(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  // Use browser's native decompression API if available
  if ('DecompressionStream' in window) {
    const ds = new DecompressionStream('gzip');
    const decompressedStream = new Response(buffer).body!.pipeThrough(ds);
    return await new Response(decompressedStream).arrayBuffer();
  }

  // If browser doesn't support DecompressionStream, throw error
  throw new Error(
    'Cannot decompress GZIP file in browser. The server-side parser will handle compressed files.'
  );
}

export async function parseNBTFile(file: File): Promise<SchematicMetadata | null> {
  try {
    let arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Check if file is GZIP compressed
    if (uint8Array[0] === 0x1f && uint8Array[1] === 0x8b) {
      try {
        arrayBuffer = await decompressGzip(arrayBuffer);
      } catch (error) {
        console.warn(
          'Cannot decompress GZIP file in browser. Server-side parsing recommended:',
          error
        );
        // Return basic fallback metadata for compressed files
        return createFallbackMetadata();
      }
    }

    // Parse NBT
    const reader = new NBTReader(arrayBuffer);
    const nbtData = reader.parse();

    // Extract dimensions
    const dimensions = {
      width: Number(nbtData.Width || nbtData.width || 0),
      height: Number(nbtData.Height || nbtData.height || 0),
      depth: Number(nbtData.Length || nbtData.length || 0),
      blockCount: 0,
    };

    const blockMap = new Map<string, BlockData>();
    const modSet = new Set<string>();
    let hasRedstone = false;
    let hasCommandBlocks = false;

    // Try to parse palette-based format (Sponge Schematic v2/v3)
    if (nbtData.Palette || nbtData.palette) {
      const palette = nbtData.Palette || nbtData.palette;
      const blockData = nbtData.BlockData || nbtData.blockData || [];

      // Parse palette
      const paletteArray: string[] = [];
      if (typeof palette === 'object') {
        Object.entries(palette).forEach(([blockId, index]) => {
          paletteArray[index as number] = blockId;
        });
      }

      // Count blocks
      if (Array.isArray(blockData)) {
        for (const blockIndex of blockData) {
          const idx = typeof blockIndex === 'number' ? blockIndex : 0;
          const blockId = paletteArray[idx] || `block_${idx}`;
          if (blockId && blockId !== 'minecraft:air' && blockId !== 'air') {
            const [namespace, blockName] = blockId.includes(':')
              ? blockId.split(':')
              : ['minecraft', blockId];

            const cleanBlockName = blockName.replace(/\[.*\]/, '');
            const key = `${namespace}:${cleanBlockName}`;

            if (!blockMap.has(key)) {
              const isVanilla = namespace === VANILLA_NAMESPACE;
              const mod = isVanilla ? 'Vanilla' : MOD_MAPPING[namespace] || namespace;
              blockMap.set(key, {
                id: key,
                name: cleanBlockName,
                displayName: cleanBlockName
                  .split('_')
                  .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(' '),
                namespace,
                mod,
                count: 0,
                isVanilla,
                isRedstone: REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs)),
                isCommand: cleanBlockName.includes('command_block'),
              });
            }

            const block = blockMap.get(key)!;
            block.count++;

            if (namespace !== VANILLA_NAMESPACE) {
              modSet.add(block.mod || namespace);
            }

            if (REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs))) {
              hasRedstone = true;
            }

            if (cleanBlockName.includes('command_block')) {
              hasCommandBlocks = true;
            }
          }
        }
      }
    }
    // Try legacy format with Blocks array
    else if (nbtData.Blocks) {
      const blocks = nbtData.Blocks;

      // Simple block counting for legacy format
      const blockCounts: Record<number, number> = {};
      if (Array.isArray(blocks)) {
        for (const blockId of blocks) {
          if (typeof blockId === 'number' && blockId > 0) {
            blockCounts[blockId] = (blockCounts[blockId] || 0) + 1;
          }
        }
      }

      // Convert to block data
      Object.entries(blockCounts).forEach(([blockId, count]) => {
        const id = parseInt(blockId);
        const blockName = `block_${id}`;

        blockMap.set(`minecraft:${blockName}`, {
          id: `minecraft:${blockName}`,
          name: blockName,
          displayName: blockName
            .split('_')
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' '),
          namespace: 'minecraft',
          mod: 'Vanilla',
          count: count as number,
          isVanilla: true,
          isRedstone: [55, 75, 76, 93, 94, 149, 150].includes(id),
          isCommand: [137, 210, 211].includes(id),
        });

        // Check for common block IDs
        if ([55, 75, 76, 93, 94, 149, 150].includes(id)) {
          hasRedstone = true;
        }
      });
    }

    const blocks = Array.from(blockMap.values()).sort((a, b) => b.count - a.count);
    dimensions.blockCount = blocks.reduce((sum, block) => sum + block.count, 0);

    // If no blocks were found but dimensions exist, don't estimate - keep count at 0
    // We can't know how many non-air blocks there are without palette data
    if (
      blocks.length === 0 &&
      dimensions.width > 0 &&
      dimensions.height > 0 &&
      dimensions.depth > 0
    ) {
      console.warn('No block data found in NBT file - unable to determine non-air block count');
      // Keep blockCount at 0 since we don't know the actual non-air count
      dimensions.blockCount = 0;
    }

    // Identify primary materials
    const primaryMaterials = blocks
      .filter((block) => PRIMARY_MATERIALS.some((mat) => block.name.toLowerCase().includes(mat)))
      .slice(0, 5)
      .map((block) => block.name);

    // Calculate complexity
    const complexityLevel = calculateComplexity(
      dimensions,
      blocks.length,
      hasRedstone,
      modSet.size
    );
    const estimatedBuildTime = estimateBuildTime(dimensions.blockCount, complexityLevel);

    return {
      dimensions,
      blocks,
      materials: {
        primary: primaryMaterials,
        hasModded: modSet.size > 0,
      },
      requirements: {
        mods: Array.from(modSet),
        hasRedstone,
        hasCommandBlocks,
      },
      complexity: {
        level: complexityLevel,
        estimatedBuildTime,
      },
    };
  } catch (error) {
    console.error('Error parsing NBT file:', error);
    return createFallbackMetadata();
  }
}

function createFallbackMetadata(): SchematicMetadata {
  return {
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      blockCount: 0,
    },
    blocks: [],
    materials: {
      primary: [],
      hasModded: false,
    },
    requirements: {
      mods: [],
      hasRedstone: false,
      hasCommandBlocks: false,
    },
    complexity: {
      level: 'simple',
      estimatedBuildTime: 0,
    },
  };
}

function calculateComplexity(
  dimensions: { width: number; height: number; depth: number; blockCount: number },
  uniqueBlockTypes: number,
  hasRedstone: boolean,
  modCount: number
): 'simple' | 'moderate' | 'complex' | 'extreme' {
  let score = 0;

  // Size complexity
  const volume = dimensions.width * dimensions.height * dimensions.depth;
  if (volume > 50000) score += 3;
  else if (volume > 10000) score += 2;
  else if (volume > 1000) score += 1;

  // Block variety complexity
  if (uniqueBlockTypes > 100) score += 3;
  else if (uniqueBlockTypes > 50) score += 2;
  else if (uniqueBlockTypes > 20) score += 1;

  // Redstone complexity
  if (hasRedstone) score += 2;

  // Mod complexity
  if (modCount > 5) score += 3;
  else if (modCount > 2) score += 2;
  else if (modCount > 0) score += 1;

  // Height complexity
  if (dimensions.height > 100) score += 2;
  else if (dimensions.height > 50) score += 1;

  // Determine final complexity level
  if (score >= 8) return 'extreme';
  if (score >= 5) return 'complex';
  if (score >= 3) return 'moderate';
  return 'simple';
}

function estimateBuildTime(blockCount: number, complexity: string): number {
  // Estimate seconds per block based on complexity
  const baseTimePerBlock = {
    simple: 2,
    moderate: 3,
    complex: 5,
    extreme: 8,
  };

  const secondsPerBlock = baseTimePerBlock[complexity as keyof typeof baseTimePerBlock] || 3;
  const totalSeconds = blockCount * secondsPerBlock;

  // Convert to minutes
  return Math.ceil(totalSeconds / 60);
}
