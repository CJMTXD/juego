import {relicBalance as R} from './data/relics.js';
import {evolutionEffects as E} from './data/evolutions.js';
import {weapons} from './data/weapons.js';
import {emit} from './projectiles.js';
import {balance as B} from './data/balance.js';
export function equipWeapon(world,id){
 if(!Object.hasOwn(weapons,id))return false;
 const existing=world.weaponSlots.indexOf(id);
 if(existing>=0)world.weaponIndex=existing;
 else if(world.weaponSlots.length<2){world.weaponSlots.push(id);world.weaponIndex=world.weaponSlots.length-1;}
 else world.weaponSlots[world.weaponIndex]=id;
 world.fireTimer=0;world.burstLeft=0;world.charge=0;return true;
}
export function swapWeapon(world){if(world.weaponSlots.length>1){world.weaponIndex=1-world.weaponIndex;world.fireTimer=0;world.burstLeft=0;world.charge=0;world.events.push('reward');}}
export function currentWeapon(world){const id=world.weaponSlots[world.weaponIndex];return world.weaponForms?.[id]?.[(world.weaponProgress[id]?.level||1)-1]||weapons[id]||weapons.needle;}
function projectile(world,gun,angle,damage){
 const p=world.player;
 const bullet=emit(world.allies,p.x+Math.cos(angle)*18,p.y+Math.sin(angle)*18,angle,gun.speed*world.stats.bulletSpeed/B.projectiles.speed,gun.radius||3,damage,world.stats.pierce+(gun.pierce||0),gun.shape);
 if(bullet){bullet.weaponId=gun.id;bullet.finalEffect=gun.finalEffect||'';bullet.mode=gun.projectileMode||gun.mode;bullet.range=gun.range*(1+R.rangePerLevel*(world.inventory.reed||0))*(world.superItem==='crown'?R.crownRange:1);bullet.bounces=gun.bounces||0;if(world.superItem==='furnace'&&!['area','orbit','beam'].includes(gun.mode)){bullet.mode='bounce';bullet.bounces=R.furnaceBounces;bullet.vx*=R.furnaceSpeed;bullet.vy*=R.furnaceSpeed;bullet.radius+=R.furnaceRadius;}bullet.life=Math.min(8,bullet.range/Math.max(1,gun.speed)+0.2);bullet.turn=gun.turn||0;
 if(gun.mode==='beam'){bullet.life=0.06;bullet.pierce=15;}
 if(gun.mode==='orbit'){bullet.life=gun.duration;bullet.orbit=angle;bullet.orbitRadius=gun.orbitRadius*(1+R.rangePerLevel*(world.inventory.reed||0))*(world.superItem==='crown'?R.crownRange:1);bullet.pierce=15;bullet.range=10000;bullet.vx=0;bullet.vy=0;}
 if(gun.mode==='area'){const a=Math.atan2(world.aimY-p.y,world.aimX-p.x),distance=Math.min(bullet.range,Math.hypot(world.aimX-p.x,world.aimY-p.y));bullet.x=p.x+Math.cos(a)*distance;bullet.y=p.y+Math.sin(a)*distance;bullet.px=bullet.x;bullet.py=bullet.y;bullet.vx=0;bullet.vy=0;bullet.delay=gun.delay;bullet.life=gun.delay+0.18;bullet.radius=gun.radius;bullet.pierce=15;}
 if(gun.mode==='boomerang')bullet.life=2.2;if(gun.finalEffect==='quake')bullet.life=gun.delay+E.quakeLife;
 if(world.weaponSlots.includes('ricochet')&&world.weaponSlots.includes('orbit'))bullet.bounces=Math.min(3,bullet.bounces+1);
 if(world.weaponSlots.includes('beam')&&world.weaponSlots.includes('needle'))bullet.pierce=Math.min(15,bullet.pierce+1);}
 return bullet;
}
function discharge(world,gun,damageScale=1,withSides=true){
 if(world.inventory.laurel&&world.weaponProgress[gun.id].shots%R.laurelEvery===R.laurelEvery-1)damageScale*=R.laurelDamage;
 if(gun.mode==='orbit'||gun.mode==='area')damageScale*=1+world.stats.side*B.weapons.sideUtility;
 if(['orbit','area','beam'].includes(gun.mode))damageScale*=1+world.stats.pierce*B.weapons.pierceUtility;
 if(gun.mode==='beam'&&world.inventory.prism)damageScale*=1+R.prismBeamDamage;
 const p=world.player;
 const count=gun.mode==='burst'?1:gun.count;
 const spread=world.weaponSlots.includes('scatter')&&world.weaponSlots.includes('burst')?gun.spread*0.8:gun.spread;
 for(let i=0;i<count;i++){
  const angle=gun.mode==='orbit'?world.time*3+Math.PI*2*i/count:p.angle+(count>1?(i-Math.floor(count/2))*spread/(count-1):0);
  projectile(world,gun,angle,gun.damage*world.stats.damage*damageScale*(gun.sideFactor&&i!==Math.floor(count/2)?gun.sideFactor:1)*(world.weaponSlots.includes('area')&&world.weaponSlots.includes('charge')?1.1:1));
 }
 // Ecos laterales limitados: no multiplican toda la escopeta o cada bala de la ráfaga.
 if(withSides&&gun.mode!=='orbit'&&gun.mode!=='area')for(let i=1;i<=world.stats.side;i++)for(const sign of [-1,1])projectile(world,gun,p.angle+sign*B.upgrades.sideAngle*i,gun.damage*world.stats.damage*Math.min(B.upgrades.sideDamage,gun.mode==='beam'?0.2:0.55)/Math.max(1,gun.count));
 if(world.weaponProgress[gun.id])world.weaponProgress[gun.id].shots++;
 if(gun.finalEffect==='backfan'&&withSides)for(let i=-1;i<=1;i++)projectile(world,gun,p.angle+Math.PI+i*E.backAngle,gun.damage*world.stats.damage*E.backDamage);
 if(world.combos.includes('echo_oath')&&world.weaponProgress[gun.id].shots%R.rearEvery===0)for(let n=-1;n<=1;n++)projectile(world,gun,p.angle+Math.PI+n*R.rearAngle,gun.damage*world.stats.damage*R.rearDamage);
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
 if(world.burstLeft>0&&world.burstTimer<=0){discharge(world,gun,1,false);world.burstLeft--;world.burstTimer=gun.burstGap;return;}
 if(gun.mode==='orbit'){let count=0;for(const b of world.allies)if(b.active&&b.mode==='orbit')count++;if(count>=B.weapons.maxOrbitals)return;}
 if(!(preferences.autoFire||input.shoot)||world.fireTimer>1e-9)return;
 world.burstLeft=gun.mode==='burst'?gun.count-1:0;
 discharge(world,gun);world.burstTimer=gun.burstGap||0;
 world.fireTimer=gun.interval*world.stats.interval/B.projectiles.interval;world.cooldowns[gun.id]=world.fireTimer;
}

export function weaponSynergy(world){const ids=world.weaponSlots;if(ids.includes('scatter')&&ids.includes('burst'))return 'Voz + Sal: dispersión -20%';if(ids.includes('ricochet')&&ids.includes('orbit'))return 'Regreso + Astrolabio: un rebote extra (máx. 3)';if(ids.includes('beam')&&ids.includes('needle'))return 'Luz + Aguja: una penetración extra';if(ids.includes('area')&&ids.includes('charge'))return 'Tinta + Sol: +10% de daño';return '';}

export function rollWeapon(world,boss=false){
 const available=Object.values(weapons).filter(g=>!world.weaponSlots.includes(g.id)&&world.allowedWeapons.includes(g.id)&&(!boss||g.source.includes('jefe')));
 const groups=['common','rare','epic'].filter(r=>available.some(g=>g.rarity===r));if(!groups.length)return null;
 const weights=boss?B.progression.bossWeights:B.progression.weights;
 let roll=world.random()*groups.reduce((n,r)=>n+weights[r],0),rarity=groups[groups.length-1];
 for(const r of groups){roll-=weights[r];if(roll<0){rarity=r;break;}}
 const group=available.filter(g=>g.rarity===rarity);return group[Math.floor(world.random()*group.length)];
}
