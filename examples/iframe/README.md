# iframe 支持示例

这个示例展示了 DomOutline 在 iframe 中的使用和跨框架检查功能。

## 功能演示

- **跨框架检查**: 检查器可以检查 iframe 内的元素
- **同源 iframe**: 支持同源 iframe 的完整检查功能
- **跨域检测**: 自动检测并处理跨域 iframe
- **框架识别**: 在日志中显示元素是否在 iframe 中
- **多框架支持**: 同时支持多个 iframe 的检查

## 运行示例

1. 确保已经构建了项目：
   ```bash
   npm run build
   ```

2. 在浏览器中打开 `examples/iframe/index.html`

3. 点击"开始检查"按钮

4. 在 iframe 内容中进行交互：
   - 移动鼠标到 iframe 内的元素
   - 点击 iframe 内的按钮和链接
   - 使用键盘导航

5. 观察日志中的框架信息

## iframe 支持说明

### 同源 iframe

DomOutline 完全支持同源 iframe 的检查：

```javascript
// 检查器会自动检测并处理 iframe
theRoom.start({
    createInspector: true
});

// 事件处理器会显示元素是否在 iframe 中
theRoom.on('click', (target, event, originTarget, depth) => {
    const isInIframe = target.ownerDocument !== document;
    console.log('元素在 iframe 中:', isInIframe);
});
```

### 跨域 iframe

对于跨域 iframe，DomOutline 会：

1. 自动检测跨域限制
2. 跳过无法访问的 iframe
3. 在日志中显示警告信息

```javascript
// 检查器会自动处理跨域 iframe
theRoom.start({
    createInspector: true,
    starting: (target, event, originTarget, depth) => {
        console.log('检查器启动，自动处理 iframe');
    }
});
```

### 多框架支持

DomOutline 支持同时检查多个 iframe：

```javascript
// 检查器会遍历所有可访问的 iframe
theRoom.start({
    createInspector: true,
    click: (target, event, originTarget, depth) => {
        // 检查元素所在的文档
        const doc = target.ownerDocument;
        const isMainDoc = doc === document;
        const isIframe = doc !== document;
        
        if (isIframe) {
            console.log('元素在 iframe 中');
        } else {
            console.log('元素在主页面中');
        }
    }
});
```

## 技术实现

### 框架检测

DomOutline 使用以下方法检测 iframe：

```javascript
// 检查元素是否在 iframe 中
const isInIframe = target.ownerDocument !== document;

// 获取 iframe 元素
const iframe = target.ownerDocument.defaultView.frameElement;
```

### 跨域检测

```javascript
// 检测 iframe 是否可以访问
function canAccessIframe(iframe) {
    try {
        iframe.contentDocument;
        return true;
    } catch (e) {
        return false; // 跨域限制
    }
}
```

### 事件传播

DomOutline 会在所有可访问的框架中绑定事件：

```javascript
// 遍历所有 iframe 并绑定事件
function bindEventsToFrames(win) {
    const frames = win.frames;
    for (let i = 0; i < frames.length; i++) {
        if (canAccessIframe(frames[i])) {
            // 绑定事件到 iframe
            bindEvents(frames[i]);
        }
    }
}
```

## 使用场景

### 1. 多页面应用

```javascript
// 检查主页面和所有 iframe 中的元素
theRoom.start({
    createInspector: true,
    click: (target, event, originTarget, depth) => {
        const doc = target.ownerDocument;
        const frameInfo = doc === document ? '主页面' : 'iframe';
        console.log(`点击了 ${frameInfo} 中的元素:`, target.tagName);
    }
});
```

### 2. 嵌入式内容

```javascript
// 检查嵌入的第三方内容
theRoom.start({
    createInspector: true,
    excludes: ['.third-party'], // 排除第三方内容
    hook: (event) => {
        // 只检查特定 iframe 中的元素
        const iframe = event.target.ownerDocument.defaultView.frameElement;
        if (iframe && iframe.id === 'allowed-iframe') {
            return true;
        }
        return false;
    }
});
```

### 3. 开发调试

```javascript
// 调试多框架应用
theRoom.start({
    createInspector: true,
    click: (target, event, originTarget, depth) => {
        const doc = target.ownerDocument;
        const frameName = doc.defaultView.name || 'unnamed';
        console.log(`框架: ${frameName}, 元素: ${target.tagName}`);
    }
});
```

## 注意事项

- 跨域 iframe 无法被检查（浏览器安全限制）
- iframe 内容必须完全加载后才能被检查
- 检查器会自动处理 iframe 的显示位置
- 键盘导航在 iframe 中同样有效
- 事件处理器会接收正确的框架信息

## 浏览器兼容性

- Chrome 60+: 完全支持
- Firefox 55+: 完全支持
- Safari 12+: 完全支持
- Edge 79+: 完全支持

## 故障排除

### iframe 无法检查

1. 检查 iframe 是否同源
2. 确认 iframe 内容已完全加载
3. 检查控制台是否有跨域错误

### 检查器位置不正确

1. 检查 iframe 的 CSS 样式
2. 确认 iframe 的定位方式
3. 检查 z-index 设置

### 事件不触发

1. 确认 iframe 内容可访问
2. 检查事件绑定是否成功
3. 查看控制台错误信息
