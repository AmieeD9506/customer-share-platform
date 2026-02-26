@echo off
echo 启动前端开发服务器...

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
)

REM 使用完整路径执行vite
node_modules\.bin\vite

pause