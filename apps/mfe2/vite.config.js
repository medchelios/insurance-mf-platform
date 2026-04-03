import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'mfe2',
      filename: 'remoteEntry.js',
      exposes: {
        './Card': './src/Card.vue'
      },
      remotes: {},
      shared: ['vue']
    })
  ],
  server: {
    port: 3002
  },
  build: {
    target: 'esnext'
  }
})