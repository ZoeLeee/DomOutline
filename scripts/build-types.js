#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 创建主要的 index.d.ts 文件
const indexDtsContent = `// 导出所有类型
export * from './types';

// 导出主要的 API
export { default as theRoom } from './browser';
export { default } from './browser';

// 全局变量声明
declare global {
  interface Window {
    theRoom: import('./types').TheRoomAPI;
  }
}
`;

// 写入文件
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.d.ts');

fs.writeFileSync(indexPath, indexDtsContent);
console.log('✅ Created index.d.ts');
