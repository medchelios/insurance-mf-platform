import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    angular({
      main: 'src/main.ts'
    }),
    federation({
      name: 'mfe1',
      filename: 'remoteEntry.js',
      exposes: {
        './ReclamationForm': './src/app/app.component.ts'
      },
      remotes: {},
      shared: ['@angular/core', '@angular/common', 'rxjs']
    })
  ],
  server: {
    port: 3001,
    strictPort: true
  },
  preview: {
    port: 3001,
    strictPort: true
  },
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/app/app.component.ts'
    }
  }
})