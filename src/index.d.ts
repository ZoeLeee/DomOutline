// 事件处理器类型定义
export type EventHandler = (target?: HTMLElement, event?: Event, originTarget?: HTMLElement, depth?: number) => void | boolean;

// 钩子事件处理器类型
export type HookEventHandler = (event: Event) => boolean | void;

// 配置选项接口
export interface TheRoomOptions {
  inspector?: string | HTMLElement;
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

// 状态类型
export type Status = 'idle' | 'running' | 'stopped';

// TheRoom API 接口
export interface TheRoomAPI {
  start: (opts?: TheRoomOptions) => void;
  stop: (resetInspector?: boolean) => void;
  check: (el: HTMLElement | HTMLElement[]) => void;
  highLight: (color?: string) => void;
  cancelHighLight: () => void;
  on: (name: string, handler: EventHandler | HookEventHandler) => void;
  configure: (opts: TheRoomOptions) => void;
  status: () => Status;
}

// 扩展 Window 接口
declare global {
  interface Window {
    theRoom: TheRoomAPI;
  }
}

// 扩展 HTMLElement 接口
declare global {
  interface HTMLElement {
    __theroomWinIndexs?: number[];
  }
}

// 扩展 Window 接口用于 iframe 索引
declare global {
  interface Window {
    __theroomWinIndexs?: number[];
  }
}

// 导出默认的 TheRoom API
export default TheRoomAPI;
