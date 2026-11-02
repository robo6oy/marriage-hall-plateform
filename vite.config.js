import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is set for GitHub Pages at https://<user>.github.io/marriage-hall-plateform/
// For local dev (`npm run dev`) Vite serves from root regardless of this base.
export default defineConfig({
  plugins: [react()],
  base: '/marriage-hall-plateform/'
})
