import { defineConfig } from 'eslint/config';
import frontendConfig from './frontend/eslint.config.mjs';

// Export the frontend config as the root config
// This allows lint-staged to find the config when running from root
export default defineConfig(frontendConfig);