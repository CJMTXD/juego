import {arsenal,fusions} from './data/fusions.js';
import {characters} from './data/characters.js';
import {upgrades} from './data.js';
import {expansion as A,familiars} from './data/expansion.js';
const int=(v,max=1000000)=>Number.isSafeInteger(v)&&v>=0?Math.min(v,max):0;
const ids=(v,allowed,max=100)=>Array.isArray(v)?[...new Set(v.filter(id=>allowed.includes(id)))].slice(0,max):[];
export function journeyDefaults(){return {version:1,weaponSkins:[],lastEcho:null,fusions:[],familiars:['ward','spark'],kills:{},victories:{},personal:{},spent:0,runs:0,spiralBest:0,weeklyWins:[]};}
export function validateJourney(raw){const m=journeyDefaults();if(!raw||raw.version!==1)return m;m.weaponSkins=ids(raw.weaponSkins,Object.keys(arsenal).filter(id=>int(raw.kills?.[id])>=A.mastery.kills[0]));m.fusions=ids(raw.fusions,fusions.map(f=>f.id));m.familiars=[...new Set([...m.familiars,...ids(raw.familiars,familiars.map(f=>f.id))])];for(const id of Object.keys(arsenal))if(int(raw.kills?.[id]))m.kills[id]=int(raw.kills[id]);for(const id of Object.keys(characters)){if(int(raw.victories?.[id]))m.victories[id]=int(raw.victories[id]);if(int(raw.personal?.[id],3))m.personal[id]=int(raw.personal[id],3);}for(const k of ['spent','runs','spiralBest'])m[k]=int(raw[k]);m.weeklyWins=Array.isArray(raw.weeklyWins)?[...new Set(raw.weeklyWins.filter(v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)))].slice(-60):[];const e=raw.lastEcho;if(e&&Object.hasOwn(characters,e.character)&&Object.hasOwn(arsenal,e.weapon))m.lastEcho={character:e.character,weapon:e.weapon,items:ids(e.items,upgrades.map(u=>u.id),A.rival.items)};return m;}
export function rememberJourney(w,save){const j=save.meta.journey;if(w.dailyKey||w.weeklyKey||w.cheated)return;for(const id of w.fusionsFound||[])if(!j.fusions.includes(id))j.fusions.push(id);j.lastEcho={character:w.character.id,weapon:w.mostUsed||w.character.weapon,items:Object.keys(w.inventory).filter(id=>upgrades.some(u=>u.id===id)).slice(0,A.rival.items)};}

// Los rangos solo conceden presentación; la pasiva personal es un +2% de carga.
export function profileRank(save){const points=save.meta.journey.spent+save.meta.journey.runs*A.profile.runPoints;let index=0;for(let n=0;n<A.profile.levels.length;n++)if(points>=A.profile.levels[n])index=n;return {index,points,title:A.profile.titles[index],next:A.profile.levels[index+1]||null};}
export function masteryRank(kills){return A.mastery.kills.filter(n=>kills>=n).length;}
export function noteSpent(save,amount){save.meta.journey.spent=Math.min(1000000,save.meta.journey.spent+Math.max(0,amount));}
