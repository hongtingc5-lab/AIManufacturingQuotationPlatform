import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const src = fileURLToPath(new URL('./src', import.meta.url))

/** MES Workspace — port 5177 */
export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: { alias: { '@': src } },
  server: { port: 5177, strictPort: true },
  preview: { port: 5177, strictPort: true },
})
