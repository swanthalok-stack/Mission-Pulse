import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') || 
              id.includes('@react-three') || 
              id.includes('three-stdlib') || 
              id.includes('camera-controls') || 
              id.includes('troika')
            ) {
              return 'three'
            }
            if (id.includes('recharts')) {
              return 'recharts'
            }
            if (id.includes('lucide-react')) {
              return 'lucide'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor'
            }
          }
        },
      },
    },
  },
})
