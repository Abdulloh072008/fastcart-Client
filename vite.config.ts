import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('swiper')) return 'vendor-swiper'
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-redux'
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform'))
            return 'vendor-form'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/'))
            return 'vendor-react'
          if (id.includes('react-router')) return 'vendor-router'
        },
      },
    },
  },
})
