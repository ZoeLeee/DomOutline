import { TheRoomOptions, TheRoomAPI, Status, EventHandler, HookEventHandler } from './types';

// TheRoom 类实现
export class TheRoom implements TheRoomAPI {
  private _status: Status = 'idle';
  private options: TheRoomOptions = {
    inspector: undefined,
    htmlClass: true,
    blockRedirection: false,
    createInspector: false,
    excludes: [],
  };

  private depth = 0;
  private currentElement: HTMLElement | null = null;
  private inspectorList: HTMLElement | null = null;

  private getInspector(isCheck: boolean = false): HTMLElement {
    if (typeof this.options.inspector === 'string') {
      const el = document.querySelector(this.options.inspector);
      if (el) return el as HTMLElement;
      else throw new Error('inspector element not found');
    }

    if (this.options.inspector instanceof Element) {
      return this.options.inspector as HTMLElement;
    }

    if (!this.options.inspector && this.options.createInspector) {
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
  }

  private updateSelectBox(target: HTMLElement, inspector: HTMLElement = this.options.inspector as HTMLElement): void {
    let bodyTop = 0;
    const currentRoot = target.getRootNode() as Document | ShadowRoot;
    const originRoot = inspector.getRootNode() as Document | ShadowRoot;

    if (currentRoot !== originRoot && 'body' in currentRoot && currentRoot.body) {
      inspector.parentElement?.remove();
      (currentRoot as Document).body?.appendChild(inspector.parentElement as HTMLElement);
    }

    document.documentElement.childNodes.forEach(function (i) {
      if (i.nodeType === Node.ELEMENT_NODE && (i as Element).tagName === 'DIV') {
        bodyTop += (i as HTMLElement).offsetHeight || 0;
      }
    });

    const pos = target.getBoundingClientRect();
    const scrollBaseRoot = ('body' in currentRoot && currentRoot.body) ? currentRoot : originRoot;
    const scrollTop = ('documentElement' in scrollBaseRoot && scrollBaseRoot.documentElement) 
      ? scrollBaseRoot.documentElement.scrollTop 
      : 0;
    const scrollLeft = ('documentElement' in scrollBaseRoot && scrollBaseRoot.documentElement) 
      ? scrollBaseRoot.documentElement.scrollLeft 
      : 0;

    const width = pos.width;
    const height = pos.height;
    const top = Math.max(0, pos.top - bodyTop + scrollTop);
    const left = Math.max(0, pos.left + scrollLeft);

    inspector.style.top = top + 'px';
    inspector.style.left = left + 'px';
    inspector.style.width = width + 'px';
    inspector.style.height = height + 'px';
    if (inspector.firstElementChild) {
      (inspector.firstElementChild as HTMLElement).innerText = target.nodeName;
    }
  }

  private eventEmitter = (event: Event): void => {
    if (this.eventController('hook', event) === false) return;

    let target = (event as any).path?.[0] as HTMLElement || event.target as HTMLElement;
    const originTarget = event.target as HTMLElement;

    if (this.depth > 0) {
      for (let i = 0; i < this.depth; i++) {
        target = target.parentElement as HTMLElement;
        if (!target) break;
      }
    }
    this.currentElement = target;

    if (
      !target ||
      target === this.options.inspector ||
      target.hasAttribute('hint-panel')
    ) {
      return;
    }

    const excludedSelector = this.options.excludes?.join(',') || '';
    if (excludedSelector) {
      const excludedElements = Array.prototype.slice.call(
        document.querySelectorAll(excludedSelector)
      ) as HTMLElement[];
      if (excludedElements.indexOf(target) >= 0) return;
    }

    if (event.type === 'mousemove') {
      this.updateSelectBox(target);
    }

    if (this.options.inspector && (this.options.inspector as HTMLElement).firstElementChild) {
      const firstChild = (this.options.inspector as HTMLElement).firstElementChild as HTMLElement;
      if (firstChild.innerText) {
        if ((event.target as HTMLElement).getBoundingClientRect().top < 5 + 30) {
          firstChild.style.top = '47px';
        } else {
          firstChild.style.top = '-41px';
        }
      }
    }

    this.eventController(event.type, target, event, originTarget, this.depth);
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey) {
      let isExpand = false;
      if (event.key === 'ArrowUp') {
        isExpand = true;
        this.depth++;
      } else if (event.key === 'ArrowDown') {
        isExpand = true;
        this.depth--;
      }
      if (this.depth < 0) {
        this.depth = 0;
      }
      if (isExpand && this.currentElement) {
        event.preventDefault();
        let parent = this.currentElement;
        for (let i = 0; i < this.depth; i++) {
          if (!parent.parentElement) {
            this.depth = i - 1;
            break;
          }
          parent = parent.parentElement;
        }
        this.updateSelectBox(parent);
      }
    }
    this.eventController(event.type, undefined, event, undefined, this.depth);
  };

  private handleMouseDown = (event: MouseEvent): void => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  private handleKeyup = (event: KeyboardEvent): void => {
    this.eventController(event.type, undefined, event, undefined, this.depth);
  };

  private engine(type: 'start' | 'stop', win?: Window): void {
    const htmlEl = document.querySelector('html') as HTMLHtmlElement;
    const isStart = !win;
    if (!win) win = window;

    const frames = win.frames;
    const length = frames.length;

    for (let i = 0; i < length; i++) {
      try {
        if (type === 'start') {
          if (isStart) (frames[i] as any)['__theroomWinIndexs'] = [i];
          else
            (frames[i] as any)['__theroomWinIndexs'] = [
              ...((win as any)['__theroomWinIndexs'] ?? []),
              i,
            ];
        }
        this.engine(type, frames[i] as Window);
      } catch (e) {
        // 跨域 iframe，跳过
        continue;
      }
    }

    if (type === 'start') {
      if (this.options.blockRedirection && isStart) {
        window.addEventListener('beforeunload', () => true);
      }

      win.document.addEventListener('click', this.eventEmitter, true);
      win.document.addEventListener('mousemove', this.eventEmitter);
      win.document.addEventListener('keydown', this.handleKeydown);
      win.document.addEventListener('keyup', this.handleKeyup);
      win.document.addEventListener('mousedown', this.handleMouseDown);

      if (this.options.htmlClass === true) htmlEl.className += ' theroom';

      this._status = 'running';
    } else if (type === 'stop') {
      win.document.removeEventListener('click', this.eventEmitter, true);
      win.document.removeEventListener('mousemove', this.eventEmitter);
      win.document.removeEventListener('keydown', this.handleKeydown);
      win.document.removeEventListener('keyup', this.handleKeyup);
      win.document.removeEventListener('mousedown', this.handleMouseDown);

      if (this.options.htmlClass === true)
        htmlEl.className = htmlEl.className.replace(' theroom', '');

      if (this.options.blockRedirection === true)
        window.removeEventListener('beforeunload', () => true);

      this._status = 'stopped';
    }
  }

  private eventController(
    type: string, 
    arg?: HTMLElement | Event, 
    arg2?: Event, 
    arg3?: HTMLElement, 
    depth?: number
  ): boolean | void {
    const handler = (this.options as any)[type];
    if (!handler) return;
    if (typeof handler !== 'function') {
      throw new Error('event handler must be a function: ' + type);
    }
    return handler.call(null, arg, arg2, arg3, depth);
  }

  // 公共 API 方法
  start(opts?: TheRoomOptions): void {
    if (opts) {
      this.configure(opts);
    }

    this.options.inspector = this.getInspector();

    this.eventController('starting');

    this.engine('start');

    this.eventController('started');
  }

  stop(resetInspector?: boolean): void {
    this.eventController('stopping');
    this.depth = 0;
    this.engine('stop');

    if (resetInspector === true && this.options.inspector) {
      const inspector = this.options.inspector as HTMLElement;
      inspector.style.top = '';
      inspector.style.left = '';
      inspector.style.width = '';
      inspector.style.height = '';
    }

    if (this.options.createInspector === true) {
      if (this.options?.inspector) {
        (this.options.inspector as HTMLElement)?.parentElement?.remove();
        this.options.inspector = undefined as any;
      }
    }

    if (this.inspectorList) {
      this.inspectorList.remove();
      this.inspectorList = null;
    }

    this.eventController('stopped');
  }

  check(el: HTMLElement | HTMLElement[]): void {
    if (Array.isArray(el)) {
      // 处理多个元素的情况
      for (const element of el) {
        const inspector = this.getInspector(true);
        this.updateSelectBox(element, inspector);
      }
    } else {
      const inspector = this.getInspector(true);
      this.options.inspector = inspector;
      this.updateSelectBox(el, inspector);
    }
  }

  highLight(color: string = 'rgba(255, 229, 190, 0.4)'): void {
    if (this.options.inspector) {
      (this.options.inspector as HTMLDivElement).style.background = color;
    }
  }

  cancelHighLight(): void {
    if (this.options.inspector) {
      (this.options.inspector as HTMLDivElement).style.background = 'unset';
    }
  }

  on(name: string, handler: EventHandler | HookEventHandler): void {
    if (typeof name !== 'string') {
      throw new Error('event name is expected to be a string but got: ' + typeof name);
    }
    if (typeof handler !== 'function') {
      throw new Error('event handler is not a function for: ' + name);
    }
    (this.options as any)[name] = handler;
  }

  configure(opts: TheRoomOptions): void {
    if (typeof opts !== 'object') {
      throw new Error('options is expected to be an object');
    }

    for (const opt in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, opt)) {
        (this.options as any)[opt] = (opts as any)[opt];
      }
    }
  }

  status(): Status {
    return this._status;
  }
}

// 创建默认实例
const theRoom = new TheRoom();

// 导出默认实例和类
export default theRoom;
