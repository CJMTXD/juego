import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,updateWorld,travel,chooseUpgrade,recalculate,damagePlayer,emit,sweptHit,offerUpgrades} from '../src/simulation.js';
import {generateMap} from '../src/map.js';
import {freshSave,validateSave} from '../src/storage.js';
import {defaults,upgrades} from '../src/data.js';
const preferences=()=>({bindings:{...defaults},autoFire:true});
const input=()=>({keys:new Set(),mouseX:600,mouseY:180,shoot:false,dash:false});
function steps(w,seconds,i=input(),p=preferences()){for(let n=0;n<Math.round(seconds*120);n++)updateWorld(w,i,1/120,p);}

test('1000 semillas: mapa conectado, coordenadas únicas y jefe accesible al final',()=>{
 for(let seed=0;seed<1000;seed++){
  const rooms=generateMap(seed),visited=new Set([0]),queue=[0];
  while(queue.length){const id=queue.pop();for(const next of rooms[id].links){assert(rooms[next].links.includes(id));assert.equal(Math.abs(rooms[id].x-rooms[next].x)+Math.abs(rooms[id].y-rooms[next].y),1);if(!visited.has(next)){visited.add(next);queue.push(next);}}}
  assert.equal(visited.size,rooms.length);assert.equal(new Set(rooms.map(r=>`${r.x},${r.y}`)).size,rooms.length);assert.equal(rooms[8].kind,'boss');
  assert.deepEqual(rooms,generateMap(seed));
 }
 assert.notDeepEqual(generateMap(1),generateMap(2));
});

test('movimiento independiente del paso y diagonal normalizada; límites',()=>{
 const a=createWorld(),b=createWorld(),c=createWorld(),i=input();i.keys.add('KeyD');steps(a,1,i);
 i.keys.add('KeyW');steps(b,1,i);for(let n=0;n<60;n++)updateWorld(c,i,1/60,preferences());
 assert(Math.abs(a.player.x-490)<1e-6);assert(Math.abs(Math.hypot(b.player.x-320,b.player.y-180)-170)<1e-6);assert(Math.abs(b.player.x-c.player.x)<1e-6);steps(a,100,i);assert.equal(a.player.x,604);assert.equal(a.player.y,36);
});

test('disparo manual/automático, dirección, cadencia y pool sin sobrescritura',()=>{
 const w=createWorld(),i=input(),p=preferences();p.autoFire=false;steps(w,0.3,i,p);assert(!w.allies.some(b=>b.active));i.shoot=true;i.mouseX=320;i.mouseY=0;updateWorld(w,i,1/120,p);assert(w.allies.some(b=>b.active&&b.vy<0&&Math.abs(b.vx)<1e-6));
 const bullets=Array.from({length:2},()=>({active:false}));assert(emit(bullets,1,2,0,100,3,1));assert(emit(bullets,4,5,0,100,3,1));assert.equal(emit(bullets,8,9,0,100,3,1),false);assert.equal(bullets[0].x,1);
 const a=createWorld();for(let n=0;n<120;n++){updateWorld(a,input(),1/120,preferences());}assert.equal(a.events.filter(e=>e==='shoot').length,5);assert.equal(a.allies.length,128);assert.equal(a.hostiles.length,512);
});

test('colisión barrida y muerte: invulnerabilidad, daño, dash y reinicio limpio',()=>{
 assert(sweptHit(0,100,500,100,250,100,4));assert(!sweptHit(0,100,500,100,250,110,4));
 const w=createWorld(),i=input();emit(w.hostiles,280,180,0,10000,4,1);updateWorld(w,i,1/120,preferences());assert.equal(w.player.hp,4);assert(!damagePlayer(w));
 w.player.invulnerable=0;i.dash=true;updateWorld(w,i,1/120,preferences());assert(w.player.invulnerable>0);assert(w.player.dashCooldown>0);
 for(let n=0;n<4;n++){w.player.invulnerable=0;damagePlayer(w);}assert.equal(w.status,'dead');assert.equal(w.player.hp,0);assert(!w.hostiles.some(b=>b.active));
 const clean=createWorld();assert.equal(clean.player.hp,5);assert.deepEqual(clean.inventory,{});assert.equal(clean.roomId,0);
});

test('primera oleada segura, aviso antes de balas y cierre de puertas',()=>{
 const w=createWorld(123),i=input();assert(travel(w,1));assert(!travel(w,2));steps(w,1.5,i);assert(w.enemies.length>0);assert(w.enemies.every(e=>Math.hypot(e.x-w.player.x,e.y-w.player.y)>125));assert(!w.hostiles.some(b=>b.active));
 let sawWarning=false;for(let n=0;n<300;n++){updateWorld(w,i,1/120,preferences());if(w.enemies.some(e=>e.warning))sawWarning=true;if(w.hostiles.some(b=>b.active))break;}assert(sawWarning);assert(w.hostiles.some(b=>b.active));
});

test('recompensas sin duplicados, límites, sinergias y acceso por desbloqueo',()=>{
 const w=createWorld(4);offerUpgrades(w);assert.equal(new Set(w.options.map(u=>u.id)).size,w.options.length);assert(!w.options.some(u=>u.unlock));assert(!chooseUpgrade(w,'inventada'));assert(chooseUpgrade(w,w.options[0].id));assert(!chooseUpgrade(w,w.options[0]?.id));
 w.inventory={ember:2,halo:1,pulse:1,heart:1};recalculate(w);assert(Math.abs(w.stats.damage-3.0375)<1e-6);assert.equal(w.player.maxHp,6);const damage=w.stats.damage;recalculate(w);assert.equal(w.stats.damage,damage);
 for(const u of upgrades)w.inventory[u.id]=u.max;offerUpgrades(w);assert(w.options.length>0);
});

test('guardado versionado: corrupción, valores imposibles y teclas duplicadas',()=>{
 assert.deepEqual(validateSave(null),freshSave());assert.deepEqual(validateSave({version:2}),freshSave());
 const bad=freshSave();bad.progress.echoes=-10;bad.progress.unlocks=99;bad.preferences.bindings.up='KeyD';bad.preferences.muted='false';const result=validateSave(bad);assert.equal(result.progress.echoes,0);assert.equal(result.progress.unlocks,2);assert.deepEqual(result.preferences.bindings,defaults);assert.equal(result.preferences.muted,false);
 const good=freshSave();good.progress.echoes=8;good.preferences.bindings.up='ArrowUp';assert.deepEqual(validateSave(good),good);
});

test('zona completa: combate real, oleadas, mejoras, refugio y tres fases del jefe',()=>{
 const w=createWorld(42,2),i=input(),p=preferences(),phases=new Set();let budget=0;
 assert(!travel(w,8));
 for(let id=1;id<=8;id++){
  assert(travel(w,id));
  while(w.status==='playing'&&!w.rooms[id].cleared&&budget<180000){
   // Fixture de supervivencia: se aísla el ciclo de combate; el daño se prueba aparte.
   w.player.invulnerable=1;
   const target=w.enemies.find(e=>e.active);if(target){i.mouseX=target.x;i.mouseY=target.y;if(target.type==='boss')phases.add(target.phase);}
   updateWorld(w,i,1/120,p);w.events.length=0;budget++;
  }
  if(id<8){assert.equal(w.status,'reward',`sala ${id}`);const choice=w.options.find(u=>u.id==='ember'||u.id==='pulse')||w.options[0];assert(chooseUpgrade(w,choice.id));}
 }
 assert.equal(w.status,'won');assert.equal(w.cleared,8);assert(w.kills>25);assert.deepEqual([...phases],[0,1,2]);assert(budget<180000);
 console.log(`Zona completada por fixture en ${w.time.toFixed(1)} s de simulación, ${w.kills} enemigos.`);
 const rest=createWorld(42);rest.roomId=2;rest.rooms[2].cleared=true;rest.rooms[2].rewardTaken=true;rest.player.hp=1;const branch=rest.rooms[2].links.find(id=>rest.rooms[id].kind==='rest');if(branch!==undefined){assert(travel(rest,branch));assert.equal(rest.player.hp,3);assert(travel(rest,2));assert(travel(rest,branch));assert.equal(rest.player.hp,3);}
});

test('los tres patrones respetan cantidades, velocidades y ángulos definidos',()=>{
 for(const [pattern,count,speed] of [['ring',12,90],['fan',5,105],['spiral',6,95]]){
  const w=createWorld();w.enemies.push({id:0,type:'keeper',x:320,y:90,radius:12,hp:7,maxHp:7,active:true,timer:0.001,warning:true,pattern,angle:Math.PI/2,offset:0,phase:0,flash:0});
  updateWorld(w,input(),1/120,preferences());const bullets=w.hostiles.filter(b=>b.active);assert.equal(bullets.length,count);assert(bullets.every(b=>Math.abs(Math.hypot(b.vx,b.vy)-speed)<1e-6));
  if(pattern==='fan'){const angles=bullets.map(b=>Math.atan2(b.vy,b.vx));assert(Math.abs(angles[0]-Math.PI/3)<1e-6);assert(Math.abs(angles.at(-1)-2*Math.PI/3)<1e-6);}
 }
});

test('la recompensa de reserva no supera los límites de acumulación',()=>{
 const w=createWorld();for(const u of upgrades)w.inventory[u.id]=u.max;w.player.hp=1;offerUpgrades(w);assert.equal(w.options[0].id,'restore');assert(chooseUpgrade(w,'restore'));assert.equal(w.player.hp,3);for(const u of upgrades)assert.equal(w.inventory[u.id],u.max);
});

test('cuatro armas configurables: ráfaga, dispersión, rebote y alternancia',async()=>{
 const {weapons}=await import('../src/data/weapons.js');const {equipWeapon,swapWeapon}=await import('../src/weapons.js');
 for(const gun of Object.values(weapons)){
  const w=createWorld();equipWeapon(w,gun.id);const i=input();steps(w,0.6,i);assert(w.events.includes('shoot'),gun.id);assert(w.allies.some(b=>b.mode===gun.mode),gun.id);
 }
 const w=createWorld();equipWeapon(w,'ricochet');let b=emit(w.allies,614,100,0,300,3,1);b.mode='bounce';b.bounces=2;steps(w,0.05);assert(b.vx<0);assert.equal(b.bounces,1);swapWeapon(w);assert.equal(w.weaponIndex,0);
});
