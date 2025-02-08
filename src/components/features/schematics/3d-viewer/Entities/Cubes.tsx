import { nanoid } from "nanoid";

import { useSchematicStore } from "../store/schematic.ts";
import { Cube } from "./Cube";

export function Cubes() {
  const { schematic } = useSchematicStore();

  return (
    <>
      {Object.entries(schematic).map(([blockname, positions]) => {
        if (blockname === "air") return null;
        return <Cube key={nanoid()} texture={blockname} pos={positions} />;
      })}
    </>
  );
}
