export type EventHandler = (target?: HTMLElement, event?: Event, originTarget?: HTMLElement, depth?: number) => void | boolean;
export type HookEventHandler = (event: Event) => boolean | void;
export interface TheRoomOptions {
    inspector?: string | HTMLElement | undefined;
    htmlClass?: boolean;
    blockRedirection?: boolean;
    createInspector?: boolean;
    excludes?: string[];
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
export type Status = 'idle' | 'running' | 'stopped';
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
declare global {
    interface Window {
        theRoom: TheRoomAPI;
    }
}
declare global {
    interface HTMLElement {
        __theroomWinIndexs?: number[];
    }
}
declare global {
    interface Window {
        __theroomWinIndexs?: number[];
    }
}
