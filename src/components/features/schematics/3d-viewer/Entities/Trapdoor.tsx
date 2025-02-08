import { useEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, InstancedMesh, Object3D, Material } from "three";
import { getMaterialsForBlocks } from "../Textures/textureLoader.tsx";

interface TrapdoorState {
  position: "top" | "bottom" | "open";
  facing: "north" | "south" | "east" | "west";
  hinge: "left" | "right";
}

interface TrapdoorProps {
  positions: Array<[number, number, number]>;
  states: Array<TrapdoorState>;
}

// Create geometries with correct dimensions
const BottomGeometry = new BoxGeometry(1, 3 / 16, 1);
const TopGeometry = new BoxGeometry(1, 3 / 16, 1);
const OpenGeometry = new BoxGeometry(1, 1, 3 / 16);

// Define rotation for each facing direction
const FacingRotations = {
  north: 0,
  east: Math.PI / 2,
  south: Math.PI,
  west: -Math.PI / 2,
};

export function Trapdoor({ positions, states }: TrapdoorProps) {
  const meshRef = useRef<InstancedMesh | null>(null);
  const [material, setMaterial] = useState<Material | undefined>(undefined);

  // Object3D instance to manage transformations
  const instanceObj = useMemo(() => new Object3D(), []);

  // Load material once when the component mounts
  useEffect(() => {
    let mounted = true;

    getMaterialsForBlocks(["oak_trapdoor"])
      .then((materials) => {
        if (mounted) {
          const trapdoorMaterial = materials.get("oak_trapdoor")?.[0];
          if (trapdoorMaterial) {
            setMaterial(trapdoorMaterial);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load trapdoor material:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Update instanced mesh when positions, states, or material change
  useEffect(() => {
    // Early return if material is not loaded or meshRef.current is null
    if (!material || !meshRef.current) return;

    positions.forEach((pos, index) => {
      const state = states[index];
      const [x, y, z] = pos;

      // Set position and reset rotation
      instanceObj.position.set(x, y, z);
      instanceObj.rotation.set(0, 0, 0);

      if (state.position === "top") {
        instanceObj.position.y += 13 / 16; // Adjust Y for 'top'
      } else if (state.position === "open") {
        instanceObj.rotation.y = FacingRotations[state.facing];
        const offset = state.hinge === "left" ? -7 / 16 : 7 / 16;
        instanceObj.position.x += Math.sin(instanceObj.rotation.y) * offset;
        instanceObj.position.z += Math.cos(instanceObj.rotation.y) * offset;
      }

      // Update transformation matrix
      instanceObj.updateMatrix();

      // TypeScript confirmed that meshRef.current is defined above
      meshRef.current!.setMatrixAt(index, instanceObj.matrix);
    });

    // Mark instance matrix as needing an update
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, [positions, states, material, instanceObj]);

  // Dynamically select geometry based on the most common state
  const geometry = useMemo(() => {
    // Count occurrences of each position state
    const stateCount = states.reduce((acc, state) => {
      acc[state.position] = (acc[state.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get the state with the highest count
    const mostCommonState = Object.entries(stateCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Return the appropriate geometry
    switch (mostCommonState) {
      case "top":
        return TopGeometry;
      case "open":
        return OpenGeometry;
      default:
        return BottomGeometry;
    }
  }, [states]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, positions.length]} // Material, length passed with args
    />
  );
}