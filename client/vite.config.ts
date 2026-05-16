import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /* Split heavy vendor libs into separate chunks for better caching
           and parallel downloading. React, GSAP, and Leaflet are large
           and rarely change — caching them separately avoids re-downloading
           the entire bundle on every deploy. */
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'vendor-leaflet'
          }
        },
      },
    },
    /* Target modern browsers for smaller bundle size */
    target: 'es2020',
  },
})
