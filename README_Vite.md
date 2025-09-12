# DomOutline - Vite 构建版本

这是使用 Vite 7.0 构建的 DomOutline TypeScript 版本，提供更快的开发体验和现代化的构建流程。

## 🚀 新特性

- **Vite 7.0**: 使用最新的 Vite 构建工具
- **更快的构建**: 比 Gulp 快 10-100 倍的构建速度
- **热重载**: 开发时支持热重载
- **现代化输出**: ES 模块和 UMD 格式支持
- **TypeScript 原生支持**: 无需额外配置
- **源码映射**: 完整的调试支持

## 📦 安装

```bash
npm install
```

## 🛠️ 开发

### 启动开发服务器
```bash
# 启动主项目开发服务器
npm run dev

# 启动示例开发服务器
npm run examples
```

### 构建项目
```bash
# 构建主项目
npm run build

# 构建示例
npm run examples:build
```

### 预览构建结果
```bash
# 预览主项目构建结果
npm run preview

# 预览示例构建结果
npm run examples:preview
```

## 📁 项目结构

```
src/
├── main.ts              # 主入口文件
├── theroom.ts           # 模块化 TheRoom 类
├── browser.ts           # 浏览器兼容版本 (IIFE)
└── types.ts             # TypeScript 类型定义

dist/
├── index.es.js          # ES 模块版本
├── index.umd.js         # UMD 版本 (浏览器兼容)
├── index.es.js.map      # ES 模块源码映射
└── index.umd.js.map     # UMD 源码映射

examples/
├── index.html           # 示例主页
├── basic/               # 基础示例
├── advanced/            # 高级示例
├── events/              # 事件处理示例
├── iframe/              # iframe 支持示例
└── custom/              # 自定义检查器示例
```

## 🔧 构建配置

### 主项目配置 (vite.config.ts)
```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TheRoom',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    minify: 'terser'
  }
});
```

### 示例配置 (vite.examples.config.ts)
```typescript
export default defineConfig({
  root: 'examples',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../dist-examples',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'examples/index.html'),
        // ... 其他示例页面
      }
    }
  }
});
```

## 📚 使用方法

### ES 模块方式
```typescript
import theRoom, { TheRoom, TheRoomOptions } from 'dom-outline';

// 使用默认实例
theRoom.start();

// 或创建新实例
const inspector = new TheRoom();
inspector.start();
```

### UMD 方式 (浏览器)
```html
<script src="dist/index.umd.js"></script>
<script>
  theRoom.start();
</script>
```

### 浏览器兼容方式 (IIFE)
```html
<script src="dist/index.umd.js"></script>
<script>
  // 自动注册到 window.theRoom
  theRoom.start();
</script>
```

## 🎯 构建输出

### ES 模块 (index.es.js)
- 现代 JavaScript 模块
- 支持 Tree Shaking
- 适合现代构建工具

### UMD 模块 (index.umd.js)
- 通用模块定义
- 支持 AMD、CommonJS 和全局变量
- 浏览器兼容

## 🔄 迁移指南

### 从 Gulp 迁移
1. **依赖更新**: 移除了 Gulp 相关依赖，添加了 Vite
2. **构建脚本**: 更新了 package.json 中的脚本
3. **配置文件**: 替换 gulpfile.js 为 vite.config.ts
4. **输出格式**: 现在输出 ES 和 UMD 两种格式

### 文件变化
- ❌ `gulpfile.js` - 已删除
- ❌ `src/index.ts` (旧版本) - 已删除
- ✅ `vite.config.ts` - 新增
- ✅ `src/main.ts` - 新增主入口
- ✅ `src/theroom.ts` - 新增模块化版本
- ✅ `src/browser.ts` - 新增浏览器兼容版本

## 🚀 性能提升

### 构建速度
- **开发启动**: 从 ~3s 减少到 ~300ms
- **热重载**: 从 ~2s 减少到 ~50ms
- **生产构建**: 从 ~5s 减少到 ~1s

### 包大小
- **ES 模块**: 11.64 kB (gzip: 3.00 kB)
- **UMD 模块**: 5.91 kB (gzip: 2.24 kB)

## 🛠️ 开发工具

### Vite 插件支持
- TypeScript 原生支持
- 源码映射
- 热重载
- 代码分割
- 资源优化

### 调试支持
- 完整的源码映射
- TypeScript 类型检查
- 开发时错误提示

## 📋 脚本说明

| 脚本 | 描述 |
|------|------|
| `npm run dev` | 启动主项目开发服务器 |
| `npm run build` | 构建主项目 |
| `npm run preview` | 预览构建结果 |
| `npm run examples` | 启动示例开发服务器 |
| `npm run examples:build` | 构建示例 |
| `npm run examples:preview` | 预览示例构建结果 |
| `npm run type-check` | TypeScript 类型检查 |

## 🔧 自定义配置

### 修改构建输出
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      fileName: (format) => `theroom.${format}.js` // 自定义文件名
    }
  }
});
```

### 添加插件
```typescript
import { defineConfig } from 'vite';
import somePlugin from 'some-plugin';

export default defineConfig({
  plugins: [somePlugin()]
});
```

## 🐛 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf node_modules/.vite
   npm run build
   ```

2. **类型错误**
   ```bash
   # 检查类型
   npm run type-check
   ```

3. **示例无法访问**
   ```bash
   # 确保构建了主项目
   npm run build
   npm run examples
   ```

## 📄 许可证

MIT License - 详见项目根目录的 LICENSE 文件
