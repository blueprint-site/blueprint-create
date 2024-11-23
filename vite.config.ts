import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        preserveModules: true
      },
      treeshake: false,
      preserveEntrySignatures: "exports-only",
      plugins: [
        nodePolyfills()
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [polyfillNode({})],
    },
  },
  plugins: [react({})],
  envPrefix: "APP"
});