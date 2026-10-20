import {presentation as P} from './data/presentation.js';
// Síntesis original: sin descargas de audio. La música no usa el azar de la partida.
export function createAudio(getPreferences){
 let context,master,musicBus,effectsBus,ambient,filter,nextBeat=0,beat=0,zoneId=null,active=false;
 const notes={uiSelect:[340,0.035,'sine',0.008],uiConfirm:[640,0.09,'triangle',0.012],uiBack:[220,0.055,'sine',0.009],special:[990,0.35,'triangle',0.04],combo:[780,0.25,'triangle',0.04],super:[1320,0.6,'sine',0.05],evolve:[1046,0.35,'sine',0.05],shoot:[280,0.025,'square',0.012],hit:[120,0.04,'triangle',0.035],hurt:[70,0.17,'sawtooth',0.045],kill:[180,0.08,'triangle',0.035],reward:[660,0.16,'sine',0.045],win:[880,0.5,'sine',0.05],death:[45,0.6,'sawtooth',0.035],dash:[400,0.06,'sine',0.02],heal:[520,0.2,'sine',0.035],attack:[100,0.06,'triangle',0.015],warning:[480,0.05,'sine',0.012],phase:[320,0.2,'triangle',0.03]};
 function tone(hz,duration,wave,volume,music=false){
  if(!context||context.state!=='running')return;
  const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
  osc.type=wave;osc.frequency.setValueAtTime(hz,now);osc.frequency.exponentialRampToValueAtTime(Math.max(20,hz*0.7),now+duration);
  gain.gain.setValueAtTime(0.001,now);gain.gain.linearRampToValueAtTime(volume,now+0.008);gain.gain.exponentialRampToValueAtTime(0.001,now+duration);
  osc.connect(gain);gain.connect(music?musicBus:effectsBus);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start();osc.stop(now+duration);
 }
 return {
  unlock(){
   try{
    if(!context){
     context=new (window.AudioContext||window.webkitAudioContext)();master=context.createGain();master.gain.value=0.75;master.connect(context.destination);musicBus=context.createGain();effectsBus=context.createGain();musicBus.connect(master);effectsBus.connect(master);
     const buffer=context.createBuffer(1,context.sampleRate,context.sampleRate),data=buffer.getChannelData(0);
     for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*0.35;
     const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;filter=context.createBiquadFilter();filter.type='bandpass';filter.Q.value=0.5;ambient=context.createGain();ambient.gain.value=0;noise.connect(filter);filter.connect(ambient);ambient.connect(musicBus);noise.start();
    }
    context.resume().catch(()=>{});
   }catch{}
  },
  update(world,isActive){
   active=isActive;
   if(!context)return;
   const preferences=getPreferences(),now=context.currentTime;
   master.gain.setTargetAtTime(preferences.muted?0:P.audio.volume,now,0.025);musicBus.gain.setTargetAtTime(preferences.music?preferences.musicVolume??P.audio.musicDefault:0,now,.03);effectsBus.gain.setTargetAtTime(preferences.effectsVolume??P.audio.effectsDefault,now,.03);
   ambient.gain.setTargetAtTime(active&&!preferences.muted&&preferences.music?0.014:0,now,0.08);
   if(zoneId!==world.zone.id){zoneId=world.zone.id;beat=0;nextBeat=now;filter.frequency.setValueAtTime(180+world.worldIndex*140,now);}
   if(!active||preferences.muted||!preferences.music){nextBeat=now;return;}
   if(now>=nextBeat){
    let bullets=0;for(const b of world.hostiles)if(b.active)bullets++;const rest=['rest','start','altar'].includes(world.rooms[world.roomId].kind),level=P.audio.bulletLayers.filter(n=>bullets>=n).length;const sequence=[0,2,1,3,2,0,3,1],index=sequence[beat%sequence.length],hz=world.zone.music[index];
    tone(hz*(world.worldIndex>=4?2:1),world.zone.tempo*0.85,world.worldIndex%2?'sine':'triangle',0.013*(rest?P.audio.restVolume:1),true);
    let activeEnemies=0,bossActive=false;for(const e of world.enemies)if(e.active){activeEnemies++;bossActive||=e.type==='boss';}
    if(!rest&&(bossActive||level>=1))tone(hz*2,world.zone.tempo*0.25,'triangle',0.008,true);if(!rest&&level>=2&&beat%2===0)tone(hz*1.5,world.zone.tempo*.45,'sine',.006,true);if(!rest&&level>=3)tone(70,world.zone.tempo*.12,'triangle',.006,true);
    if(beat%4===0)tone(world.zone.music[0]/2,world.zone.tempo*1.8,'sine',0.015*(rest?P.audio.restVolume:1),true);
    beat++;nextBeat=now+world.zone.tempo*(bossActive?P.audio.bossTempo:rest?2:1);
   }
  },
  play(name,weapon=null){
   if(getPreferences().muted||!context||context.state!=='running'||!notes[name])return;
   const [hz,duration,wave,volume]=notes[name];
   if(name==='shoot'&&weapon)tone(weapon.tone,weapon.sound?.duration||duration,weapon.sound?.wave||wave,volume);
   else tone(hz,duration,wave,volume);
  },
  diagnostics(){return {available:!!context,state:context?.state||'uninitialized',zone:zoneId,beat,active};},
 };
}
