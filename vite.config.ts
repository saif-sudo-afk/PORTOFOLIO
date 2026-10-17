import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/portfolio/' : '/',
  build: {
    target: 'es2022',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: { main: 'index.html', cv: 'cv.html' },
    },
  },
});
