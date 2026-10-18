import {settings as s,colors as c} from './data.js';
// Matrices originales de 16×16: cada celda ocupa 2 píxeles nativos.
const hero=[
'.....OOOOOO.....','....OBBBBBBO....','...OBWWBBBBOO...','...OBBBBBBBBO...','...OBBOBBOBBO...','...OBBOBBOBBO...','....OBBBBBBO....','.....OOOOOO.....','....OTTTTTTO....','...OTLLLLTTTO...','..OTLLLLTTTTTO..','..OTLTTTTTTTTO..','.OOTTTTTTTTTTOO.','.OTTTTTTTTTTTTO.','..OOOOOOOOOOOO..','....OO....OO....'];
const keeper=[
'.....OOOOOO.....','...OOSSSSSSOO...','..OSSSSSSSSSSO..','..OSSSSSSSSSSO..','..OSBOBBOBBBSO..','..OSBOBBOBBBSO..','...OSBBBBBBSO...','....OSSSSSSO....','...OOEEEEEEOO...','..OEEEEEEEEEEO..','.OEEOEEEEEEOEEO.','.OEOEEEEEEEEOEO.','..OEEEEEEEEEEO..','..OEEEEEEEEEEO..','...OOOOOOOOOO...','....OO....OO....'];
const mourner=[
'......OOOO......','....OOTTTTOO....','...OTLLLLTTTO...','..OTLLLLTTTTTO..','..OTLBBBBBBTTO..','..OTBBOBBOBTTO..','..OTBBOBBOBTTO..','...OTBBBBBTTO...','....OTTTTTTO....','...OTTTTTTTTO...','..OTLTTTTTTTTO..','..OTTTTTTTTTTO..','.OTTTTTTTTTTTTO.','.OTTOTTTTTTOTTO.','..OO.OOOOOO.OO..','......O..O......'];
const palette={O:c.outline,B:c.bone,W:c.white,T:c.cloth,L:c.clothLight,S:c.lightStone,E:c.earthLight};
function sprite(rows,size=32){const image=document.createElement('canvas');image.width=size;image.height=size;const ctx=image.getContext('2d'),unit=size/16;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const color=palette[rows[y][x]];if(color){ctx.fillStyle=color;ctx.fillRect(x*unit,y*unit,unit,unit);}}return image;}
export function createRenderer(canvas){
 const ctx=canvas.getContext('2d'),sprites={player:sprite(hero),keeper:sprite(keeper),mourner:sprite(mourner),boss:sprite(keeper,64)};
 const floor=document.createElement('canvas');floor.width=640;floor.height=360;const f=floor.getContext('2d');f.fillStyle=c.shadow;f.fillRect(0,0,640,360);f.fillStyle=c.floor;f.fillRect(20,20,600,320);
 for(let y=20;y<340;y+=16)for(let x=20;x<620;x+=16){f.strokeStyle=c.shadow;f.strokeRect(x+0.5,y+0.5,16,16);if((x*7+y*3)%80===0){f.fillStyle=c.stone;f.fillRect(x+3,y+4,3,2);}}
 f.strokeStyle=c.lightStone;f.lineWidth=3;f.strokeRect(18.5,18.5,603,323);
 function diamond(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fill();}
 return function render(world,input,preferences){
 ctx.imageSmoothingEnabled=false;ctx.save();
 if(world.shake>0&&!preferences.reducedEffects)ctx.translate(Math.round(Math.sin(world.time*160)*2),Math.round(Math.cos(world.time*140)*2));
 ctx.drawImage(floor,0,0);
 const room=world.rooms[world.roomId];
 for(const id of room.links){const other=world.rooms[id];const x=other.x<room.x?4:other.x>room.x?620:296,y=other.y<room.y?4:other.y>room.y?340:156,w=x===296?48:16,h=x===296?16:48;
  ctx.fillStyle=room.cleared?c.cyanDark:c.stone;ctx.fillRect(x,y,w,h);ctx.fillStyle=room.cleared?c.cyan:c.lightStone;ctx.fillRect(x+4,y+4,w-8,h-8);
 }
 if(room.kind==='rest'){ctx.strokeStyle=c.green;ctx.lineWidth=3;ctx.strokeRect(290,150,60,60);ctx.fillStyle=c.bone;ctx.fillRect(315,163,10,34);ctx.fillRect(303,175,34,10);}
 if(!room.cleared&&!world.enemies.some(e=>e.active)&&world.spawnTimer>0){ctx.fillStyle=c.dust;ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('SE ACERCAN ECOS…',320,65);}
 for(const e of world.enemies){if(!e.active)continue;
  if(e.warning){ctx.strokeStyle=c.orange;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(e.x,e.y,e.radius+13,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   if(e.pattern==='fan'){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.strokeStyle=c.orange;ctx.beginPath();ctx.moveTo(40*Math.cos(-Math.PI/6),40*Math.sin(-Math.PI/6));ctx.lineTo(160*Math.cos(-Math.PI/6),160*Math.sin(-Math.PI/6));ctx.moveTo(40*Math.cos(Math.PI/6),40*Math.sin(Math.PI/6));ctx.lineTo(160*Math.cos(Math.PI/6),160*Math.sin(Math.PI/6));ctx.stroke();ctx.restore();}
  }
  const size=e.type==='boss'?64:32;ctx.drawImage(sprites[e.type],Math.round(e.x-size/2),Math.round(e.y-size/2));
  if(e.flash>0&&!preferences.reducedEffects){ctx.strokeStyle=c.white;ctx.strokeRect(Math.round(e.x-size/2),Math.round(e.y-size/2),size,size);}
  if(e.type==='boss'){ctx.fillStyle=c.orange;ctx.fillRect(e.x-24,e.y-32,8,8);ctx.fillRect(e.x+16,e.y-32,8,8);}
  else {ctx.fillStyle=c.outline;ctx.fillRect(e.x-14,e.y-23,28,3);ctx.fillStyle=c.bone;ctx.fillRect(e.x-14,e.y-23,28*Math.max(0,e.hp/e.maxHp),3);}
 }
 for(const b of world.allies){if(!b.active)continue;const x=Math.round(b.x),y=Math.round(b.y);ctx.fillStyle=c.cyanDark;ctx.fillRect(x-4,y-4,8,8);ctx.fillStyle=c.cyan;ctx.fillRect(x-2,y-2,4,4);}
 for(const b of world.hostiles){if(!b.active)continue;const x=Math.round(b.x),y=Math.round(b.y);diamond(x,y,6,c.outline);diamond(x,y,5,b.shape?c.orange:c.red);diamond(x-1,y-1,2,c.yellow);}
 const p=world.player,x=Math.round(p.x),y=Math.round(p.y);
 if(p.invulnerable<=0||Math.floor(world.time*18)%2===0)ctx.drawImage(sprites.player,x-16,y-16);
 ctx.strokeStyle=c.cyanDark;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(p.angle)*21,y+Math.sin(p.angle)*21);ctx.stroke();
 ctx.fillStyle=c.outline;ctx.beginPath();ctx.arc(x,y,p.radius+2,0,Math.PI*2);ctx.fill();ctx.fillStyle=c.white;ctx.beginPath();ctx.arc(x,y,p.radius,0,Math.PI*2);ctx.fill();
 if(p.dashTime>0){ctx.strokeStyle=c.cyan;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle=c.cyan;ctx.lineWidth=1;const mx=Math.round(input.mouseX),my=Math.round(input.mouseY);ctx.strokeRect(mx-5,my-5,10,10);ctx.restore();
 };
}
