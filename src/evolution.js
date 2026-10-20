import {weapons} from './data/weapons.js';
import {forms,evolutionEffects as E} from './data/evolutions.js';
import {depth as D} from './data/depth.js';
import {emit} from './projectiles.js';
export function buildForms(id){const base=weapons[id],result=[];let changes={};for(let index=0;index<4;index++){changes={...changes,...forms[id][index]};result.push({...base,...changes,id,level:index+1,damage:base.damage*(changes.damageFactor||1)*D.evolution.damage[index]});}return result;}
export function initEvolution(w){w.weaponProgress=Object.fromEntries(Object.keys(weapons).map(id=>[id,{kills:0,shots:0,level:1,bonus:0}]));w.weaponForms=Object.fromEntries(Object.keys(weapons).map(id=>[id,buildForms(id)]));w.allowedWeapons=Object.keys(weapons);w.evolutionPulse=0;w.reflectCooldown=0;}
export function creditWeaponKill(w,id){const progress=w.weaponProgress[id];if(!progress)return;progress.kills++;if(id==='needle'&&w.inventory.urn_cinder&&progress.kills%w.weaponMemories.needle.evolveEvery===0)progress.bonus++;const level=1+D.evolution.thresholds.filter(n=>progress.kills+(progress.bonus||0)>=n).length;if(level>progress.level){w.discoveryRevision++;progress.level=level;w.evolutionPulse=E.pulse;w.events.push('evolve');}}
export function startingChoices(w,unlocked){const own=w.character.weapon,available=unlocked.filter(id=>weapons[id]&&id!==own);const choices=[{id:own,loan:!unlocked.includes(own)}];while(choices.length<3){const pool=available.length?available:Object.keys(weapons).filter(id=>!choices.some(c=>c.id===id));const id=pool[Math.floor(w.random()*pool.length)];choices.push({id,loan:!unlocked.includes(id)});const n=available.indexOf(id);if(n>=0)available.splice(n,1);}return choices;}
export function prepareDraft(w,save){w.itemUnlocks=[...save.meta.items];w.superUnlocks=[...save.meta.supers];w.allowedWeapons=[...save.meta.weapons];w.draft=startingChoices(w,save.meta.weapons);w.status='draft';}
export function selectStartingWeapon(w,id){if(w.status!=='draft'||!w.draft.some(g=>g.id===id))return false;w.weaponSlots=[id];w.weaponIndex=0;w.status='playing';return true;}
function child(w,b,x,y,angle,damage,mode='straight'){const next=emit(w.allies,x,y,angle,E.childSpeed,E.childRadius,damage,0,b.shape);if(next){next.weaponId=b.weaponId;next.generation=1;next.mode=mode;}return next;}
export function projectileEffect(w,b,e){
 if(b.generation||!b.finalEffect)return;
 if(b.finalEffect==='split'){const a=Math.atan2(b.vy,b.vx);child(w,b,e.x,e.y,a-E.splitAngle,b.damage*E.splitDamage);child(w,b,e.x,e.y,a+E.splitAngle,b.damage*E.splitDamage);}
 if(b.finalEffect==='chain'){let target=null,distance=Infinity;for(const n of w.enemies)if(n.active&&n!==e){const d=(n.x-e.x)**2+(n.y-e.y)**2;if(d<distance){distance=d;target=n;}}if(target)child(w,b,e.x,e.y,Math.atan2(target.y-e.y,target.x-e.x),b.damage*E.chainDamage);}
 if(b.finalEffect==='frost')e.slowTime=E.frostSeconds;
 if(b.finalEffect==='sunfall'){const a=child(w,b,e.x,e.y,0,b.damage*E.sunfallDamage,'area');if(a){a.vx=0;a.vy=0;a.radius=E.sunfallRadius;a.delay=E.sunfallDelay;a.life=E.sunfallLife;a.pierce=15;}}
}
