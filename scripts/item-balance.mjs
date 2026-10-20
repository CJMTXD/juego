// Tabla revisable de costes/condiciones; las unidades de cada efecto están en su texto.
import {memoryItems,memorySourceNames,memoryBalance} from '../src/data/memories.js';
console.table(memoryItems.map(u=>({nombre:u.name,tradicion:u.myth,rareza:u.rarity,obtencion:memorySourceNames[u.source],arma:u.weapon||'Global/personaje',max:u.max,efecto:u.text})));
console.log('Topes adicionales',memoryBalance);
import {createWorld,offerUpgrades} from '../src/simulation.js';
import {prepareDraft} from '../src/evolution.js';import {freshSave} from '../src/storage.js';
function variety(include){let sum=0;for(let seed=1;seed<=50;seed++){const w=createWorld(seed);prepareDraft(w,freshSave());if(!include)for(const u of memoryItems)w.inventory[u.id]=u.max;const seen=new Set();for(let room=0;room<20;room++){offerUpgrades(w);for(const u of w.options)seen.add(u.id);const choice=w.options[0];if(!choice.service)w.inventory[choice.id]=(w.inventory[choice.id]||0)+1;}sum+=seen.size;}return sum/50;}
console.log('Ítems distintos ofrecidos en las primeras 20 recompensas, media de 50 semillas:',{sinNuevos:variety(false),conNuevos:variety(true)});
