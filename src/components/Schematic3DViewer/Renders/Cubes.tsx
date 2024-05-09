import { Cube } from "../Entities/Cube";
import { nanoid } from "nanoid";
import { useSchematicStore } from "../store/schematic";

export function Cubes() {
  const { schematic } = useSchematicStore();
  // const cubes = useSelector((state) => state.cubes.cubes);
  // return cubes.map(({ key, pos, texture }) => {
  //   return <Cube key={key} position={pos} texture={texture} />;
  // });

  if (schematic !== null) {
    return schematic.map(({ pos }) => {
      return <Cube key={nanoid()} position={pos} texture={"plank"} />;
    });
  }
}
