const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

function findFirstExcelFile() {
    const files = fs.readdirSync(__dirname);
    const excelFile = files.find(file => file.endsWith('.xlsx'));
    
    if (!excelFile) {
        console.error('❌ Excel файл (.xlsx) не найден в папке проекта!');
        return null;
    }
    
    console.log(`📊 Найден Excel файл: ${excelFile}`);
    return path.join(__dirname, excelFile);
}

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    if (url === '/' || url === '/dashboard.html') {
        const filePath = path.join(__dirname, 'dashboard.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка загрузки дашборда');
                console.error('Ошибка чтения dashboard.html:', err);
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
        
    } else if (url === '/excel') {
        const excelPath = findFirstExcelFile();
        
        if (!excelPath) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Excel файл не найден');
            return;
        }
        
        fs.stat(excelPath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка получения информации о файле');
                console.error('Ошибка stat Excel файла:', err);
                return;
            }
            
            res.setHeader('Last-Modified', stats.mtime.toUTCString());
            
            fs.readFile(excelPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Ошибка загрузки Excel файла');
                    console.error('Ошибка чтения Excel файла:', err);
                    return;
                }
                
                res.writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Length': data.length
                });
                res.end(data);
            });
        });
        
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Страница не найдена');
    }
});

server.listen(PORT, HOST, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   🚀 Производственный Дашборд запущен!        ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📡 Сервер работает на: http://localhost:${PORT}`);
    console.log(`🌐 Доступен по адресу: http://${HOST}:${PORT}`);
    console.log('');
    console.log('📋 Доступные адреса:');
    console.log(`   • Дашборд: http://localhost:${PORT}/`);
    console.log(`   • Excel данные: http://localhost:${PORT}/excel`);
    console.log('');
    console.log('🔄 Дашборд автоматически обновляется каждые 60 секунд');
    console.log('📊 Excel файл загружается без кеширования');
    console.log('');
    console.log('❌ Для остановки нажмите Ctrl+C');
    console.log('');
    
    const excelFile = findFirstExcelFile();
    if (excelFile) {
        console.log(`✅ Готов к работе с файлом: ${path.basename(excelFile)}`);
    }
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Остановка сервера...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Остановка сервера...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});
