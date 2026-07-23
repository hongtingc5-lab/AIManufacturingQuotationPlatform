import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const entrySrc = fileURLToPath(new URL('./src', import.meta.url))

/** Independent entry portal — port 5175, separate from marketing :5173. */
export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': entrySrc,
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
})
