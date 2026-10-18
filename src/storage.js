import {characters} from './data/characters.js';
import { defaults } from './data.js';
const KEY='ascenso-save-v1';
export function freshSave() { return {version:2, preferences:{character:'remender',bindings:{...defaults},autoFire:true, muted:false,reducedEffects:false},progress:{echoes:0,runs:0,wins:0,unlocks:0,totalEchoes:0,worlds:1,bossMask:0,characters:['remender']}}; }
const validKey = key => typeof key==='string' && /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|ShiftLeft|ShiftRight)$/.test(key);
export function validateSave(raw) {
 const save=freshSave();
 if (!raw || ![1,2].includes(raw.version)) return save;
 const pref=raw.preferences;
 if(characters[pref?.character])save.preferences.character=pref.character;
 if(pref && typeof pref==='object') {
  for(const k of ['autoFire','muted','reducedEffects']) if(typeof pref[k]==='boolean')save.preferences[k]=pref[k];
  const b={...defaults,...pref.bindings};
  if(b && Object.keys(defaults).every(k=>validKey(b[k])) && new Set(Object.keys(defaults).map(k=>b[k])).size===Object.keys(defaults).length) save.preferences.bindings=Object.fromEntries(Object.keys(defaults).map(k=>[k,b[k]]));
 }
 for(const key of ['echoes','runs','wins','unlocks','totalEchoes','worlds','bossMask']) {
  const value=raw.progress?.[key];
  if(Number.isSafeInteger(value)&&value>=0&&value<=1000000)save.progress[key]=value;
 }
 if(Array.isArray(raw.progress?.characters))save.progress.characters=[...new Set(['remender',...raw.progress.characters.filter(id=>characters[id])])];
 save.progress.totalEchoes=Math.max(save.progress.totalEchoes,save.progress.echoes);
 save.progress.worlds=Math.max(1,Math.min(6,save.progress.worlds));save.progress.bossMask&=63;
 save.progress.unlocks=Math.min(2,save.progress.unlocks);
 return save;
}
export function loadSave() { try {return {save:validateSave(JSON.parse(localStorage.getItem(KEY))),error:false};}catch{return {save:freshSave(),error:true};} }
export function persist(save) { try {localStorage.setItem(KEY,JSON.stringify(save));return true;}catch{return false;} }
export { validKey };
