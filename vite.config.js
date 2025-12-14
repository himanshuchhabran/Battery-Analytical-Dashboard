import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zenfinity-intern-api-104290304048.europe-west1.run.app',
        changeOrigin: true,
        secure: false,      
      }
    }
  }
})
