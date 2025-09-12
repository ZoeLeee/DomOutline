// 导出所有类型和接口
export * from './types';

// 导出主要的 TheRoom API
export { default as theRoom, TheRoom } from './theroom';

// 为了向后兼容，也导出命名导出
export { TheRoomAPI, TheRoomOptions, Status, EventHandler, HookEventHandler } from './types';
