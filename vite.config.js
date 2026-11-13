import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

const js = path.resolve(import.meta.dirname, 'resources/adminapp/js')

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/adminapp/js/app.js', 'resources/adminapp/sass/app.scss'],
      refresh: ['resources/views/**']
    }),
    vue()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': js,
      '@pages': path.resolve(js, 'pages'),
      '@components': path.resolve(js, 'components'),
      '@cruds': path.resolve(js, 'cruds')
    }
  },
  optimizeDeps: {
    include: ['lodash/groupBy', 'lodash/debounce', 'lodash/throttle', 'browser-downloads']
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
    hmr: { host: process.env.VITE_HMR_HOST || 'localhost' }
  }
})
