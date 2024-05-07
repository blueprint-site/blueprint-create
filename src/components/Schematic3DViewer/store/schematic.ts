import { create } from "zustand";

export type SchematicData = {
  pos: [number, number, number];
  block: string;
};

type SchematicState = {
  schematic: Array<SchematicData>;
  setSchematic: (schematic: Array<SchematicData>) => void;
};

export const useSchematicStore = create<SchematicState>((set) => ({
  schematic: [],
  setSchematic: (schematic) => set({ schematic }),
}));
