import { useEffect, useState } from "react";
import { MeshStandardMaterial, RepeatWrapping } from "three";
import { getMaterialsForBlocks } from "../Textures/textureLoader";

export function Ground() {
  const [material, setMaterial] = useState<MeshStandardMaterial | null>(null);

  useEffect(() => {
    getMaterialsForBlocks(['bedrock']).then(materials => {
      const bedrockMaterial = materials.get('bedrock')?.[0];
      if (bedrockMaterial && bedrockMaterial.map) {
        bedrockMaterial.map.wrapS = RepeatWrapping;
        bedrockMaterial.map.wrapT = RepeatWrapping;
        bedrockMaterial.map.repeat.set(200, 200); // Match plane size
        setMaterial(bedrockMaterial);
      }
    });
  }, []);

  if (!material) return null;

  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[200, 200]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}