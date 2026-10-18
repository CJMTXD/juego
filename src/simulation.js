import { settings as s, enemyTypes, patterns, upgrades } from './data.js';
import { seededRandom, generateMap } from './map.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pool(capacity){return Array.from({length:capacity},()=>({active:false,x:0,y:0,px:0,py:0,vx:0,vy:0,life:0,radius:0,damage:0,pierce:0,hits:0,shape:0}));}
export function createWorld(seed=Date.now()>>>0, unlocks=0) {
 const rooms=generateMap(seed);
 return {seed,random:seededRandom(seed^0x12345678),unlocks,rooms,roomId:0,player:{x:320,y:180,radius:s.hitRadius,angle:0,hp:5,maxHp:5,invulnerable:0,dashTime:0,dashCooldown:0,dx:1,dy:0},
  allies:pool(s.bulletCapacity),hostiles:pool(s.enemyCapacity),enemies:[],inventory:{},stats:{speed:170,damage:1,interval:0.2,bulletSpeed:360,pierce:0,side:0},
  status:'playing',time:0,kills:0,cleared:0,wave:0,spawnTimer:0,fireTimer:0,enemyId:0,options:[],events:[],shake:0,settled:false,exitLock:0.5,bossPhase:0};
}
export function recalculate(world) {
 const i=world.inventory;
 world.stats={speed:170*(1+0.12*(i.step||0)),damage:(1+0.25*(i.ember||0)+0.1*(i.lens||0))*(i.halo?1.5:1)*(i.halo&&i.ember?1.35:1),interval:0.2/(1+0.12*(i.pulse||0)),bulletSpeed:360*(1+0.3*(i.lens||0)),pierce:i.pierce||0,side:i.fork||0};
 world.player.maxHp=5+(i.heart||0);
}
// Segmento contra círculo: evita que una bala rápida atraviese la hitbox.
export function sweptHit(ax,ay,bx,by,cx,cy,radius){
 const dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;
 const t=len?clamp(((cx-ax)*dx+(cy-ay)*dy)/len,0,1):0;
 return (ax+t*dx-cx)**2+(ay+t*dy-cy)**2<=radius*radius;
}
export function emit(bullets,x,y,angle,speed,radius,damage,pierce=0,shape=0){
 const b=bullets.find(item=>!item.active);if(!b)return false;
 b.active=true;b.x=x;b.y=y;b.px=x;b.py=y;b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;b.radius=radius;b.damage=damage;b.pierce=pierce;b.hits=0;b.life=8;b.shape=shape;return true;
}
function clearBullets(world){for(const b of world.allies)b.active=false;for(const b of world.hostiles)b.active=false;}
export function offerUpgrades(world) {
 const available=upgrades.filter(u=>(!u.unlock||world.unlocks>=u.unlock)&&(world.inventory[u.id]||0)<u.max);
 world.options=[];
 while(world.options.length<3&&available.length){
  const groups=['common','rare','epic'].filter(rarity=>available.some(u=>u.rarity===rarity));
  const weights=groups.map(rarity=>({common:70,rare:25,epic:5}[rarity]));
  let roll=world.random()*weights.reduce((a,b)=>a+b,0),group=0;
  for(;group<weights.length-1;group++){roll-=weights[group];if(roll<0)break;}
  const candidates=available.filter(u=>u.rarity===groups[group]);
  const selected=candidates[Math.floor(world.random()*candidates.length)];
  const index=available.indexOf(selected);
  world.options.push(available.splice(index,1)[0]);
 }
 if(!world.options.length)world.options=[{id:'restore',name:'Último recuerdo',rarity:'common',max:1,text:'Recupera 2 de vida. No añade niveles.'}];
 world.status='reward';
}
export function chooseUpgrade(world,id){
 if(world.status!=='reward'||!world.options.some(u=>u.id===id))return false;
 if(id!=='restore')world.inventory[id]=(world.inventory[id]||0)+1;
 recalculate(world);
 if(id==='heart')world.player.hp=Math.min(world.player.maxHp,world.player.hp+1);
 if(id==='mercy'||id==='restore')world.player.hp=Math.min(world.player.maxHp,world.player.hp+2);
 world.rooms[world.roomId].rewardTaken=true;world.options=[];world.status='playing';world.events.push('reward');return true;
}
export function travel(world,id){
 const old=world.rooms[world.roomId],room=world.rooms[id];
 if(world.status!=='playing'||!old.cleared||!old.rewardTaken||!old.links.includes(id)||!room)return false;
 clearBullets(world);world.enemies.length=0;world.roomId=id;world.wave=0;world.spawnTimer=1.4;world.fireTimer=0;world.exitLock=0.7;world.bossPhase=0;
 const p=world.player;p.x=320;p.y=180;
 if(room.x>old.x)p.x=48;if(room.x<old.x)p.x=592;if(room.y>old.y)p.y=48;if(room.y<old.y)p.y=312;
 p.invulnerable=1.5;
 if(!room.visited&&room.kind==='rest'){p.hp=Math.min(p.maxHp,p.hp+2);world.events.push('heal');}
 room.visited=true;
 return true;
}
function spawnWave(world){
 const room=world.rooms[world.roomId],p=world.player;
 world.wave++;
 const positions=[[128,90],[512,90],[128,270],[512,270],[320,70],[320,290]];
 const count=room.kind==='boss'?1:Math.min(3,1+Math.floor(room.depth/3)+(world.wave>1?1:0));
 for(let i=0;i<count;i++){
  const choices=positions.filter(([x,y])=>Math.hypot(x-p.x,y-p.y)>125&&!world.enemies.some(e=>Math.hypot(x-e.x,y-e.y)<80));
  if(!choices.length)continue;
  const pos=choices[Math.floor(world.random()*choices.length)];
  const type=world.random()<0.5?'keeper':'mourner',data=enemyTypes[type],boss=room.kind==='boss';
  const hp=boss?180: data.health+Math.floor(room.depth/3);
  world.enemies.push({id:world.enemyId++,type:boss?'boss':type,x:pos[0],y:pos[1],radius:boss?24:data.radius,hp,maxHp:hp,active:true,timer:1+i*0.7,warning:false,pattern:boss?'ring':data.pattern,angle:0,offset:world.random()*Math.PI*2,phase:0,flash:0});
 }
 world.events.push('spawn');
}
export function damagePlayer(world,damage=1){
 const p=world.player;if(p.invulnerable>0||world.status!=='playing')return false;
 p.hp=Math.max(0,p.hp-damage);p.invulnerable=0.9+(world.inventory.veil?0.5:0);world.shake=0.15;world.events.push('hurt');
 if(!p.hp){world.status='dead';clearBullets(world);world.events.push('death');}return true;
}
function attack(world,e){
 const pattern=patterns[e.pattern];
 for(let i=0;i<pattern.count;i++){
  let angle=e.pattern==='fan'?e.angle-pattern.spread/2+pattern.spread*i/(pattern.count-1):e.offset+2*Math.PI*i/pattern.count;
  const boss=e.type==='boss';
  emit(world.hostiles,e.x+Math.cos(angle)*(e.radius+8),e.y+Math.sin(angle)*(e.radius+8),angle,pattern.speed+(boss?5*e.phase:0),4,1,0,e.pattern==='fan'?1:0);
 }
 e.offset+=e.pattern==='spiral'?0.38:0.19;world.events.push('attack');
}
function updateEnemy(world,e,dt){
 if(!e.active)return;
 const p=world.player;e.flash=Math.max(0,e.flash-dt);
 if(e.type==='boss'){
  const phase=e.hp/e.maxHp>0.66?0:e.hp/e.maxHp>0.33?1:2;
  if(phase!==e.phase){e.phase=phase;e.pattern=['ring','fan','spiral'][phase];e.warning=false;e.timer=1.5;for(const b of world.hostiles)b.active=false;world.events.push('phase');}
  world.bossPhase=e.phase;
 }
 const pattern=patterns[e.pattern];
 e.timer-=dt;
 if(!e.warning&&e.timer<=pattern.warning){e.warning=true;e.angle=Math.atan2(p.y-e.y,p.x-e.x);}
 if(e.timer<=0){attack(world,e);e.warning=false;e.timer=pattern.interval;}
 if(e.type==='mourner'&&!e.warning){const angle=Math.atan2(p.y-e.y,p.x-e.x);const distance=Math.hypot(p.x-e.x,p.y-e.y);if(distance>165){e.x+=Math.cos(angle)*20*dt;e.y+=Math.sin(angle)*20*dt;}}
 if(Math.hypot(p.x-e.x,p.y-e.y)<p.radius+e.radius)damagePlayer(world);
}
function killEnemy(world,e){
 e.active=false;world.kills++;world.events.push('kill');
 if(!world.enemies.some(item=>item.active))world.spawnTimer=1.3;
 if(e.type==='boss'){world.status='won';world.rooms[world.roomId].cleared=true;world.cleared++;clearBullets(world);world.events.push('win');}
}
function moveBullets(world,bullets,dt,allied){
 for(const b of bullets){
  if(!b.active)continue;b.px=b.x;b.py=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
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
 world.time+=dt;const p=world.player,bindings=preferences.bindings;
 p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);world.exitLock=Math.max(0,world.exitLock-dt);world.shake=Math.max(0,world.shake-dt);
 let dx=Number(input.keys.has(bindings.right))-Number(input.keys.has(bindings.left)),dy=Number(input.keys.has(bindings.down))-Number(input.keys.has(bindings.up));
 const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;p.dx=dx;p.dy=dy;}
 if(input.dash&&p.dashCooldown<=0){p.dashTime=0.16;p.dashCooldown=1.5;p.invulnerable=Math.max(p.invulnerable,0.18);world.events.push('dash');}input.dash=false;
 if(p.dashTime>0){dx=p.dx;dy=p.dy;p.dashTime-=dt;}
 const speed=world.stats.speed*(p.dashTime>0?2.8:1);
 p.x=clamp(p.x+dx*speed*dt,36,604);p.y=clamp(p.y+dy*speed*dt,36,324);
 if(Math.hypot(input.mouseX-p.x,input.mouseY-p.y)>0.1)p.angle=Math.atan2(input.mouseY-p.y,input.mouseX-p.x);
 world.fireTimer-=dt;
 if((preferences.autoFire||input.shoot)&&world.fireTimer<=1e-9){
  const emitPlayer=(angle,damage)=>emit(world.allies,p.x+Math.cos(angle)*18,p.y+Math.sin(angle)*18,angle,world.stats.bulletSpeed,3,damage,world.stats.pierce);
  emitPlayer(p.angle,world.stats.damage);
  for(let i=1;i<=world.stats.side;i++){emitPlayer(p.angle+0.13*i,world.stats.damage*0.55);emitPlayer(p.angle-0.13*i,world.stats.damage*0.55);}
  world.fireTimer=world.stats.interval;world.events.push('shoot');
 }
 const room=world.rooms[world.roomId];
 if(!room.cleared){
  if(!world.enemies.some(e=>e.active)){
   if(world.wave<room.waves||room.kind==='boss'&&world.wave===0){world.spawnTimer-=dt;if(world.spawnTimer<=0)spawnWave(world);}
   else {room.cleared=true;world.cleared++;clearBullets(world);offerUpgrades(world);world.events.push('clear');return;}
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
