import {weapons} from '../data/weapons.js';
import {upgrades} from '../data.js';
import {pacts} from '../data/depth.js';
// Preferencias de presentación; no contienen reglas ni estadísticas de combate.
export function uiDefaults(){return {lastWeapon:'needle',lastInitial:'ember',difficulty:0,startWorld:0,pacts:[]};}
export function validateUi(raw){const u=uiDefaults();if(!raw||typeof raw!=='object')return u;if(Object.hasOwn(weapons,raw.lastWeapon))u.lastWeapon=raw.lastWeapon;if(upgrades.some(x=>x.id===raw.lastInitial))u.lastInitial=raw.lastInitial;for(const [key,max] of [['difficulty',4],['startWorld',5]])if(Number.isInteger(raw[key])&&raw[key]>=0&&raw[key]<=max)u[key]=raw[key];if(Array.isArray(raw.pacts))u.pacts=[...new Set(raw.pacts.filter(id=>pacts.some(p=>p.id===id)))].slice(0,5);return u;}
