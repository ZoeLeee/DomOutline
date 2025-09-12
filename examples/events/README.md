# 事件处理示例

这个示例展示了 DomOutline 的各种事件处理器的使用方法和效果。

## 功能演示

- **鼠标事件**: 点击、移动、按下等鼠标交互事件
- **键盘事件**: 键盘按下、释放事件，包括导航快捷键
- **钩子事件**: 检查前的拦截器，可以控制检查行为
- **实时统计**: 显示各种事件的触发次数
- **事件日志**: 详细记录所有事件的发生情况

## 运行示例

1. 确保已经构建了项目：
   ```bash
   npm run build
   ```

2. 在浏览器中打开 `examples/events/index.html`

3. 点击"开始事件监听"按钮

4. 在交互区域进行各种操作：
   - 移动鼠标
   - 点击元素
   - 使用键盘（特别是 Ctrl+↑/↓）
   - 按下鼠标

5. 观察事件日志和统计信息

## 事件类型详解

### 鼠标事件

#### click 事件
```javascript
theRoom.on('click', (target, event, originTarget, depth) => {
    console.log('点击了元素:', {
        tagName: target.tagName,
        className: target.className,
        depth: depth
    });
});
```

#### mousemove 事件
```javascript
theRoom.on('mousemove', (target, event, originTarget, depth) => {
    // 注意：这个事件触发频率很高，建议添加节流
    if (target && Math.random() < 0.1) {
        console.log('鼠标移动到:', target.tagName);
    }
});
```

#### mousedown 事件
```javascript
theRoom.on('mousedown', (target, event, originTarget, depth) => {
    console.log('鼠标按下:', target.tagName);
});
```

### 键盘事件

#### keydown 事件
```javascript
theRoom.on('keydown', (target, event, originTarget, depth) => {
    if (event.ctrlKey) {
        if (event.key === 'ArrowUp') {
            console.log('向上导航');
        } else if (event.key === 'ArrowDown') {
            console.log('向下导航');
        }
    }
});
```

#### keyup 事件
```javascript
theRoom.on('keyup', (target, event, originTarget, depth) => {
    console.log('键盘释放:', event.key);
});
```

### 钩子事件

钩子事件是一个特殊的处理器，可以在检查发生前进行拦截：

```javascript
theRoom.on('hook', (event) => {
    // 检查事件目标
    if (event.target.classList.contains('no-inspect')) {
        console.log('阻止检查 .no-inspect 元素');
        return false; // 阻止检查
    }
    
    // 记录钩子调用
    console.log('钩子检查:', event.target.tagName);
    return true; // 允许检查
});
```

## 事件参数说明

所有事件处理器都接收以下参数：

- `target`: 当前检查的 HTMLElement
- `event`: 原始的事件对象
- `originTarget`: 事件最初的目标元素
- `depth`: 当前导航深度（用于键盘导航）

## 键盘导航

DomOutline 支持键盘导航功能：

- `Ctrl + ↑`: 向上导航到父元素
- `Ctrl + ↓`: 向下导航到子元素

导航深度会在事件参数中提供。

## 性能优化建议

### 减少 mousemove 事件频率
```javascript
let lastMoveTime = 0;
theRoom.on('mousemove', (target, event, originTarget, depth) => {
    const now = Date.now();
    if (now - lastMoveTime > 100) { // 限制为每100ms最多一次
        lastMoveTime = now;
        console.log('鼠标移动:', target.tagName);
    }
});
```

### 使用节流函数
```javascript
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

theRoom.on('mousemove', throttle((target, event, originTarget, depth) => {
    console.log('节流的鼠标移动事件');
}, 100));
```

## 注意事项

- `mousemove` 事件触发频率很高，建议添加节流或限制
- 钩子函数返回 `false` 会阻止检查
- 事件处理器中的 `target` 可能为 `undefined`
- 键盘导航深度从 0 开始，表示当前元素
- 所有事件都是可选的，只绑定需要的事件处理器
