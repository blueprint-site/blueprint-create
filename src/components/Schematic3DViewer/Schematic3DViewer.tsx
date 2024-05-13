import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Ground } from "./Entities/Ground";
import { MinecraftControls } from "./Controls/MinecraftControls";
import { SchematicLoader } from "./Entities/SchematicLoader";
import styles from "./Schematic3DViewer.module.scss";
import { Suspense } from "react";
import { Cube } from "./Entities/Cube";

export function Schematic3DViewer() {
  return (
    <div id="schematic-viewer" className={styles.container}>
      <Suspense fallback={<div>CARGANDO ...</div>}>
        <Canvas>
          <Sky sunPosition={[100, 200, 20]} />
          <ambientLight intensity={1.4} />
          <Physics>
            <MinecraftControls />
            <Cube />
            <Ground />
          </Physics>
        </Canvas>
      </Suspense>
      <SchematicLoader className={styles.schematicLoader} />
      <div className={styles.crosshair}>+</div>
    </div>
  );
}
