import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@workspace/api-client-react': path.resolve(__dirname, '../../lib/api-client-react/src'),
    },
  },
});
