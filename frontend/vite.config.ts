import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/store3d/',
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/models': 'http://localhost:3000',
      '/images': 'http://localhost:3000',
    },
  },
})
