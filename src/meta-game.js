import {depth as D,difficulties,pacts,achievements} from './data/depth.js';
import {weapons} from './data/weapons.js';
import {characters} from './data/characters.js';
import {upgrades} from './data.js';
import {superItems} from './data/relics.js';
import {worlds} from './data/worlds.js';
export function price(save,category,id){let base=Infinity;const m=save.meta;
 if(category==='weapon'&&Object.hasOwn(weapons,id))base=D.weaponCosts[id];
 if(category==='tree'&&Object.hasOwn(D.tree,id))base=D.tree[id].base*D.tree[id].growth**m.tree[id];
 if(Object.hasOwn(D.purchases,category))base=D.purchases[category];
 if(category==='bestiary')base=D.purchases.lore;
 return Math.ceil(base*(1-0.05*m.tree.discount));
}
export function purchase(save,category,id){const m=save.meta;let target=null;
 if(category==='weapon'&&Object.hasOwn(weapons,id))target=m.weapons;
 if(category==='character'&&Object.hasOwn(characters,id))target=save.progress.characters;
 if(category==='item'&&upgrades.some(u=>u.id===id&&(u.shopUnlock||u.unlock)))target=m.items;
 if(category==='super'&&superItems.some(s=>s.id===id&&s.shopUnlock))target=m.supers;
 if(category==='skin'&&Object.hasOwn(characters,id))target=m.skins;
 if(category==='lore'&&worlds.some(w=>w.id===id))target=m.lore;
 if(category==='bestiary'&&(m.seenEnemies.includes(id)||m.seenBosses.includes(id)))target=m.lore;
 if(category==='tree'&&(!Object.hasOwn(D.tree,id)||m.tree[id]>=D.tree[id].max))return false;
 if(category==='reroll'&&m.rerolls>=99)return false;
 if(!target&&!['tree','reroll'].includes(category))return false;
 const key=category==='bestiary'?'entry:'+id:id;if(target?.includes(key))return false;
 const cost=price(save,category,id);if(!Number.isFinite(cost)||save.progress.echoes<cost)return false;
 save.progress.echoes-=cost;
 if(category==='tree')m.tree[id]++;
 else if(category==='reroll')m.rerolls++;
 else target.push(key);
 if(category==='lore'&&!m.fragments.includes(id))m.fragments.push(id);
 return true;
}
export function prepareProfile(w,save){w.startWorld=w.worldIndex;w.metaTree={...save.meta.tree};w.knownFragments=[...save.meta.fragments];w.skin=save.preferences.skin==='memory'&&save.meta.skins.includes(w.character.id)?'memory':'base';w.dailyKey='';w.bossesDefeated=[];w.roomCoins=0;}
export function discover(w,kind,id){const field={enemy:'discoveredEnemies',boss:'discoveredBosses'}[kind];if(field&&!w[field].includes(id)){w[field].push(id);w.discoveryRevision++;}}
export function syncDiscoveries(w,save){if(w.savedDiscoveryRevision===w.discoveryRevision)return false;w.savedDiscoveryRevision=w.discoveryRevision;let changed=false;for(const [target,source] of [['recipes',w.discoveredRecipes],['seenItems',w.discoveredItems],['seenEnemies',w.discoveredEnemies],['seenBosses',w.discoveredBosses]])for(const id of source)if(!save.meta[target].includes(id)){save.meta[target].push(id);changed=true;}return changed;}
export function resultBreakdown(w){const difficulty=difficulties[w.difficultyIndex||0],pactBonus=(w.pactIds||[]).reduce((n,id)=>n+(pacts.find(p=>p.id===id)?.echoes||0),0),won=w.status==='won';
 const kills=Math.floor(w.kills/D.economy.killEvery),bosses=(w.bossesDefeated?.length||0)*D.economy.boss,worlds=(w.bossesDefeated?.length||0)*D.economy.world,victory=won?D.economy.win:0,base=kills+bosses+worlds+victory;
 const difficultyBonus=Math.floor(base*(difficulty.echoes-1)),pact=Math.floor(base*pactBonus),before=base+difficultyBonus+pact,death=won?0:Math.ceil(before*(1-D.economy.deathFactor));
 let total=Math.max(0,before-death);if(!won&&(w.kills>0||w.grazes>0))total=Math.max(D.economy.minDeath,total);if(w.cheated)total=0;
 return {kills,bosses,worlds,victory,difficulty:difficultyBonus,pacts:pact,death,total};
}
export function settleRun(w,save){if(w.settled||!['dead','won'].includes(w.status))return false;w.settled=true;w.result=resultBreakdown(w);w.earned=w.result.total;
 w.trueEnding=w.status==='won'&&w.startWorld===0&&(w.difficultyIndex||0)>=2&&(w.knownFragments?.length||0)>=3&&w.secretVisits>0;
 let used=w.character.weapon,shots=-1;for(const [id,record] of Object.entries(w.weaponProgress))if(record.shots>shots){used=id;shots=record.shots;}w.mostUsed=used;
 if(w.cheated)return true;
 const m=save.meta;if(w.dailyKey&&m.dailyWins.includes(w.dailyKey)){w.earned=0;w.result.total=0;w.dailyRepeated=true;}
 save.progress.echoes=Math.min(D.economy.maxCurrency,save.progress.echoes+w.earned);save.progress.totalEchoes=Math.min(D.economy.maxCurrency,save.progress.totalEchoes+w.earned);
 m.totalKills=Math.min(1000000,m.totalKills+w.kills);m.totalGraze=Math.min(1000000,m.totalGraze+w.grazes);m.totalDamage=Math.min(1000000,m.totalDamage+Math.floor(w.damageDealt));
 if(w.status==='won'){save.progress.wins++;if(w.startWorld===0){m.difficulty=Math.max(m.difficulty,Math.min(4,(w.difficultyIndex||0)+1));const mark=w.character.id+':'+(w.difficultyIndex||0);if(!m.marks.includes(mark))m.marks.push(mark);}if(w.dailyKey&&!m.dailyWins.includes(w.dailyKey))m.dailyWins.push(w.dailyKey);}else m.deaths++;
 const achieved={first:w.bossesDefeated.length>0,ascend:w.status==='won'&&w.startWorld===0,grazer:m.totalGraze>=100,alchemist:m.recipes.length>=3,evolved:Object.values(w.weaponProgress).some(p=>p.level===4),daily:!!w.dailyKey&&w.status==='won',true:w.trueEnding};for(const a of achievements)if(achieved[a.id]&&!m.achievements.includes(a.id))m.achievements.push(a.id);
 m.history.push({seed:w.seed,kills:w.kills,world:w.worldIndex+1,echoes:w.earned,seconds:Math.floor(w.time),won:w.status==='won',difficulty:w.difficultyIndex||0,character:w.character.id,daily:w.dailyKey});if(m.history.length>D.economy.history)m.history.shift();return true;
}
