import {balance as B} from './data/balance.js';
export function createBulletPool(capacity){return Array.from({length:capacity},()=>({active:false,x:0,y:0,px:0,py:0,vx:0,vy:0,life:0,radius:0,damage:0,pierce:0,hits:0,shape:0,mode:'straight',bounces:0,range:0,distance:0,turn:0,orbit:0,delay:0}));}
export function emit(bullets,x,y,angle,speed,radius,damage,pierce=0,shape=0){
 const b=bullets.find(item=>!item.active);if(!b)return false;
 b.active=true;b.x=x;b.y=y;b.px=x;b.py=y;b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;b.radius=radius;b.damage=damage;b.pierce=pierce;b.hits=0;b.life=B.projectiles.life;b.shape=shape;
 b.mode='straight';b.bounces=0;b.range=10000;b.distance=0;b.turn=0;b.orbit=angle;b.delay=0;return b;
}
