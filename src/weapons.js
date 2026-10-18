import {weapons} from './data/weapons.js';
import {emit} from './projectiles.js';
import {balance as B} from './data/balance.js';
export function equipWeapon(world,id){
 if(!weapons[id])return false;
 const existing=world.weaponSlots.indexOf(id);
 if(existing>=0)world.weaponIndex=existing;
 else if(world.weaponSlots.length<2){world.weaponSlots.push(id);world.weaponIndex=world.weaponSlots.length-1;}
 else world.weaponSlots[world.weaponIndex]=id;
 world.fireTimer=0;world.burstLeft=0;world.charge=0;return true;
}
export function swapWeapon(world){if(world.weaponSlots.length>1){world.weaponIndex=1-world.weaponIndex;world.fireTimer=0;world.burstLeft=0;world.charge=0;world.events.push('reward');}}
export function currentWeapon(world){return weapons[world.weaponSlots[world.weaponIndex]]||weapons.needle;}
function projectile(world,gun,angle,damage){
 const p=world.player;
 const bullet=emit(world.allies,p.x+Math.cos(angle)*18,p.y+Math.sin(angle)*18,angle,gun.speed*world.stats.bulletSpeed/B.projectiles.speed,gun.radius||3,damage,world.stats.pierce+(gun.pierce||0),gun.shape);
 if(bullet){bullet.mode=gun.mode;bullet.range=gun.range;bullet.bounces=gun.bounces||0;bullet.life=Math.min(8,gun.range/Math.max(1,gun.speed)+0.2);}
 return bullet;
}
function discharge(world,gun,damageScale=1){
 const p=world.player;
 const count=gun.mode==='burst'?1:gun.count;
 const spread=world.weaponSlots.includes('scatter')&&world.weaponSlots.includes('burst')?gun.spread*0.8:gun.spread;
 for(let i=0;i<count;i++){
  const angle=p.angle+(count>1?-spread/2+spread*i/(count-1):0);
  projectile(world,gun,angle,gun.damage*world.stats.damage*damageScale);
 }
 // Ecos laterales limitados: no multiplican toda la escopeta o cada bala de la ráfaga.
 if(world.burstLeft===0)for(let i=1;i<=world.stats.side;i++)for(const sign of [-1,1])projectile(world,gun,p.angle+sign*B.upgrades.sideAngle*i,gun.damage*world.stats.damage*B.upgrades.sideDamage);
 world.events.push('shoot');
}
export function updateWeapon(world,input,dt,preferences){
 if(input.swap){swapWeapon(world);input.swap=false;}
 const gun=currentWeapon(world);world.fireTimer-=dt;world.burstTimer-=dt;
 if(world.burstLeft>0&&world.burstTimer<=0){discharge(world,gun);world.burstLeft--;world.burstTimer=gun.burstGap;return;}
 if(!(preferences.autoFire||input.shoot)||world.fireTimer>1e-9)return;
 world.burstLeft=gun.mode==='burst'?gun.count-1:0;
 discharge(world,gun);world.burstTimer=gun.burstGap||0;
 world.fireTimer=gun.interval*world.stats.interval/B.projectiles.interval;
}
