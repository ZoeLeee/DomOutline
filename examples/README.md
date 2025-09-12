# DomOutline 示例集合

这个目录包含了 DomOutline TypeScript 版本的各种使用示例，展示了库的不同功能和用法。

## 示例列表

### 1. 基础使用示例 (`basic/`)
- **文件**: `basic/index.html`
- **描述**: 学习 DomOutline 的基本使用方法
- **功能**: 启动检查器、鼠标交互、键盘导航、状态管理
- **适合**: 初学者和快速入门

### 2. 高级配置示例 (`advanced/`)
- **文件**: `advanced/index.html`
- **描述**: 探索高级配置选项和自定义功能
- **功能**: 自定义检查器、排除选择器、事件钩子、详细日志
- **适合**: 需要高级功能的开发者

### 3. 事件处理示例 (`events/`)
- **文件**: `events/index.html`
- **描述**: 深入了解各种事件处理器的使用
- **功能**: 鼠标事件、键盘事件、钩子事件、实时统计
- **适合**: 需要自定义事件处理的开发者

### 4. iframe 支持示例 (`iframe/`)
- **文件**: `iframe/index.html`
- **描述**: 展示 iframe 中的使用和跨框架检查
- **功能**: 跨框架检查、同源支持、跨域检测、多框架支持
- **适合**: 多页面应用和嵌入式内容开发者

### 5. 自定义检查器示例 (`custom/`)
- **文件**: `custom/index.html`
- **描述**: 学习如何创建自定义的检查器元素
- **功能**: 多种样式、动态切换、自定义标签、动画效果
- **适合**: 需要个性化设计的开发者

## 快速开始

### 1. 构建项目
```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

### 2. 运行示例
```bash
# 启动本地服务器（推荐）
npx serve examples

# 或者直接在浏览器中打开
open examples/index.html
```

### 3. 选择示例
- 打开 `examples/index.html` 查看所有示例
- 点击相应的示例卡片进入具体示例
- 按照示例中的说明进行操作

## 示例特性

### 完整的 TypeScript 支持
- 所有示例都使用 TypeScript 编写
- 完整的类型定义和类型安全
- 现代化的开发体验

### 响应式设计
- 所有示例都支持移动设备
- 自适应布局和交互
- 现代化的 UI 设计

### 详细文档
- 每个示例都有详细的 README 说明
- 代码注释和解释
- 最佳实践建议

### 实时交互
- 所有示例都可以实时运行
- 交互式配置和演示
- 实时日志和反馈

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **HTML5**: 现代 HTML 标准
- **CSS3**: 现代 CSS 特性
- **ES6+**: 现代 JavaScript 特性
- **DomOutline**: 核心检查器库

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发指南

### 添加新示例

1. 在 `examples/` 目录下创建新的子目录
2. 创建 `index.html` 文件
3. 创建 `README.md` 说明文档
4. 更新主 `index.html` 添加新示例链接

### 示例结构

```
examples/
├── index.html              # 主页面
├── README.md               # 总说明文档
├── basic/                  # 基础示例
│   ├── index.html
│   └── README.md
├── advanced/               # 高级示例
│   ├── index.html
│   └── README.md
├── events/                 # 事件处理示例
│   ├── index.html
│   └── README.md
├── iframe/                 # iframe 示例
│   ├── index.html
│   ├── iframe-content-1.html
│   ├── iframe-content-2.html
│   └── README.md
└── custom/                 # 自定义检查器示例
    ├── index.html
    └── README.md
```

### 代码规范

- 使用 TypeScript 编写所有 JavaScript 代码
- 遵循 ESLint 和 Prettier 配置
- 添加详细的代码注释
- 使用语义化的 HTML 结构
- 遵循 CSS 最佳实践

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 添加新示例或改进现有示例
4. 提交 Pull Request
5. 等待代码审查

## 许可证

MIT License - 详见项目根目录的 LICENSE 文件

## 支持

如果您在使用示例时遇到问题：

1. 查看相应的 README 文档
2. 检查浏览器控制台错误
3. 确认项目已正确构建
4. 在 GitHub 上提交 Issue

## 更新日志

### v2.1.6 (TypeScript 版本)
- 完整的 TypeScript 重构
- 添加 5 个详细示例
- 支持 iframe 和跨框架检查
- 自定义检查器功能
- 现代化 UI 设计
- 完整的类型定义
