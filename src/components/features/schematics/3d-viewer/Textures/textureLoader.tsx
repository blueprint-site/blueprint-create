import {
  MeshStandardMaterial,
  NearestFilter,
  Texture,
  TextureLoader,
} from "three";

// Registry of available textures and models (paths only)
const textureRegistry = new Map<string, () => Promise<any>>();
const modelRegistry = new Map<string, () => Promise<any>>();

// Cache for loaded resources
const loadedTextures = new Map<string, Texture>();
const loadedModels = new Map<string, { textures: Record<string, string> }>();
const materialCache = new Map<string, Array<MeshStandardMaterial>>();

// Initialize registries
const textureFiles = import.meta.glob("/public/minecraft/textures/*.png");
const modelFiles = import.meta.glob("/public/minecraft/models/block/*.json");

// Register available textures without loading them
Object.entries(textureFiles).forEach(([path, importFn]) => {
  const name = path.match(/minecraft\/textures\/(.*)\.png/)?.[1];
  if (name) {
    textureRegistry.set(name, importFn);
  }
});

// Register available models without loading them
Object.entries(modelFiles).forEach(([path, importFn]) => {
  const name = path.match(/minecraft\/models\/block\/(.*)\.json/)?.[1];
  if (name) {
    modelRegistry.set(name, importFn);
  }
});

/**
 * Load a single texture by name
 */
async function loadTexture(textureName: string): Promise<Texture> {
  // Return cached texture if available
  if (loadedTextures.has(textureName)) {
    return loadedTextures.get(textureName)!;
  }

  const importFn = textureRegistry.get(textureName);
  if (!importFn) {
    throw new Error(`Texture not found: ${textureName}`);
  }

  const module = await importFn();
  const texture = new TextureLoader().load(module.default);
  texture.magFilter = NearestFilter;

  loadedTextures.set(textureName, texture);
  return texture;
}

/**
 * Load a block model and its required textures
 */
async function loadBlockModel(modelName: string) {
  // Return cached model if available
  if (loadedModels.has(modelName)) {
    return loadedModels.get(modelName)!;
  }

  const importFn = modelRegistry.get(modelName);
  if (!importFn) {
    throw new Error(`Model not found: ${modelName}`);
  }

  const module = await importFn() as { default: { textures: Record<string, string> } };
  loadedModels.set(modelName, module.default);
  return module.default;
}

/**
 * Create materials for a block, loading required textures
 */
async function createMaterialsForBlock(blockName: string): Promise<Array<MeshStandardMaterial>> {
  // Return cached materials if available
  if (materialCache.has(blockName)) {
    return materialCache.get(blockName)!;
  }

  // Load the block model
  const model = await loadBlockModel(blockName);
  const tempTextures = new Map<string, Texture>();

  // Load required textures
  try {
    for (const [key, value] of Object.entries(model.textures)) {
      if (typeof value === "string") {
        const textureName = value.split("/")[1];
        const texture = await loadTexture(textureName);
        tempTextures.set(key, texture);
      }
    }
  } catch (e) {
    console.error("Error loading textures for block:", blockName, e);
    throw e;
  }

  // Create materials for each face
  const materials = [
    new MeshStandardMaterial({
      map: tempTextures.get("side") ?? tempTextures.get("front") ?? tempTextures.get("all"),
    }),
    new MeshStandardMaterial({
      map: tempTextures.get("side") ?? tempTextures.get("back") ?? tempTextures.get("all"),
    }),
    new MeshStandardMaterial({
      map: tempTextures.get("top") ?? tempTextures.get("end") ?? tempTextures.get("all"),
    }),
    new MeshStandardMaterial({
      map: tempTextures.get("bottom") ?? tempTextures.get("end") ?? tempTextures.get("all"),
    }),
    new MeshStandardMaterial({
      map: tempTextures.get("side") ?? tempTextures.get("all"),
    }),
    new MeshStandardMaterial({
      map: tempTextures.get("side") ?? tempTextures.get("all"),
    }),
  ];

  materialCache.set(blockName, materials);
  return materials;
}

/**
 * Get materials for multiple blocks, loading as needed
 */
async function getMaterialsForBlocks(blockNames: string[]): Promise<Map<string, Array<MeshStandardMaterial>>> {
  const materials = new Map<string, Array<MeshStandardMaterial>>();

  await Promise.all(
    blockNames.map(async (blockName) => {
      const blockMaterials = await createMaterialsForBlock(blockName);
      materials.set(blockName, blockMaterials);
    })
  );

  return materials;
}

/**
 * Clean up unused resources
 */
function disposeUnusedResources(usedBlockNames: string[]) {
  const usedBlocks = new Set(usedBlockNames);

  // Clean up unused materials
  for (const [blockName, materials] of materialCache.entries()) {
    if (!usedBlocks.has(blockName)) {
      materials.forEach(material => material.dispose());
      materialCache.delete(blockName);
    }
  }

  // Clean up unused models
  for (const blockName of loadedModels.keys()) {
    if (!usedBlocks.has(blockName)) {
      loadedModels.delete(blockName);
    }
  }

  // Clean up unused textures (more complex as textures might be shared)
  // Would need to track texture usage counts
}

export { getMaterialsForBlocks, disposeUnusedResources };