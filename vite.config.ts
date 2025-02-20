import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        preserveModules: true
      },
      treeshake: false,
      preserveEntrySignatures: "exports-only"
    }
  },
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: "APP"
});