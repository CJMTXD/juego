// Piloto de pruebas: planifica cada 0,25 s, mueve con las mismas teclas y esquiva.
import {blocked,boxHit} from '../src/rooms-content.js';
import {defaults} from '../src/data.js';
const dirs=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
export function steer(w,input){
 const p=w.player;let target=null,dist=Infinity;for(const e of w.enemies)if(e.active){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<dist){dist=d;target=e;}}if(!target){input.keys.clear();return;}
 input.mouseX=target.x;input.mouseY=target.y;
 if(w.time<(input.nextDecision||0))return;input.nextDecision=w.time+0.1;
 // BFS en rejilla pequeña; encuentra un punto con línea de tiro y distancia útil.
 const size=32,cols=18,rows=9,startX=Math.max(0,Math.min(cols-1,Math.round((p.x-48)/size))),startY=Math.max(0,Math.min(rows-1,Math.round((p.y-48)/size))),start=startY*cols+startX,queue=[start],prev=new Int16Array(cols*rows).fill(-1);prev[start]=start;let goal=start;
 const orbit=w.weaponSlots[w.weaponIndex]==='orbit',range=orbit?48:180;
 for(let head=0;head<queue.length;head++){const id=queue[head],x=48+id%cols*size,y=48+Math.floor(id/cols)*size;if(Math.hypot(target.x-x,target.y-y)<range&&!w.scenery.some(o=>o.active&&o.kind!=='pit'&&boxHit(x,y,target.x,target.y,o,4))){goal=id;break;}for(const [dx,dy] of dirs.slice(1,5)){const nx=id%cols+dx,ny=Math.floor(id/cols)+dy,next=ny*cols+nx;if(nx<0||nx>=cols||ny<0||ny>=rows||prev[next]>=0||blocked(w,48+nx*size,48+ny*size,10))continue;prev[next]=id;queue.push(next);}}
 let node=goal;while(prev[node]!==start&&prev[node]!==node&&prev[node]>=0)node=prev[node];const gx=48+node%cols*size,gy=48+Math.floor(node/cols)*size;
 const hold=Math.hypot(target.x-p.x,target.y-p.y)<range&&!w.scenery.some(o=>o.active&&o.kind!=='pit'&&boxHit(p.x,p.y,target.x,target.y,o,8));let best=Infinity,choice=dirs[0],danger=0;
 for(const dir of dirs){const len=Math.hypot(...dir)||1,x=p.x+dir[0]/len*18,y=p.y+dir[1]/len*18;if(x<45||x>595||y<45||y>315||blocked(w,x,y,10))continue;let score=hold?0:Math.hypot(gx-x,gy-y)*0.12;for(const b of w.hostiles)if(b.active){const bx=b.x+b.vx*.22,by=b.y+b.vy*.22,d=Math.hypot(bx-x,by-y);if(d<50)score+=(50-d)*2;if(Math.hypot(b.x-p.x,b.y-p.y)<26)danger++;}for(const e of w.enemies)if(e.active){const d=Math.hypot(e.x-x,e.y-y);if(d<e.radius+24)score+=100;}if(score<best){best=score;choice=dir;}}
 input.keys.clear();if(choice[0])input.keys.add(choice[0]>0?defaults.right:defaults.left);if(choice[1])input.keys.add(choice[1]>0?defaults.down:defaults.up);if(danger&&p.dashCooldown<=0)input.dash=true;if(w.abilityCharge>=100)input.special=true;
}
