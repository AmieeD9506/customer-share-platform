@echo off
echo ========================================
echo   启动客户信息共享平台前端服务
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 错误：依赖安装失败
        pause
        exit /b 1
    )
    echo 依赖安装完成
) else (
    echo 依赖已存在
)

echo.
echo [2/3] 启动前端服务...
echo 端口：3001
echo 访问地址：http://localhost:3001
echo.
echo 默认账号：
echo   管理员：admin / 123456
echo   员工：zhangsan / 123456
echo.
echo ========================================
echo.

REM 使用npx启动vite
call npx vite

pause