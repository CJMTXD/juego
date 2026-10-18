import {settings,defaults,upgrades,lore} from './data.js';
import {createWorld,updateWorld,chooseUpgrade,travel} from './simulation.js';
import {createInput} from './input.js';
import {createRenderer} from './render.js';
import {loadSave,persist,validKey} from './storage.js';
import {createAudio} from './audio.js';
const $=id=>document.getElementById(id),canvas=$('game'),panel=$('panel');
const loaded=loadSave();const save=loaded.save;
let saveError=loaded.error,world=createWorld(1,save.progress.unlocks),mode='title',settingsReturn='title',waitingKey=null,previous=0,accumulator=0,lastHud=0,lastPanel='',lastMap='';
const audio=createAudio(()=>save.preferences);
const input=createInput(canvas,()=>save.preferences.bindings,()=>togglePause());
const render=createRenderer(canvas);
const keyName=code=>code.replace('Key','').replace('Digit','').replace('Space','Espacio').replace('Arrow','Flecha ').replace('ShiftLeft','Shift izq.').replace('ShiftRight','Shift der.');
const timeText=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`;
function saveNow(){saveError=!persist(save);}
function resetClock(){previous=performance.now();accumulator=0;input.clear();}
function setMode(value){mode=value;waitingKey=null;resetClock();lastPanel='';updatePanel();if(value==='playing'&&world.status==='playing')canvas.focus();}
function togglePause(){if(mode==='playing'&&world.status==='playing')setMode('paused');else if(mode==='paused')setMode('playing');else if(mode==='settings')setMode(settingsReturn);}
function startRun(){
 const text=$('seed-input')?.value.trim();let seed;
 if(text){if(!/^\d{1,10}$/.test(text)||Number(text)>4294967295){$('seed-error').textContent='Usa un entero entre 0 y 4294967295.';return;}seed=Number(text);}
 else {const values=new Uint32Array(1);crypto.getRandomValues(values);seed=values[0];}
 world=createWorld(seed,save.progress.unlocks);save.progress.runs++;saveNow();audio.unlock();setMode('playing');updateHud();
}
function settle(){
 if(world.settled||!['dead','won'].includes(world.status))return;
 world.settled=true;
 const earned=world.cleared+(world.status==='won'?6:0);
 save.progress.echoes=Math.min(1000000,save.progress.echoes+earned);
 if(world.status==='won')save.progress.wins++;
 world.earned=earned;saveNow();resetClock();lastPanel='';
}
function titlePanel(){return `<span class="eyebrow">EL DEPÓSITO DE LAS PROMESAS</span><h2>Lo que cae desde arriba</h2><p>Las alturas arrojan sus recuerdos al fondo. Cruza las salas del depósito y vence al Sellador para abrir la primera compuerta. Un primer capítulo completo; el resto del ascenso aún espera.</p><div class="stats"><span>${save.progress.echoes} ecos</span><span>${save.progress.wins} victorias</span><span>${save.progress.unlocks}/2 desbloqueos</span></div><div class="actions"><button class="primary" data-action="start">Comenzar partida</button><button data-action="settings">Opciones</button><button data-action="unlock" ${save.progress.unlocks>=2?'disabled':''}>${save.progress.unlocks>=2?'Todo desbloqueado':`Desbloquear ${save.progress.unlocks===0?'Lente':'Velo'} · ${save.progress.unlocks===0?5:10} ecos`}</button></div><label>Semilla opcional <input id="seed-input" type="text" inputmode="numeric" maxlength="10" placeholder="Aleatoria" aria-describedby="seed-error"></label><p id="seed-error" role="status"></p><p>WASD · ratón · Espacio para un impulso invulnerable breve. Esc para pausar.<br>Las mejoras son temporales; los ecos se conservan al terminar.</p>`;}
function settingsPanel(){const b=save.preferences.bindings;return `<h2>Opciones</h2><p>Los cambios se guardan solo en este navegador.</p><div class="settings">${[['up','Arriba'],['down','Abajo'],['left','Izquierda'],['right','Derecha'],['dash','Impulso']].map(([id,label])=>`<div class="setting"><span>${label}</span><button data-bind="${id}">${waitingKey===id?'Pulsa una tecla…':keyName(b[id])}</button></div>`).join('')}<label class="setting wide">Disparo automático<input type="checkbox" data-pref="autoFire" ${save.preferences.autoFire?'checked':''}></label><label class="setting wide">Silenciar audio<input type="checkbox" data-pref="muted" ${save.preferences.muted?'checked':''}></label><label class="setting wide">Reducir efectos y sacudida<input type="checkbox" data-pref="reducedEffects" ${save.preferences.reducedEffects?'checked':''}></label></div><p id="binding-message" role="status">Pulsa un control para reasignarlo. Esc cancela. Sin disparo automático, mantén clic izquierdo.</p><div class="actions"><button data-action="reset-controls">Restaurar controles</button><button class="primary" data-action="back">Volver</button></div>`;}
function updatePanel(){
 let screen=mode==='playing'?world.status:mode;
 if(screen==='playing'){panel.hidden=true;lastPanel='';return;}
 const signature=screen+waitingKey+save.progress.echoes+save.progress.unlocks+world.roomId+saveError;
 if(signature===lastPanel)return;lastPanel=signature;panel.hidden=false;
 let html='';
 if(screen==='title')html=titlePanel();
 else if(screen==='settings')html=settingsPanel();
 else if(screen==='paused')html='<h2>En pausa</h2><p>El tiempo se ha detenido. Reanuda cuando estés listo.</p><div class="actions"><button class="primary" data-action="resume">Continuar</button><button data-action="settings">Opciones</button><button data-action="abandon">Terminar partida</button></div>';
 else if(screen==='abandon')html='<h2>¿Terminar esta partida?</h2><p>Las mejoras temporales se perderán. Conservarás los ecos de las salas completadas.</p><div class="actions"><button data-action="resume">Seguir jugando</button><button data-action="confirm-abandon">Terminar</button></div>';
 else if(screen==='reward')html=`<span class="eyebrow">SALA SUPERADA</span><h2>Conserva un fragmento</h2><p>${lore[Math.min(7,world.rooms[world.roomId].depth)]}</p><div class="cards">${world.options.map(u=>`<button class="upgrade ${u.rarity}" data-upgrade="${u.id}"><span class="rarity">${{common:'COMÚN',rare:'RARA',epic:'ÉPICA'}[u.rarity]}</span><strong>${u.name}</strong><span>${u.text}</span><small>Nivel ${world.inventory[u.id]||0} / ${u.max}</small></button>`).join('')}</div><p>Elige una mejora para abrir las salidas.</p>`;
 else if(screen==='dead'||screen==='won')html=`<span class="eyebrow">${screen==='won'?'PRIMER CAPÍTULO COMPLETADO':'LA MEMORIA PERSISTE'}</span><h2>${screen==='won'?'La compuerta se abre':'Tu viaje termina aquí'}</h2><p>${screen==='won'?'Tras el sello hay cartas con la misma marca que la ceniza. El dolor del fondo sostiene la paz de arriba. Has liberado el primer paso; los mundos superiores quedan para una futura expansión.':'El depósito conserva tus ecos, pero las mejoras de esta partida se desvanecen. Cada patrón puede aprenderse.'}</p><div class="stats"><span>${timeText(world.time)}</span><span>${world.kills} enemigos</span><span>+${world.earned||0} ecos</span></div><p>Semilla: ${world.seed}</p><div class="actions"><button class="primary" data-action="restart">Nueva partida</button><button data-action="title">Inicio y desbloqueos</button></div>`;
 panel.innerHTML=`<div class="panel-content">${html}<p id="save-message">${saveError?'No se pudo leer o guardar el progreso. El juego funciona, pero comprueba que el navegador permite almacenamiento local.':''}</p></div>`;
 // El foco vuelve a un control visible al abrir un menú, sin secuestrar el teclado al jugar.
 panel.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
}
function updateHud(){
 const p=world.player,room=world.rooms[world.roomId];$('health').textContent='● '.repeat(p.hp)+'○ '.repeat(Math.max(0,p.maxHp-p.hp));$('dash-meter').value=1.5-p.dashCooldown;$('timer').textContent=timeText(world.time);$('room-name').textContent=room.name;
 $('wave').textContent=room.kind==='boss'?'Jefe':room.cleared?'Salidas abiertas':`Oleada ${Math.max(1,world.wave)} / ${room.waves}`;
 $('notice').textContent=room.cleared?(room.kind==='rest'?'Refugio: recuperas 2 de vida la primera vez.':room.kind==='start'?'Elige la primera sala en el mapa. Las puertas claras indican salidas.':lore[Math.min(room.depth,8)]):'Esquiva los rombos. Los anillos y las líneas naranjas anuncian el próximo ataque.';
 const boss=world.enemies.find(e=>e.active&&e.type==='boss');$('boss-hud').hidden=!boss;
 if(boss){$('boss-health').max=boss.maxHp;$('boss-health').value=Math.max(0,boss.hp);$('boss-phase').textContent=['Anillo','Abanico','Espiral'][boss.phase];}
 $('room-count').textContent=`${world.cleared} / 8`;$('seed-display').textContent=`Semilla ${world.seed}`;
 const counts=Object.entries(world.inventory);$('inventory').replaceChildren(...counts.map(([id,count])=>{const div=document.createElement('div');div.textContent=`${upgrades.find(u=>u.id===id)?.name||id} ×${count}`;return div;}));if(!counts.length)$('inventory').textContent='Sin mejoras todavía.';
 $('synergy').textContent=world.inventory.halo&&world.inventory.ember?'Sinergia activa: Brasa + Memoria (+35% de daño).':'';
 const b=save.preferences.bindings;$('controls-help').textContent=`${keyName(b.up)} ${keyName(b.left)} ${keyName(b.down)} ${keyName(b.right)}: moverse · ${keyName(b.dash)}: impulso · Ratón: apuntar · ${save.preferences.autoFire?'Disparo automático':'Mantén clic para disparar'} · Esc: pausa`;
 const mapKey=`${mode}:${world.status}:${world.roomId}:${world.rooms.filter(r=>r.visited).map(r=>r.id).join(',')}`;
 if(mapKey===lastMap)return;lastMap=mapKey;
 const map=$('map');map.replaceChildren();
 for(let y=0;y<5;y++)for(let x=0;x<5;x++){
  const r=world.rooms.find(r=>r.x===x&&r.y===y),button=document.createElement('button');button.type='button';
  if(!r){button.className='empty';button.disabled=true;button.tabIndex=-1;}else{
   const visible=r.visited||r.links.some(id=>world.rooms[id].visited);button.textContent=visible?{start:'◇',combat:'○',boss:'♛',rest:'+'}[r.kind]:'·';button.className=[r.id===world.roomId?'current':'',r.cleared?'cleared':'',!visible?'unknown':''].join(' ');
   button.disabled=mode!=='playing'||world.status!=='playing'||!room.cleared||!room.rewardTaken||!room.links.includes(r.id);button.dataset.room=r.id;button.title=visible?r.name:'Sala desconocida';button.setAttribute('aria-label',`${visible?r.name:'Sala desconocida'}${r.id===world.roomId?', ubicación actual':''}${r.cleared?', completada':''}`);if(r.id===world.roomId)button.setAttribute('aria-current','location');
  }map.append(button);
 }
}
$('map').addEventListener('click',e=>{const button=e.target.closest('[data-room]');if(button&&!button.disabled&&travel(world,Number(button.dataset.room))){audio.play('reward');input.clear();canvas.focus();updateHud();}});
$('menu-button').addEventListener('click',()=>{audio.unlock();togglePause();});
panel.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;audio.unlock();
 if(target.dataset.upgrade){if(chooseUpgrade(world,target.dataset.upgrade)){lastPanel='';updatePanel();updateHud();canvas.focus();}return;}
 if(target.dataset.bind){waitingKey=target.dataset.bind;lastPanel='';updatePanel();return;}
 switch(target.dataset.action){
  case 'start':startRun();break;
  case 'resume':setMode('playing');break;
  case 'settings':settingsReturn=mode;setMode('settings');break;
  case 'back':setMode(settingsReturn);break;
  case 'reset-controls':save.preferences.bindings={...defaults};saveNow();waitingKey=null;lastPanel='';updatePanel();break;
  case 'restart':world=createWorld(Date.now()>>>0,save.progress.unlocks);save.progress.runs++;saveNow();setMode('playing');break;
  case 'title':setMode('title');break;
  case 'abandon':setMode('abandon');break;
  case 'confirm-abandon':world.status='dead';settle();setMode('playing');break;
  case 'unlock':{const cost=save.progress.unlocks===0?5:10;if(save.progress.unlocks<2&&save.progress.echoes>=cost){save.progress.echoes-=cost;save.progress.unlocks++;saveNow();lastPanel='';updatePanel();}else{$('seed-error').textContent='Completa salas para reunir más ecos.';}break;}
 }
 updateHud();
});
panel.addEventListener('change',e=>{const key=e.target.dataset.pref;if(key){save.preferences[key]=e.target.checked;saveNow();updateHud();}});
window.addEventListener('keydown',e=>{
 if(mode!=='settings'||!waitingKey)return;e.preventDefault();e.stopImmediatePropagation();
 if(e.code==='Escape'){waitingKey=null;lastPanel='';updatePanel();return;}
 const conflict=Object.entries(save.preferences.bindings).some(([action,key])=>action!==waitingKey&&key===e.code);
 if(!validKey(e.code)||conflict){$('binding-message').textContent=conflict?'Esa tecla ya tiene otra acción. Elige una diferente.':'Usa letras, números, flechas, Espacio o Shift.';return;}
 save.preferences.bindings[waitingKey]=e.code;waitingKey=null;saveNow();lastPanel='';updatePanel();updateHud();
},true);
function autoPause(){if(mode==='playing'&&world.status==='playing')setMode('paused');input.clear();}
window.addEventListener('blur',autoPause);document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause();});
function resize(){const available=Math.min(canvas.parentElement.clientWidth,window.innerHeight-240);const scale=available>=640?Math.max(1,Math.floor(available/640)):Math.min(1,canvas.parentElement.clientWidth/640);canvas.style.width=`${640*scale}px`;canvas.style.height=`${360*scale}px`;}
window.addEventListener('resize',resize);resize();
function frame(now){const elapsed=Math.min(Math.max((now-previous)/1000,0),0.05);previous=now;
 if(mode==='playing'&&world.status==='playing'){
  accumulator+=elapsed;while(accumulator>=settings.step){updateWorld(world,input,settings.step,save.preferences);accumulator-=settings.step;if(world.status!=='playing'){accumulator=0;break;}}
 }
 // Un sonido de cada tipo por fotograma evita ráfagas de nodos de audio.
 for(let i=0;i<world.events.length;i++)if(world.events.indexOf(world.events[i])===i)audio.play(world.events[i]);world.events.length=0;
 settle();render(world,input,save.preferences);updatePanel();if(now-lastHud>150){updateHud();lastHud=now;}requestAnimationFrame(frame);
}
updatePanel();updateHud();requestAnimationFrame(frame);
