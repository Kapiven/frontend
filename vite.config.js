import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    watch: {
      usePolling: true,
    },
    historyApiFallback: true,
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(
      process.env.VITE_BACKEND_URL || 'http://localhost:4000',
    ),
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
