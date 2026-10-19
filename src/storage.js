import {metaDefaults,validateMeta} from './profile.js';
import {characters} from './data/characters.js';
import { defaults } from './data.js';
const KEY='ascenso-save-v1';
export function freshSave() { return {version:3,meta:metaDefaults(), preferences:{character:'remender',skin:'base',bindings:{...defaults},autoFire:true, muted:false,music:true,reducedEffects:false,colorblind:false,highlightBullets:false,disableFlash:false,disableShake:false,damageNumbers:false,tutorial:true,hitboxScale:1},progress:{echoes:0,runs:0,wins:0,unlocks:0,totalEchoes:0,worlds:1,bossMask:0,characters:['remender']}}; }
const validKey = key => typeof key==='string' && /^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Space|ShiftLeft|ShiftRight)$/.test(key);
export function validateSave(raw) {
 const save=freshSave();
 if (!raw || ![1,2,3].includes(raw.version)) return save;
 save.meta=validateMeta(raw.meta);
 const pref=raw.preferences;
 if(['base','memory','ascendant'].includes(pref?.skin))save.preferences.skin=pref.skin;
 if(typeof pref?.character==='string'&&Object.hasOwn(characters,pref.character))save.preferences.character=pref.character;
 if(pref && typeof pref==='object') {
  for(const k of ['autoFire','muted','music','reducedEffects','colorblind','highlightBullets','disableFlash','disableShake','damageNumbers','tutorial']) if(typeof pref[k]==='boolean')save.preferences[k]=pref[k];
  if([1,1.5,2].includes(pref.hitboxScale))save.preferences.hitboxScale=pref.hitboxScale;
  const b={...defaults,...pref.bindings};
  if(pref.bindings&&!pref.bindings.swap)b.swap=['KeyQ','KeyE','KeyR','KeyX','KeyZ','KeyC'].find(key=>!Object.values(pref.bindings).includes(key))||'KeyQ';
  if(pref.bindings&&!pref.bindings.special)b.special=['KeyE','KeyR','KeyX','KeyZ','KeyC','KeyT'].find(key=>!Object.entries(b).some(([id,value])=>id!=='special'&&value===key))||'KeyE';
  if(b && Object.keys(defaults).every(k=>validKey(b[k])) && new Set(Object.keys(defaults).map(k=>b[k])).size===Object.keys(defaults).length) save.preferences.bindings=Object.fromEntries(Object.keys(defaults).map(k=>[k,b[k]]));
 }
 for(const key of ['echoes','runs','wins','unlocks','totalEchoes','worlds','bossMask']) {
  const value=raw.progress?.[key];
  if(Number.isSafeInteger(value)&&value>=0&&value<=1000000)save.progress[key]=value;
 }
 if(Array.isArray(raw.progress?.characters))save.progress.characters=[...new Set(['remender',...raw.progress.characters.filter(id=>typeof id==='string'&&Object.hasOwn(characters,id))])];
 save.progress.totalEchoes=Math.max(save.progress.totalEchoes,save.progress.echoes);
 if(raw.version===1&&save.progress.wins>0){save.progress.bossMask|=1;save.progress.worlds=Math.max(2,save.progress.worlds);}
 save.progress.worlds=Math.max(1,Math.min(6,save.progress.worlds));save.progress.bossMask&=63;for(let i=0;i<6;i++)if(save.progress.bossMask&(1<<i))save.progress.worlds=Math.max(save.progress.worlds,Math.min(6,i+2));
 save.progress.unlocks=Math.min(2,save.progress.unlocks);
 return save;
}
export function loadSave(sandbox=false) { try {return {save:validateSave(JSON.parse(localStorage.getItem(sandbox?'ascenso-debug-v3':KEY))),error:false};}catch{return {save:freshSave(),error:true};} }
export function persist(save,sandbox=false) { try {localStorage.setItem(sandbox?'ascenso-debug-v3':KEY,JSON.stringify(save));return true;}catch{return false;} }
export { validKey };
