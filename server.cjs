// Servidor local sin dependencias para equipos que tengan Node.js.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const args=process.argv.slice(2),lan=args.includes('--lan'),portArg=args.indexOf('--port');
const port=portArg>=0?Number(args[portArg+1]):8000;
if(!Number.isInteger(port)||port<1||port>65535){console.error('Puerto no válido.');process.exit(1);}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs':'text/javascript', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  if (pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403); res.end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('No encontrado'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  });
});
server.on('error', error => { console.error('No se pudo iniciar el servidor:', error.message); process.exit(1); });
server.listen(port, lan?'0.0.0.0':'127.0.0.1', () => {
  console.log(`Juego disponible en http://127.0.0.1:${port}. Cierra con Ctrl+C.`);
  if(lan){for(const list of Object.values(require('node:os').networkInterfaces()))for(const address of list||[])if(address.family==='IPv4'&&!address.internal)console.log(`Celular en la misma Wi-Fi: http://${address.address}:${port}`);}
  if (process.argv.includes('--open') && process.platform === 'win32') {
    require('node:child_process').execFile('cmd.exe', ['/c', 'start', '', `http://127.0.0.1:${port}`], error => {
      if (error) console.log(`Abre http://127.0.0.1:${port} en tu navegador.`);
    });
  }
});
