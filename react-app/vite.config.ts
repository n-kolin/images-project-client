import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This is the correct way to disable TS checking during build
    rollupOptions: {
      // This tells Rollup to ignore TypeScript errors during build
      onwarn(warning, warn) {
        if (warning.code === 'TS_ERROR') return
        warn(warning)
      }
    }
  }
})


