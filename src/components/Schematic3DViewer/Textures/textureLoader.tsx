import { NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";
const faces = import.meta.glob("/public/faces/*.png");

const textures: Map<string, Texture> = new Map([]);

Object.entries(faces).forEach(([path]) => {
  const key = path.match(/faces\/(.*)\.png/)?.[1];
  if (key) {
    const texture = new TextureLoader().load(path);
    if (key === "bedrock") {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(200, 200);
    }
    texture.magFilter = NearestFilter;
    textures.set(key, texture);
  }
});

console.log(textures);

export { textures };
