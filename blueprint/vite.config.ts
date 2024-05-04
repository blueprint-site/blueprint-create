import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCloudflaredTunnel from 'vite-cloudflared-tunnel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCloudflaredTunnel()],
})