import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite' // <-- Tem que estar aqui
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // <-- Tem que estar aqui em cima
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})