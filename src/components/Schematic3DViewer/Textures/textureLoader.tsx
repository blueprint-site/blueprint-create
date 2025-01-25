import {
  MeshStandardMaterial,
  NearestFilter,
  Texture,
  TextureLoader,
} from "three";

const faces = import.meta.glob("/public/minecraft/textures/*.png");
const models = import.meta.glob("/public/minecraft/models/block/*.json");
const textures: Map<string, Texture> = new Map([]);

const modelsMap = new Map<string, { textures: Record<string, string> }>();
const materialsMap = new Map<
  string,
  Array<MeshStandardMaterial> | MeshStandardMaterial
>();

async function loadModelsAndTextures() {
  for (const path in models) {
    const name = path.match(/minecraft\/models\/block\/(.*)\.json/)?.[1];
    const module = (await models[path]()) as {
      default: { textures: Record<string, string> };
    };

    if (typeof name === "string") {
      modelsMap.set(name, module.default);
    }
  }

  Object.entries(faces).forEach(([path]) => {
    const name = path.match(/minecraft\/textures\/(.*)\.png/)?.[1];
    const texture = new TextureLoader().load(path);

    texture.magFilter = NearestFilter;

    if (typeof name === "string") {
      textures.set(name, texture);
    }
  });

  modelsMap.forEach((model, name) => {
    const tempTextures = new Map<string, Texture>();

    try {
      Object.entries(model?.textures).forEach(([key, value]) => {
        if (typeof value === "string") {
          const textureName = value.split("/")[1];
          if (typeof textures.get(textureName) !== "undefined") {
            tempTextures.set(key, textures.get(textureName) ?? new Texture());
          }
        }
      });
    } catch (e) {
      console.error(
        "Error while mapping the textures, this could be due missing definition of block model on code",
        e
      );
    }

    const materialsArrayByFaces = [
      new MeshStandardMaterial({
        map:
          tempTextures.get("side") ??
          tempTextures.get("front") ??
          tempTextures.get("all"),
      }),
      new MeshStandardMaterial({
        map:
          tempTextures.get("side") ??
          tempTextures.get("back") ??
          tempTextures.get("all"),
      }),
      new MeshStandardMaterial({
        map:
          tempTextures.get("top") ??
          tempTextures.get("end") ??
          tempTextures.get("all"),
      }),
      new MeshStandardMaterial({
        map:
          tempTextures.get("bottom") ??
          tempTextures.get("end") ??
          tempTextures.get("all"),
      }),
      new MeshStandardMaterial({
        map: tempTextures.get("side") ?? tempTextures.get("all"),
      }),
      new MeshStandardMaterial({
        map: tempTextures.get("side") ?? tempTextures.get("all"),
      }),
    ];

    materialsMap.set(name, materialsArrayByFaces);
    tempTextures.clear();
  });
}

loadModelsAndTextures();

export { textures, materialsMap };