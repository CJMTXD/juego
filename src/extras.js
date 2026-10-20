import {grantMemory} from './memories.js';
import {memoryBalance as M} from './data/memories.js';
import {depth as D} from './data/depth.js';
import {extras as X,abilities} from './data/extras.js';
import {heal} from './rules.js';
export function configureSideRooms(w){
 // Mantener un refugio y sustituir el segundo desvío, sin cambiar las conexiones.
 const side=w.rooms.filter(r=>r.id>=9);const r=side[side.length-1];if(!r)return;
 r.kind=X.rooms.kinds[w.worldIndex];r.name=X.rooms.names[r.kind];r.used=false;r.repeats=0;
 if(r.kind==='challenge'||r.kind==='miniboss'){r.cleared=false;r.rewardTaken=false;r.waves=r.kind==='challenge'?D.rooms.challengeWaves:1;}
}
export function initExtras(w){w.abilityCharge=0;w.abilityTime=0;w.grazePulse=0;w.roomCoins=0;w.judgmentPower=0;w.judgmentHealth=0;w.numberCooldown=0;w.defeat={x:0,y:0,timer:0};w.tutorial={moved:0,dashed:false,shot:false,upgraded:false};configureSideRooms(w);}
export function canEnterRoom(w,room){return room.kind!=='secret'||w.grazes>=D.rooms.secretGraze||w.combos.length>0;}
export function enterSideRoom(w,r){if(['shop','altar','judgment','secret'].includes(r.kind)&&!r.used){if(r.kind==='secret'&&!r.secretFound){r.secretFound=true;w.secretVisits++;w.roomCoins+=X.rooms.secretCoins;w.events.push('reward');}w.status='room';}}
export function useRoom(w,action,recalculate){const r=w.rooms[w.roomId];if(w.status!=='room')return false;
 if(action==='leave'){w.status='playing';return true;}
 if(r.used)return false;
 if(action==='buy'&&r.kind==='shop'){const u=w.shopOffer,cost=Math.ceil(D.rooms.shopCost*(1-(w.itemBonuses.shopDiscount||0)));if(!u||w.roomCoins<cost)return false;w.roomCoins-=cost;w.inventory[u.id]=(w.inventory[u.id]||0)+1;recalculate(w);}
 else if(action==='rest'&&r.kind==='altar'){if(w.roomCoins<D.rooms.altarCost)return false;w.roomCoins-=D.rooms.altarCost;heal(w,D.rooms.altarHeal);}
 else if(action==='power'&&r.kind==='judgment'){if(w.player.maxHp<=D.rooms.judgmentHealthCost)return false;w.judgmentHealth+=D.rooms.judgmentHealthCost;w.judgmentPower+=D.rooms.judgmentDamage;recalculate(w);}
 else if(action==='debt'&&r.kind==='judgment'){if(w.player.hp<=D.rooms.judgmentHealthCost)return false;w.player.hp-=D.rooms.judgmentHealthCost;w.roomCoins+=X.rooms.judgmentCoins;}
 else if(action==='secret'&&r.kind==='secret'){heal(w,1);w.knownFragments=[...new Set([...w.knownFragments,w.zone.id])];w.discoveryRevision++;}
 else return false;
 if(['judgment','secret'].includes(r.kind))grantMemory(w,r.kind,recalculate);r.used=true;w.status='playing';w.events.push('reward');return true;
}
export function repeatChallenge(w){const r=w.rooms[w.roomId];if(w.status!=='playing'||r.kind!=='challenge'||!r.cleared||!r.rewardTaken||w.player.hp<=D.rooms.challengeRepeatHealth)return false;w.player.hp-=D.rooms.challengeRepeatHealth;r.repeats++;r.cleared=false;r.rewardTaken=false;w.wave=0;w.spawnTimer=1.4;w.roomTime=0;return true;}
export function activateAbility(w){if(w.abilityCharge<D.graze.maximum)return false;const p=w.player;w.abilityCharge=0;w.abilityTime=D.graze.abilitySeconds+(w.itemBonuses.abilityDuration||0)+(w.inventory.oath?1:0)+(w.memoryBonuses?.duration||0);w.abilityTime=Math.max(M.abilityMin,Math.min(M.abilityMax,w.abilityTime));
 if(w.character.id==='remender')heal(w,X.ability.heal);
 if(w.character.id==='hollow')w.shield=true;
 if(w.character.id==='courier')p.dashCooldown=0;
 if(['remender','hollow'].includes(w.character.id)||w.memoryBonuses?.clear)for(const b of w.hostiles)if(b.active&&Math.hypot(b.x-p.x,b.y-p.y)<X.ability.clearRadius+(w.memoryBonuses?.clear||0))b.active=false;
 p.invulnerable=Math.max(p.invulnerable,X.ability.invulnerability);w.events.push('special');w.comboNotice=abilities[w.character.id].name;w.comboTimer=2;return true;
}
export function graze(w,b,sweptHit){const p=w.player;if(b.grazed||p.invulnerable>0||p.dashTime>0||sweptHit(b.px,b.py,b.x,b.y,p.x,p.y,p.radius+b.radius))return false;
 if(!sweptHit(b.px,b.py,b.x,b.y,p.x,p.y,p.radius+b.radius+D.graze.margin))return false;
 b.grazed=true;w.grazes++;w.abilityCharge=Math.min(D.graze.maximum,w.abilityCharge+D.graze.charge+(w.inventory.knot?1:0)+(w.itemBonuses.graze||0));w.grazePulse=X.graze.pulse;return true;}
export function updateExtras(w,input,dt){w.grazePulse=Math.max(0,w.grazePulse-dt);w.abilityTime=Math.max(0,w.abilityTime-dt);w.numberCooldown=Math.max(0,w.numberCooldown-dt);w.defeat.timer=Math.max(0,w.defeat.timer-dt);if(input.special)activateAbility(w);input.special=false;}
export function damageNumber(w,e,value,prefs){if(!prefs.damageNumbers||prefs.reducedEffects||w.numberCooldown>0)return;const p=w.particles.find(p=>!p.active);if(!p)return;w.numberCooldown=X.effects.numberCooldown;Object.assign(p,{active:true,kind:'number',value:Math.round(value*10)/10,x:e.x,y:e.y-20,vx:0,vy:-X.effects.numberSpeed,life:X.effects.numberLife});}
export function tutorialText(w,bindings){const t=w.tutorial;if(t.moved<X.tutorial.minimumMove)return 'Muévete con tus teclas de dirección. El punto claro es tu hitbox.';if(!t.shot)return 'Apunta con el ratón: el disparo es automático (o mantén clic si lo desactivaste).';if(!t.dashed)return 'Usa '+bindings.dash.replace('Key','')+' para un impulso breve e invulnerable.';if(!t.upgraded)return 'Completa una sala y elige una mejora temporal.';if(w.grazes<1)return 'Pasa cerca de un rombo sin tocarlo para cargar tu habilidad.';if(w.abilityCharge>=D.graze.maximum)return 'Habilidad cargada: pulsa '+bindings.special.replace('Key','')+'.';return '';}
