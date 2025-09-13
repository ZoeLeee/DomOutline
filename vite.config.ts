import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/browser.ts'),
      name: 'TheRoom',
      fileName: (format) => {
        if (format === 'es') {
          return 'index.js';
        }
        return `index.${format}.js`;
      },
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        // 确保 UMD 格式在全局变量中可用
        globals: {
          'theRoom': 'TheRoom'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  define: {
    // 确保在生产构建中移除开发代码
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
});