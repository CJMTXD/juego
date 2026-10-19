import {icon,itemIcon} from './icons.js';
import {upgrades} from '../data.js';
import {weapons} from '../data/weapons.js';
import {recipes,itemGroups,mythologies} from '../data/relics.js';
import {depth as D} from '../data/depth.js';
import {currentWeapon} from '../weapons.js';
import {makeWeaponSprite} from '../render.js';
const $=id=>document.getElementById(id);
export const roomLabels={start:'Inicio',combat:'Combate',boss:'Jefe',rest:'Refugio',shop:'Tienda',altar:'Altar',judgment:'Juicio',secret:'Secreto',challenge:'Desafío',miniboss:'Minijefe'};
export function createHud(){let healthKey='',itemKey='',weaponKey='',roomKey='',roomNoticeUntil=0;
 return function update(w,prefs,keyName,touch=false){const p=w.player,gun=currentWeapon(w),record=w.weaponProgress[gun.id],target=D.evolution.thresholds[record.level-1],previous=D.evolution.thresholds[record.level-2]||0;
 const health=$('health');if(healthKey!==p.hp+':'+p.maxHp){healthKey=p.hp+':'+p.maxHp;health.innerHTML=Array.from({length:p.maxHp},(_,i)=>`<span class="${i<p.hp?'heart-full':'heart-empty'}">${icon('heart',14)}</span>`).join('');health.setAttribute('aria-label',`${p.hp} de ${p.maxHp} de vida`);}
 $('weapon-name').textContent=gun.name;$('weapon-name').title=gun.name;$('evolution-meter').max=target?target-previous:1;$('evolution-meter').value=target?record.kills-previous:1;$('evolution-label').textContent=target?`Nivel ${record.level} · ${record.kills}/${target} bajas`:'Nivel 4 · Forma final';
 const next=w.weaponSlots.find(id=>id!==gun.id);$('alternate-weapon').textContent=next?(touch?'Cambiar':keyName(prefs.bindings.swap))+': '+weapons[next].name:'Sin otra arma';$('swap-button').disabled=!next;$('swap-button').title=next?'Cambiar a '+weapons[next].name:'No tienes otra arma';$('swap-button').setAttribute('aria-label',$('swap-button').title);
 $('ability-label').textContent=w.abilityTime>0?'Habilidad activa':w.abilityCharge>=D.graze.maximum?'Habilidad lista':'Habilidad · roza balas';$('ability-meter').classList.toggle('ready',w.abilityCharge>=D.graze.maximum);
 if(weaponKey!==gun.id+record.level){weaponKey=gun.id+record.level;const ctx=$('current-weapon-icon').getContext('2d');ctx.clearRect(0,0,16,16);ctx.drawImage(makeWeaponSprite(gun),0,0);}
 const items=Object.entries(w.inventory),key=w.seed+':'+w.character.id+':'+items.map(([id,n])=>id+n).join(',');if(key!==itemKey){itemKey=key;$('inventory').innerHTML=items.length?items.map(([id,n])=>`<button class="item-tile" data-item-detail="${id}" aria-label="${upgrades.find(u=>u.id===id)?.name} ×${n}">${itemIcon(id)}<strong>×${n}</strong><span>${upgrades.find(u=>u.id===id)?.name}</span></button>`).join(''):'<p>Aún no llevas objetos. Completa una sala para elegir tu primera mejora.</p>';$('item-detail').replaceChildren();}
 const rk=w.seed+':'+w.worldIndex+':'+w.roomId;if(rk!==roomKey){roomKey=rk;roomNoticeUntil=w.time+4;}$('notice').hidden=w.comboTimer<=0&&w.time>roomNoticeUntil&&!(w.rooms[w.roomId].kind==='challenge'&&w.rooms[w.roomId].cleared);$('controls-help').hidden=touch||w.time>120;
 document.documentElement.style.setProperty('--region',w.worldIndex<2?'#FF922E':w.worldIndex<4?'#A2E1E8':'#EEE1BF');
 };}
export function showItem(w,id){const item=upgrades.find(u=>u.id===id);if(!item||!w.inventory[id])return;const detail=$('item-detail');if(detail.dataset.itemId===id&&detail.children.length)return;detail.dataset.itemId=id;const group=itemGroups[id];$('item-detail').innerHTML=`${itemIcon(id)}<h3>${item.name} · ${w.inventory[id]}/${item.max}</h3><p>${item.text}</p><p>${mythologies[group]||'Sin tradición'} · ${w.setCounts[group]||0}/4 piezas distintas</p>${recipes.filter(r=>r.requires.includes(id)).map(r=>`<p><strong>${r.name}</strong>: ${r.requires.map(key=>`${w.inventory[key]?'✓':'Falta'} ${upgrades.find(u=>u.id===key).name}`).join(' + ')}. ${r.text}</p>`).join('')}`;}
export function fillLegend(){const target=$('map-legend');target.innerHTML=Object.entries(roomLabels).map(([id,label])=>`<span>${icon(id)} ${label}</span>`).join('');}
