import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    angular(),
    federation({
      name: 'mfe1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/app/button/button.component.ts'
      },
      remotes: {},
      shared: ['@angular/core', '@angular/common', 'rxjs']
    })
  ],
  server: {
    port: 3001
  },
  build: {
    target: 'esnext'
  }
})