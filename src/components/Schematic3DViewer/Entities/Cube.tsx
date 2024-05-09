import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { Mesh } from "three";
import { textures } from "../Textures/textureLoader";

type CubeProps = {
  position: [number, number, number];
  texture: string;
};

export function Cube({ position, texture }: CubeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    position,
  }));
  const activeTexture = textures.get(texture);

  return (
    <mesh
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "grey" : "white"}
        map={activeTexture}
        transparent={true}
        attach="material"
      />
    </mesh>
  );
}
