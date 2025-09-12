import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'examples',
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      // 将 dist 路径映射到项目根目录的 dist 文件夹
      '/dist': resolve(__dirname, 'dist')
    }
  }
});
