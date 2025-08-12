import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // Permite usar outra porta se 5173 estiver ocupada
    host: true, // Permite conexões externas
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        secure: false,
        ws: true, // Suporte para WebSocket
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Erro no proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  // Configurações de build otimizadas
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Configurações de preview
  preview: {
    port: 4173,
    strictPort: false,
  }
})
