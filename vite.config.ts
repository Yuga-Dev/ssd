import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Imposter Word Game',
        short_name: 'Imposter',
        description: 'A multiplayer word deduction game',
        theme_color: '#000000',
        icons: [] // Empty array for now, can add PWA icons later
      }
    })
  ],
})
