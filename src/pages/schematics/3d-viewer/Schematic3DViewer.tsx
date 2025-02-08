import { Suspense } from "react";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Ground } from "@/components/features/schematics/3d-viewer/Entities/Ground.tsx";
import { MinecraftControls } from "@/components/features/schematics/3d-viewer/Controls/MinecraftControls.tsx";
import { SchematicLoader } from "@/components/features/schematics/3d-viewer/Entities/SchematicLoader.tsx";
import { Cubes } from "@/components/features/schematics/3d-viewer/Entities/Cubes.tsx";

import styles from "./Schematic3DViewer.module.scss";
export function Schematic3DViewer() {
  return (
    <div id="schematic-viewer" className={styles.container}>
      <Suspense fallback={<div>CARGANDO ...</div>}>
        <Canvas>
          <Sky sunPosition={[100, 200, 20]} />
          <ambientLight intensity={1.4} />
          <MinecraftControls />
          <Cubes />
          <Ground />
        </Canvas>
      </Suspense>
      <SchematicLoader className={styles.schematicLoader} />
      <div className={styles.crosshair}>+</div>
    </div>
  );
}