export function createInput(canvas, getBindings, onPause) {
 const keys=new Set();
 const input={keys,mouseX:480,mouseY:180,shoot:false,dash:false,swap:false,clear(){keys.clear();input.shoot=false;input.dash=false;input.swap=false;}};
 const editing=t=>t instanceof HTMLElement&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName));
 window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();if(!e.repeat)onPause();return;}
  if(editing(e.target))return;
  const bindings=getBindings();
  if(Object.values(bindings).includes(e.code)) {e.preventDefault();keys.add(e.code);if(e.code===bindings.dash&&!e.repeat)input.dash=true;if(e.code===bindings.swap&&!e.repeat)input.swap=true;}
 });
 window.addEventListener('keyup',e=>keys.delete(e.code));
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();input.mouseX=(e.clientX-r.left)*canvas.width/r.width;input.mouseY=(e.clientY-r.top)*canvas.height/r.height;});
 canvas.addEventListener('pointerdown',e=>{if(e.button===0){input.shoot=true;canvas.focus();}});
 window.addEventListener('pointerup',()=>input.shoot=false);
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 return input;
}
