const { parse } = require("prismarine-nbt");
const { Schematic } = require("prismarine-schematic");

const VANILLA_NAMESPACE = "minecraft";

const MOD_MAPPING = {
  // Create Ecosystem
  create: "Create",
  createaddition: "Create Crafts & Additions",
  createdeco: "Create Deco",
  createbigcannons: "Create Big Cannons",
  create_enchantment_industry: "Create Enchantment Industry",
  create_steam_n_rails: "Create Steam 'n Rails",
  create_slice_and_dice: "Create Slice & Dice",

  // Tech Mods
  immersive_engineering: "Immersive Engineering",
  mekanism: "Mekanism",
  thermal: "Thermal Series",
  applied_energistics: "Applied Energistics 2",
  ae2: "Applied Energistics 2",
  industrialforegoing: "Industrial Foregoing",
  pneumaticcraft: "PneumaticCraft",

  // Building & Decoration
  supplementaries: "Supplementaries",
  decorative_blocks: "Decorative Blocks",
  chisel: "Chisel",
  architects_palette: "Architect's Palette",
  dustrial_decor: "Dustrial Decor",
  adorn: "Adorn",
  another_furniture: "Another Furniture",
  farmer_delights: "Farmer's Delight",

  // Macaw's Building Mods
  mcwbridges: "Macaw's Bridges",
  mcwdoors: "Macaw's Doors",
  mcwfences: "Macaw's Fences",
  mcwlights: "Macaw's Lights",
  mcwpaths: "Macaw's Paths",
  mcwroofs: "Macaw's Roofs",
  mcwtrpdoors: "Macaw's Trapdoors",
  mcwwindows: "Macaw's Windows",

  // Content Mods
  quark: "Quark",
  botania: "Botania",
  tconstruct: "Tinkers' Construct",
  twilightforest: "Twilight Forest",
  biomesoplenty: "Biomes O' Plenty",
  alexsmobs: "Alex's Mobs",

  // Storage & Transport
  sophisticatedstorage: "Sophisticated Storage",
  sophisticatedbackpacks: "Sophisticated Backpacks",
  itemfilters: "Item Filters",
  storagedrawers: "Storage Drawers",

  // Utility
  jei: "Just Enough Items",
  rei: "Roughly Enough Items",
  waystones: "Waystones",
  journeymap: "JourneyMap",

  // Performance & Library
  curios: "Curios API",
  patchouli: "Patchouli",
  placebo: "Placebo",
};

const REDSTONE_BLOCKS = [
  "redstone_wire",
  "redstone_torch",
  "redstone_block",
  "repeater",
  "comparator",
  "piston",
  "sticky_piston",
  "observer",
  "hopper",
  "dropper",
  "dispenser",
  "redstone_lamp",
  "tnt",
  "powered_rail",
  "detector_rail",
  "activator_rail",
  "daylight_detector",
  "tripwire_hook",
  "trapped_chest",
  "note_block",
  "target",
  "sculk_sensor",
  "calibrated_sculk_sensor",
];

const PRIMARY_MATERIALS = [
  "stone",
  "cobblestone",
  "wood",
  "oak",
  "spruce",
  "birch",
  "jungle",
  "acacia",
  "dark_oak",
  "mangrove",
  "cherry",
  "bamboo",
  "crimson",
  "warped",
  "brick",
  "iron",
  "gold",
  "diamond",
  "netherite",
  "copper",
  "quartz",
  "glass",
  "wool",
  "concrete",
  "terracotta",
  "andesite",
  "granite",
  "diorite",
  "deepslate",
  "blackstone",
  "basalt",
  "calcite",
  "tuff",
  "dripstone",
];

function calculateComplexity(
  dimensions,
  uniqueBlockTypes,
  hasRedstone,
  modCount,
) {
  let score = 0;

  const volume = dimensions.width * dimensions.height * dimensions.depth;
  if (volume > 50000) score += 3;
  else if (volume > 10000) score += 2;
  else if (volume > 1000) score += 1;

  if (uniqueBlockTypes > 100) score += 3;
  else if (uniqueBlockTypes > 50) score += 2;
  else if (uniqueBlockTypes > 20) score += 1;

  if (hasRedstone) score += 2;

  if (modCount > 5) score += 3;
  else if (modCount > 2) score += 2;
  else if (modCount > 0) score += 1;

  if (dimensions.height > 100) score += 2;
  else if (dimensions.height > 50) score += 1;

  if (score >= 8) return "extreme";
  if (score >= 5) return "complex";
  if (score >= 3) return "moderate";
  return "simple";
}

function estimateBuildTime(blockCount, complexity) {
  const baseTimePerBlock = {
    simple: 2,
    moderate: 3,
    complex: 5,
    extreme: 8,
  };

  const secondsPerBlock = baseTimePerBlock[complexity] || 3;
  const totalSeconds = blockCount * secondsPerBlock;

  return Math.ceil(totalSeconds / 60);
}

async function parseNBTData(buffer) {
  try {
    // First try to parse as NBT
    const { parsed, type } = await parse(buffer);
    console.log("NBT parsed successfully, type:", type);
    console.log("Parsed structure keys:", Object.keys(parsed.value || parsed));

    // Log the raw structure to understand the format better
    const rawData = parsed.value || parsed;
    console.log("NBT structure keys:", Object.keys(rawData));

    if (rawData.palette) {
      console.log("Found palette, length:", rawData.palette.value.value.length);
      console.log(
        "First 3 palette entries:",
        rawData.palette.value.value
          .slice(0, 3)
          .map((entry) => entry.Name?.value),
      );
    }
    if (rawData.blocks) {
      console.log(
        "Found blocks array, length:",
        rawData.blocks.value.value.length,
      );
      console.log(
        "First 10 block entries:",
        rawData.blocks.value.value.slice(0, 10),
      );
    }
    if (rawData.size) {
      console.log("Schematic size:", rawData.size.value.value);
    }

    let schematic;
    try {
      // Try to read as schematic format
      schematic = await Schematic.read(buffer);
      console.log("Successfully read as Schematic format");
    } catch (e) {
      console.log("Schematic.read failed, using raw parsed data:", e.message);
      schematic = parsed.value || parsed;
    }

    // Extract dimensions from various schematic formats
    let width = 0,
      height = 0,
      depth = 0;

    // Try different dimension sources
    if (schematic.Width || schematic.width) {
      width = schematic.Width || schematic.width;
      height = schematic.Height || schematic.height;
      depth = schematic.Length || schematic.length;
    } else if (schematic.size) {
      // Handle NBT size array format
      if (schematic.size.value && Array.isArray(schematic.size.value.value)) {
        const sizeArray = schematic.size.value.value;
        width = sizeArray[0] || 0;
        height = sizeArray[1] || 0;
        depth = sizeArray[2] || 0;
      } else if (Array.isArray(schematic.size)) {
        width = schematic.size[0] || 0;
        height = schematic.size[1] || 0;
        depth = schematic.size[2] || 0;
      }
    } else if (schematic.DataVersion) {
      // Try to calculate from palette and block data if dimensions not explicit
      width = Math.cbrt(schematic.BlockData?.length || 0);
      height = width;
      depth = width;
    }

    const dimensions = {
      width: width,
      height: height,
      depth: depth,
      blockCount: 0,
    };

    console.log(
      `Extracted dimensions: ${width} x ${height} x ${depth} (Volume: ${width * height * depth})`,
    );

    const blockMap = new Map();
    const modSet = new Set();
    let hasRedstone = false;
    let hasCommandBlocks = false;

    // Handle different schematic formats

    // Format 1: Sponge Schematic Format with Palette and BlockData
    if (
      (schematic.Palette || schematic.palette) &&
      (schematic.BlockData || schematic.blockData)
    ) {
      console.log("Processing Sponge Schematic format with palette");
      const palette = schematic.Palette || schematic.palette;
      const blockData = schematic.BlockData || schematic.blockData;

      // Create palette lookup - handle different palette formats
      const paletteArray = [];

      // Handle NBT parsed palette (array of compound objects with Name.value structure)
      if (Array.isArray(palette) && palette.length > 0 && palette[0].Name) {
        console.log("Processing NBT compound palette format");
        palette.forEach((entry, index) => {
          if (entry.Name && entry.Name.value) {
            paletteArray[index] = entry.Name.value;
          }
        });
      }
      // Handle Map format
      else if (palette instanceof Map) {
        palette.forEach((index, blockId) => {
          paletteArray[index] = blockId;
        });
      }
      // Handle simple object format
      else if (typeof palette === "object" && !Array.isArray(palette)) {
        Object.entries(palette).forEach(([blockId, index]) => {
          paletteArray[index] = blockId;
        });
      }
      // Handle array format with direct values
      else if (Array.isArray(palette)) {
        palette.forEach((blockId, index) => {
          paletteArray[index] = blockId;
        });
      }

      console.log(`Palette contains ${paletteArray.length} block types`);
      console.log(`Sample palette entries:`, paletteArray.slice(0, 5));

      console.log(
        `BlockData type: ${typeof blockData}, is array: ${Array.isArray(blockData)}`,
      );
      if (blockData && blockData.length) {
        console.log(`BlockData length: ${blockData.length}`);

        // Process block placement data
        let processedBlocks = 0;
        for (let i = 0; i < blockData.length; i++) {
          let blockIndex;

          // Handle different data formats
          if (Array.isArray(blockData)) {
            blockIndex = blockData[i];
          } else if (blockData[i] !== undefined) {
            blockIndex = blockData[i];
          } else {
            continue;
          }

          // Get block ID from palette
          const blockId = paletteArray[blockIndex];

          if (blockId && blockId !== "minecraft:air" && blockId !== "air") {
            processedBlocks++;
            const [namespace, blockName] = blockId.includes(":")
              ? blockId.split(":")
              : ["minecraft", blockId];

            const cleanBlockName = blockName.replace(/\[.*\]/, "");
            const key = `${namespace}:${cleanBlockName}`;

            if (!blockMap.has(key)) {
              const modName =
                namespace !== VANILLA_NAMESPACE
                  ? MOD_MAPPING[namespace] || namespace
                  : "Minecraft";
              blockMap.set(key, {
                id: key,
                name: cleanBlockName,
                displayName: cleanBlockName
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                namespace,
                mod: modName,
                count: 0,
                isVanilla: namespace === VANILLA_NAMESPACE,
                isRedstone: REDSTONE_BLOCKS.some((rs) =>
                  cleanBlockName.includes(rs),
                ),
                isCommand: cleanBlockName.includes("command_block"),
              });
            }

            const blockDataEntry = blockMap.get(key);
            blockDataEntry.count++;

            if (namespace !== VANILLA_NAMESPACE) {
              modSet.add(blockDataEntry.mod);
            }

            if (REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs))) {
              hasRedstone = true;
            }

            if (cleanBlockName.includes("command_block")) {
              hasCommandBlocks = true;
            }
          }
        }
        console.log(
          `Processed ${processedBlocks} non-air blocks from ${blockData.length} total positions`,
        );
      } else {
        console.log("BlockData is not an array, trying to convert...");
        // Handle case where BlockData might be a buffer or other format
        if (blockData.length) {
          for (let i = 0; i < blockData.length; i++) {
            const blockIndex = blockData[i];
            if (typeof blockIndex === "number") {
              const blockId = paletteArray[blockIndex];
              if (blockId && blockId !== "minecraft:air" && blockId !== "air") {
                const [namespace, blockName] = blockId.includes(":")
                  ? blockId.split(":")
                  : ["minecraft", blockId];

                const cleanBlockName = blockName.replace(/\[.*\]/, "");
                const key = `${namespace}:${cleanBlockName}`;

                if (!blockMap.has(key)) {
                  blockMap.set(key, {
                    name: cleanBlockName,
                    namespace,
                    count: 0,
                    mod:
                      namespace !== VANILLA_NAMESPACE
                        ? MOD_MAPPING[namespace] || namespace
                        : undefined,
                  });
                }

                blockMap.get(key).count++;

                if (namespace !== VANILLA_NAMESPACE) {
                  modSet.add(MOD_MAPPING[namespace] || namespace);
                }

                if (REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs))) {
                  hasRedstone = true;
                }

                if (cleanBlockName.includes("command_block")) {
                  hasCommandBlocks = true;
                }
              }
            }
          }
        }
      }
    }
    // Format 1b: Raw NBT format with palette and blocks arrays
    else if (schematic.palette && schematic.blocks) {
      console.log("Processing raw NBT format with palette and blocks arrays");
      const palette = schematic.palette;
      const blocks = schematic.blocks;

      // Create palette lookup from NBT format
      const paletteArray = [];

      // Handle NBT palette format (array of compound objects)
      if (palette.value && Array.isArray(palette.value.value)) {
        console.log("Processing NBT palette.value.value format");
        palette.value.value.forEach((entry, index) => {
          if (entry.Name && entry.Name.value) {
            paletteArray[index] = entry.Name.value;
          }
        });
      }

      console.log(`NBT Palette contains ${paletteArray.length} block types`);
      console.log(`Sample palette entries:`, paletteArray.slice(0, 5));

      // Process blocks array
      if (blocks.value && Array.isArray(blocks.value.value)) {
        console.log(
          `Processing NBT blocks array with ${blocks.value.value.length} entries`,
        );

        let processedBlocks = 0;
        blocks.value.value.forEach((block) => {
          // Each block should have a 'state' property indicating the palette index
          if (block.state !== undefined) {
            const blockIndex = block.state.value;
            const blockId = paletteArray[blockIndex];

            if (blockId && blockId !== "minecraft:air" && blockId !== "air") {
              processedBlocks++;
              const [namespace, blockName] = blockId.includes(":")
                ? blockId.split(":")
                : ["minecraft", blockId];

              const cleanBlockName = blockName.replace(/\[.*\]/, "");
              const key = `${namespace}:${cleanBlockName}`;

              if (!blockMap.has(key)) {
                const modName =
                  namespace !== VANILLA_NAMESPACE
                    ? MOD_MAPPING[namespace] || namespace
                    : "Minecraft";
                blockMap.set(key, {
                  id: key,
                  name: cleanBlockName,
                  displayName: cleanBlockName
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  namespace,
                  mod: modName,
                  count: 0,
                  isVanilla: namespace === VANILLA_NAMESPACE,
                  isRedstone: REDSTONE_BLOCKS.some((rs) =>
                    cleanBlockName.includes(rs),
                  ),
                  isCommand: cleanBlockName.includes("command_block"),
                });
              }

              const blockDataEntry = blockMap.get(key);
              blockDataEntry.count++;

              if (namespace !== VANILLA_NAMESPACE) {
                modSet.add(blockDataEntry.mod);
              }

              if (REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs))) {
                hasRedstone = true;
              }

              if (cleanBlockName.includes("command_block")) {
                hasCommandBlocks = true;
              }
            }
          }
        });
        console.log(
          `Processed ${processedBlocks} non-air blocks from NBT blocks array`,
        );
      }
    }
    // Format 2: Just palette (count blocks from palette)
    else if (schematic.palette || schematic.Palette) {
      console.log("Processing palette-only format");
      const palette = schematic.palette || schematic.Palette;
      const paletteEntries = Object.entries(palette);

      for (const [blockId] of paletteEntries) {
        if (blockId !== "minecraft:air" && blockId !== "air") {
          const [namespace, blockName] = blockId.includes(":")
            ? blockId.split(":")
            : ["minecraft", blockId];

          const cleanBlockName = blockName.replace(/\[.*\]/, "");
          const key = `${namespace}:${cleanBlockName}`;

          if (!blockMap.has(key)) {
            const modName =
              namespace !== VANILLA_NAMESPACE
                ? MOD_MAPPING[namespace] || namespace
                : "Minecraft";
            blockMap.set(key, {
              id: key,
              name: cleanBlockName,
              displayName: cleanBlockName
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              namespace,
              mod: modName,
              count: 1, // Default count for palette entries
              isVanilla: namespace === VANILLA_NAMESPACE,
              isRedstone: REDSTONE_BLOCKS.some((rs) =>
                cleanBlockName.includes(rs),
              ),
              isCommand: cleanBlockName.includes("command_block"),
            });
          }

          if (namespace !== VANILLA_NAMESPACE) {
            modSet.add(MOD_MAPPING[namespace] || namespace);
          }

          if (REDSTONE_BLOCKS.some((rs) => cleanBlockName.includes(rs))) {
            hasRedstone = true;
          }

          if (cleanBlockName.includes("command_block")) {
            hasCommandBlocks = true;
          }
        }
      }
    }
    // Parse Blocks array format
    else if (schematic.Blocks) {
      const blockBytes = schematic.Blocks;
      const blockIds = schematic.BlockIDs || [];

      const blockCounts = {};
      for (let i = 0; i < blockBytes.length; i++) {
        const blockId = blockBytes[i];
        if (blockId > 0) {
          blockCounts[blockId] = (blockCounts[blockId] || 0) + 1;
        }
      }

      Object.entries(blockCounts).forEach(([blockId, count]) => {
        const id = parseInt(blockId);
        const blockName = blockIds[id] || `block_${id}`;
        const key = `minecraft:${blockName}`;

        blockMap.set(key, {
          name: blockName,
          namespace: "minecraft",
          count: count,
        });

        if ([55, 75, 76, 93, 94, 149, 150].includes(id)) {
          hasRedstone = true;
        }
      });
    }

    const blocks = Array.from(blockMap.values()).sort(
      (a, b) => b.count - a.count,
    );
    dimensions.blockCount = blocks.reduce((sum, block) => sum + block.count, 0);

    console.log(`Final results: Found ${blocks.length} different block types`);
    console.log(`Total blocks: ${dimensions.blockCount}`);
    console.log(
      "Top 10 blocks:",
      blocks.slice(0, 10).map((b) => `${b.name}: ${b.count}`),
    );
    console.log(
      "All blocks found:",
      blocks.map((b) => `${b.namespace}:${b.name} (${b.count})`),
    );

    const primaryMaterials = blocks
      .filter((block) =>
        PRIMARY_MATERIALS.some((mat) => block.name.toLowerCase().includes(mat)),
      )
      .slice(0, 5)
      .map((block) => ({
        name: block.name,
        displayName: block.displayName,
        count: block.count,
        percentage:
          dimensions.blockCount > 0
            ? Math.round((block.count / dimensions.blockCount) * 100)
            : 0,
      }));

    const complexityLevel = calculateComplexity(
      dimensions,
      blocks.length,
      hasRedstone,
      modSet.size,
    );
    const estimatedBuildTime = estimateBuildTime(
      dimensions.blockCount,
      complexityLevel,
    );

    // Organize blocks by category
    const vanillaBlocks = blocks.filter((block) => block.isVanilla);
    const moddedBlocks = blocks.filter((block) => !block.isVanilla);
    const redstoneBlocks = blocks.filter((block) => block.isRedstone);

    // Get unique mods with block counts
    const modStats = Array.from(modSet)
      .map((modName) => ({
        name: modName,
        blockTypes: blocks.filter((block) => block.mod === modName).length,
        totalBlocks: blocks
          .filter((block) => block.mod === modName)
          .reduce((sum, block) => sum + block.count, 0),
      }))
      .sort((a, b) => b.totalBlocks - a.totalBlocks);

    return {
      dimensions,
      blocks: blocks.slice(0, 100), // Limit to top 100 blocks for response size
      blockStats: {
        total: blocks.length,
        vanilla: vanillaBlocks.length,
        modded: moddedBlocks.length,
        redstone: redstoneBlocks.length,
        command: blocks.filter((block) => block.isCommand).length,
      },
      materials: {
        primary: primaryMaterials,
        hasModded: modSet.size > 0,
        mostUsed: blocks.slice(0, 5).map((block) => ({
          name: block.displayName,
          count: block.count,
          percentage:
            dimensions.blockCount > 0
              ? Math.round((block.count / dimensions.blockCount) * 100)
              : 0,
          mod: block.mod,
        })),
      },
      requirements: {
        mods: modStats,
        hasRedstone,
        hasCommandBlocks,
        minecraftVersion: "1.16+", // Default, could be detected from block types
      },
      complexity: {
        level: complexityLevel,
        estimatedBuildTime,
      },
      summary: {
        title: `${dimensions.width}×${dimensions.height}×${dimensions.depth} Build`,
        description: `Contains ${dimensions.blockCount.toLocaleString()} blocks across ${blocks.length} different types${modSet.size > 0 ? ` from ${modSet.size} mods` : ""}${hasRedstone ? " with redstone components" : ""}`,
        tags: [
          complexityLevel,
          hasRedstone ? "redstone" : null,
          hasCommandBlocks ? "command-blocks" : null,
          modSet.size > 0 ? "modded" : "vanilla",
          dimensions.blockCount > 10000
            ? "large"
            : dimensions.blockCount > 1000
              ? "medium"
              : "small",
        ].filter(Boolean),
      },
    };
  } catch (error) {
    throw new Error(`Failed to parse NBT: ${error.message}`);
  }
}

module.exports = async ({ req, res, log, error }) => {
  try {
    log("NBT Parser function called");

    // Check if request has file data
    if (!req.body || !req.body.file) {
      error("No file data provided in request");
      return res.json(
        {
          success: false,
          error: "No file data provided",
        },
        400,
      );
    }

    log("File data received, length: " + req.body.file.length);

    // Convert base64 to buffer with validation
    let buffer;
    try {
      buffer = Buffer.from(req.body.file, "base64");
      log("Buffer created successfully, size: " + buffer.length + " bytes");

      // Check if buffer looks like a valid NBT file
      if (buffer.length < 10) {
        throw new Error("File too small to be a valid NBT file");
      }

      // Log first few bytes for debugging
      const header = Array.from(buffer.slice(0, 10))
        .map((b) => "0x" + b.toString(16).padStart(2, "0"))
        .join(" ");
      log("File header bytes: " + header);
    } catch (decodeError) {
      error("Failed to decode base64: " + decodeError.message);
      return res.json(
        {
          success: false,
          error: "Invalid base64 data: " + decodeError.message,
        },
        400,
      );
    }

    // Parse NBT data
    const metadata = await parseNBTData(buffer);

    log("NBT parsing completed successfully");

    // Return parsed metadata
    return res.json({
      success: true,
      metadata,
    });
  } catch (err) {
    error("Error parsing NBT file: " + err.message);
    error("Stack trace: " + err.stack);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
    );
  }
};
