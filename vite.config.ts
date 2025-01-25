import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
  plugins: [
    react({}),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: "APP"
});