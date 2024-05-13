import { BoxGeometry, InstancedMesh, Object3D } from "three";
import { textures } from "../Textures/textureLoader";
import { useEffect, useRef } from "react";
import { useSchematicStore } from "../store/schematic";

const box = new BoxGeometry();
const cube = new Object3D();
const activeTexture = textures.get("plank");
export function Cube() {
  const ref = useRef<InstancedMesh>(null);
  const { schematic } = useSchematicStore();

  useEffect(() => {
    schematic.forEach(({ pos }, index) => {
      cube.position.set(pos[0], pos[1], pos[2]);
      cube.updateMatrix();
      ref.current?.setMatrixAt(index, cube.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [schematic, ref]);

  return (
    <instancedMesh ref={ref} args={[box, undefined, schematic.length]}>
      <meshBasicMaterial attach="material" map={activeTexture} />
    </instancedMesh>
  );
}
