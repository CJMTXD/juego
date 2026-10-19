// Comprobación sin dependencias: evita publicar una caché incompleta al añadir módulos.
import fs from 'node:fs';import assert from 'node:assert/strict';
const sw=fs.readFileSync('sw.js','utf8'),files=JSON.parse(sw.match(/const FILES=(\[[\s\S]*?\]);/)[1]);
function visit(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?visit(dir+'/'+e.name):[dir+'/'+e.name]);}
for(const file of visit('src').filter(p=>p.endsWith('.js')))assert(files.includes(file),'Falta precaché de '+file);
for(const file of files)if(file!=='./')assert(fs.existsSync(file),'Recurso ausente: '+file);
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');for(const icon of manifest.icons){const data=fs.readFileSync(icon.src);const size=Number(icon.sizes.split('x')[0]);assert.equal(data.readUInt32BE(16),size);assert.equal(data.readUInt32BE(20),size);}
console.log('PWA: '+files.length+' recursos disponibles, todos los módulos en caché, rutas relativas e iconos correctos.');
