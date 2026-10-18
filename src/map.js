import { roomNames } from './data.js';
export function seededRandom(seed) {
 let state=seed>>>0;
 return ()=>{state=(state+0x6D2B79F5)|0;let x=Math.imul(state^(state>>>15),1|state);x^=x+Math.imul(x^(x>>>7),61|x);return ((x^(x>>>14))>>>0)/4294967296;};
}
export function generateMap(seed) {
 const random=seededRandom(seed);
 let path;
 // Camino acotado: siempre existe una ruta completa hasta el jefe.
 for(let attempt=0;attempt<100;attempt++) {
  path=[{x:2,y:2}];
  while(path.length<9){
   const last=path[path.length-1];
   const choices=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>({x:last.x+x,y:last.y+y})).filter(p=>p.x>=0&&p.x<5&&p.y>=0&&p.y<5&&!path.some(q=>q.x===p.x&&q.y===p.y));
   if(!choices.length)break;
   path.push(choices[Math.floor(random()*choices.length)]);
  }
  if(path.length===9)break;
 }
 if(path.length<9)path=[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:4,y:1},{x:3,y:1},{x:2,y:1},{x:1,y:1}];
 const rooms=path.map((pos,i)=>({...pos,id:i,depth:i,kind:i===0?'start':i===8?'boss':'combat',name:roomNames[i],links:[],cleared:i===0,visited:i===0,rewardTaken:i===0,waves:i<3?2:3}));
 for(let i=1;i<rooms.length;i++){rooms[i].links.push(i-1);rooms[i-1].links.push(i);}
 // Dos refugios laterales, sin cortar el camino principal ni crear encuentros obligatorios extra.
 for(let i=2;i<7&&rooms.length<11;i++){
  const parent=rooms[i];
  const free=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>({x:parent.x+x,y:parent.y+y})).filter(p=>p.x>=0&&p.x<5&&p.y>=0&&p.y<5&&!rooms.some(q=>p.x===q.x&&p.y===q.y));
  if(!free.length)continue;
  const pos=free[Math.floor(random()*free.length)],id=rooms.length;
  rooms.push({...pos,id,depth:i,kind:'rest',name:'Refugio de recuerdos',links:[i],cleared:true,visited:false,rewardTaken:true,waves:0}); parent.links.push(id);
 }
 return rooms;
}
