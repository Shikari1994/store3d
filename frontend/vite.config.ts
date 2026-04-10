import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.BACKEND_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    base: '/',
    server: {
      proxy: {
        '/api': backendUrl,
        '/models': backendUrl,
        '/images': backendUrl,
      },
    },
  }
})
