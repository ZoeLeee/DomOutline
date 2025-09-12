# 自定义检查器示例

这个示例展示了如何创建和使用自定义的检查器元素，实现个性化的视觉效果。

## 功能演示

- **多种样式**: 提供4种不同的检查器样式
- **动态配置**: 实时切换检查器样式和功能
- **标签显示**: 可选的元素标签显示
- **信息显示**: 显示元素的尺寸信息
- **动画效果**: 可选的过渡动画效果
- **实时更新**: 检查器内容实时更新

## 运行示例

1. 确保已经构建了项目：
   ```bash
   npm run build
   ```

2. 在浏览器中打开 `examples/custom/index.html`

3. 配置检查器选项：
   - 选择检查器样式
   - 启用/禁用标签显示
   - 启用/禁用信息显示
   - 启用/禁用动画效果

4. 点击"启动自定义检查器"按钮

5. 在演示区域移动鼠标，观察自定义检查器的效果

## 自定义检查器实现

### 1. 创建自定义检查器元素

```html
<!-- 自定义检查器元素 -->
<div id="customInspector" class="custom-inspector style1" style="display: none;">
    <div class="label">元素标签</div>
    <div class="info">元素信息</div>
</div>
```

### 2. 定义检查器样式

```css
.custom-inspector {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    pointer-events: none;
    z-index: 999999;
    transition: all 0.2s ease;
}

.custom-inspector.style1 {
    border: 3px solid #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.custom-inspector.style2 {
    border: 3px solid #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
    border-radius: 8px;
}

.custom-inspector.style3 {
    border: 3px solid #45b7d1;
    background: rgba(69, 183, 209, 0.1);
    border-radius: 50%;
}

.custom-inspector.style4 {
    border: 3px solid #f9ca24;
    background: rgba(249, 202, 36, 0.1);
    transform: rotate(45deg);
}
```

### 3. 配置检查器

```javascript
// 使用自定义检查器
theRoom.start({
    inspector: document.getElementById('customInspector'),
    createInspector: false, // 不自动创建检查器
    click: (target, event, originTarget, depth) => {
        // 更新检查器内容
        const customInspector = document.getElementById('customInspector');
        const label = customInspector.querySelector('.label');
        const info = customInspector.querySelector('.info');
        
        if (target) {
            label.textContent = target.tagName;
            const rect = target.getBoundingClientRect();
            info.textContent = `${Math.round(rect.width)}×${Math.round(rect.height)}`;
        }
    }
});
```

## 样式选项详解

### 1. 红色边框样式
```css
.custom-inspector.style1 {
    border: 3px solid #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}
```
- 经典红色边框
- 半透明红色背景
- 适合调试和开发

### 2. 青色圆角样式
```css
.custom-inspector.style2 {
    border: 3px solid #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
    border-radius: 8px;
}
```
- 现代圆角设计
- 青色主题
- 适合现代UI

### 3. 蓝色圆形样式
```css
.custom-inspector.style3 {
    border: 3px solid #45b7d1;
    background: rgba(69, 183, 209, 0.1);
    border-radius: 50%;
}
```
- 圆形检查器
- 蓝色主题
- 独特的视觉效果

### 4. 黄色旋转样式
```css
.custom-inspector.style4 {
    border: 3px solid #f9ca24;
    background: rgba(249, 202, 36, 0.1);
    transform: rotate(45deg);
}
```
- 旋转45度效果
- 黄色主题
- 动态视觉效果

## 高级自定义

### 1. 动态样式切换

```javascript
function updateInspectorStyle(style) {
    const customInspector = document.getElementById('customInspector');
    
    // 移除所有样式类
    customInspector.className = 'custom-inspector';
    customInspector.classList.add(style);
    
    // 应用自定义样式
    switch(style) {
        case 'style1':
            customInspector.style.border = '3px solid #ff6b6b';
            customInspector.style.background = 'rgba(255, 107, 107, 0.1)';
            break;
        case 'style2':
            customInspector.style.border = '3px solid #4ecdc4';
            customInspector.style.background = 'rgba(78, 205, 196, 0.1)';
            customInspector.style.borderRadius = '8px';
            break;
        // ... 其他样式
    }
}
```

### 2. 自定义标签和信息

```javascript
function updateInspectorContent(target) {
    const customInspector = document.getElementById('customInspector');
    const label = customInspector.querySelector('.label');
    const info = customInspector.querySelector('.info');
    
    if (target) {
        // 更新标签
        label.textContent = target.tagName;
        
        // 更新信息
        const rect = target.getBoundingClientRect();
        const styles = window.getComputedStyle(target);
        info.textContent = `${Math.round(rect.width)}×${Math.round(rect.height)} | ${styles.position}`;
    }
}
```

### 3. 动画效果控制

```javascript
function toggleAnimation(enable) {
    const customInspector = document.getElementById('customInspector');
    
    if (enable) {
        customInspector.style.transition = 'all 0.2s ease';
    } else {
        customInspector.style.transition = 'none';
    }
}
```

## 使用场景

### 1. 品牌化设计
```javascript
// 使用品牌色彩
const brandInspector = {
    border: '3px solid #your-brand-color',
    background: 'rgba(your-brand-color, 0.1)',
    borderRadius: '4px'
};
```

### 2. 调试工具集成
```javascript
// 集成到开发工具
theRoom.start({
    inspector: debugInspector,
    createInspector: false,
    click: (target) => {
        // 显示调试信息
        showDebugInfo(target);
    }
});
```

### 3. 用户体验优化
```javascript
// 根据用户偏好调整
const userPreference = getUserPreference();
theRoom.start({
    inspector: createInspector(userPreference),
    createInspector: false
});
```

## 注意事项

- 自定义检查器元素必须设置正确的定位样式
- 确保检查器元素的 z-index 足够高
- 检查器元素应该设置 `pointer-events: none`
- 标签和信息元素需要适当的定位
- 考虑不同屏幕尺寸的适配

## 最佳实践

1. **性能优化**: 使用 CSS 变换而不是改变位置属性
2. **可访问性**: 确保检查器不会影响页面交互
3. **响应式设计**: 考虑不同设备的显示效果
4. **主题一致性**: 与整体设计风格保持一致
5. **用户反馈**: 提供清晰的视觉反馈
