import { BoxGeometry, InstancedMesh, Object3D, MeshStandardMaterial } from "three";
import { getMaterialsForBlocks } from "../Textures/textureLoader.tsx";
import { useEffect, useRef, useState } from "react";

const box = new BoxGeometry();
const cube = new Object3D();

export function Cube({
                       pos,
                       texture,
                     }: {
  pos: Array<Array<number>>;
  texture: string;
}) {
  const ref = useRef<InstancedMesh>(null);
  const [materials, setMaterials] = useState<Array<MeshStandardMaterial> | null>(null);

  useEffect(() => {
    getMaterialsForBlocks([texture]).then(mats => {
      const textureMaterials = mats.get(texture);
      if (textureMaterials) {
        setMaterials(textureMaterials);
      }
    });
  }, [texture]);

  useEffect(() => {
    if (!ref.current || !materials) return;

    pos.forEach((pos, index) => {
      cube.position.set(pos[0], pos[1], pos[2]);
      cube.updateMatrix();
      ref.current?.setMatrixAt(index, cube.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [pos, materials]);

  if (!materials) {
    return null;
  }

  return (
    <instancedMesh
      ref={ref}
      args={[box, materials, pos.length]}
      // onPointerOver={() => console.log(texture)}
    />
  );
}