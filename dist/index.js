/*!
* dom-outline v2.1.6
* A vanilla javascript plugin that allows you to outline DOM elements like web inspectors
* It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer
* MIT License
* by Joe Lee
*/
(function (window, document, namespace) {
    let status = 'idle';
    // 默认配置选项
    const options = {
        inspector: undefined,
        htmlClass: true,
        blockRedirection: false,
        createInspector: false,
        excludes: [],
    };
    const getInspector = function (isCheck = false) {
        if (typeof options.inspector === 'string') {
            // 如果提供的 inspector 是 CSS 选择器，返回对应的元素
            const el = document.querySelector(options.inspector);
            if (el)
                return el;
            else
                throw new Error('inspector element not found');
        }
        if (options.inspector instanceof Element) {
            // 如果提供的 inspector 是 DOM 元素，直接返回
            return options.inspector;
        }
        if (!options.inspector && options.createInspector) {
            // 创建 inspector 元素
            const inspectorCustom = document.createElement('inspector');
            document.body.appendChild(inspectorCustom);
            const _inspector = document.createElement('div');
            _inspector.style.cssText = `
        transition: all 200ms;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 912px;
        height: 630px;
        pointer-events: none;
        z-index: 99999999999999999999;
        border: solid 2px red;
      `;
            _inspector.className = 'inspector-element';
            inspectorCustom.appendChild(_inspector);
            if (!isCheck) {
                const message = document.createElement('div');
                _inspector.appendChild(message);
                message.style.cssText = `
           position:absolute;
           left:0;
           top:-41px;
           height:30px;
           line-height:30px;
           background:#333;
           color:#fff;
           padding:5px 10px;
           width:max-content;
           white-space:no-wrap;
         `;
            }
            return _inspector;
        }
        throw new Error('inspector must be a css selector or a DOM element');
    };
    let inspectorList = null;
    const inspectorListCsstext = `
  transition: all 200ms;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 912px;
  height: 630px;
  pointer-events: none;
  z-index: 99999999999999999999;
  border: solid 2px red;
`;
    const getInspectors = (count) => {
        var _a;
        if (!inspectorList) {
            inspectorList = document.createElement('inspector-list');
            for (let i = 0; i < count; i++) {
                const _inspector = document.createElement('div');
                _inspector.style.cssText = inspectorListCsstext;
                _inspector.className = 'inspector-element';
                inspectorList.appendChild(_inspector);
            }
            document.body.appendChild(inspectorList);
        }
        else {
            const children = inspectorList.children;
            const len = children.length;
            if (len > count) {
                for (let i = len; i < count; i++) {
                    const _inspector = document.createElement('div');
                    _inspector.style.cssText = inspectorListCsstext;
                    _inspector.className = 'inspector-element';
                    inspectorList.appendChild(_inspector);
                }
            }
            else {
                for (let i = count; i < len; i++) {
                    (_a = children[i]) === null || _a === void 0 ? void 0 : _a.remove();
                }
            }
        }
        return inspectorList;
    };
    const getExclusionSelector = function () {
        var _a;
        return ((_a = options.excludes) === null || _a === void 0 ? void 0 : _a.join(',')) || '';
    };
    const applyOptions = function (opts) {
        if (typeof opts !== 'object') {
            throw new Error('options is expected to be an object');
        }
        // 合并选项
        for (const opt in opts) {
            if (Object.prototype.hasOwnProperty.call(opts, opt)) {
                options[opt] = opts[opt];
            }
        }
    };
    let depth = 0;
    let currentElement = null;
    const handleKeydown = (event) => {
        if (event.ctrlKey || event.metaKey) {
            let isExpand = false;
            if (event.key === 'ArrowUp') {
                isExpand = true;
                depth++;
            }
            else if (event.key === 'ArrowDown') {
                isExpand = true;
                depth--;
            }
            if (depth < 0) {
                depth = 0;
            }
            if (isExpand && currentElement) {
                event.preventDefault();
                // 更新元素层级
                let parent = currentElement;
                for (let i = 0; i < depth; i++) {
                    if (!parent.parentElement) {
                        depth = i - 1;
                        break;
                    }
                    parent = parent.parentElement;
                }
                updateSelectBox(parent);
            }
        }
        // 事件调用
        eventController(event.type, undefined, event, undefined, depth);
    };
    const handleMouseDown = (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    const handleKeyup = (event) => {
        // 事件调用
        eventController(event.type, undefined, event, undefined, depth);
    };
    const updateSelectBox = (target, inspector = options.inspector) => {
        var _a, _b;
        let bodyTop = 0;
        const currentRoot = target.getRootNode();
        const originRoot = inspector.getRootNode();
        // 是不同的根 并且是iframe 有些根元素是shadow-root 没有body
        if (currentRoot !== originRoot && 'body' in currentRoot && currentRoot.body) {
            (_a = inspector.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = currentRoot.body) === null || _b === void 0 ? void 0 : _b.appendChild(inspector.parentElement);
        }
        document.documentElement.childNodes.forEach(function (i) {
            if (i.nodeType === Node.ELEMENT_NODE && i.tagName === 'DIV') {
                bodyTop += i.offsetHeight || 0;
            }
        });
        // target.getRootNode 获取当前的根元素 iframe的话就会获取iframe内嵌的视图
        // get target element information
        const pos = target.getBoundingClientRect();
        // 滚轮的参考基准根元素-有body的情况下是Iframe或者 原始页面 使用currentRoot 没有的情况下 可能是影子节点 root没有body 用的原始的
        const scrollBaseRoot = ('body' in currentRoot && currentRoot.body) ? currentRoot : originRoot;
        const scrollTop = ('documentElement' in scrollBaseRoot && scrollBaseRoot.documentElement)
            ? scrollBaseRoot.documentElement.scrollTop
            : 0;
        const scrollLeft = ('documentElement' in scrollBaseRoot && scrollBaseRoot.documentElement)
            ? scrollBaseRoot.documentElement.scrollLeft
            : 0;
        // 保存当前状态（这些变量可能在未来版本中使用）
        // currentScrollLeft = scrollLeft;
        // currentScrollTop = scrollTop;
        // currentBodyTop = bodyTop;
        const width = pos.width;
        const height = pos.height;
        const top = Math.max(0, pos.top - bodyTop + scrollTop);
        const left = Math.max(0, pos.left + scrollLeft);
        // 设置 inspector 元素位置和尺寸
        inspector.style.top = top + 'px';
        inspector.style.left = left + 'px';
        inspector.style.width = width + 'px';
        inspector.style.height = height + 'px';
        if (inspector.firstElementChild) {
            inspector.firstElementChild.innerText = target.nodeName;
        }
    };
    const eventEmitter = function (event) {
        var _a;
        // hook event invocation
        // do not emit mouseover and click events
        // if the hook event returns false
        if (eventController('hook', event) === false)
            return;
        let target = ((_a = event.path) === null || _a === void 0 ? void 0 : _a[0]) || event.target;
        const originTarget = event.target;
        if (depth > 0) {
            for (let i = 0; i < depth; i++) {
                target = target.parentElement;
                if (!target)
                    break;
            }
        }
        currentElement = target;
        // validation --skip inspector element itself--
        if (!target ||
            target === options.inspector ||
            target.hasAttribute('hint-panel')) {
            return;
        }
        // do not inspect excluded elements
        const excludedSelector = getExclusionSelector();
        if (excludedSelector) {
            const excludedElements = Array.prototype.slice.call(document.querySelectorAll(excludedSelector));
            if (excludedElements.indexOf(target) >= 0)
                return;
        }
        if (event.type === 'mousemove') {
            updateSelectBox(target);
        }
        // 当鼠标获取的元素上边界的和浏览器高度之差小于 元素块标题的高度时把元素块放到下面展示
        if (options.inspector && options.inspector.firstElementChild) {
            const firstChild = options.inspector.firstElementChild;
            if (firstChild.innerText) {
                if (event.target.getBoundingClientRect().top < 5 + 30) {
                    firstChild.style.top = '47px';
                }
                else {
                    firstChild.style.top = '-41px';
                }
            }
        }
        // event invocation
        eventController(event.type, target, event, originTarget, depth);
    };
    const blockPageRedirection = () => {
        return true;
    };
    // 对Iframe 是否有访问权限
    const isBlockIFrame = (iframe) => {
        try {
            // 是否有访问权限
            iframe.document;
            return false;
        }
        catch (err) {
            return true;
        }
    };
    const engine = function (type, win) {
        var _a;
        const htmlEl = document.querySelector('html');
        const isStart = !win;
        if (!win)
            win = window;
        const frames = win.frames;
        const length = frames.length;
        for (let i = 0; i < length; i++) {
            if (isBlockIFrame(frames[i]))
                continue;
            if (type === 'start') {
                if (isStart)
                    frames[i]['__theroomWinIndexs'] = [i];
                else
                    frames[i]['__theroomWinIndexs'] = [
                        ...((_a = win['__theroomWinIndexs']) !== null && _a !== void 0 ? _a : []),
                        i,
                    ];
            }
            engine(type, frames[i]);
        }
        if (type === 'start') {
            if (options.blockRedirection && isStart) {
                // block page redirection
                window.addEventListener('beforeunload', blockPageRedirection);
            }
            // bind event listeners
            win.document.addEventListener('click', eventEmitter, true);
            win.document.addEventListener('mousemove', eventEmitter);
            win.document.addEventListener('keydown', handleKeydown);
            win.document.addEventListener('keyup', handleKeyup);
            win.document.addEventListener('mousedown', handleMouseDown);
            // add namespace to HTML tag class list
            if (options.htmlClass === true)
                htmlEl.className += ' ' + namespace;
            status = 'running';
        }
        else if (type === 'stop') {
            // remove binded event listeners
            win.document.removeEventListener('click', eventEmitter, true);
            win.document.removeEventListener('mousemove', eventEmitter);
            win.document.removeEventListener('keydown', handleKeydown);
            win.document.removeEventListener('keyup', handleKeyup);
            win.document.removeEventListener('mousedown', handleMouseDown);
            // remove namespace from HTML tag class list
            if (options.htmlClass === true)
                htmlEl.className = htmlEl.className.replace(' ' + namespace, '');
            // remove blocking page redirection
            if (options.blockRedirection === true)
                window.removeEventListener('beforeunload', blockPageRedirection);
            status = 'stopped';
        }
    };
    const eventController = function (type, arg, arg2, arg3, depth) {
        const handler = options[type];
        if (!handler)
            return;
        if (typeof handler !== 'function') {
            throw new Error('event handler must be a function: ' + type);
        }
        // call the event
        return handler.call(null, arg, arg2, arg3, depth);
    };
    const start = function (opts) {
        if (opts) {
            theRoomAPI.configure(opts);
        }
        // get the inspector element
        options.inspector = getInspector();
        eventController('starting');
        // start the inspection engine
        engine('start');
        eventController('started');
    };
    const stop = function (resetInspector) {
        var _a, _b;
        eventController('stopping');
        depth = 0;
        // stop the inspection engine
        engine('stop');
        if (resetInspector === true && options.inspector) {
            const inspector = options.inspector;
            inspector.style.top = '';
            inspector.style.left = '';
            inspector.style.width = '';
            inspector.style.height = '';
        }
        if (options.createInspector === true) {
            // remove auto generated inspector element on stop
            if (options === null || options === void 0 ? void 0 : options.inspector) {
                (_b = (_a = options.inspector) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                options.inspector = undefined;
            }
        }
        if (inspectorList) {
            inspectorList.remove();
            inspectorList = null;
        }
        eventController('stopped');
    };
    const check = function (el) {
        if (Array.isArray(el)) {
            const list = getInspectors(el.length);
            const elList = Array.from(list.children);
            for (let i = 0; i < el.length; i++) {
                const inspector = elList[i];
                if (inspector) {
                    updateSelectBox(el[i], inspector);
                }
            }
        }
        else {
            const inspector = getInspector(true);
            options.inspector = inspector;
            updateSelectBox(el, inspector);
        }
    };
    const eventBinder = function (name, handler) {
        if (typeof name !== 'string') {
            throw new Error('event name is expected to be a string but got: ' + typeof name);
        }
        if (typeof handler !== 'function') {
            throw new Error('event handler is not a function for: ' + name);
        }
        // update the event
        options[name] = handler;
    };
    // 高亮
    const highLight = (color = 'rgba(255, 229, 190, 0.4)') => {
        if (options.inspector) {
            options.inspector.style.background = color;
        }
    };
    // 取消高亮
    const cancelHighLight = () => {
        if (options.inspector) {
            options.inspector.style.background = 'unset';
        }
    };
    // make it accessible from outside
    const theRoomAPI = {
        start: start,
        check: check,
        stop: stop,
        highLight,
        cancelHighLight,
        on: eventBinder,
        configure: function (opts) {
            // merge provided options with defaults
            applyOptions(opts);
        },
        status: function () {
            return status;
        },
    };
    window[namespace] = theRoomAPI;
})(window, document, 'theRoom');
export {};
