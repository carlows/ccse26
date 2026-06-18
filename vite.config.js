import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/ccse26/' for GitHub Pages (https://carlows.github.io/ccse26/),
// '/' for local dev so `npm run dev` works at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ccse26/' : '/',
  plugins: [react()],
  server: { port: 5173, open: true },
}))
