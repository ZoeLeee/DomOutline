import { TheRoomOptions, TheRoomAPI, Status, EventHandler, HookEventHandler } from './types';

(function (window: Window, document: Document, namespace: string) {
  let status: Status = 'idle';

  // 默认配置选项
  const options: TheRoomOptions = {
    inspector: undefined,
    htmlClass: true,
    blockRedirection: false,
    createInspector: false,
    excludes: [],
  };

  const getInspector = function (isCheck: boolean = false): HTMLElement {
    if (typeof options.inspector === 'string') {
      // 如果提供的 inspector 是 CSS 选择器，返回对应的元素
      const el = document.querySelector(options.inspector);
      if (el) return el as HTMLElement;
      else throw new Error('inspector element not found');
    }

    if (options.inspector instanceof Element) {
      // 如果提供的 inspector 是 DOM 元素，直接返回
      return options.inspector as HTMLElement;
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

  let inspectorList: HTMLElement | null = null;
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

  const getInspectors = (count: number): HTMLElement => {
    if (!inspectorList) {
      inspectorList = document.createElement('inspector-list');
      for (let i = 0; i < count; i++) {
        const _inspector = document.createElement('div');
        _inspector.style.cssText = inspectorListCsstext;
        _inspector.className = 'inspector-element';
        inspectorList.appendChild(_inspector);
      }
      document.body.appendChild(inspectorList);
    } else {
      const children = inspectorList.children;
      const len = children.length;
      if (len > count) {
        for (let i = len; i < count; i++) {
          const _inspector = document.createElement('div');
          _inspector.style.cssText = inspectorListCsstext;
          _inspector.className = 'inspector-element';
          inspectorList.appendChild(_inspector);
        }
      } else {
        for (let i = count; i < len; i++) {
          children[i]?.remove();
        }
      }
    }
    return inspectorList;
  };

  const getExclusionSelector = function (): string {
    return options.excludes?.join(',') || '';
  };

  const applyOptions = function (opts: TheRoomOptions): void {
    if (typeof opts !== 'object') {
      throw new Error('options is expected to be an object');
    }

    // 合并选项
    for (const opt in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, opt)) {
        (options as any)[opt] = (opts as any)[opt];
      }
    }
  };

  let depth = 0;
  let currentElement: HTMLElement | null = null;

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey) {
      let isExpand = false;
      if (event.key === 'ArrowUp') {
        isExpand = true;
        depth++;
      } else if (event.key === 'ArrowDown') {
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

  const handleMouseDown = (event: MouseEvent): void => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleKeyup = (event: KeyboardEvent): void => {
    // 事件调用
    eventController(event.type, undefined, event, undefined, depth);
  };

  const updateSelectBox = (
    target: HTMLElement,
    inspector: HTMLElement = options.inspector as HTMLElement
  ): void => {
    let bodyTop = 0;
    const currentRoot = target.getRootNode() as Document | ShadowRoot;
    const originRoot = inspector.getRootNode() as Document | ShadowRoot;

    // 是不同的根 并且是iframe 有些根元素是shadow-root 没有body
    if (currentRoot !== originRoot && 'body' in currentRoot && currentRoot.body) {
      inspector.parentElement?.remove();
      (currentRoot as Document).body?.appendChild(inspector.parentElement as HTMLElement);
    }

    document.documentElement.childNodes.forEach(function (i) {
      if (i.nodeType === Node.ELEMENT_NODE && (i as Element).tagName === 'DIV') {
        bodyTop += (i as HTMLElement).offsetHeight || 0;
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
      (inspector.firstElementChild as HTMLElement).innerText = target.nodeName;
    }
  };

  const eventEmitter = function (event: Event): void {
    // hook event invocation
    // do not emit mouseover and click events
    // if the hook event returns false
    if (eventController('hook', event) === false) return;

    let target = (event as any).path?.[0] as HTMLElement || event.target as HTMLElement;
    const originTarget = event.target as HTMLElement;

    if (depth > 0) {
      for (let i = 0; i < depth; i++) {
        target = target.parentElement as HTMLElement;
        if (!target) break;
      }
    }
    currentElement = target;
    // validation --skip inspector element itself--
    if (
      !target ||
      target === options.inspector ||
      target.hasAttribute('hint-panel')
    ) {
      return;
    }

    // do not inspect excluded elements
    const excludedSelector = getExclusionSelector();
    if (excludedSelector) {
      const excludedElements = Array.prototype.slice.call(
        document.querySelectorAll(excludedSelector)
      ) as HTMLElement[];
      if (excludedElements.indexOf(target) >= 0) return;
    }

    if (event.type === 'mousemove') {
      updateSelectBox(target);
    }

    // 当鼠标获取的元素上边界的和浏览器高度之差小于 元素块标题的高度时把元素块放到下面展示
    if (options.inspector && (options.inspector as HTMLElement).firstElementChild) {
      const firstChild = (options.inspector as HTMLElement).firstElementChild as HTMLElement;
      if (firstChild.innerText) {
        if ((event.target as HTMLElement).getBoundingClientRect().top < 5 + 30) {
          firstChild.style.top = '47px';
        } else {
          firstChild.style.top = '-41px';
        }
      }
    }

    // event invocation
    eventController(event.type, target, event, originTarget, depth);
  };

  const blockPageRedirection = (): boolean => {
    return true;
  };

  // 对Iframe 是否有访问权限
  const isBlockIFrame = (iframe: Window): boolean => {
    try {
      // 是否有访问权限
      iframe.document;
      return false;
    } catch (err) {
      return true;
    }
  };

  const engine = function (type: 'start' | 'stop', win?: Window): void {
    const htmlEl = document.querySelector('html') as HTMLHtmlElement;
    const isStart = !win;
    if (!win) win = window;

    const frames = win.frames;
    const length = frames.length;

    for (let i = 0; i < length; i++) {
      if (isBlockIFrame(frames[i] as Window)) continue;
      if (type === 'start') {
        if (isStart) (frames[i] as any)['__theroomWinIndexs'] = [i];
        else
          (frames[i] as any)['__theroomWinIndexs'] = [
            ...((win as any)['__theroomWinIndexs'] ?? []),
            i,
          ];
      }
      engine(type, frames[i] as Window);
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
      if (options.htmlClass === true) htmlEl.className += ' ' + namespace;

      status = 'running';
    } else if (type === 'stop') {
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

  const eventController = function (
    type: string, 
    arg?: HTMLElement | Event, 
    arg2?: Event, 
    arg3?: HTMLElement, 
    depth?: number
  ): boolean | void {
    const handler = (options as any)[type];
    if (!handler) return;
    if (typeof handler !== 'function') {
      throw new Error('event handler must be a function: ' + type);
    }

    // call the event
    return handler.call(null, arg, arg2, arg3, depth);
  };

  const start = function (opts?: TheRoomOptions): void {
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

  const stop = function (resetInspector?: boolean): void {
    eventController('stopping');
    depth = 0;
    // stop the inspection engine
    engine('stop');

    if (resetInspector === true && options.inspector) {
      const inspector = options.inspector as HTMLElement;
      inspector.style.top = '';
      inspector.style.left = '';
      inspector.style.width = '';
      inspector.style.height = '';
    }

    if (options.createInspector === true) {
      // remove auto generated inspector element on stop
      if (options?.inspector) {
        (options.inspector as HTMLElement)?.parentElement?.remove();
        options.inspector = undefined as any;
      }
    }

    if (inspectorList) {
      inspectorList.remove();
      inspectorList = null;
    }

    eventController('stopped');
  };

  const check = function (el: HTMLElement | HTMLElement[]): void {
    if (Array.isArray(el)) {
      const list = getInspectors(el.length);
      const elList = Array.from(list.children) as HTMLElement[];
      for (let i = 0; i < el.length; i++) {
        const inspector = elList[i];
        if (inspector) {
          updateSelectBox(el[i]!, inspector);
        }
      }
    } else {
      const inspector = getInspector(true);
      options.inspector = inspector;
      updateSelectBox(el, inspector);
    }
  };

  const eventBinder = function (name: string, handler: EventHandler | HookEventHandler): void {
    if (typeof name !== 'string') {
      throw new Error(
        'event name is expected to be a string but got: ' + typeof name
      );
    }
    if (typeof handler !== 'function') {
      throw new Error('event handler is not a function for: ' + name);
    }

    // update the event
    (options as any)[name] = handler;
  };

  // 高亮
  const highLight = (color: string = 'rgba(255, 229, 190, 0.4)'): void => {
    if (options.inspector) {
      (options.inspector as HTMLDivElement).style.background = color;
    }
  };

  // 取消高亮
  const cancelHighLight = (): void => {
    if (options.inspector) {
      (options.inspector as HTMLDivElement).style.background = 'unset';
    }
  };

  // make it accessible from outside
  const theRoomAPI: TheRoomAPI = {
    start: start,
    check: check,
    stop: stop,
    highLight,
    cancelHighLight,
    on: eventBinder,
    configure: function (opts: TheRoomOptions) {
      // merge provided options with defaults
      applyOptions(opts);
    },
    status: function (): Status {
      return status;
    },
  };

  (window as any)[namespace] = theRoomAPI;
})(window, document, 'theRoom');