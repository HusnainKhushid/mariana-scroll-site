import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE is set by the deploy workflow for GitHub Pages
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
})
