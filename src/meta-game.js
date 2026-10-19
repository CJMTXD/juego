import {depth as D} from './data/depth.js';
import {weapons} from './data/weapons.js';
export function purchase(save,category,id){
 if(category!=='weapon'||!Object.hasOwn(weapons,id)||save.meta.weapons.includes(id))return false;
 const cost=D.weaponCosts[id];if(save.progress.echoes<cost)return false;
 save.progress.echoes-=cost;save.meta.weapons.push(id);return true;
}

export function syncDiscoveries(w,save){if(w.savedDiscoveryRevision===w.discoveryRevision)return false;w.savedDiscoveryRevision=w.discoveryRevision;let changed=false;for(const [target,source] of [['recipes',w.discoveredRecipes],['seenItems',w.discoveredItems]])for(const id of source)if(!save.meta[target].includes(id)){save.meta[target].push(id);changed=true;}return changed;}
