import {arsenal as weapons} from '../src/data/fusions.js';
import {buildForms} from '../src/evolution.js';
import {weaponBalance} from '../src/data/weapon-balance.js';
import {evolutionEffects as E} from '../src/data/evolutions.js';
export function theoreticalDps(f){const hits=f.sideFactor?1+(f.count-1)*f.sideFactor:f.count;const returns=f.mode==='boomerang'?2:1;const pulses=f.finalEffect==='quake'?Math.ceil(E.quakeLife/E.quakeInterval):1;return f.damage*hits/f.interval*returns*pulses;}
if(process.argv[1]?.endsWith('weapon-balance.mjs')){const rows=[];for(const g of Object.values(weapons))for(const f of buildForms(g.id))rows.push({arma:g.name,nivel:f.level,daño:+f.damage.toFixed(2),cantidad:f.count,intervalo:f.interval,alcance:f.range,DPS_ideal:+theoreticalDps(f).toFixed(2),riesgo:weaponBalance[g.id]?.risk||'fusión: sacrifica dos armas; '+weaponBalance[g.base].risk});console.table(rows);console.log('Cuenta el daño reducido de satélites, ida/retorno y cuatro pulsos sísmicos. Excluye penetración, fallos y efectos secundarios de las otras formas finales. Las referencias son objetivos teóricos, no mediciones humanas.');}
