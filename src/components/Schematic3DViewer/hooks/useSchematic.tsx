import { useSchematicStore } from "@/store/schematic";
import { Buffer } from "buffer";
import nbt from "prismarine-nbt";
import { useEffect, useState } from "react";

import * as fflate from "fflate";

export function useSchematic() {
  const [file, setFile] = useState<File | null>(null);
  const { setSchematic } = useSchematicStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function loadNbt() {
      try {
        setSchematic({});
        setLoading(true);
        if (file) {
          const buffer = await file.arrayBuffer();
          const stringBuffer = new Uint8Array(buffer);
          const decompressed = fflate.decompressSync(stringBuffer);
          const data = nbt.parseUncompressed(Buffer.from(decompressed.buffer));
          console.log(data);
          if (
            data.value.blocks !== undefined &&
            data.value.palette !== undefined
          ) {
            const blocksMap: Record<string, Array<Array<number>>> = {};
            // @ts-expect-error types from prismarine-nbt are not accurate
            const blocks = data.value.blocks.value.value;
            // @ts-expect-error types from prismarine-nbt are not accurate
            const palette = data.value.palette.value.value;
            // @ts-expect-error types from prismarine-nbt are not accurate
            blocks.forEach((block) => {
              const { pos, state } = block;
              const { Name } = palette[state.value];
              const blockName = Name.value.split(":")[1];
              const blockPosition = pos.value.value;

              if (blocksMap[blockName]) {
                blocksMap[blockName] = [...blocksMap[blockName], blockPosition];
              } else {
                blocksMap[blockName] = [blockPosition];
              }
            });
            console.log(blocksMap);
            setSchematic(blocksMap);
          }
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (file !== null) {
      loadNbt();
    }
  }, [file]);

  return { setFile, loading, error };
}
