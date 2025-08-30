/* eslint-disable no-undef */

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import imagemin from 'vite-plugin-imagemin';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import pkg from './package.json' with { type: 'json' };
import tailwindcss from '@tailwindcss/vite';

interface ReactCompilerConfig {
  target?: string;
  sources?: (filename: string) => boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

const baseCompilerConfig: ReactCompilerConfig = {
  target: '19',
};

const devCompilerConfig: ReactCompilerConfig = {
  ...baseCompilerConfig,
  logLevel: 'debug',
};

export default defineConfig(({ mode }) => ({
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          radix: Object.keys(pkg.dependencies).filter((dep) => dep.startsWith('@radix-ui')),
          tanstack: ['@tanstack/react-query', '@tanstack/react-table'],
          animation: ['framer-motion', 'embla-carousel-react'],
        },
      },
      treeshake: true,
      preserveEntrySignatures: 'exports-only',
    },
    assetsInlineLimit: 4096,
  },
  plugins: [
    tailwindcss(),
    mode === 'production' &&
      imagemin({
        gifsicle: { optimizationLevel: 3 },
        mozjpeg: { quality: 80 },
        optipng: { optimizationLevel: 5 },
        svgo: {
          plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
        },
      }),
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              target: '19',
              logLevel: process.env.NODE_ENV === 'development' ? 'debug' : undefined,
            },
          ],
        ],
      },
    }),
    // checker({
    //   typescript: true,
    //   eslint: {
    //     lintCommand: 'eslint .', // Simplified command
    //     dev: {
    //       logLevel: ['error'],
    //     },
    //   },
    //   overlay: false,
    // }),
    viteCompression({ algorithm: 'gzip' }),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ].filter(Boolean),
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'buffer', 'prismarine-nbt'],
    exclude: ['@tanstack/react-query'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
    },
  },
  server: {
    port: Number(process.env.VITE_DEV_PORT) || 5174,
  },
  envPrefix: 'APP',
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis',
  },
}));
