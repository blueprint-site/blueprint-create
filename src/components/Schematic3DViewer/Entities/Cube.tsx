import { BoxGeometry, InstancedMesh, Object3D } from "three";
import { materialsMap } from "../Textures/textureLoader";
import { useEffect, useRef } from "react";

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
  const material = materialsMap.get(texture);

  useEffect(() => {
    pos.forEach((pos, index) => {
      cube.position.set(pos[0], pos[1], pos[2]);
      cube.updateMatrix();
      ref.current?.setMatrixAt(index, cube.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [pos, ref]);

  return (
    <instancedMesh
      onPointerOver={() => console.log(texture)}
      ref={ref}
      args={[box, material, pos.length]}
    />
  );
}
