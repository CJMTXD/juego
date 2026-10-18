export function createAudio(getPreferences){
 let context;
 const notes={shoot:[280,0.025,'square',0.015],hit:[120,0.04,'triangle',0.04],hurt:[70,0.17,'sawtooth',0.06],kill:[180,0.08,'triangle',0.05],reward:[660,0.16,'sine',0.06],win:[880,0.5,'sine',0.07],death:[45,0.6,'sawtooth',0.04],dash:[400,0.06,'sine',0.02],heal:[520,0.2,'sine',0.04]};
 return {unlock(){try{context??=new (window.AudioContext||window.webkitAudioContext)();context.resume().catch(()=>{});}catch{}},play(name){
  if(getPreferences().muted||!context||context.state!=='running'||!notes[name])return;
  const [hz,duration,type,volume]=notes[name],osc=context.createOscillator(),gain=context.createGain();
  osc.type=type;osc.frequency.setValueAtTime(hz,context.currentTime);osc.frequency.exponentialRampToValueAtTime(Math.max(20,hz/2),context.currentTime+duration);
  gain.gain.setValueAtTime(volume,context.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,context.currentTime+duration);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+duration);
 }};
}
