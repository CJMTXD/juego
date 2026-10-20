import {expansion as A} from './data/expansion.js';
export const assistDefaults=()=>({version:1,speed:1,heart:false,heal:false,hitbox:1});
export function validateAssist(raw){const a=assistDefaults();if(raw?.version!==1)return a;if(Number.isFinite(raw.speed))a.speed=Math.max(A.assist.minSpeed,Math.min(1,raw.speed));if(Number.isFinite(raw.hitbox))a.hitbox=Math.max(A.assist.minHitbox,Math.min(1,raw.hitbox));a.heart=raw.heart===true;a.heal=raw.heal===true;return a;}
export function applyAssist(w,pref){w.assist=w.dailyKey||w.weeklyKey?assistDefaults():validateAssist(pref);w.assisted=w.assist.speed<1||w.assist.hitbox<1||w.assist.heart||w.assist.heal;}
export function assistStats(w){w.player.radius=w.character.radius*(w.assist?.hitbox||1);if(w.assist?.heart)w.player.maxHp=Math.min(8,w.player.maxHp+A.assist.health);}
