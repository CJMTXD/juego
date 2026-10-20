import {characters as souls} from './data/characters.js';
import {drawFamiliars} from './adventure.js';
import {drawRoomContent,drawEliteMarks} from './rooms-content.js';
import {depth as D} from './data/depth.js';
import {extras as X} from './data/extras.js';
import {currentWeapon} from './weapons.js';
import {settings as s,colors as c,patterns} from './data.js';
// Matrices originales de 16×16: cada celda ocupa 2 píxeles nativos.
const hero=[
'.....OOOOOO.....','....OBBBBBBO....','...OBWWBBBBOO...','...OBBBBBBBBO...','...OBBOBBOBBO...','...OBBOBBOBBO...','....OBBBBBBO....','.....OOOOOO.....','....OTTTTTTO....','...OTLLLLTTTO...','..OTLLLLTTTTTO..','..OTLTTTTTTTTO..','.OOTTTTTTTTTTOO.','.OTTTTTTTTTTTTO.','..OOOOOOOOOOOO..','....OO....OO....'];
const keeper=[
'.....OOOOOO.....','...OOSSSSSSOO...','..OSSSSSSSSSSO..','..OSSSSSSSSSSO..','..OSBOBBOBBBSO..','..OSBOBBOBBBSO..','...OSBBBBBBSO...','....OSSSSSSO....','...OOEEEEEEOO...','..OEEEEEEEEEEO..','.OEEOEEEEEEOEEO.','.OEOEEEEEEEEOEO.','..OEEEEEEEEEEO..','..OEEEEEEEEEEO..','...OOOOOOOOOO...','....OO....OO....'];
const mourner=[
'......OOOO......','....OOTTTTOO....','...OTLLLLTTTO...','..OTLLLLTTTTTO..','..OTLBBBBBBTTO..','..OTBBOBBOBTTO..','..OTBBOBBOBTTO..','...OTBBBBBTTO...','....OTTTTTTO....','...OTTTTTTTTO...','..OTLTTTTTTTTO..','..OTTTTTTTTTTO..','.OTTTTTTTTTTTTO.','.OTTOTTTTTTOTTO.','..OO.OOOOOO.OO..','......O..O......'];
function creatureRows(kind,world){
 const base=(kind===1?mourner:keeper).map(row=>row.split(''));
 const put=(x,y,char)=>{if(x>=0&&x<16&&y>=0&&y<16)base[y][x]=char;};
 for(let n=0;n<3;n++){put(2+n,2+world%3,'O');put(13-n,2+world%3,'O');}
 if(kind===0){for(let y=8;y<14;y++)put(1+world%2,y,'S');}
 if(kind===1){for(let x=4;x<12;x++)put(x,1+world%2,'B');}
 if(kind===2){for(let y=1;y<6;y++){put(2,y,'O');put(13,y,'O');}for(let x=5;x<11;x++)put(x,11,'S');}
 if(kind===3){for(let x=2;x<14;x++)put(x,0,x%3===world%3?'B':'O');for(let y=4;y<13;y++){put(0,y,'S');put(15,y,'S');}}
 if(world===1){for(let y=9;y<15;y++)put(14,y,'B');}
 if(world===2){for(let y=2;y<10;y++)put(1,y,'L');}
 if(world===3){for(let x=0;x<16;x+=3)put(x,12,'E');}
 if(world===4){for(let x=0;x<16;x++)put(x,8,x%2?'B':'O');}
 if(world===5){for(let x=0;x<16;x+=2){put(x,3,'W');put(15-x,13,'B');}}
 return base.map(row=>row.join(''));
}
function characterRows(character){const rows=hero.map(row=>row.split(''));const n=character.look;if(n===1)for(let y=3;y<7;y++)for(let x=5;x<11;x++)rows[y][x]='O';if(n===2)for(let x=1;x<15;x++)rows[3][x]='L';if(n===3)for(let y=1;y<8;y++){rows[y][1]='L';rows[y][14]='L';}if(n===4)for(let x=2;x<14;x++){rows[0][x]='B';rows[2][x]='O';}return rows.map(row=>row.join(''));}
const palette={O:c.outline,B:c.bone,W:c.white,T:c.cloth,L:c.clothLight,S:c.lightStone,E:c.earthLight};
function sprite(rows,size=32){const image=document.createElement('canvas');image.width=size;image.height=size;const ctx=image.getContext('2d'),unit=size/16;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const color=palette[rows[y][x]];if(color){ctx.fillStyle=color;ctx.fillRect(x*unit,y*unit,unit,unit);}}return image;}
const weaponMasks=[
 ['.......X','......XX','.....XX.','....XX..','...XX...','..XX....','.XX.....','XX......'],
 ['X..X..X.','.X.X.X..','..XXX...','...X....','...X....','..XXX...','..X.X...','..X.X...'],
 ['..XXX...','.XXXXX..','..XXX...','...XXX..','..XXX...','...XXX..','..XXX...','...X....'],
 ['..XXXX..','.XX..XX.','XX.XX.XX','X.XXXX.X','X.XXXX.X','XX.XX.XX','.XX..XX.','..XXXX..'],
 ['...XX...','..XXXX..','.XX..XX.','XX....XX','.XX..XX.','..XXXX..','...XX...','...XX...'],
 ['...XX...','...XX...','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...','...XX...','...XX...'],
 ['..XXXX..','.X....X.','X..XX..X','X.X..X.X','X.X..X.X','X..XX..X','.X....X.','..XXXX..'],
 ['...XX...','..XXXX..','.XX..XX.','XX.XX.XX','X.XXXX.X','.XX..XX.','..XXXX..','...XX...'],
 ['...XX...','.X.XX.X.','..XXXX..','XXXXXXXX','XXXXXXXX','..XXXX..','.X.XX.X.','...XX...'],
 ['...XXXX.','..XX....','.XX.....','XX......','.XX.....','..XX....','...XXXX.','........']
];
export function makeWeaponSprite(gun){const image=document.createElement('canvas');image.width=16;image.height=16;const ctx=image.getContext('2d'),mask=weaponMasks[gun.shape%weaponMasks.length];for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(mask[y][x]==='X'){ctx.fillStyle=c.outline;ctx.fillRect(x*2-1,y*2-1,4,4);}for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(mask[y][x]==='X'){ctx.fillStyle=(x+y)%3?(gun.skin==='votive'?c.bone:c.cyan):(gun.skin==='votive'?c.white:c.bone);ctx.fillRect(x*2,y*2,2,2);}if(gun.level>1){ctx.fillStyle=c.bone;for(let n=0;n<gun.level;n++)ctx.fillRect(n*4,14,2,2);if(gun.level===4){ctx.strokeStyle=c.cyan;ctx.strokeRect(0.5,0.5,15,15);}}return image;}
export function makeEnemySprite(worldIndex,kind,boss=false){return sprite(creatureRows(kind,worldIndex),boss?64:32);}
export function drawPortrait(canvas,character){canvas.width=32;canvas.height=32;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite(characterRows(character)),0,0);ctx.fillStyle=c[character.color];ctx.fillRect(5,21,22,7);}
export function createRenderer(canvas){
 const ctx=canvas.getContext('2d'),sprites={player:sprite(hero),keeper:sprite(keeper),mourner:sprite(mourner),boss:sprite(keeper,64)};
 let loadedZone=null,loadedCharacter=null,loadedWeapon=null,weaponImage=null;
 const floor=document.createElement('canvas');floor.width=640;floor.height=360;const f=floor.getContext('2d');f.fillStyle=c.shadow;f.fillRect(0,0,640,360);f.fillStyle=c.floor;f.fillRect(20,20,600,320);
 for(let y=20;y<340;y+=16)for(let x=20;x<620;x+=16){f.strokeStyle=c.shadow;f.strokeRect(x+0.5,y+0.5,16,16);if((x*7+y*3)%80===0){f.fillStyle=c.stone;f.fillRect(x+3,y+4,3,2);}}
 f.strokeStyle=c.lightStone;f.lineWidth=3;f.strokeRect(18.5,18.5,603,323);
 function warningStroke(color){ctx.strokeStyle=c.outline;ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();}
 function warningRect(x,y,w,h,color){ctx.strokeStyle=c.outline;ctx.lineWidth=4;ctx.strokeRect(x,y,w,h);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
 function diamond(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fill();}
 return function render(world,input,preferences){
 if(loadedZone!==world.zone.id){loadedZone=world.zone.id;f.lineWidth=1;f.fillStyle=world.zone.floor;f.fillRect(20,20,600,320);for(let y=20;y<340;y+=16)for(let x=20;x<620;x+=16){f.strokeStyle=world.zone.detail;f.strokeRect(x+0.5,y+0.5,16,16);if(world.zone.tile===1&&(x+y)%32===8){f.fillStyle=world.zone.accent;f.fillRect(x+3,y+7,8,2);}}f.strokeStyle=c.lightStone;f.lineWidth=3;f.strokeRect(18.5,18.5,603,323);for(const key of Object.keys(sprites))if(!['player','keeper','mourner','boss'].includes(key))delete sprites[key];for(let i=0;i<world.zone.enemies.length;i++){sprites[world.zone.enemies[i].id]=sprite(creatureRows(i,world.worldIndex));}sprites.boss=sprite(creatureRows(3,world.worldIndex),64);sprites.rival=sprite(characterRows(souls[world.previousEcho?.character]||souls.remender));
 for(let y=36;y<325;y+=32)for(let x=36;x<605;x+=32){f.fillStyle=world.zone.accent;const tile=world.zone.tile;if(tile===2){f.fillRect(x,y,12,2);f.fillRect(x+5,y-4,2,10);}if(tile===3){f.fillRect(x,y,2,10);f.fillRect(x-3,y+3,8,2);}if(tile===4){f.strokeStyle=world.zone.detail;f.strokeRect(x,y,10,10);}if(tile===5){f.fillRect(x,y,2,6);f.fillRect(x-2,y+2,6,2);}}}
 if(loadedCharacter!==world.character.id){loadedCharacter=world.character.id;sprites.player=sprite(characterRows(world.character));}
 const gun=currentWeapon(world);if(loadedWeapon!==gun.id+':'+gun.level+':'+gun.skin){loadedWeapon=gun.id+':'+gun.level+':'+gun.skin;weaponImage=makeWeaponSprite(gun);}
 ctx.imageSmoothingEnabled=false;ctx.save();
 if(world.shake>0&&!preferences.reducedEffects&&!preferences.disableShake)ctx.translate(Math.round(Math.sin(world.time*160)*2),Math.round(Math.cos(world.time*140)*2));
 ctx.drawImage(floor,0,0);drawRoomContent(ctx,world);
 const type=world.zone.hazard,phase=world.hazardPhase;
 if(phase>0){ctx.strokeStyle=phase===1?c.orange:c.red;ctx.fillStyle=phase===1?c.stone:c.earth;ctx.lineWidth=2;if(type==='embers'){for(const [x,y] of world.hazardPositions){ctx.beginPath();ctx.arc(x,y,34,0,Math.PI*2);warningStroke(phase===1?c.orange:c.red);if(phase===2){ctx.fillStyle=c.red;ctx.fillRect(x-8,y-8,16,16);}}}if(type==='wind'){ctx.strokeStyle=c.cyanDark;ctx.strokeRect(50,45,540,270);ctx.fillStyle=c.cyanDark;for(let x=80;x<600;x+=80)ctx.fillText('↑',x,280);}if(type==='roots'){ctx.strokeStyle=c.green;ctx.beginPath();ctx.arc(320,180,90,0,Math.PI*2);ctx.stroke();}if(type==='mirrors'){ctx.strokeStyle=phase===1?c.orange:c.yellow;for(const x of world.mirrorPositions){ctx.beginPath();ctx.moveTo(x,70);ctx.lineTo(x,290);warningStroke(phase===1?c.orange:c.yellow);}}if(type==='eclipse'){ctx.strokeStyle=phase===1?c.orange:c.red;warningRect(130,20,45,320,phase===1?c.orange:c.red);warningRect(465,20,45,320,phase===1?c.orange:c.red);}if(type==='tide'){ctx.strokeStyle=c.cyanDark;ctx.strokeRect(20,125,600,110);ctx.fillStyle=c.cyanDark;for(let x=70;x<600;x+=70)ctx.fillText(Math.floor(world.hazardClock/8)%2?'→':'←',x,182);}}
 if(world.mark.active){ctx.strokeStyle=world.mark.timer>0?c.orange:c.red;ctx.lineWidth=2;ctx.beginPath();ctx.arc(world.mark.x,world.mark.y,world.mark.radius,0,Math.PI*2);warningStroke(world.mark.timer>0?c.orange:c.red);}
 const room=world.rooms[world.roomId];
 for(const id of room.links){const other=world.rooms[id];const x=other.x<room.x?4:other.x>room.x?620:296,y=other.y<room.y?4:other.y>room.y?340:156,w=x===296?48:16,h=x===296?16:48;
  ctx.fillStyle=room.cleared?c.cyanDark:c.stone;ctx.fillRect(x,y,w,h);ctx.fillStyle=room.cleared?c.cyan:c.lightStone;ctx.fillRect(x+4,y+4,w-8,h-8);
 }
 if(room.kind==='rest'){ctx.strokeStyle=c.green;ctx.lineWidth=3;ctx.strokeRect(290,150,60,60);ctx.fillStyle=c.bone;ctx.fillRect(315,163,10,34);ctx.fillRect(303,175,34,10);}
 if(!room.cleared&&!world.enemies.some(e=>e.active)&&world.spawnTimer>0){ctx.fillStyle=c.dust;ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('SE ACERCAN ECOS…',320,65);}
 for(const e of world.enemies){if(!e.active)continue;
  if(e.warning&&e.behavior==='blink'){ctx.strokeStyle=c.orange;ctx.strokeRect(e.destX-16,e.destY-16,32,32);}
  if(e.warning&&e.type==='boss'){const mechanic=world.zone.boss.mechanic;ctx.strokeStyle=c.orange;if(mechanic==='teleport')ctx.strokeRect(e.destX-25,e.destY-25,50,50);if(mechanic==='charge'){ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(e.angle)*150,e.y+Math.sin(e.angle)*150);warningStroke(c.orange);}if(mechanic==='echo'){ctx.beginPath();ctx.arc(640-e.x,360-e.y,30,0,Math.PI*2);ctx.stroke();}}
  if(e.warning&&patterns[e.pattern]?.mode==='ceiling'){ctx.strokeStyle=c.orange;for(let i=0;i<patterns[e.pattern].count;i++){const x=50+i*540/(patterns[e.pattern].count-1);if(Math.abs(x-e.targetX)>65){ctx.beginPath();ctx.moveTo(x,24);ctx.lineTo(x,90);ctx.stroke();}}}
  if(e.warning){ctx.strokeStyle=c.orange;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(e.x,e.y,e.radius+13,0,Math.PI*2);warningStroke(c.orange);ctx.setLineDash([]);
   if(e.pattern==='fan'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.strokeStyle=c.orange;ctx.beginPath();ctx.moveTo(40*Math.cos(-Math.PI/6),40*Math.sin(-Math.PI/6));ctx.lineTo(160*Math.cos(-Math.PI/6),160*Math.sin(-Math.PI/6));ctx.moveTo(40*Math.cos(Math.PI/6),40*Math.sin(Math.PI/6));ctx.lineTo(160*Math.cos(Math.PI/6),160*Math.sin(Math.PI/6));ctx.stroke();ctx.restore();}
  }
  const size=e.type==='boss'?64:e.miniboss?48:32;const entry=e.type==='boss'&&!preferences.reducedEffects?1-Math.max(0,e.entry||0)/X.effects.entrySeconds*0.3:1;ctx.drawImage(e.rival?sprites.rival:sprites[e.type],Math.round(e.x-size*entry/2),Math.round(e.y-size*entry/2),size*entry,size*entry);
  drawEliteMarks(ctx,e);if(e.elite){ctx.strokeStyle=c.orange;ctx.lineWidth=2;ctx.strokeRect(e.x-17,e.y-17,34,34);}
  if(e.flash>0&&!preferences.reducedEffects&&!preferences.disableFlash){ctx.strokeStyle=c.white;ctx.strokeRect(Math.round(e.x-size/2),Math.round(e.y-size/2),size,size);}
  if(e.type==='boss'){ctx.fillStyle=c.orange;ctx.fillRect(e.x-24,e.y-32,8,8);ctx.fillRect(e.x+16,e.y-32,8,8);}
  else {ctx.fillStyle=c.outline;ctx.fillRect(e.x-14,e.y-23,28,3);ctx.fillStyle=c.bone;ctx.fillRect(e.x-14,e.y-23,28*Math.max(0,e.hp/e.maxHp),3);}
 }
 for(const b of world.allies){if(!b.active)continue;const x=Math.round(b.x),y=Math.round(b.y);
 if(b.mode==='beam'){ctx.strokeStyle=c.cyan;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.px,b.py);ctx.lineTo(b.x,b.y);ctx.stroke();continue;}
 if(b.mode==='area'){ctx.strokeStyle=c.cyanDark;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,b.radius,0,Math.PI*2);ctx.stroke();if(b.delay<=0){ctx.strokeStyle=c.cyan;ctx.beginPath();ctx.arc(x,y,b.radius-4,0,Math.PI*2);ctx.stroke();}continue;}
 if(b.shape%2===1){ctx.strokeStyle=c.cyan;ctx.strokeRect(x-5,y-5,10,10);}
 ctx.fillStyle=c.cyanDark;ctx.fillRect(x-4,y-4,8,8);ctx.fillStyle=c.cyan;ctx.fillRect(x-2,y-2,4,4);}
 const threat=preferences.colorblind?D.accessibility.alternative:D.accessibility.normal;
 for(const b of world.hostiles){if(!b.active)continue;const x=Math.round(b.x),y=Math.round(b.y);diamond(x,y,preferences.highlightBullets?8:6,c.outline);diamond(x,y,preferences.highlightBullets?6:5,b.shape?threat[1]:threat[0]);diamond(x-1,y-1,2,threat[2]);}
 drawFamiliars(ctx,world);const p=world.player,x=Math.round(p.x),y=Math.round(p.y);
 if(preferences.disableFlash||preferences.reducedEffects||p.invulnerable<=0||Math.floor(world.time*18)%2===0){ctx.drawImage(sprites.player,x-16,y-16);ctx.fillStyle=world.skin==='ascendant'?c.white:world.skin==='memory'?c.bone:c[world.character.color];ctx.fillRect(x-11,y+5,22,7);if(world.character.look===1){ctx.fillStyle=c.outline;ctx.fillRect(x-5,y-10,10,8);}if(world.character.look===2){ctx.fillStyle=c.cyan;ctx.fillRect(x-10,y-15,20,3);}}
 if(!preferences.reducedEffects)for(const p of world.particles)if(p.active){ctx.fillStyle=p.life>0.12?c.bone:c.dust;if(p.kind==='number'){ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(String(p.value),Math.round(p.x),Math.round(p.y));}else ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2);}
 ctx.save();ctx.translate(x+Math.cos(p.angle)*12,y+Math.sin(p.angle)*12);ctx.rotate(p.angle+Math.PI/4);ctx.drawImage(weaponImage,-8,-8);ctx.restore();
 if(world.character.kind==='aura'){ctx.strokeStyle=c.clothLight;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,72,0,Math.PI*2);ctx.stroke();}
 if(world.trail.timer>0){ctx.strokeStyle=c.clothLight;ctx.lineWidth=2;ctx.strokeRect(world.trail.x-30,world.trail.y-30,60,60);}
 if(world.superItem){ctx.strokeStyle=c.bone;ctx.lineWidth=world.superPulse>0&&!preferences.disableFlash&&!preferences.reducedEffects?3:1;ctx.beginPath();ctx.arc(x,y,22+(!preferences.disableFlash&&!preferences.reducedEffects?world.superPulse||0:0)*18,0,Math.PI*2);ctx.stroke();}
 if(world.evolutionPulse>0&&!preferences.reducedEffects&&!preferences.disableFlash){ctx.strokeStyle=c.bone;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,25+world.evolutionPulse*12,0,Math.PI*2);ctx.stroke();}
 if(gun.mode==='charge'&&world.charge>0){ctx.strokeStyle=c.cyan;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,20,-Math.PI/2,-Math.PI/2+Math.PI*2*world.charge/gun.interval);ctx.stroke();}
 ctx.strokeStyle=c.cyanDark;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(p.angle)*21,y+Math.sin(p.angle)*21);ctx.stroke();
 if(world.abilityTime>0||world.grazePulse>0){ctx.strokeStyle=c.cyan;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,world.abilityTime>0?24:12,0,Math.PI*2);ctx.stroke();}
 if(world.defeat.timer>0&&!preferences.reducedEffects&&!preferences.disableFlash){ctx.strokeStyle=c.bone;ctx.lineWidth=2;ctx.beginPath();ctx.arc(world.defeat.x,world.defeat.y,24+(1-world.defeat.timer/X.effects.defeatSeconds)*45,0,Math.PI*2);ctx.stroke();}
 const hitRadius=p.radius*(preferences.hitboxScale||1);ctx.fillStyle=c.outline;ctx.beginPath();ctx.arc(x,y,hitRadius+2,0,Math.PI*2);ctx.fill();ctx.fillStyle=c.white;ctx.beginPath();ctx.arc(x,y,hitRadius,0,Math.PI*2);ctx.fill();
 if(p.dashTime>0){ctx.strokeStyle=c.cyan;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle=c.cyan;ctx.lineWidth=1;const mx=Math.round(input.mouseX),my=Math.round(input.mouseY);ctx.strokeRect(mx-5,my-5,10,10);ctx.restore();
 };
}
