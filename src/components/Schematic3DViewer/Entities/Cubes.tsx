import { useSchematicStore } from "../store/schematic";
import { Cube } from "./Cube";
import { nanoid } from "nanoid";
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
