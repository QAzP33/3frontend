import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.otf'],
  plugins: [react()],
  base: '/3frontend/',
});
