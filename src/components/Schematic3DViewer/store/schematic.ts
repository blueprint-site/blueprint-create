import { create } from "zustand";

export type SchematicData = {
  pos: [number, number, number];
  block: string;
};

type SchematicState = {
  schematic: Record<string, Array<Array<number>>>;
  setSchematic: (schematic: Record<string, Array<Array<number>>>) => void;
};

export const useSchematicStore = create<SchematicState>((set) => ({
  schematic: {},
  setSchematic: (schematic) => set({ schematic }),
}));
