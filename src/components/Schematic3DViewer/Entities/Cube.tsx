import { BoxGeometry, InstancedMesh, Object3D } from "three";
import { textures } from "../Textures/textureLoader";
import { useEffect, useRef } from "react";
import { useSchematicStore } from "../store/schematic";

// type CubeProps = {
//   position: [number, number, number];
// };

const box = new BoxGeometry();
const cube = new Object3D();
export function Cube() {
  const ref = useRef<InstancedMesh>(null);
  const { schematic } = useSchematicStore();

  const activeTexture = textures.get("plank");

  useEffect(() => {
    // Set positions
    schematic.forEach(({ pos }, index) => {
      cube.position.set(pos[0], pos[1], pos[2]);
      cube.updateMatrix();
      ref.current?.setMatrixAt(index, cube.matrix);
    });
    // Update the instance
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [schematic, ref]);

  return (
    <instancedMesh ref={ref} args={[box, undefined, schematic.length]}>
      <meshBasicMaterial attach="material" map={activeTexture} />
    </instancedMesh>
  );
}
