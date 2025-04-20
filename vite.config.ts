import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Ignorar todos los errores de TypeScript durante la compilación
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        ignoreDeprecations: "5.0",
      }
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist',
    // No detener la compilación al encontrar errores de tipo
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          paypal: ['@paypal/checkout-server-sdk'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', '@prisma/client']
  }
});
