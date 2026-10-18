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
 if(bullet){bullet.mode=gun.mode;bullet.range=gun.range;bullet.bounces=gun.bounces||0;bullet.life=Math.min(8,gun.range/Math.max(1,gun.speed)+0.2);bullet.turn=gun.turn||0;
 if(gun.mode==='beam'){bullet.life=0.06;bullet.pierce=15;}
 if(gun.mode==='orbit'){bullet.life=gun.duration;bullet.orbit=angle;bullet.orbitRadius=gun.orbitRadius;bullet.pierce=15;bullet.range=10000;bullet.vx=0;bullet.vy=0;}
 if(gun.mode==='area'){const a=Math.atan2(world.aimY-p.y,world.aimX-p.x),distance=Math.min(gun.range,Math.hypot(world.aimX-p.x,world.aimY-p.y));bullet.x=p.x+Math.cos(a)*distance;bullet.y=p.y+Math.sin(a)*distance;bullet.px=bullet.x;bullet.py=bullet.y;bullet.vx=0;bullet.vy=0;bullet.delay=gun.delay;bullet.life=gun.delay+0.18;bullet.radius=gun.radius;bullet.pierce=15;}
 if(gun.mode==='boomerang')bullet.life=2.2;
 if(world.weaponSlots.includes('ricochet')&&world.weaponSlots.includes('orbit'))bullet.bounces=Math.min(3,bullet.bounces+1);
 if(world.weaponSlots.includes('beam')&&world.weaponSlots.includes('needle'))bullet.pierce=Math.min(15,bullet.pierce+1);}
 return bullet;
}
function discharge(world,gun,damageScale=1){
 const p=world.player;
 const count=gun.mode==='burst'?1:gun.count;
 const spread=world.weaponSlots.includes('scatter')&&world.weaponSlots.includes('burst')?gun.spread*0.8:gun.spread;
 for(let i=0;i<count;i++){
  const angle=gun.mode==='orbit'?world.time*3+Math.PI*2*i/count:p.angle+(count>1?-spread/2+spread*i/(count-1):0);
  projectile(world,gun,angle,gun.damage*world.stats.damage*damageScale*(world.weaponSlots.includes('area')&&world.weaponSlots.includes('charge')?1.1:1));
 }
 // Ecos laterales limitados: no multiplican toda la escopeta o cada bala de la ráfaga.
 if(world.burstLeft===0&&gun.mode!=='orbit'&&gun.mode!=='area')for(let i=1;i<=world.stats.side;i++)for(const sign of [-1,1])projectile(world,gun,p.angle+sign*B.upgrades.sideAngle*i,gun.damage*world.stats.damage*Math.min(B.upgrades.sideDamage,gun.mode==='beam'?0.2:0.55)/Math.max(1,gun.count));
 world.events.push('shoot');
}
export function updateWeapon(world,input,dt,preferences){
 if(input.swap){swapWeapon(world);input.swap=false;}
 for(const id in world.cooldowns)world.cooldowns[id]=Math.max(0,world.cooldowns[id]-dt);
 const gun=currentWeapon(world);world.fireTimer=world.cooldowns[gun.id]||0;world.aimX=input.mouseX;world.aimY=input.mouseY;
 if(gun.mode==='charge'){
  if(preferences.autoFire||input.shoot)world.charge=Math.min(gun.interval,world.charge+dt/(world.stats.interval/B.projectiles.interval));
  if(world.charge>=gun.interval-1e-9||(!preferences.autoFire&&!input.shoot&&world.charge>0.15)){discharge(world,gun,world.charge/gun.interval);world.charge=0;}return;
 }world.burstTimer-=dt;
 if(world.burstLeft>0&&world.burstTimer<=0){discharge(world,gun);world.burstLeft--;world.burstTimer=gun.burstGap;return;}
 if(gun.mode==='orbit'){let count=0;for(const b of world.allies)if(b.active&&b.mode==='orbit')count++;if(count>=6)return;}
 if(!(preferences.autoFire||input.shoot)||world.fireTimer>1e-9)return;
 world.burstLeft=gun.mode==='burst'?gun.count-1:0;
 discharge(world,gun);world.burstTimer=gun.burstGap||0;
 world.fireTimer=gun.interval*world.stats.interval/B.projectiles.interval;world.cooldowns[gun.id]=world.fireTimer;
}
