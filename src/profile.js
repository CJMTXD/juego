import {weapons} from './data/weapons.js';
import {characters} from './data/characters.js';
import {depth as D} from './data/depth.js';
// Esquema v3: listas acotadas, claves conocidas y números finitos; nunca copiar objetos sin validar.
export function metaDefaults(){return {weapons:['needle'],weaponForms:{},tree:{vitality:0,stride:0,luck:0,discount:0},items:[],supers:[],skins:[],lore:[],rerolls:0,difficulty:0,marks:[],achievements:[],recipes:[],seenEnemies:[],seenBosses:[],seenItems:[],totalKills:0,totalGraze:0,deaths:0,totalDamage:0,history:[],fragments:[],dailyWins:[]};}
const safeInt=(x,max=1000000)=>Number.isSafeInteger(x)&&x>=0?Math.min(max,x):0;
const list=(v,valid,max=128)=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&valid(x)))].slice(0,max):[];
export function validateMeta(raw){
 const m=metaDefaults();if(!raw||typeof raw!=='object')return m;
 for(const id of Object.keys(weapons))if(Number.isInteger(raw.weaponForms?.[id])&&raw.weaponForms[id]>=1&&raw.weaponForms[id]<=4)m.weaponForms[id]=raw.weaponForms[id];
 m.weapons=[...new Set(['needle',...list(raw.weapons,id=>Object.hasOwn(weapons,id))])];
 for(const [id,config] of Object.entries(D.tree))m.tree[id]=safeInt(raw.tree?.[id],config.max);
 for(const k of ['items','supers','skins','lore','marks','achievements','recipes','seenEnemies','seenBosses','seenItems','fragments','dailyWins'])m[k]=list(raw[k],x=>/^[a-zA-Z0-9_:-]{1,80}$/.test(x),k==='dailyWins'?60:128);
 m.rerolls=safeInt(raw.rerolls,99);m.difficulty=safeInt(raw.difficulty,4);m.totalKills=safeInt(raw.totalKills);m.totalGraze=safeInt(raw.totalGraze);m.deaths=safeInt(raw.deaths);m.totalDamage=safeInt(raw.totalDamage);
 if(Array.isArray(raw.history))m.history=raw.history.slice(-D.economy.history).filter(r=>r&&typeof r==='object').map(r=>({seed:safeInt(r.seed,4294967295),kills:safeInt(r.kills),world:safeInt(r.world,6),echoes:safeInt(r.echoes),seconds:safeInt(r.seconds,86400),won:r.won===true,difficulty:safeInt(r.difficulty,4),character:Object.hasOwn(characters,r.character)?r.character:'remender',daily:typeof r.daily==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.daily)?r.daily:''}));
 return m;
}
