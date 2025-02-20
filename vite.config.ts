import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const ReactCompilerConfig = {
  // sources: (filename: string) => {
  //   return filename.indexOf("src/components/features/addons") !== -1;
  // },
  target: '19'
};

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      treeshake: false,
      preserveEntrySignatures: "exports-only",
    },
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: "APP",
});
