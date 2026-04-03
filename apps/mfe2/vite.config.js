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
        './AccountLinkForm': './src/AccountLinkForm.vue'
      },
      remotes: {},
      shared: ['vue']
    })
  ],
  server: {
    port: 3002,
    strictPort: true
  },
  build: {
    target: 'esnext'
  }
})