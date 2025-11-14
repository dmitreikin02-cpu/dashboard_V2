@echo off
chcp 65001 >nul
title Производственный Дашборд - Сервер

echo ╔════════════════════════════════════════════════╗
echo ║   Запуск Производственного Дашборда           ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Проверка наличия портативного Node.js
if not exist "node\node.exe" (
    echo ❌ ОШИБКА: Портативный Node.js не найден!
    echo.
    echo 📥 Скачайте портативную версию Node.js:
    echo    https://nodejs.org/dist/latest/
    echo.
    echo 📁 Распакуйте в папку: node\
    echo.
    echo Структура должна быть:
    echo    Dashboard\
    echo        node\
    echo            node.exe
    echo        dashboard.html
    echo        server.js
    echo        start.bat
    echo        [ваш_файл].xlsx
    echo.
    pause
    exit /b 1
)

REM Проверка наличия dashboard.html
if not exist "dashboard.html" (
    echo ❌ ОШИБКА: dashboard.html не найден!
    echo.
    pause
    exit /b 1
)

REM Проверка наличия server.js
if not exist "server.js" (
    echo ❌ ОШИБКА: server.js не найден!
    echo.
    pause
    exit /b 1
)

REM Проверка наличия Excel файла
set EXCEL_FOUND=0
for %%f in (*.xlsx) do (
    set EXCEL_FOUND=1
    goto :excel_check_done
)
:excel_check_done

if %EXCEL_FOUND%==0 (
    echo ⚠️  ПРЕДУПРЕЖДЕНИЕ: Excel файл (.xlsx) не найден в текущей папке!
    echo.
    echo 📊 Поместите Excel файл с данными в папку с дашбордом
    echo.
    pause
)

echo ✅ Все файлы найдены
echo.
echo 🚀 Запуск сервера...
echo.

REM Запуск Node.js сервера
node\node.exe server.js

REM Если сервер завершился с ошибкой
if errorlevel 1 (
    echo.
    echo ❌ Ошибка запуска сервера
    echo.
    pause
    exit /b 1
)

pause
