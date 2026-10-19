import {depth as D,difficulties,pacts} from './data/depth.js';
export function initRules(w,index=0,selected=[]){w.difficultyIndex=Number.isInteger(index)?Math.max(0,Math.min(4,index)):0;w.rules=difficulties[w.difficultyIndex];w.pactIds=[...new Set(selected.filter(id=>pacts.some(p=>p.id===id)))].slice(0,D.caps.pacts);w.healCarry=0;}
export function hasPact(w,id){return w.pactIds.includes(id);}
export function heal(w,amount){const total=amount*w.rules.heal*(hasPact(w,'thirst')?0.75:1)*(1+(w.itemBonuses?.heal||0))+w.healCarry;const points=Math.floor(total+1e-9);w.healCarry=Math.max(0,total-points);w.player.hp=Math.min(w.player.maxHp,w.player.hp+points);return points;}
export function rareWeights(w,rarity,base){const bonus=w.rules.rare+(w.metaTree?.luck||0)*2;return base+(rarity==='rare'?bonus:rarity==='epic'?bonus*0.3:0);}
