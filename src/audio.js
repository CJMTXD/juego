// Síntesis original: sin descargas de audio. La música no usa el azar de la partida.
export function createAudio(getPreferences){
 let context,master,ambient,filter,nextBeat=0,beat=0,zoneId=null,active=false;
 const notes={special:[990,0.35,'triangle',0.04],combo:[780,0.25,'triangle',0.04],super:[1320,0.6,'sine',0.05],evolve:[1046,0.35,'sine',0.05],shoot:[280,0.025,'square',0.012],hit:[120,0.04,'triangle',0.035],hurt:[70,0.17,'sawtooth',0.045],kill:[180,0.08,'triangle',0.035],reward:[660,0.16,'sine',0.045],win:[880,0.5,'sine',0.05],death:[45,0.6,'sawtooth',0.035],dash:[400,0.06,'sine',0.02],heal:[520,0.2,'sine',0.035],attack:[100,0.06,'triangle',0.015],warning:[480,0.05,'sine',0.012],phase:[320,0.2,'triangle',0.03]};
 function tone(hz,duration,wave,volume){
  if(!context||context.state!=='running')return;
  const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
  osc.type=wave;osc.frequency.setValueAtTime(hz,now);osc.frequency.exponentialRampToValueAtTime(Math.max(20,hz*0.7),now+duration);
  gain.gain.setValueAtTime(0.001,now);gain.gain.linearRampToValueAtTime(volume,now+0.008);gain.gain.exponentialRampToValueAtTime(0.001,now+duration);
  osc.connect(gain);gain.connect(master);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start();osc.stop(now+duration);
 }
 return {
  unlock(){
   try{
    if(!context){
     context=new (window.AudioContext||window.webkitAudioContext)();master=context.createGain();master.gain.value=0.75;master.connect(context.destination);
     const buffer=context.createBuffer(1,context.sampleRate,context.sampleRate),data=buffer.getChannelData(0);
     for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*0.35;
     const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;filter=context.createBiquadFilter();filter.type='bandpass';filter.Q.value=0.5;ambient=context.createGain();ambient.gain.value=0;noise.connect(filter);filter.connect(ambient);ambient.connect(master);noise.start();
    }
    context.resume().catch(()=>{});
   }catch{}
  },
  update(world,isActive){
   active=isActive;
   if(!context)return;
   const preferences=getPreferences(),now=context.currentTime;
   master.gain.setTargetAtTime(preferences.muted?0:0.75,now,0.025);
   ambient.gain.setTargetAtTime(active&&!preferences.muted&&preferences.music?0.014:0,now,0.08);
   if(zoneId!==world.zone.id){zoneId=world.zone.id;beat=0;nextBeat=now;filter.frequency.setValueAtTime(180+world.worldIndex*140,now);}
   if(!active||preferences.muted||!preferences.music){nextBeat=now;return;}
   if(now>=nextBeat){
    const sequence=[0,2,1,3,2,0,3,1],index=sequence[beat%sequence.length],hz=world.zone.music[index];
    tone(hz*(world.worldIndex>=4?2:1),world.zone.tempo*0.85,world.worldIndex%2?'sine':'triangle',0.013);
    let activeEnemies=0,bossActive=false;for(const e of world.enemies)if(e.active){activeEnemies++;bossActive||=e.type==='boss';}
    if(bossActive||activeEnemies>=3)tone(hz*2,world.zone.tempo*0.25,'triangle',0.008);
    if(beat%4===0)tone(world.zone.music[0]/2,world.zone.tempo*1.8,'sine',0.015);
    beat++;nextBeat=now+world.zone.tempo;
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
