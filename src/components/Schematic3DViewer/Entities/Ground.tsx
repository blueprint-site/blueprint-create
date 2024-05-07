import { Mesh } from "three";
import { usePlane } from "@react-three/cannon";
import { textures } from "../Textures/textureLoader";

export function Ground() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry attach="geometry" args={[200, 200]} />
      <meshStandardMaterial attach="material" map={textures.get("bedrock")} />
    </mesh>
  );
}
