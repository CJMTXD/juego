import {memoryItems} from './memories.js';
import {weapons} from './weapons.js';
import {worlds} from './worlds.js';
import {characters} from './characters.js';
// Moneda de juego exclusivamente. Probabilidades nominales; las garantías se normalizan en urns.js.
export const urnTypes=[{id:'ash',name:'Urna de ceniza recogida',text:'Ilar reúne las promesas que cayeron al depósito.',price:6,weights:{common:70,rare:25,epic:5},rarePity:4,epicPity:12},{id:'dawn',name:'Urna del alba caída',text:'Luz que descendió del archivo cuando se rompió el ciclo.',price:12,weights:{common:35,rare:50,epic:15},rarePity:2,epicPity:8}];
export const urnBalance={version:1,refund:{common:1,rare:3,epic:6},animationSeconds:.45,openedMax:1000000};
const weaponMyths={needle:'inferno',scatter:'river',burst:'olympus',ricochet:'river',homing:'threads',beam:'dawn',orbit:'olympus',area:'river',charge:'olympus',boomerang:'threads'};
const characterMyths={remender:'inferno',hollow:'river',courier:'threads',weaver:'threads',witness:'dawn'};
export const urnRewards=[
 ...memoryItems.filter(u=>u.source==='urn').map(u=>({id:'item_'+u.id,kind:'item',value:u.id,name:u.name,myth:u.myth,rarity:u.rarity,text:u.text,weapon:u.weapon})),
 ...Object.values(characters).map(c=>({id:'skin_'+c.id,kind:'skin',value:c.id,name:'Memoria pálida · '+c.name,myth:characterMyths[c.id],rarity:'common',text:'Desbloquea el aspecto Memoria pálida; solo cambia la ropa. No desbloquea el personaje ni cambia estadísticas.'})),
 ...Object.values(weapons).map((g,i)=>({id:'weapon_skin_'+g.id,kind:'weapon_skin',value:g.id,weapon:g.id,name:'Marfil del ciclo · '+g.name,myth:weaponMyths[g.id],rarity:i<5?'rare':'epic',text:'Aspecto opcional de marfil para esta arma. No cambia disparos, daño ni estadísticas y no desbloquea el arma.'})),
 ...worlds.map((w,i)=>({id:'fragment_'+w.id,kind:'lore',value:w.id,name:'Fragmento · '+w.name,myth:['inferno','river','threads','river','olympus','dawn'][i],rarity:i<3?'common':'rare',text:w.lore[0]+' Añade este fragmento a los conocidos para la condición del final verdadero.'})),
 ...worlds.map((w,i)=>({id:'entry_'+w.id,kind:'entry',value:'urn_entry_'+w.id,name:'Carta caída · '+w.name,myth:['inferno','river','threads','river','olympus','dawn'][i],rarity:i<3?'common':'rare',text:['Ilar recoge la ceniza porque cada grano fue una promesa.','El río devuelve lo que las pesas no pudieron nombrar.','Un hilo que cae desde arriba aún puede coser dos orillas.','La raíz recuerda el peso de quienes nunca llegaron al jardín.','El sello de la corte lleva la misma grieta que las urnas del fondo.','La luz vuelve al ciclo cuando alguien acepta recordar su sombra.'][i]})),
];
