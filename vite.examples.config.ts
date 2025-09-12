import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'examples',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist-examples',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'examples/index.html'),
        basic: resolve(__dirname, 'examples/basic/index.html'),
        advanced: resolve(__dirname, 'examples/advanced/index.html'),
        events: resolve(__dirname, 'examples/events/index.html'),
        iframe: resolve(__dirname, 'examples/iframe/index.html'),
        custom: resolve(__dirname, 'examples/custom/index.html'),
        test: resolve(__dirname, 'examples/test.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
