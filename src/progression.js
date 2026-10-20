import {personalStories,weeklyIdentity} from './data/journey.js';
import {expansion as A} from './data/expansion.js';
import {weapons} from './data/weapons.js';
import {masteryRank} from './journey.js';
export function initFeats(w){w.feats={healed:0,blocked:0,dashes:0,abilities:0,perfect:0,bossNoDash:0,bossNoAbility:0};w.weeklyKey='';w.weeklyMutator=null;w.spiral=false;w.spiralDepth=0;w.personalComplete=false;}
export function applyWeekly(w,date=new Date()){const identity=weeklyIdentity(date);w.weeklyKey=identity.key;w.dailyKey=identity.key;w.weeklyMutator=identity.mutator;w.rules={...w.rules,heal:w.rules.heal*identity.mutator.heal,health:w.rules.health*identity.mutator.health};return identity;}
export function weeklyRoom(w){if(w.weeklyMutator?.id!=='rotation')return;const ids=Object.keys(weapons),id=ids[(w.worldIndex*9+w.roomId)%ids.length];w.weaponSlots=[id];w.weaponIndex=0;w.burstLeft=0;w.charge=0;w.comboNotice='Arma prestada: '+weapons[id].name;w.comboTimer=4;}
export function recordProgression(w,save){if(w.cheated)return;const j=save.meta.journey;
 if(w.weeklyKey&&w.status==='won'&&!j.weeklyWins.includes(w.weeklyKey)){j.weeklyWins.push(w.weeklyKey);j.weeklyWins=j.weeklyWins.slice(-60);}
 if(w.assisted||w.dailyKey||w.weeklyKey)return;
 j.runs=Math.min(1000000,j.runs+1);j.spiralBest=Math.max(j.spiralBest,w.spiralDepth||0);
 for(const [id,p] of Object.entries(w.weaponProgress)){j.kills[id]=Math.min(1000000,(j.kills[id]||0)+p.kills);}
 const won=w.status==='won'&&w.startWorld===0&&!w.spiral;if(won)j.victories[w.character.id]=Math.min(1000000,(j.victories[w.character.id]||0)+1);
 const step=j.personal[w.character.id]||0,story=personalStories[w.character.id];if(step<3){const requirement=story.steps[step],value={...w.feats,kills:w.kills,grazes:w.grazes,flawlessBoss:w.bossFeats.length,won:won?1:0}[requirement.key]||0;if(value>=requirement.goal){j.personal[w.character.id]=step+1;w.personalUnlocked=step+1;}}
}
export function masterySkin(save,id){return masteryRank(save.meta.journey.kills[id]||0)>=1;}
