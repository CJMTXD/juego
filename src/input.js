import {settings} from './data.js';
export function createInput(canvas, getBindings, onPause) {
 const keys=new Set(),keyboardKeys=new Set();
 const input={keys,keyboardKeys,device:'pointer',touchActive:false,mouseX:480,mouseY:180,shoot:false,dash:false,swap:false,special:false,candle:false,clear(){keys.clear();keyboardKeys.clear();input.shoot=false;input.dash=false;input.swap=false;input.special=false;input.candle=false;}};
 const editing=t=>t instanceof HTMLElement&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName));
 window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();if(!e.repeat)onPause();return;}
  if(editing(e.target))return;
  const bindings=getBindings();
  if(Object.values(bindings).includes(e.code)) {e.preventDefault();keys.add(e.code);keyboardKeys.add(e.code);input.device='keyboard';if(e.code===bindings.candle&&!e.repeat)input.candle=true;if(e.code===bindings.dash&&!e.repeat)input.dash=true;if(e.code===bindings.swap&&!e.repeat)input.swap=true;if(e.code===bindings.special&&!e.repeat)input.special=true;}
 });
 window.addEventListener('keyup',e=>{keys.delete(e.code);keyboardKeys.delete(e.code);});
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;input.device='pointer';const r=canvas.getBoundingClientRect();input.mouseX=(e.clientX-r.left)*settings.width/r.width;input.mouseY=(e.clientY-r.top)*settings.height/r.height;});
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')input.device='touch';if(e.pointerType!=='touch'&&e.button===0){input.shoot=true;canvas.focus({preventScroll:true});}});
 window.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')input.shoot=false;});
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 return input;
}
