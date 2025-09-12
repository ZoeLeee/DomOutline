#!/usr/bin/env node

/**
 * 简单的 HTTP 服务器，用于运行 DomOutline 示例
 * 使用方法: node start-server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 3000;
const ROOT_DIR = __dirname;

// MIME 类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

// 获取文件 MIME 类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 默认页面
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(ROOT_DIR, pathname);
    
    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 - 文件未找到</title></head>
                    <body>
                        <h1>404 - 文件未找到</h1>
                        <p>请求的文件不存在: ${pathname}</p>
                        <a href="/">返回首页</a>
                    </body>
                </html>
            `);
            return;
        }
        
        // 读取文件
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 - 服务器错误</title></head>
                        <body>
                            <h1>500 - 服务器错误</h1>
                            <p>读取文件时发生错误: ${err.message}</p>
                        </body>
                    </html>
                `);
                return;
            }
            
            // 设置响应头
            const mimeType = getMimeType(filePath);
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        });
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`
🚀 DomOutline 示例服务器已启动！

📁 服务目录: ${ROOT_DIR}
🌐 访问地址: http://localhost:${PORT}
📖 主页面: http://localhost:${PORT}/index.html

📋 可用示例:
   • 基础使用: http://localhost:${PORT}/basic/
   • 高级配置: http://localhost:${PORT}/advanced/
   • 事件处理: http://localhost:${PORT}/events/
   • iframe 支持: http://localhost:${PORT}/iframe/
   • 自定义检查器: http://localhost:${PORT}/custom/

💡 提示: 按 Ctrl+C 停止服务器
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
        console.error(`   例如: node start-server.js ${PORT + 1}`);
    } else {
        console.error('❌ 服务器错误:', err.message);
    }
    process.exit(1);
});
