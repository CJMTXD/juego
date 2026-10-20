import {memoryItems,memoryRecipes,memoryBalance as M} from './data/memories.js';
import {depth as D} from './data/depth.js';
import {relicBalance as R} from './data/relics.js';
import {heal} from './rules.js';
const byId=Object.fromEntries(memoryItems.map(u=>[u.id,u]));
export function memoryEligible(w,u){return (!u.minDifficulty||w.difficultyIndex>=u.minDifficulty)&&!(w.dailyKey&&u.source==='urn');}
// Se calcula al cambiar inventario; el combate solo consulta números y objetos ya creados.
export function recalculateMemories(w){const m={};w.weaponMemories={};for(const [id,count] of Object.entries(w.inventory)){const u=byId[id];if(!u||!count)continue;if(u.weapon)w.weaponMemories[u.weapon]=u.effects;else for(const [key,n] of Object.entries(u.effects))m[key]=(m[key]||0)+n;}
 for(const recipe of memoryRecipes)if(w.combos.includes(recipe.id))for(const [key,n] of Object.entries(recipe.bonuses))m[key]=(m[key]||0)+n;
 w.memoryBonuses=m;w.itemBonuses.dash=(w.itemBonuses.dash||0)+(m.dash||0);w.itemBonuses.heal=(w.itemBonuses.heal||0)+(m.heal||0);w.itemBonuses.burn=(w.itemBonuses.burn||0)+(m.burn||0);
 w.stats.damage=Math.min(D.caps.damage,w.stats.damage*(1+Math.min(M.damageCap,m.damage||0)));w.stats.speed=Math.min(D.caps.speed,w.stats.speed*(1+Math.min(M.speedCap,m.speed||0)));w.stats.bulletSpeed*=1+(m.bulletSpeed||0);w.player.maxHp=Math.min(D.caps.health,Math.max(1,w.player.maxHp+(m.health||0)));w.player.hp=Math.min(w.player.hp,w.player.maxHp);
}
export function memoryShotFactor(w,gun){const m=w.memoryBonuses||{},g=w.weaponMemories?.[gun.id];let factor=1;if(m.healthyDamage&&w.player.hp>w.player.maxHp*M.healthyFraction)factor*=1+m.healthyDamage;if(m.activeDamage&&w.abilityTime>0)factor*=1+m.activeDamage;if(g){if(g.sunfall&&gun.level===4)factor*=1+g.finalDamage;else if(!g.sunfall||gun.level>=2)factor*=1+(g.damage||0);if(g.chargedDamage&&w.abilityCharge>=M.chargedRequired)factor*=1+g.chargedDamage;}return factor;}
export function memoryProjectile(w,gun,b){if(!b)return;const m=w.weaponMemories?.[gun.id];if(!m)return;if(m.bounce){b.mode='bounce';b.bounces=Math.min(M.bouncesMax,b.bounces+m.bounce);}if(m.range)b.range*=1+m.range;if(m.turn)b.turn+=m.turn;if(m.pierce)b.pierce=Math.min(D.caps.pierce,b.pierce+m.pierce);if(m.orbitRadius)b.orbitRadius+=m.orbitRadius;if(m.sunfall&&gun.level>=2){b.finalEffect='sunfall';if(gun.level===4)b.range*=1+m.finalRange;}}
export function memoryKill(w){const m=w.memoryBonuses||{};if(m.coinEvery&&w.kills%m.coinEvery===0)w.roomCoins=Math.min(M.coinsMax,w.roomCoins+1);if(m.recipeCoinEvery&&w.kills%m.recipeCoinEvery===0)w.roomCoins=Math.min(M.coinsMax,w.roomCoins+1);if(m.killCharge)w.abilityCharge=Math.min(D.graze.maximum,w.abilityCharge+m.killCharge);}
export function memoryBoss(w){const m=w.memoryBonuses||{};w.memoryEchoes=Math.min(M.bossEchoes,(w.memoryEchoes||0)+(m.bossEcho||0));if(m.bossHeal&&w.player.hp<=w.player.maxHp*M.healthyFraction&&(w.memoryHeals||0)<M.bossHeals){heal(w,m.bossHeal);w.memoryHeals=(w.memoryHeals||0)+1;}}
export function grantMemory(w,source,recalculate){const item=memoryItems.find(u=>u.source===source);if(!item||w.inventory[item.id])return false;w.inventory[item.id]=1;recalculate(w);w.comboNotice='Recuerdo obtenido: '+item.name;w.comboTimer=4;w.events.push('reward');return true;}
export function memoryTrail(w){return !!(w.memoryBonuses?.trail||w.combos.includes('return_thread'));}
export function memoryTrailDuration(w){return R.trailSeconds+(w.memoryBonuses?.trailDuration||0);}
