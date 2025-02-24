import path from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import imagemin from 'vite-plugin-imagemin';
const ReactCompilerConfig = {
  // sources: (filename: string) => {
  //   return filename.indexOf("src/components/features/addons") !== -1;
  // },
  target: '19',
};

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      treeshake: true,
      preserveEntrySignatures: 'exports-only',
    },
  },
  plugins: [
    tailwindcss(),
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 80 },
      optipng: { optimizationLevel: 5 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envPrefix: 'APP',
});
