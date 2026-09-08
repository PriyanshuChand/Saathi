import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Saathi/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
