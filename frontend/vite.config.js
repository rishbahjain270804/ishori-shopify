import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hasExplicitBase = !!env.VITE_API_BASE_URL
  return {
    plugins: [react()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@design-system': path.resolve(__dirname, '../design-system'),
    },
    },
    server: {
      port: 3000,
      host: true,
      allowedHosts: [
        '.loca.lt',
        'hip-ghosts-laugh.loca.lt'
      ],
      proxy: hasExplicitBase ? undefined : {
        '/api': 'http://localhost:5000',
      },
    },
  }
})
