import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.otf'],
  plugins: [react()],
  base: '/3frontend/',
  server: {
    allowedHosts: [
      '.ngrok-free.app', // 允許所有 ngrok 域名
      'localhost',
    ],
  },
});
