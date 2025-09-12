# 基础使用示例

这个示例展示了 DomOutline 的基本使用方法。

## 功能演示

- **启动/停止检查器**: 点击按钮控制检查器的启动和停止
- **鼠标悬停检查**: 移动鼠标到不同元素上查看轮廓
- **点击元素检查**: 点击元素获取详细信息
- **键盘导航**: 使用 Ctrl+↑/↓ 导航到父/子元素
- **检查特定元素**: 点击按钮检查指定的元素

## 运行示例

1. 确保已经构建了项目：
   ```bash
   npm run build
   ```

2. 在浏览器中打开 `examples/basic/index.html`

3. 点击"开始检查"按钮启动检查器

4. 移动鼠标到页面上的不同元素，观察轮廓效果

5. 点击元素查看控制台输出的详细信息

## 代码说明

### 基本 API 使用

```javascript
// 启动检查器
theRoom.start();

// 停止检查器
theRoom.stop();

// 检查状态
const status = theRoom.status(); // 'idle' | 'running' | 'stopped'

// 检查特定元素
theRoom.check(document.querySelector('.card'));
```

### 事件处理

```javascript
// 绑定点击事件
theRoom.on('click', (target, event, originTarget, depth) => {
    console.log('点击了元素:', {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        depth: depth
    });
});

// 绑定鼠标移动事件
theRoom.on('mousemove', (target, event, originTarget, depth) => {
    // 处理鼠标移动逻辑
});
```

## 键盘快捷键

- `Ctrl + ↑`: 向上导航到父元素
- `Ctrl + ↓`: 向下导航到子元素

## 注意事项

- 检查器启动后，页面会添加 `theroom` CSS 类
- 检查器元素会显示在页面上，显示当前悬停的元素轮廓
- 可以通过控制台查看详细的事件信息
