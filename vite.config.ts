import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


//utilizar base: '', para usuario.karine.pt
//utilizar base: '/usuario/', para 144.22.133.136/usuario

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso externo
    port: 5174, // Mude para uma porta diferente para evitar conflitos
  },
  base: '',
  build: {
    outDir:'dist',
    emptyOutDir: true,
  }
})
