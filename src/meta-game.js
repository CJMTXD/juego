import {depth as D} from './data/depth.js';
import {weapons} from './data/weapons.js';
export function purchase(save,category,id){
 if(category!=='weapon'||!Object.hasOwn(weapons,id)||save.meta.weapons.includes(id))return false;
 const cost=D.weaponCosts[id];if(save.progress.echoes<cost)return false;
 save.progress.echoes-=cost;save.meta.weapons.push(id);return true;
}
