import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Tic-tac-toe/',
  plugins: [react()]
})