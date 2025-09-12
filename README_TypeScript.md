# TheRoom.js - TypeScript 重构版本

这是一个使用 TypeScript 重构的 DOM 元素检查器库，允许您像 Web 检查器一样勾勒 DOM 元素。

## 特性

- ✅ 完整的 TypeScript 类型支持
- ✅ 严格的类型检查
- ✅ 现代化的构建流程
- ✅ 保持原有 API 兼容性
- ✅ 支持 iframe 和 shadow DOM
- ✅ 可配置的排除选择器
- ✅ 事件钩子系统

## 安装

```bash
npm install
```

## 构建

```bash
# 仅编译 TypeScript
npm run build:ts

# 完整构建（包括压缩和源码映射）
npm run build

# 监听文件变化并自动构建
npm run watch:ts

# 类型检查
npm run type-check
```

## 使用方法

### 基本用法

```typescript
// 启动检查器
theRoom.start();

// 停止检查器
theRoom.stop();

// 检查状态
console.log(theRoom.status()); // 'idle' | 'running' | 'stopped'
```

### 高级配置

```typescript
import { TheRoomOptions } from './src/types';

const options: TheRoomOptions = {
  inspector: '#my-inspector', // CSS 选择器或 HTMLElement
  htmlClass: true,            // 是否添加 CSS 类到 html 元素
  blockRedirection: false,    // 是否阻止页面重定向
  createInspector: true,      // 是否自动创建检查器元素
  excludes: ['.no-inspect'],  // 排除的选择器
  // 事件处理器
  starting: (target, event, originTarget, depth) => {
    console.log('检查器启动');
  },
  click: (target, event, originTarget, depth) => {
    console.log('点击了元素:', target);
  }
};

theRoom.start(options);
```

### 事件处理

```typescript
// 绑定事件处理器
theRoom.on('click', (target, event, originTarget, depth) => {
  console.log('点击元素:', target?.tagName);
});

theRoom.on('mousemove', (target, event, originTarget, depth) => {
  console.log('鼠标移动:', target?.className);
});

// 钩子事件（可以阻止默认行为）
theRoom.on('hook', (event) => {
  if (event.target?.classList.contains('no-inspect')) {
    return false; // 阻止检查
  }
  return true;
});
```

### 检查特定元素

```typescript
// 检查单个元素
const element = document.querySelector('#my-element');
theRoom.check(element);

// 检查多个元素
const elements = document.querySelectorAll('.my-elements');
theRoom.check(Array.from(elements));
```

### 高亮功能

```typescript
// 高亮当前检查的元素
theRoom.highLight('rgba(255, 0, 0, 0.3)');

// 取消高亮
theRoom.cancelHighLight();
```

## API 参考

### TheRoomAPI

```typescript
interface TheRoomAPI {
  start: (opts?: TheRoomOptions) => void;
  stop: (resetInspector?: boolean) => void;
  check: (el: HTMLElement | HTMLElement[]) => void;
  highLight: (color?: string) => void;
  cancelHighLight: () => void;
  on: (name: string, handler: EventHandler | HookEventHandler) => void;
  configure: (opts: TheRoomOptions) => void;
  status: () => Status;
}
```

### TheRoomOptions

```typescript
interface TheRoomOptions {
  inspector?: string | HTMLElement | undefined;
  htmlClass?: boolean;
  blockRedirection?: boolean;
  createInspector?: boolean;
  excludes?: string[];
  // 事件处理器
  starting?: EventHandler;
  started?: EventHandler;
  stopping?: EventHandler;
  stopped?: EventHandler;
  click?: EventHandler;
  mousemove?: EventHandler;
  keydown?: EventHandler;
  keyup?: EventHandler;
  mousedown?: EventHandler;
  hook?: HookEventHandler;
}
```

### 事件处理器类型

```typescript
type EventHandler = (
  target?: HTMLElement, 
  event?: Event, 
  originTarget?: HTMLElement, 
  depth?: number
) => void | boolean;

type HookEventHandler = (event: Event) => boolean | void;
```

## 键盘快捷键

- `Ctrl/Cmd + ↑`: 向上导航到父元素
- `Ctrl/Cmd + ↓`: 向下导航到子元素

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发

### 项目结构

```
src/
  ├── index.ts          # 主要实现文件
  ├── types.ts          # 类型定义
  └── index.d.ts        # 类型声明文件
dist/                   # 构建输出
  ├── index.js          # 编译后的 JavaScript
  ├── index.d.ts        # 类型定义文件
  └── index.min.js      # 压缩版本
```

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 许可证

MIT License
