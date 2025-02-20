import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

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
  plugins: [tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: "APP"
});