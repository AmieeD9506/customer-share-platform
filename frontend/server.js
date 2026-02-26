const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  
  // 处理根路径
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
  }
  // 处理其他静态文件
  else {
    const filePath = path.join(__dirname, req.url);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.readFile(filePath, (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading file');
            return;
          }
          
          // 设置正确的Content-Type
          const ext = path.extname(filePath);
          let contentType = 'text/plain';
          switch (ext) {
            case '.html': contentType = 'text/html'; break;
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.json': contentType = 'application/json'; break;
          }
          
          res.writeHead(200, {'Content-Type': contentType});
          res.end(content);
        });
      } else {
        res.writeHead(404);
        res.end('File not found');
      }
    });
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`前端服务运行在 http://localhost:${PORT}`);
  console.log('默认账号：admin / 123456');
});

console.log('正在启动前端服务...');
console.log('端口:', PORT);
