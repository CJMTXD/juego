import {steer} from './bot-driver.mjs';
// Límite favorable: supervivencia forzada y puntería perfecta. No mide destreza ni diversión humana.
import assert from 'node:assert/strict';
import {createWorld,updateWorld,travel,chooseUpgrade,advanceWorld,recalculate,offerUpgrades} from '../src/simulation.js';
import {freshSave} from '../src/storage.js';
import {prepareProfile} from '../src/meta-game.js';
import {prepareDraft,selectStartingWeapon} from '../src/evolution.js';
import {initRules} from '../src/rules.js';
import {defaults} from '../src/data.js';
export function measureCampaign(seed,difficulty=0){
 const save=freshSave(),w=createWorld(seed);prepareProfile(w,save);initRules(w,difficulty);prepareDraft(w,save);selectStartingWeapon(w,'needle');offerUpgrades(w);chooseUpgrade(w,w.options.find(u=>u.id==='ember'||u.id==='pulse')?.id||w.options[0].id);recalculate(w);
 const input={keys:new Set(),mouseX:400,mouseY:180},prefs={bindings:defaults,autoFire:true,reducedEffects:true};let ticks=0;const counts=[];
 for(let zone=0;zone<6;zone++){
  const start=w.time;
  for(let room=1;room<=8;room++){
   assert(travel(w,room));let roomTicks=0;
   while(w.status==='playing'&&!w.rooms[room].cleared&&roomTicks<600000){w.player.invulnerable=1;steer(w,input);const e=w.enemies.find(e=>e.active);if(e){}updateWorld(w,input,1/120,prefs);w.events.length=0;roomTicks++;ticks++;}
   assert(roomTicks<600000,JSON.stringify({error:'Combate sin salida',seed,difficulty,zone,room,player:w.player,gun:w.weaponProgress.needle,enemies:w.enemies.filter(e=>e.active),stats:w.stats}));if(room<8){assert.equal(w.status,'reward');const choice=['ember','pulse','halo','lens','fork','pierce','cinder','prism','laurel'].map(id=>w.options.find(u=>u.id===id)).find(Boolean)||w.options[0];assert(chooseUpgrade(w,choice.id));}
  }
  counts.push(+((w.time-start)/60).toFixed(2));if(zone<5)assert(advanceWorld(w));
 }
 assert.equal(w.status,'won');return {seed,difficulty,minutes:+(w.time/60).toFixed(2),kills:w.kills,level:w.weaponProgress.needle.level,worldMinutes:counts};
}
if(process.argv[1]?.endsWith('campaign-balance.mjs')){const results=[42,123,2026].map(seed=>measureCampaign(seed));results.push(measureCampaign(42,4));console.log(JSON.stringify({fixture:'Invulnerabilidad y puntería perfecta; sin viajes manuales ni tiempo de decisiones. No valida 15–25 min humanos.',results},null,2));}
