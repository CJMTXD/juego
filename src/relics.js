import {heal,hasPact} from './rules.js';
import {itemGroups,recipes,sets,superItems,relicBalance as R} from './data/relics.js';
import {depth as D} from './data/depth.js';
import {emit} from './projectiles.js';
export function initRelics(w){w.discoveredEnemies=[];w.discoveredBosses=[];w.bossesDefeated=[];w.metaTree={vitality:0,stride:0,luck:0,discount:0};w.knownFragments=[];w.startWorld=w.worldIndex;w.skin='base';w.combos=[];w.setCounts={};w.itemBonuses={};w.itemUnlocks=null;w.superUnlocks=null;w.superItem=null;w.superOffers=[];w.discoveredRecipes=[];w.discoveredItems=[];w.discoveryRevision=0;w.comboTimer=0;w.comboNotice='';w.bossFeats=[];w.bossDamage=0;w.secretVisits=0;w.grazes=0;w.vampireHeals=0;w.mercyHeals=0;w.prismTimer=0;w.crownTimer=0;w.superPulse=0;w.trail={x:0,y:0,timer:0};}
export function recalculateRelics(w){
 w.setCounts={};w.itemBonuses={};
 for(const [id,count] of Object.entries(w.inventory))if(count>0){const group=itemGroups[id];if(group)w.setCounts[group]=(w.setCounts[group]||0)+1;if(!w.discoveredItems.includes(id)){w.discoveredItems.push(id);w.discoveryRevision++;}}
 for(const [group,count] of Object.entries(w.setCounts))for(const tier of sets[group])if(count>=tier.pieces)for(const [key,value] of Object.entries(tier))if(key!=='pieces')w.itemBonuses[key]=(w.itemBonuses[key]||0)+value;
 w.combos=recipes.filter(r=>r.requires.every(id=>w.inventory[id]>0)).map(r=>r.id);
 for(const id of w.combos)if(!w.discoveredRecipes.includes(id)){w.discoveredRecipes.push(id);w.discoveryRevision++;w.comboNotice='Receta descubierta: '+recipes.find(r=>r.id===id).name;w.comboTimer=4;w.events.push('combo');}
 const b=w.itemBonuses,s=superItems.find(s=>s.id===w.superItem);
 w.stats.speed=Math.min(D.caps.speed,w.stats.speed*(1+D.stats.permanentSpeed*w.metaTree.stride)*(1+(b.speed||0))*(s?.speed||1));w.stats.damage=Math.min(D.caps.damage,w.stats.damage*(1+(b.damage||0))*(s?.damage||1));w.stats.bulletSpeed*=1+(b.bulletSpeed||0)+(w.inventory.prism?R.prismSpeedBonus:0);w.stats.interval=Math.max(D.caps.cadence,w.stats.interval/(1+(b.cadence||0)));w.stats.pierce=Math.min(D.caps.pierce,w.stats.pierce+(b.pierce||0));
 w.player.maxHp=Math.min(D.caps.health,Math.max(1,w.player.maxHp-(hasPact(w,'frail')?1:0)+w.metaTree.vitality+(b.health||0)-(s?.healthCost||0)));if(w.superItem==='nobody')w.player.maxHp=1;w.player.hp=Math.min(w.player.hp,w.player.maxHp);
}
export function eligibleSupers(w){if(w.superItem)return [];return superItems.filter(s=>(!s.shopUnlock||w.superUnlocks===null||w.superUnlocks.includes(s.id))&&(!s.recipe||w.combos.includes(s.recipe))&&(!s.kills||w.kills>=s.kills)&&(s.boss===undefined||w.bossFeats.includes(s.boss))&&(!s.secret||w.secretVisits>0)&&(!s.graze||w.grazes>=s.graze)&&(!s.difficulty||(w.difficultyIndex||0)>=s.difficulty));}
export function claimSuper(w,id){if(!eligibleSupers(w).some(s=>s.id===id))return false;w.superItem=id;w.superPulse=1;w.events.push('super');w.discoveryRevision++;w.comboNotice='Superítem: '+superItems.find(s=>s.id===id).name;w.comboTimer=5;return true;}
export function relicImpact(w,b,e){
 if(w.combos.includes('living_ash')||w.itemBonuses.burn||w.inventory.cinder){e.burnTime=R.burnSeconds+(w.inventory.cinder||0)*R.cinderDuration;e.burnDamage=b.damage*R.burnFraction;e.burnWeapon=b.weaponId;}
 if(w.combos.includes('ownerless_light')&&!b.generation&&w.prismTimer<=0){w.prismTimer=R.prismCooldown;const angle=Math.atan2(b.vy,b.vx);for(let direction=-1;direction<=1;direction+=2){const ray=emit(w.allies,e.x,e.y,angle+direction*Math.PI/2,R.prismSpeed,3,b.damage*R.prismDamage);if(ray){ray.weaponId=b.weaponId;ray.generation=1;}}}
}
export function relicKill(w){if(w.combos.includes('equal_scale')&&w.kills%R.mercyKills===0&&w.mercyHeals<R.mercyCap){heal(w,1);w.mercyHeals++;}if(w.superItem==='balance'&&w.kills%R.vampireKills===0&&w.vampireHeals<D.caps.healingSteal){heal(w,1);w.vampireHeals++;}}
export function updateRelics(w,dt){w.comboTimer=Math.max(0,w.comboTimer-dt);w.superPulse=Math.max(0,w.superPulse-dt);w.prismTimer=Math.max(0,w.prismTimer-dt);w.trail.timer=Math.max(0,w.trail.timer-dt);if(w.trail.timer>0)for(const e of w.enemies)if(e.active&&Math.hypot(e.x-w.trail.x,e.y-w.trail.y)<R.trailRadius)e.slowTime=R.trailSlowSeconds;
 if(w.superItem==='crown'){w.crownTimer-=dt;if(w.crownTimer<=0){w.crownTimer=R.superOrbitSeconds;let active=0;for(const b of w.allies)if(b.active&&b.mode==='orbit')active++;for(let n=0;n<Math.min(R.superOrbitCount,R.superOrbitCap-active);n++){const b=emit(w.allies,w.player.x,w.player.y,n*Math.PI*2/R.superOrbitCount,0,3,w.stats.damage*R.superOrbitDamage,15);if(b){b.mode='orbit';b.orbit=n*Math.PI*2/R.superOrbitCount;b.orbitRadius=R.superOrbitRadius;b.life=R.superOrbitLife;}}}}
}
