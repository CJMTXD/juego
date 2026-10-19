import {weapons} from './data/weapons.js';
import {depth as D} from './data/depth.js';
export function extraPanel(screen,w,save){
 if(screen==='draft')return `<h2>Tres recuerdos para partir</h2><p>Elige una sola arma. Los préstamos no se añaden al botín global.</p><div class="cards">${w.draft.map(choice=>{const g=weapons[choice.id];return `<button class="upgrade" data-start-weapon="${g.id}"><canvas data-weapon-icon="${g.id}" width="16" height="16" class="weapon-icon"></canvas><strong>${g.name}</strong><span>${g.damage} × ${g.count} daño · ${g.interval} s · ${g.range} px</span><small>${g.special} ${choice.loan?'Préstamo de Ilar.':'Desbloqueada.'}</small></button>`;}).join('')}</div>`;
 if(screen==='sanctuary')return `<span class="eyebrow">LA ANTESALA DE LOS RECUERDOS</span><h2>Ilar, guardián del regreso</h2><p>«No vendo tu destino. Te devuelvo posibilidades». ${save.progress.echoes} ecos.</p><div class="cards">${Object.values(weapons).map(g=>`<button class="upgrade" data-buy="weapon:${g.id}" ${save.meta.weapons.includes(g.id)?'disabled':''}><strong>${g.name}</strong><span>${g.special}</span><small>${save.meta.weapons.includes(g.id)?'Desbloqueada':D.weaponCosts[g.id]+' ecos'}</small></button>`).join('')}</div><p id="meta-message" role="status"></p><button data-action="title">Volver</button>`;
 return null;
}
