import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Ground } from "./Entities/Ground";
import { Player } from "./Entities/Player";
import { FPV } from "./Entities/FPV";
import { Cubes } from "./Renders/Cubes";
import { SchematicLoader } from "./Entities/SchematicLoader";
import styles from "./Schematic3DViewer.module.scss";
import { Suspense } from "react";

export function Schematic3DViewer() {
  return (
    <>
      <Suspense fallback={<div>CARGANDO ...</div>}>
        <Canvas>
          <Sky sunPosition={[100, 200, 20]} />
          <ambientLight intensity={1.4} />
          <FPV />
          <Physics>
            <Player />
            <Cubes />
            <Ground />
          </Physics>
        </Canvas>
      </Suspense>
      <SchematicLoader className={styles.schematicLoader} />
      <div className={styles.crosshair}>+</div>
    </>
  );
}
