import {createTouch} from './ui/touch.js';
import {mobileSettings,helpCard} from './ui/mobile-settings.js';
import {createPlatform} from './ui/platform.js';
import {validateUi} from './ui/preferences.js';
import {uiConfig as U} from './ui/config.js';
import {createHud,showItem,fillLegend,roomLabels} from './ui/hud.js';
import {titleScreen,preparationScreen,screenHeader} from './ui/screens.js';
import {drawTitle} from './ui/title.js';
import {icon} from './ui/icons.js';
import {mythologies} from './data/relics.js';
import {roomPanel,debugPanel} from './extras-views.js';
import {useRoom,repeatChallenge,tutorialText,canEnterRoom} from './extras.js';
import {dailyIdentity,abilities,extras as X} from './data/extras.js';
import {depth as D} from './data/depth.js';
import {superItems} from './data/relics.js';
import {initRules} from './rules.js';
import {difficulties,pacts} from './data/depth.js';
import {claimSuper} from './relics.js';
import {recalculate,offerUpgrades} from './simulation.js';
import {prepareDraft,selectStartingWeapon} from './evolution.js';
import {extraPanel,superButtons} from './depth-views.js';
import {purchase,syncDiscoveries,prepareProfile,settleRun} from './meta-game.js';
import {balance as B} from './data/balance.js';
import {weapons} from './data/weapons.js';
import {worlds} from './data/worlds.js';
import {characters,canSelect,refreshCharacters} from './data/characters.js';
import {currentWeapon,weaponSynergy,equipWeapon} from './weapons.js';
import {settings,defaults,upgrades,lore} from './data.js';
import {createWorld,updateWorld,chooseUpgrade,travel,advanceWorld} from './simulation.js';
import {createInput} from './input.js';
import {createRenderer,drawPortrait,makeWeaponSprite} from './render.js';
import {loadSave,persist,validKey,freshSave} from './storage.js';
import {createAudio} from './audio.js';
const $=id=>document.getElementById(id),canvas=$('game'),panel=$('panel');
const debugTools=new URLSearchParams(location.search).get('debug')==='1';
const loaded=loadSave(debugTools);const save=loaded.save;refreshCharacters(save.progress);if(!canSelect(save.progress,characters[save.preferences.character]))save.preferences.character='remender';
let saveError=loaded.error,world=createWorld(1,save.progress.unlocks),mode='title',settingsReturn='title',waitingKey=null,previous=0,accumulator=0,lastHud=0,lastPanel='',lastMap='';
let debug=debugTools,fps=60,preparation={tab:'summary',weapon:'needle',initial:'ember'},navigation=[];
const audio=createAudio(()=>save.preferences);
const input=createInput(canvas,()=>save.preferences.bindings,()=>togglePause());
const render=createRenderer(canvas),updateGameHud=createHud();const effectivePreferences={...save.preferences};const platform=createPlatform(()=>save.preferences);const touch=createTouch(input,()=>world,()=>save.preferences,()=>mode==='playing'&&world.status==='playing');let lastDraw=0,drawScale=1;
function lowPerformance(){return save.preferences.ui.performance==='low'||save.preferences.ui.performance==='auto'&&((navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4);}fillLegend();
$('map-button').innerHTML=icon('map')+'<span>Mapa</span>';$('items-button').innerHTML=icon('bag')+'<span>Mochila</span>';$('menu-button').innerHTML=icon('pause');$('swap-button').innerHTML=icon('weapon')+'<span id="alternate-weapon">Cambiar</span>';$('fullscreen-button').innerHTML=icon('fullscreen');
const keyName=code=>({ArrowUp:'Flecha arriba',ArrowDown:'Flecha abajo',ArrowLeft:'Flecha izquierda',ArrowRight:'Flecha derecha',Space:'Espacio',ShiftLeft:'Shift izq.',ShiftRight:'Shift der.'}[code]||code.replace('Key','').replace('Digit',''));
const timeText=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`;
function applyPreferences(){document.documentElement.dataset.reduced=String(save.preferences.reducedEffects||save.preferences.disableFlash);Object.assign(effectivePreferences,save.preferences);}
applyPreferences();
function saveNow(){applyPreferences();saveError=!persist(save,debugTools);}
function resetClock(){previous=performance.now();accumulator=0;input.clear();}
function setMode(value){mode=value;waitingKey=null;resetClock();lastPanel='';lastMap='';updatePanel();updateHud();if(value==='playing'&&world.status==='playing')canvas.focus({preventScroll:true});}
function togglePause(){if(mode==='playing'&&world.status==='playing')setMode('paused');else if(mode==='paused')setMode('playing');else if(mode==='settings'||mode==='arsenal')setMode(navigation.pop()||settingsReturn);else if(['map','items'].includes(mode))setMode('playing');else if(mode==='prepare')setMode('title');else if(['codex','characters','sanctuary'].includes(mode))setMode(navigation.pop()||'title');}
function prepareRun(daily=false,keepSeed=false){
 const u=save.preferences.ui,day=dailyIdentity();let seed=world.seed;
 if(daily)seed=day.seed;else if(!keepSeed){const values=new Uint32Array(1);crypto.getRandomValues(values);seed=values[0];}
 const profile=daily?freshSave():save;if(daily){profile.meta.weapons=Object.keys(weapons);profile.meta.supers=superItems.map(s=>s.id);profile.meta.items=upgrades.map(u=>u.id);profile.progress.unlocks=2;}
 const start=daily?0:Math.min(u.startWorld,save.progress.worlds-1);world=createWorld(seed,profile.progress.unlocks,daily?X.daily.character:save.preferences.character,start);prepareProfile(world,profile);initRules(world,daily?0:Math.min(u.difficulty,save.meta.difficulty),daily?[]:u.pacts);prepareDraft(world,profile);world.dailyKey=daily?day.key:'';recalculate(world);world.player.hp=world.player.maxHp;
 offerUpgrades(world);world.status='draft';preparation.weapon=world.draft.some(g=>g.id===u.lastWeapon)?u.lastWeapon:world.character.weapon;preparation.initial=world.options.some(i=>i.id===u.lastInitial)?u.lastInitial:world.options[0].id;setMode('prepare');updateHud();
}
function startRun(){if(mode!=='prepare')return;const u=save.preferences.ui;
 if(!world.dailyKey&&$('seed-input')){const text=$('seed-input').value.trim();if(!/^\d{1,10}$/.test(text)||Number(text)>4294967295){$('seed-error').textContent='Usa un entero de 0 a 4294967295.';return;}if(Number(text)!==world.seed){world.seed=Number(text);prepareRun(false,true);}}
 if(!selectStartingWeapon(world,preparation.weapon))return;world.status='reward';chooseUpgrade(world,preparation.initial);if(!world.dailyKey){u.lastWeapon=preparation.weapon;u.lastInitial=preparation.initial;}save.progress.runs++;saveNow();audio.unlock();setMode('playing');updateHud();
}
function settle(){if(!settleRun(world,save))return;refreshCharacters(save.progress);saveNow();resetClock();lastPanel='';}
function titlePanel(){return titleScreen(save);}
function settingsPanel(){const b=save.preferences.bindings;return `<h2>Opciones</h2><p>Los cambios se guardan solo en este navegador.</p><div class="settings">${[['up','Arriba'],['down','Abajo'],['left','Izquierda'],['right','Derecha'],['dash','Esquiva'],['swap','Cambiar arma'],['special','Habilidad de roce']].map(([id,label])=>`<div class="setting"><span>${label}</span><button data-bind="${id}">${waitingKey===id?'Pulsa una tecla…':keyName(b[id])}</button></div>`).join('')}<label class="setting wide">Disparo automático<input type="checkbox" data-pref="autoFire" ${save.preferences.autoFire?'checked':''}></label><label class="setting wide">Silenciar audio<input type="checkbox" data-pref="muted" ${save.preferences.muted?'checked':''}></label><label class="setting wide">Música y ambiente<input type="checkbox" data-pref="music" ${save.preferences.music?'checked':''}></label><label class="setting wide">Reducir efectos y sacudida<input type="checkbox" data-pref="reducedEffects" ${save.preferences.reducedEffects?'checked':''}></label>${[['colorblind','Paleta alternativa'],['highlightBullets','Resaltar balas enemigas'],['disableFlash','Desactivar destellos y parpadeo'],['disableShake','Desactivar sacudida'],['damageNumbers','Números de daño'],['tutorial','Consejos integrados']].map(([id,label])=>`<label class="setting wide">${label}<input type="checkbox" data-pref="${id}" ${save.preferences[id]?'checked':''}></label>`).join('')}<label class="setting wide">Tamaño visual de hitbox (colisión sin cambios)<select data-hitbox>${D.accessibility.hitboxSizes.map(n=>`<option value="${n}" ${save.preferences.hitboxScale===n?'selected':''}>×${n}</option>`).join('')}</select></label></div>${mobileSettings(save.preferences.ui)}<p id="binding-message" role="status">Pulsa un control para reasignarlo. Esc cancela. Sin disparo automático, mantén clic izquierdo.</p><div class="actions"><button data-action="reset-controls">Restaurar controles</button><button class="primary" data-action="back">Volver</button></div>`;}
function updatePanel(){
 let screen=mode==='playing'?world.status:mode;if(document.body.dataset.screen!==screen){document.body.dataset.screen=screen;$('app').inert=screen!=='playing';}
 if(screen==='playing'){panel.hidden=true;lastPanel='';return;}
 const signature=screen+waitingKey+save.progress.echoes+save.progress.unlocks+world.roomId+saveError;
 if(signature===lastPanel)return;lastPanel=signature;panel.hidden=false;
 let html='';
 const extra=extraPanel(screen,world,save);
 if(screen==='map'||screen==='items')html=`<div id="utility-host"></div>`;
 else if(screen==='room')html=roomPanel(world);
 else if(extra!==null)html=extra;
 else if(screen==='title')html=titlePanel();
 else if(screen==='prepare')html=preparationScreen(world,save,preparation);
 else if(screen==='transition')html=`<span class="eyebrow">MUNDO SUPERADO</span><h2>${world.zone.name}</h2><p>${world.zone.lore[2]}</p><p>«${world.zone.boss.quote}»</p><p>Siguiente: ${worlds[world.worldIndex+1].name}. Recuperas hasta ${B.progression.restHeal+(world.inventory.dawn?1:0)} de vida, ajustada por dificultad y pactos; conservas equipo y mejoras.</p>${world.bossWeapon?`<button data-boss-weapon="${world.bossWeapon.id}">Tomar ${world.bossWeapon.name} y ascender</button>`:""}<button class="primary" data-action="ascend">Ascender conservando equipo</button>`;
 else if(screen==='settings')html=settingsPanel();
 else if(screen==='arsenal')html=`<h2>Armería del ascenso</h2><p>Dos ranuras: Q alterna. Las armas se consiguen en cofres de sala o al vencer jefes. Las parejas de armas pueden prestar una sinergia sin disparar ambas a la vez.</p><div class="cards">${Object.values(weapons).map(g=>`<div class="upgrade"><canvas class="weapon-icon" data-weapon-icon="${g.id}" width="16" height="16"></canvas><strong>${g.name}</strong><span>${g.damage} daño × ${g.count} · ${g.interval} s · ${g.speed} px/s · ${g.range} px</span><small>${g.rarity} · ${g.source}. ${g.special}</small></div>`).join('')}</div><button data-action="back">Volver</button>`;
 else if(screen==='characters')html=`<h2>Elige tu memoria</h2><div class="cards">${Object.values(characters).map(c=>`<button class="upgrade" data-character="${c.id}" ${canSelect(save.progress,c)?'':'disabled'}><canvas class="portrait" data-portrait="${c.id}" width="32" height="32"></canvas><strong>${c.name}</strong><span>Vida ${c.health} · Vel. ${c.speed} · Hitbox ${c.radius} · Daño ×${c.damage}</span><span>${c.passive}</span><small>${c.story} ${canSelect(save.progress,c)?'':c.unlock}</small></button>`).join('')}</div><button data-action="title">Volver</button>`;
 else if(screen==='paused')html='<h2>En pausa</h2><p>El tiempo se ha detenido. Reanuda cuando estés listo.</p><div class="actions"><button class="primary" data-action="resume">Continuar</button><button data-action="settings">Opciones</button><button data-action="map">Mapa</button><button data-action="items">Mochila</button><button data-action="arsenal">Armería</button><button data-action="abandon">Terminar partida</button></div>';
 else if(screen==='abandon')html='<h2>¿Terminar esta partida?</h2><p>Las mejoras temporales se perderán. Conservarás los ecos de las salas completadas.</p><div class="actions"><button data-action="resume">Seguir jugando</button><button data-action="confirm-abandon">Terminar</button></div>';
 else if(screen==='reward')html=`<span class="eyebrow">SALA SUPERADA</span><h2>Conserva un fragmento</h2><p>${world.zone.lore[Math.min(2,Math.floor(world.rooms[world.roomId].depth/3))]}</p><div class="cards">${world.options.map(u=>`<button class="upgrade ${u.rarity}" data-upgrade="${u.id}"><span class="rarity">${{common:'COMÚN',rare:'RARA',epic:'ÉPICA'}[u.rarity]}</span><strong>${u.name}</strong><span>${u.text}</span><small>Nivel ${world.inventory[u.id]||0} / ${u.max}</small></button>`).join('')}</div><div class="actions">${world.weaponOffer?`<button data-upgrade="weapon">Arma: ${world.weaponOffer.name} · ${world.weaponOffer.damage} daño · ${world.weaponOffer.interval} s · ${world.weaponOffer.special}</button>`:""}</div><p>Elige una mejora o el arma. Dos ranuras; Q alterna.</p>`;
 else if(screen==='dead'||screen==='won')html=`<span class="eyebrow">${screen==='won'?'ASCENSO COMPLETADO':'LA MEMORIA PERSISTE'}</span><h2>${screen==='won'?'El ciclo vuelve a girar':'Tu viaje termina aquí'}</h2><p>${screen==='won'?'Devuelves los recuerdos al ciclo. Las alturas ya no pueden olvidar a quienes sostienen su paz. Los seis guardianes han caído; cada memoria vuelve a tener un lugar.':'El depósito conserva tus ecos, pero las mejoras de esta partida se desvanecen. Cada patrón puede aprenderse.'}</p><div class="stats"><span>${timeText(world.time)}</span><span>${world.kills} enemigos</span><span>+${world.earned||0} ecos</span></div><p>Semilla: ${world.seed}</p><div class="actions"><button class="primary" data-action="restart">Nueva partida</button><button data-action="title">Inicio y desbloqueos</button></div>`;
 if(screen==='paused')html+=helpCard('skill','Pasa cerca de las balas sin tocarlas para cargar la habilidad. Úsala cuando la barra esté llena.',save);
 if(screen==='title')html+=helpCard('ecos','Los ecos se conservan al terminar. Úsalos en el Santuario para desbloquear equipo.',save);
 if(screen==='map')html+=helpCard('rooms','El marco claro es tu sala. Elige una conectada después de superar el combate.',save);
 if(debugTools&&screen==='paused')html+=debugPanel();
 if(screen==='reward'||screen==='transition')html+=superButtons(world);if(screen==='reward')html+=`<button data-reroll="item" ${save.meta.rerolls>0&&!world.dailyKey?'':'disabled'}>Cambiar opciones · ${save.meta.rerolls} reintentos</button>`;
 for(const id of ['map-card','items-card'])$('ui-storage').append($(id));
 panel.innerHTML=`${screen==='title'?'':`<header class="screen-header"><button data-action="nav-back" aria-label="Volver">${icon('back')}<span>Atrás</span></button><strong>${screenHeader(screen)}</strong>${screen==='prepare'?'<button class="primary" data-action="begin">Comenzar</button>':''}</header>`}<div class="panel-content">${html}<p id="save-message">${saveError?'No se pudo leer o guardar el progreso. El juego funciona, pero comprueba que el navegador permite almacenamiento local.':''}</p></div>`;
 if(screen==='map'||screen==='items')$('utility-host').append($(screen==='map'?'map-card':'items-card'));
 // El foco vuelve a un control visible al abrir un menú, sin secuestrar el teclado al jugar.
 for(const portrait of panel.querySelectorAll('[data-portrait]'))drawPortrait(portrait,characters[portrait.dataset.portrait]);
 for(const icon of panel.querySelectorAll('[data-weapon-icon]'))icon.getContext('2d').drawImage(makeWeaponSprite(weapons[icon.dataset.weaponIcon]),0,0);
 (panel.querySelector('[data-action="begin"],[data-action="start"]')||panel.querySelector('button:not(:disabled)'))?.focus({preventScroll:true});
}
function updateHud(){
 const p=world.player,room=world.rooms[world.roomId];$('dash-meter').max=p.dashRecharge||B.player.dashCooldown;$('dash-meter').value=$('dash-meter').max-p.dashCooldown;$('ability-meter').value=world.abilityCharge;$('ability-name').textContent=abilities[world.character.id].name+(world.abilityTime>0?' · activa':world.abilityCharge>=D.graze.maximum?' · lista':'');$('timer').textContent=timeText(world.time);$('room-name').textContent=`${world.zone.name} · ${room.name}`;$('world-heading').textContent=world.zone.region.split(' · ')[0];$('map-title').textContent=world.zone.name;
 $('wave').textContent=room.kind==='boss'?'Jefe':room.cleared?'Salidas abiertas':`Oleada ${Math.max(1,world.wave)} / ${room.waves}`;
 $('notice').textContent=room.cleared?(room.kind==='rest'?'Refugio: recuperas 2 de vida la primera vez.':room.kind==='start'?'Elige la primera sala en el mapa. Las puertas claras indican salidas.':world.zone.lore[Math.min(2,Math.floor(room.depth/3))]):'Esquiva los rombos. Los anillos y las líneas naranjas anuncian el próximo ataque.';
 const boss=world.enemies.find(e=>e.active&&e.type==='boss');$('boss-hud').hidden=!boss;
 if(boss){$('boss-health').max=boss.maxHp;$('boss-health').value=Math.max(0,boss.hp);$('boss-phase').textContent=`${world.zone.boss.name} · Fase ${boss.phase+1}`;$('notice').textContent=`«${world.zone.boss.quote}»`;}
 $('room-count').textContent=`${world.zoneCleared} / 8`;$('seed-display').textContent=`Semilla ${world.seed}${world.dailyKey?' · Diaria UTC '+world.dailyKey:''} · ${world.rules.name}${debugTools?' · LABORATORIO':''}`;
 $('synergy').textContent=weaponSynergy(world)+' '+(world.inventory.halo&&world.inventory.ember?'Sinergia activa: Brasa + Memoria (+15% de daño).':'');
 const b=save.preferences.bindings;$('controls-help').textContent=`${keyName(b.up)} ${keyName(b.left)} ${keyName(b.down)} ${keyName(b.right)}: moverse · ${keyName(b.dash)}: esquiva · Ratón: apuntar · ${save.preferences.autoFire?'Disparo automático':'Mantén clic para disparar'} · Esc: pausa`;
 $('debug').hidden=!debug;if(debug){let damage=0,allies=0,hostiles=0,enemies=0;for(const n of world.damageBuckets)damage+=n;for(const b of world.allies)if(b.active)allies++;for(const b of world.hostiles)if(b.active)hostiles++;for(const e of world.enemies)if(e.active)enemies++;$('debug').textContent=`FPS ${fps.toFixed(0)} · DPS (5 s) ${(damage/B.campaign.metricsWindow).toFixed(1)}\nBalas ${allies}/128 + ${hostiles}/512 · Enemigos ${enemies}/16\nSala ${world.roomTime.toFixed(1)} s · Mundo ${world.worldIndex+1} · Semilla ${world.seed}`;}
 if(world.comboTimer>0)$('notice').textContent=world.comboNotice;
 $('synergy').textContent+=' '+Object.entries(world.setCounts).map(([group,count])=>`${mythologies[group]} ${count}/4`).join(' · ')+(world.superItem?' · Súper: '+superItems.find(s=>s.id===world.superItem).name:'');
 if(world.rooms[world.roomId].kind==='challenge'&&room.cleared)$('notice').textContent='Cámara repetible: pulsa el botón para arriesgar 1 vida por nuevas oleadas.';
 if(save.preferences.tutorial&&save.progress.runs<=X.tutorial.returningRuns&&world.comboTimer<=0&&!boss){const hint=tutorialText(world,{dash:keyName(b.dash),special:keyName(b.special)});if(hint)$('notice').textContent=hint;}
 $('controls-help').textContent+=` · ${keyName(b.special)}: ${abilities[world.character.id].name} ${Math.floor(world.abilityCharge)}/100 · ${world.grazes} roces · ${world.roomCoins} fichas`;
 updateGameHud(world,save.preferences,keyName,input.touchActive||false);
 const challengeButton=$('repeat-challenge');if(challengeButton)challengeButton.hidden=!(mode==='playing'&&world.status==='playing'&&room.kind==='challenge'&&room.cleared&&room.rewardTaken);
 const mapKey=`${mode}:${world.status}:${world.roomId}:${world.rooms.filter(r=>r.visited).map(r=>r.id).join(',')}:${world.grazes>=D.rooms.secretGraze}:${world.combos.length}`;
 if(mapKey===lastMap)return;lastMap=mapKey;
 const map=$('map');map.replaceChildren();
 for(let y=0;y<5;y++)for(let x=0;x<5;x++){
  const r=world.rooms.find(r=>r.x===x&&r.y===y),button=document.createElement('button');button.type='button';
  if(!r){button.className='empty';button.disabled=true;button.tabIndex=-1;}else{
   const visible=(r.visited||r.links.some(id=>world.rooms[id].visited))&&canEnterRoom(world,r);button.innerHTML=visible?icon(r.kind):icon('secret',16);button.dataset.kind=r.kind;button.className=[r.id===world.roomId?'current':'',r.cleared?'cleared':'',!visible?'unknown':''].join(' ');
   button.disabled=!['playing','map'].includes(mode)||world.status!=='playing'||!room.cleared||!room.rewardTaken||!room.links.includes(r.id)||!canEnterRoom(world,r);button.dataset.room=r.id;button.title=visible?r.name:'Sala desconocida';button.setAttribute('aria-label',`${visible?roomLabels[r.kind]+': '+r.name:'Sala desconocida'}${r.id===world.roomId?', ubicación actual':''}${r.cleared?', completada':''}`);if(r.id===world.roomId)button.setAttribute('aria-current','location');
  }map.append(button);
 }
}
$('map').addEventListener('click',e=>{const button=e.target.closest('[data-room]');if(button&&!button.disabled&&travel(world,Number(button.dataset.room))){audio.play('reward');if(mode==='map')setMode('playing');input.clear();canvas.focus({preventScroll:true});updateHud();}});
$('map-button').addEventListener('click',()=>{audio.unlock();setMode('map');updateHud();});$('items-button').addEventListener('click',()=>{audio.unlock();setMode('items');updateHud();});$('swap-button').addEventListener('click',()=>{input.swap=true;canvas.focus({preventScroll:true});});
$('fullscreen-button').addEventListener('click',()=>platform.fullscreen());
$('menu-button').addEventListener('click',()=>{audio.unlock();togglePause();});
panel.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;audio.unlock();audio.play(target.dataset.action==='nav-back'?'uiBack':target.dataset.action==='begin'?'uiConfirm':'uiSelect');
 if(target.dataset.dismissHelp){save.preferences.ui.dismissedHelp.push(target.dataset.dismissHelp);saveNow();lastPanel='';updatePanel();return;}
 if(target.dataset.itemDetail){showItem(world,target.dataset.itemDetail);return;}
 if(target.dataset.prepTab){preparation.tab=target.dataset.prepTab;lastPanel='';updatePanel();return;}
 if(target.dataset.prepInitial){preparation.initial=target.dataset.prepInitial;if(!world.dailyKey){save.preferences.ui.lastInitial=preparation.initial;saveNow();}lastPanel='';updatePanel();return;}
 if(target.dataset.prepCharacter){if(canSelect(save.progress,characters[target.dataset.prepCharacter])&&!world.dailyKey){save.preferences.character=target.dataset.prepCharacter;save.preferences.skin='base';save.preferences.ui.lastWeapon=characters[target.dataset.prepCharacter].weapon;saveNow();prepareRun(false,true);}return;}
 if(target.dataset.debug){if(debugTools)runDebug(target.dataset.debug);return;}
 if(target.dataset.roomAction){if(useRoom(world,target.dataset.roomAction,recalculate)){lastPanel='';lastMap='';resetClock();updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.initialItem){if(world.status==='keepsake'&&world.options.some(u=>u.id===target.dataset.initialItem)){world.status='reward';chooseUpgrade(world,target.dataset.initialItem);resetClock();lastPanel='';updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.reroll){if(save.meta.rerolls>0&&!world.dailyKey){save.meta.rerolls--;saveNow();if(world.status==='draft'){prepareDraft(world,save);preparation.weapon=world.draft.some(g=>g.id===preparation.weapon)?preparation.weapon:world.draft[0].id;}else{const old=world.status;offerUpgrades(world);world.status=old;}lastPanel='';updatePanel();}return;}
 if(target.dataset.skin){if(!canSelect(save.progress,characters[target.dataset.skin]))return;save.preferences.character=target.dataset.skin;save.preferences.skin=target.dataset.skinStyle||'memory';saveNow();setMode('title');return;}
 if(target.dataset.super){if(claimSuper(world,target.dataset.super)){recalculate(world);if(world.status==='reward'){world.rooms[world.roomId].rewardTaken=true;world.status='playing';}lastPanel='';updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.startWeapon&&mode==='prepare'){preparation.weapon=target.dataset.startWeapon;if(!world.dailyKey){save.preferences.ui.lastWeapon=target.dataset.startWeapon;saveNow();}lastPanel='';updatePanel();return;}
 if(target.dataset.startWeapon){if(selectStartingWeapon(world,target.dataset.startWeapon)){offerUpgrades(world);world.status='keepsake';resetClock();lastPanel='';updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.buy){const [category,id]=target.dataset.buy.split(':');if(purchase(save,category,id)){saveNow();lastPanel='';updatePanel();}else if($('meta-message'))$('meta-message').textContent='No hay ecos suficientes o ya lo tienes.';return;}
 if(target.dataset.bossWeapon){if(world.status==='transition'&&world.bossWeapon?.id===target.dataset.bossWeapon){equipWeapon(world,target.dataset.bossWeapon);advanceWorld(world);resetClock();lastPanel='';lastMap='';updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.upgrade){if(chooseUpgrade(world,target.dataset.upgrade)){lastPanel='';updatePanel();updateHud();canvas.focus({preventScroll:true});}return;}
 if(target.dataset.character){if(canSelect(save.progress,characters[target.dataset.character])){save.preferences.character=target.dataset.character;save.preferences.skin='base';saveNow();setMode('title');}return;}
 if(target.dataset.bind){waitingKey=target.dataset.bind;lastPanel='';updatePanel();return;}
 if(['codex','sanctuary','arsenal','characters','settings'].includes(target.dataset.action))navigation.push(mode==='playing'?'paused':mode);
 switch(target.dataset.action){
  case 'install-app':platform.install();break;
  case 'update-app':platform.update();break;
  case 'codex':setMode('codex');break;
  case 'sanctuary':setMode('sanctuary');break;
  case 'arsenal':settingsReturn=mode;setMode('arsenal');break;
  case 'characters':setMode('characters');break;
  case 'ascend':advanceWorld(world);resetClock();lastPanel='';lastMap='';updatePanel();canvas.focus({preventScroll:true});break;
  case 'daily':preparation.tab='summary';prepareRun(true);break;
  case 'start':preparation.tab='summary';prepareRun();break;
  case 'begin':startRun();break;
  case 'map':setMode('map');break;
  case 'items':setMode('items');break;
  case 'nav-back':if(['map','items'].includes(mode))setMode('playing');else if(['map','items'].includes(mode))setMode('playing');else if(mode==='prepare')setMode('title');else if(mode==='playing'&&world.status==='playing')setMode('paused');else if(mode==='playing'&&['reward','transition','room'].includes(world.status))setMode('paused');else if(mode==='paused')setMode('playing');else setMode(navigation.pop()||settingsReturn||'title');break;
  case 'resume':setMode('playing');break;
  case 'settings':settingsReturn=mode;setMode('settings');break;
  case 'back':setMode(settingsReturn);break;
  case 'reset-controls':save.preferences.bindings={...defaults};saveNow();waitingKey=null;lastPanel='';updatePanel();break;
  case 'restart':preparation.tab='summary';prepareRun();break;
  case 'title':navigation=[];settingsReturn='title';setMode('title');break;
  case 'abandon':setMode('abandon');break;
  case 'confirm-abandon':world.status='dead';settle();setMode('playing');break;
  case 'unlock':{const cost=B.progression.unlockCosts[save.progress.unlocks]??Infinity;if(save.progress.unlocks<2&&save.progress.echoes>=cost){save.progress.echoes-=cost;save.progress.unlocks++;saveNow();lastPanel='';updatePanel();}else{$('seed-error').textContent='Completa salas para reunir más ecos.';}break;}
 }
 updateHud();
});
panel.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'){const b=e.target.closest('[data-item-detail]');if(b)showItem(world,b.dataset.itemDetail);}});panel.addEventListener('focusin',e=>{const b=e.target.closest('[data-item-detail]');if(b)showItem(world,b.dataset.itemDetail);});
panel.addEventListener('change',e=>{if(e.target.dataset.uiPref){const key=e.target.dataset.uiPref,value=e.target.type==='checkbox'?e.target.checked:e.target.type==='range'||['controlScale','resolution'].includes(key)?Number(e.target.value):e.target.value;save.preferences.ui=validateUi({...save.preferences.ui,[key]:value});saveNow();input.clear();touch.update();return;}if(mode==='prepare'&&!world.dailyKey){const u=save.preferences.ui;if(e.target.id==='difficulty-input')u.difficulty=Number(e.target.value);else if(e.target.id==='start-world')u.startWorld=Number(e.target.value);else if(e.target.dataset.pact)u.pacts=[...panel.querySelectorAll('[data-pact]:checked')].map(x=>x.dataset.pact);else if(e.target.id==='seed-input')return;else return;saveNow();prepareRun(false,true);return;}if(e.target.hasAttribute('data-hitbox')){save.preferences.hitboxScale=Number(e.target.value);saveNow();return;}const key=e.target.dataset.pref;if(key){save.preferences[key]=e.target.checked;saveNow();updateHud();}});
window.addEventListener('keydown',e=>{
 if(mode!=='settings'||!waitingKey)return;e.preventDefault();e.stopImmediatePropagation();
 if(e.code==='Escape'){waitingKey=null;lastPanel='';updatePanel();return;}
 const conflict=Object.entries(save.preferences.bindings).some(([action,key])=>action!==waitingKey&&key===e.code);
 if(!validKey(e.code)||conflict){$('binding-message').textContent=conflict?'Esa tecla ya tiene otra acción. Elige una diferente.':'Usa letras, números, flechas, Espacio o Shift.';return;}
 save.preferences.bindings[waitingKey]=e.code;waitingKey=null;saveNow();lastPanel='';updatePanel();updateHud();
},true);
function autoPause(){if(mode==='playing'&&world.status==='playing')setMode('paused');input.clear();}
window.addEventListener('pagehide',autoPause);window.addEventListener('blur',autoPause);screen.orientation?.addEventListener('change',autoPause);window.addEventListener('orientationchange',autoPause);let landscape=matchMedia('(orientation: landscape)').matches;window.addEventListener('resize',()=>{const next=matchMedia('(orientation: landscape)').matches;if(next!==landscape){landscape=next;autoPause();}});document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause();});
function resize(){const r=$('stage').getBoundingClientRect();if(!r.width||!r.height)return;const scale=Math.min(r.width/settings.width,r.height/settings.height);canvas.style.width=`${Math.floor(settings.width*scale)}px`;canvas.style.height=`${Math.floor(settings.height*scale)}px`;}
new ResizeObserver(resize).observe($('stage'));window.addEventListener('resize',resize);resize();
window.addEventListener('keydown',e=>{if(e.code==='F3'){e.preventDefault();debug=!debug;updateHud();}});
if(debugTools)window.gameDiagnostics=()=>({mode,status:world.status,room:world.roomId,world:world.worldIndex,character:world.character.id,health:world.player.hp,weapon:currentWeapon(world).id,time:world.time,damage:world.damageDealt,fps,touch:touch.diagnostics(),platform:platform.diagnostics(),audio:audio.diagnostics()});
function runDebug(action,value){
 if(!debugTools)return false;world.cheated=true;
 if(action==='echoes'){save.progress.echoes=Math.min(D.economy.maxCurrency,save.progress.echoes+D.debug.currency);saveNow();}
 else if(action==='charge')world.abilityCharge=D.graze.maximum;
 else if(action==='weapon'){const id=value||$('debug-weapon')?.value;if(!Object.hasOwn(weapons,id))return false;equipWeapon(world,id);}
 else if(action==='item'){const id=value||$('debug-item')?.value;const u=upgrades.find(u=>u.id===id);if(!u)return false;world.inventory[id]=Math.min(u.max,(world.inventory[id]||0)+1);recalculate(world);}
 else if(action==='warp'){const index=Number(value??$('debug-world')?.value);if(!Number.isInteger(index)||index<0||index>=worlds.length)return false;world=createWorld(world.seed,2,world.character.id,index);prepareProfile(world,save);world.allowedWeapons=Object.keys(weapons);world.itemUnlocks=null;world.superUnlocks=null;world.cheated=true;recalculate(world);world.player.hp=world.player.maxHp;}
 else if(action==='boss'){world.status='playing';world.roomId=7;world.rooms[7].cleared=true;world.rooms[7].rewardTaken=true;travel(world,8);}
 else return false;
 lastPanel='';lastMap='';setMode('playing');updateHud();return true;
}
if(debugTools)window.gameDebug={command:runDebug,world:()=>world};
const repeatButton=document.createElement('button');repeatButton.id='repeat-challenge';repeatButton.textContent='Repetir desafío · cuesta 1 vida';repeatButton.hidden=true;canvas.parentElement.append(repeatButton);repeatButton.addEventListener('click',()=>{if(repeatChallenge(world)){lastMap='';updateHud();canvas.focus({preventScroll:true});}});
function frame(now){touch.update();const low=lowPerformance();effectivePreferences.autoFire=input.touchActive||save.preferences.autoFire;effectivePreferences.reducedEffects=save.preferences.reducedEffects||low;const elapsed=Math.min(Math.max((now-previous)/1000,0),0.05);previous=now;
 if(mode==='playing'&&world.status==='playing'){
  accumulator+=elapsed;while(accumulator>=settings.step){updateWorld(world,input,settings.step,effectivePreferences);accumulator-=settings.step;if(world.status!=='playing'){accumulator=0;break;}}
 }
 if(world.status!=='playing')world.defeat.timer=Math.max(0,world.defeat.timer-elapsed);
 // Un sonido de cada tipo por fotograma evita ráfagas de nodos de audio.
 platform.feedback(world.events);
 for(let i=0;i<world.events.length;i++)if(world.events.indexOf(world.events[i])===i)audio.play(world.events[i],world.events[i]==='shoot'?currentWeapon(world):null);world.events.length=0;
 if(world.pendingWorld>0&&!(save.progress.bossMask&(1<<(world.pendingWorld-1)))){save.progress.bossMask|=1<<(world.pendingWorld-1);save.progress.worlds=Math.max(save.progress.worlds,Math.min(worlds.length,world.pendingWorld+1));refreshCharacters(save.progress);saveNow();}
 audio.update(world,mode==='playing'&&world.status==='playing');platform.setActive(mode==='playing'&&world.status==='playing');
 if(syncDiscoveries(world,save))saveNow();
 settle();if(now-lastDraw>=1000/(low?U.lowFps:U.normalFps)-1){const raw=(now-lastDraw)/1000;if(lastDraw&&raw>0&&raw<1)fps=fps*.9+.1/raw;lastDraw=now;if(mode==='title')drawTitle($('title-scene'),now,save.preferences.reducedEffects||save.preferences.disableFlash||low);const scale=save.preferences.ui.resolution*(low?1:Math.min(U.maxDpr,Math.max(1,Math.floor(devicePixelRatio||1))));if(scale!==drawScale){drawScale=scale;canvas.width=Math.round(settings.width*scale);canvas.height=Math.round(settings.height*scale);}canvas.getContext('2d').setTransform(scale,0,0,scale,0,0);render(world,input,effectivePreferences);}updatePanel();if(now-lastHud>150){updateHud();lastHud=now;}requestAnimationFrame(frame);
}
touch.update();updatePanel();updateHud();requestAnimationFrame(frame);
