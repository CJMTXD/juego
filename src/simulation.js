import {worlds} from './data/worlds.js';
import {resetHazard,updateHazard} from './hazards.js';
import {characters} from './data/characters.js';
import {createBulletPool,emit} from './projectiles.js';
export {emit} from './projectiles.js';
import {updateWeapon,equipWeapon} from './weapons.js';
import {weapons} from './data/weapons.js';
import { balance as B } from './data/balance.js';
import { settings as s, enemyTypes, patterns, upgrades } from './data.js';
import { seededRandom, generateMap } from './map.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createWorld(seed=Date.now()>>>0, unlocks=0, characterId='remender',startWorld=0) {
 const zone=worlds[Math.max(0,Math.min(worlds.length-1,startWorld))];
 const rooms=generateMap(seed);
 const character=characters[characterId]||characters.remender;
 return {zone,worldIndex:Math.max(0,Math.min(worlds.length-1,startWorld)),pendingWorld:0,zoneCleared:0,roomTime:0,hazardClock:0,hazardPhase:0,environmentSlow:1,hazardPositions:[[210,120],[430,240]],mark:{active:false,x:0,y:0,radius:38,timer:0},character,shield:character.kind==='shield',seed,random:seededRandom(seed^0x12345678),unlocks,rooms,roomId:0,player:{x:320,y:180,radius:character.radius,angle:0,hp:character.health,maxHp:character.health,invulnerable:0,dashTime:0,dashCooldown:0,dx:1,dy:0},
  allies:createBulletPool(s.bulletCapacity),hostiles:createBulletPool(s.enemyCapacity),enemies:Array.from({length:16},(_,id)=>({id,active:false,type:'keeper',x:0,y:0,radius:12,hp:0,maxHp:0,timer:0,warning:false,pattern:'ring',angle:0,offset:0,phase:0,flash:0,behavior:'stay',speed:0,charge:0,targetX:0,targetY:0})),inventory:{},weaponSlots:[character.weapon],weaponIndex:0,weaponOffer:null,burstLeft:0,burstTimer:0,charge:0,stats:{speed:character.speed,damage:character.damage,interval:B.projectiles.interval,bulletSpeed:B.projectiles.speed,pierce:0,side:0},
  status:'playing',time:0,kills:0,cleared:0,wave:0,spawnTimer:0,fireTimer:0,enemyId:0,options:[],events:[],shake:0,settled:false,exitLock:0.5,bossPhase:0};
}
export function recalculate(world) {
 const i=world.inventory,character=world.character;
 world.stats={speed:character.speed*(1+B.upgrades.step*(i.step||0)),damage:character.damage*(1+B.upgrades.ember*(i.ember||0)+B.upgrades.lensDamage*(i.lens||0))*(i.halo?B.upgrades.halo:1)*(i.halo&&i.ember?B.upgrades.synergy:1),interval:B.projectiles.interval/(1+B.upgrades.pulse*(i.pulse||0)),bulletSpeed:B.projectiles.speed*(1+B.upgrades.lensSpeed*(i.lens||0)),pierce:i.pierce||0,side:i.fork||0};
 world.player.maxHp=character.health+(i.heart||0);
}
// Segmento contra círculo: evita que una bala rápida atraviese la hitbox.
export function sweptHit(ax,ay,bx,by,cx,cy,radius){
 const dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;
 const t=len?clamp(((cx-ax)*dx+(cy-ay)*dy)/len,0,1):0;
 return (ax+t*dx-cx)**2+(ay+t*dy-cy)**2<=radius*radius;
}
function clearBullets(world){for(const b of world.allies)b.active=false;for(const b of world.hostiles)b.active=false;}
export function offerUpgrades(world) {
 const available=upgrades.filter(u=>(!u.unlock||world.unlocks>=u.unlock)&&(world.inventory[u.id]||0)<u.max);
 world.options=[];
 while(world.options.length<3&&available.length){
  const groups=['common','rare','epic'].filter(rarity=>available.some(u=>u.rarity===rarity));
  const weights=groups.map(rarity=>B.progression.weights[rarity]);
  let roll=world.random()*weights.reduce((a,b)=>a+b,0),group=0;
  for(;group<weights.length-1;group++){roll-=weights[group];if(roll<0)break;}
  const candidates=available.filter(u=>u.rarity===groups[group]);
  const selected=candidates[Math.floor(world.random()*candidates.length)];
  const index=available.indexOf(selected);
  world.options.push(available.splice(index,1)[0]);
 }
 if(!world.options.length)world.options=[{id:'restore',name:'Último recuerdo',rarity:'common',max:1,text:'Recupera 2 de vida. No añade niveles.'}];
 const guns=Object.values(weapons).filter(g=>!world.weaponSlots.includes(g.id));
 world.weaponOffer=guns.length?guns[Math.floor(world.random()*guns.length)]:null;
 world.status='reward';
}
export function chooseUpgrade(world,id){
 if(world.status!=='reward'||(!(id==='weapon'&&world.weaponOffer)&&!world.options.some(u=>u.id===id)))return false;
 if(id==='weapon'){if(!world.weaponOffer)return false;equipWeapon(world,world.weaponOffer.id);}
 else if(id!=='restore')world.inventory[id]=(world.inventory[id]||0)+1;
 recalculate(world);
 if(id==='heart')world.player.hp=Math.min(world.player.maxHp,world.player.hp+1);
 if(id==='mercy'||id==='restore')world.player.hp=Math.min(world.player.maxHp,world.player.hp+2);
 world.rooms[world.roomId].rewardTaken=true;world.options=[];world.status='playing';world.events.push('reward');return true;
}
export function travel(world,id){
 const old=world.rooms[world.roomId],room=world.rooms[id];
 if(world.status!=='playing'||!old.cleared||!old.rewardTaken||!old.links.includes(id)||!room)return false;
 clearBullets(world);world.shield=world.character.kind==='shield';for(const e of world.enemies)e.active=false;resetHazard(world);world.roomTime=0;world.roomId=id;world.wave=0;world.spawnTimer=B.encounters.spawnDelay;world.fireTimer=0;world.exitLock=B.progression.exitLock;world.bossPhase=0;
 const p=world.player;p.x=320;p.y=180;
 if(room.x>old.x)p.x=48;if(room.x<old.x)p.x=592;if(room.y>old.y)p.y=48;if(room.y<old.y)p.y=312;
 p.invulnerable=B.progression.entryGrace;
 if(!room.visited&&room.kind==='rest'){p.hp=Math.min(p.maxHp,p.hp+B.progression.restHeal);world.events.push('heal');}
 room.visited=true;
 return true;
}
function spawnWave(world){
 const room=world.rooms[world.roomId],p=world.player;world.wave++;
 const positions=[[128,90],[512,90],[128,270],[512,270],[320,70],[320,290]];
 const count=room.kind==='boss'?1:Math.min(B.encounters.enemyCap,1+Math.floor(room.depth/B.encounters.healthDepth)+(world.wave>1?1:0));
 for(let i=0;i<count;i++){
  const choices=positions.filter(([x,y])=>Math.hypot(x-p.x,y-p.y)>B.encounters.spawnDistance&&!world.enemies.some(e=>e.active&&Math.hypot(x-e.x,y-e.y)<B.encounters.enemySpacing));
  if(!choices.length)continue;
  const pos=choices[Math.floor(world.random()*choices.length)],data=world.zone.enemies[Math.floor(world.random()*world.zone.enemies.length)],boss=room.kind==='boss';
  const e=world.enemies.find(e=>!e.active);if(!e)break;
  const hp=boss?world.zone.boss.health:(data.health+Math.floor(room.depth/3))*world.zone.health;
  e.active=true;e.id=world.enemies.indexOf(e);e.type=boss?'boss':data.id;e.x=pos[0];e.y=pos[1];e.radius=boss?24:data.radius;e.hp=hp;e.maxHp=hp;e.timer=1+i*0.7;e.warning=false;e.pattern=boss?world.zone.boss.patterns[0]:data.pattern;e.angle=0;e.offset=world.random()*Math.PI*2;e.phase=0;e.flash=0;e.behavior=data.behavior;e.speed=data.speed;e.charge=0;e.targetX=p.x;e.targetY=p.y;
 }
 world.events.push('spawn');
}
export function advanceWorld(world){
 if(world.status!=='transition'||world.worldIndex+1>=worlds.length)return false;
 world.worldIndex++;world.zone=worlds[world.worldIndex];world.rooms=generateMap((world.seed+world.worldIndex*7919)>>>0);world.roomId=0;world.zoneCleared=0;world.wave=0;world.spawnTimer=1.4;world.bossPhase=0;world.exitLock=0.7;world.roomTime=0;
 clearBullets(world);for(const e of world.enemies)e.active=false;
 world.player.x=320;world.player.y=180;world.player.hp=Math.min(world.player.maxHp,world.player.hp+2);world.player.invulnerable=1.5;
 resetHazard(world);world.status='playing';world.events.push('reward');return true;
}
export function damagePlayer(world,damage=1){
 const p=world.player;if(p.invulnerable>0||world.status!=='playing')return false;
 if(world.shield){world.shield=false;p.invulnerable=B.player.invulnerability;world.events.push('heal');return true;}
 p.hp=Math.max(0,p.hp-damage);p.invulnerable=B.player.invulnerability+(world.inventory.veil?B.upgrades.veil:0);world.shake=0.15;world.events.push('hurt');
 if(!p.hp){world.status='dead';clearBullets(world);world.events.push('death');}return true;
}
function attack(world,e){
 const pattern=patterns[e.pattern];
 for(let i=0;i<pattern.count;i++){
  let angle=(e.pattern==='fan'||pattern.mode==='fan'||pattern.mode==='sine')?e.angle-pattern.spread/2+pattern.spread*i/(pattern.count-1):e.offset+2*Math.PI*i/pattern.count;
  const boss=e.type==='boss';
  if(pattern.mode==='cross')angle=e.offset+Math.floor(i/2)*Math.PI/2+(i%2?0.1:-0.1);
  const bullet=emit(world.hostiles,e.x+Math.cos(angle)*(e.radius+8),e.y+Math.sin(angle)*(e.radius+8),angle,(pattern.speed+(boss?5*e.phase:0))*world.zone.speed,4,1,0,e.pattern==='fan'?1:0);if(bullet&&pattern.mode==='sine'){bullet.mode='sine';bullet.turn=angle;}
 }
 if(e.type==='boss'&&world.zone.boss.mechanic==='marks'){world.mark.active=true;world.mark.x=world.player.x;world.mark.y=world.player.y;world.mark.timer=1.1;}
 e.offset+=e.pattern==='spiral'?0.38:0.19;world.events.push('attack');
}
function updateEnemy(world,e,dt){
 if(!e.active)return;
 const p=world.player;e.flash=Math.max(0,e.flash-dt);
 if(e.type==='boss'){
  const phase=e.hp/e.maxHp>0.66?0:e.hp/e.maxHp>0.33?1:2;
  if(phase!==e.phase){e.phase=phase;e.pattern=world.zone.boss.patterns[phase];e.warning=false;e.timer=B.encounters.bossRest;for(const b of world.hostiles)b.active=false;world.events.push('phase');}
  world.bossPhase=e.phase;
 }
 const pattern=patterns[e.pattern];
 e.timer-=dt;
 if(!e.warning&&e.timer<=pattern.warning){e.warning=true;e.angle=Math.atan2(p.y-e.y,p.x-e.x);}
 if(e.timer<=0){attack(world,e);e.warning=false;e.timer=pattern.interval;}
 if(e.behavior==='seek'&&!e.warning){const angle=Math.atan2(p.y-e.y,p.x-e.x);const distance=Math.hypot(p.x-e.x,p.y-e.y);if(distance>165){e.x+=Math.cos(angle)*e.speed*dt;e.y+=Math.sin(angle)*e.speed*dt;}}
 if(!e.warning&&e.behavior==='strafe'){e.x=clamp(e.x+Math.cos(world.time+e.id)*e.speed*dt,60,580);}
 if(!e.warning&&e.behavior==='flee'&&Math.hypot(p.x-e.x,p.y-e.y)<180){const a=Math.atan2(e.y-p.y,e.x-p.x);e.x=clamp(e.x+Math.cos(a)*e.speed*dt,60,580);e.y=clamp(e.y+Math.sin(a)*e.speed*dt,60,300);}
 if(e.type==='boss'&&world.zone.boss.mechanic==='tide'&&!e.warning){e.x=clamp(e.x+Math.cos(world.time*0.8)*25*dt,100,540);}
 if(Math.hypot(p.x-e.x,p.y-e.y)<p.radius+e.radius)damagePlayer(world);
}
function killEnemy(world,e){
 e.active=false;world.kills++;world.events.push('kill');
 if(!world.enemies.some(item=>item.active))world.spawnTimer=B.encounters.waveDelay;
 if(e.type==='boss'){world.status=world.worldIndex===worlds.length-1?'won':'transition';world.pendingWorld=world.worldIndex+1;world.rooms[world.roomId].cleared=true;world.cleared++;world.zoneCleared++;clearBullets(world);world.events.push('win');}
}
function moveBullets(world,bullets,dt,allied){
 for(const b of bullets){
  if(!b.active)continue;b.px=b.x;b.py=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
  if(b.mode==='sine'){b.x+=Math.cos(b.turn+Math.PI/2)*Math.sin((8-b.life)*5)*32*dt;b.y+=Math.sin(b.turn+Math.PI/2)*Math.sin((8-b.life)*5)*32*dt;}
  b.distance+=Math.hypot(b.vx,b.vy)*dt;
  if(allied&&b.mode==='bounce'&&b.bounces>0&&(b.x<24||b.x>616||b.y<24||b.y>336)){if(b.x<24||b.x>616){b.vx=-b.vx;b.x=clamp(b.x,24,616);}if(b.y<24||b.y>336){b.vy=-b.vy;b.y=clamp(b.y,24,336);}b.bounces--;}
  if(b.distance>b.range)b.active=false;if(!b.active)continue;
  if(allied){
   for(const e of world.enemies){
    // Cada enemigo ocupa un bit: nunca se repite daño al atravesarlo.
    const bit=1<<(e.id%30);
    if(!e.active||(b.hits&bit)||!sweptHit(b.px,b.py,b.x,b.y,e.x,e.y,e.radius+b.radius))continue;
    e.hp-=b.damage;e.flash=0.08;b.hits|=bit;world.events.push('hit');
    if(e.hp<=0)killEnemy(world,e);
    if(b.pierce<=0){b.active=false;break;}b.pierce--;
   }
  }else{const p=world.player;if(sweptHit(b.px,b.py,b.x,b.y,p.x,p.y,p.radius+b.radius)&&damagePlayer(world,b.damage))b.active=false;}
  if(b.life<=0||b.x<20||b.x>620||b.y<20||b.y>340)b.active=false;
 }
}
export function updateWorld(world,input,dt,preferences){
 if(world.status!=='playing')return;
 world.time+=dt;world.roomTime+=dt;const p=world.player,bindings=preferences.bindings;
 p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);world.exitLock=Math.max(0,world.exitLock-dt);world.shake=Math.max(0,world.shake-dt);
 let dx=Number(input.keys.has(bindings.right))-Number(input.keys.has(bindings.left)),dy=Number(input.keys.has(bindings.down))-Number(input.keys.has(bindings.up));
 const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;p.dx=dx;p.dy=dy;}
 if(input.dash&&p.dashCooldown<=0){p.dashTime=B.player.dashDuration;p.dashCooldown=world.character.kind==='dash'?1.1:B.player.dashCooldown;p.invulnerable=Math.max(p.invulnerable,B.player.dashInvulnerability);world.events.push('dash');}input.dash=false;
 if(p.dashTime>0){dx=p.dx;dy=p.dy;p.dashTime-=dt;}
 updateHazard(world,dt,damagePlayer);if(world.status!=='playing')return;
 const speed=world.stats.speed*(world.environmentSlow||1)*(p.dashTime>0?B.player.dashMultiplier:1);
 p.x=clamp(p.x+dx*speed*dt,36,604);p.y=clamp(p.y+dy*speed*dt,36,324);
 if(Math.hypot(input.mouseX-p.x,input.mouseY-p.y)>0.1)p.angle=Math.atan2(input.mouseY-p.y,input.mouseX-p.x);
 updateWeapon(world,input,dt,preferences);
 const room=world.rooms[world.roomId];
 if(!room.cleared){
  if(!world.enemies.some(e=>e.active)){
   if(world.wave<room.waves||room.kind==='boss'&&world.wave===0){world.spawnTimer-=dt;if(world.spawnTimer<=0)spawnWave(world);}
   else {room.cleared=true;world.cleared++;world.zoneCleared++;if(world.character.kind==='heal'&&world.cleared%6===0)p.hp=Math.min(p.maxHp,p.hp+1);clearBullets(world);offerUpgrades(world);world.events.push('clear');return;}
  }
 }
 for(const e of world.enemies)updateEnemy(world,e,dt);
 if(world.status!=='playing')return;
 moveBullets(world,world.allies,dt,true);if(world.status!=='playing')return;
 moveBullets(world,world.hostiles,dt,false);
 if(room.cleared&&room.rewardTaken&&world.exitLock<=0){
  for(const id of room.links){const r=world.rooms[id];if((r.x<room.x&&p.x<=37&&Math.abs(p.y-180)<24)||(r.x>room.x&&p.x>=603&&Math.abs(p.y-180)<24)||(r.y<room.y&&p.y<=37&&Math.abs(p.x-320)<24)||(r.y>room.y&&p.y>=323&&Math.abs(p.x-320)<24)){travel(world,id);break;}}
 }
}
