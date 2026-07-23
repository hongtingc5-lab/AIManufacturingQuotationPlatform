import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const src = fileURLToPath(new URL('./src', import.meta.url))

/** Admin console — port 5176 */
export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: { alias: { '@': src } },
  server: { port: 5176, strictPort: true },
  preview: { port: 5176, strictPort: true },
})
