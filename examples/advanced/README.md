# 高级配置示例

这个示例展示了 DomOutline 的高级配置选项和自定义功能。

## 功能演示

- **自定义检查器元素**: 使用自定义的检查器元素而不是自动创建的
- **排除选择器**: 配置哪些元素不应该被检查
- **事件钩子**: 使用钩子函数控制检查行为
- **详细的事件日志**: 查看所有检查器事件的详细信息
- **配置选项**: 演示各种配置选项的效果

## 运行示例

1. 确保已经构建了项目：
   ```bash
   npm run build
   ```

2. 在浏览器中打开 `examples/advanced/index.html`

3. 配置各种选项：
   - 选择检查器类型（自动创建或自定义）
   - 设置排除选择器
   - 配置其他选项

4. 点击"启动检查器"按钮

5. 观察事件日志中的详细信息

## 配置选项说明

### 检查器元素

```javascript
// 自动创建检查器
const config = {
    createInspector: true
};

// 使用自定义检查器元素
const config = {
    inspector: document.getElementById('customInspector'),
    createInspector: false
};
```

### 排除选择器

```javascript
const config = {
    excludes: ['.excluded', '.no-inspect', '#skip-me']
};
```

### 事件处理器

```javascript
const config = {
    starting: (target, event, originTarget, depth) => {
        console.log('检查器正在启动');
    },
    started: (target, event, originTarget, depth) => {
        console.log('检查器已启动');
    },
    click: (target, event, originTarget, depth) => {
        console.log('点击了元素:', target.tagName);
    },
    hook: (event) => {
        // 钩子函数，可以阻止检查
        if (event.target.classList.contains('no-inspect')) {
            return false; // 阻止检查
        }
        return true; // 允许检查
    }
};
```

### 其他选项

```javascript
const config = {
    htmlClass: true,        // 添加 theroom 类到 HTML 元素
    blockRedirection: false // 是否阻止页面重定向
};
```

## 事件类型

- `starting`: 检查器启动前
- `started`: 检查器启动后
- `stopping`: 检查器停止前
- `stopped`: 检查器停止后
- `click`: 点击元素
- `mousemove`: 鼠标移动
- `keydown`: 键盘按下
- `keyup`: 键盘释放
- `mousedown`: 鼠标按下
- `hook`: 钩子事件（可以阻止检查）

## 钩子函数

钩子函数是一个特殊的处理器，可以在检查发生前进行拦截：

```javascript
theRoom.on('hook', (event) => {
    // 检查事件目标
    if (event.target.classList.contains('no-inspect')) {
        return false; // 阻止检查
    }
    return true; // 允许检查
});
```

## 注意事项

- 钩子函数返回 `false` 会阻止检查
- 排除选择器使用 CSS 选择器语法
- 自定义检查器元素需要设置正确的样式
- 事件日志可以帮助调试检查器行为
