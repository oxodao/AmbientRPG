import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: {
          // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
          '@tabler/icons-react':
              '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
  },
  optimizeDeps: {
      include: ['@tabler/icons-react'],
      entries: ['@tabler/icons-react/**/*.js'],
  },
  server: {
      proxy: {
          '/api': {
              target: 'http://app',
          },
          '/.well-known': {
              target: 'http://app',
          },
          '/images': {
              target: 'http://app',
          },
      },
  },
})
