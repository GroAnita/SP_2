import { defineConfig } from 'vite';

export default defineConfig({
  base: '/SP_2/',
  build: {
    outDir: 'docs',
  },
  server: {
    historyApiFallback: true,
  },
});
