import {memoryItems} from './data/memories.js';
import {newItems} from './data/relics.js';
import { balance as B } from './data/balance.js';
export const settings = Object.freeze({ width:640, height:360, wall:20, playerSpeed:B.player.speed, playerSize:32, hitRadius:B.player.hitRadius, bulletSpeed:B.projectiles.speed, fireInterval:B.projectiles.interval, bulletCapacity:B.projectiles.allyCapacity, enemyCapacity:B.projectiles.enemyCapacity, step:1/120 });
export const colors = Object.freeze({ outline:'#17151C', shadow:'#27232D', floor:'#38343F', stone:'#514B56', lightStone:'#716976', dust:'#948995', earth:'#44352F', earthLight:'#665044', bone:'#D3C3A1', white:'#EEE1BF', skin:'#A97663', cloth:'#49394F', clothLight:'#70556E', green:'#66705A', cyanDark:'#3F7F92', cyan:'#A2E1E8', red:'#FF385D', orange:'#FF922E', yellow:'#FFE34B' });
export const defaults = Object.freeze({ up:'KeyW', down:'KeyS', left:'KeyA', right:'KeyD', dash:'Space',swap:'KeyQ',special:'KeyE' });
// Ángulos internos en radianes; velocidades en píxeles/segundo.
export const patterns = Object.freeze({
  ring:{count:12, speed:90, interval:2.6, warning:0.65, spread:Math.PI*2},
  fan:{count:5, speed:105, interval:2.1, warning:0.6, spread:Math.PI/3},
  cross:{mode:'cross',count:8,speed:90,interval:2.5,warning:0.8,spread:Math.PI*2},
 wave:{mode:'fan',count:7,speed:85,interval:2.8,warning:0.8,spread:1.5},
 ribbon:{mode:'sine',count:3,speed:85,interval:2.4,warning:0.85,spread:0.6},
 petals:{mode:'gapped',count:10,speed:90,interval:2.7,warning:0.85,spread:6.283185307,gap:0.6},
 sweep:{mode:'sweep',count:4,speed:105,interval:2.2,warning:0.85,spread:0.65},
 weave:{mode:'sine',count:5,speed:80,interval:2.8,warning:0.9,spread:1.2},
 lantern:{mode:'fan',count:4,speed:80,interval:2.6,warning:0.9,spread:1.0,radius:5},
 roots:{mode:'curve',count:8,speed:80,interval:2.9,warning:0.9,spread:6.283185307,turn:0.3},
 scales:{mode:'cross',count:8,speed:100,interval:2.7,warning:0.9,spread:6.283185307},
 mirrorFan:{mode:'fan',count:3,speed:90,interval:2.8,warning:1,spread:0.7,bounce:1},
 vortex:{mode:'curve',count:6,speed:90,interval:2.4,warning:0.9,spread:6.283185307,turn:-0.35},
 judgment:{mode:'gapped',count:14,speed:85,interval:3,warning:1,spread:6.283185307,gap:0.65},
 eclipse:{mode:'gapped',count:18,speed:85,interval:3.1,warning:1.1,spread:6.283185307,gap:0.7},
 falling:{mode:'ceiling',count:8,speed:95,interval:3.2,warning:1.1,spread:0},
 constellation:{mode:'paired',count:9,speed:90,interval:3,warning:1,spread:1.6},
 spiral:{count:6, speed:95, interval:1.1, warning:0.55, spread:Math.PI*2},
});
export const enemyTypes = Object.freeze({
  keeper:{name:'Custodio de ceniza', health:7, radius:12, pattern:'ring', speed:0},
  mourner:{name:'Lamentador', health:6, radius:11, pattern:'fan', speed:20},
});
export const upgrades = Object.freeze([
 {id:'ember', name:'Brasa cautiva', rarity:'common', max:4, text:'+25% de daño por nivel.'},
 {id:'pulse', name:'Pulso prestado', rarity:'common', max:4, text:'Disparas un 12% más rápido por nivel.'},
 {id:'step', name:'Suela de humo', rarity:'common', max:3, text:'+12% de velocidad por nivel.'},
 {id:'heart', name:'Vasija remendada', rarity:'rare', max:2, text:'+1 de vida máxima y recupera 1.'},
 {id:'fork', name:'Eco partido', rarity:'rare', max:2, text:'Añade dos balas laterales. Cada bala lateral hace 25% de daño.'},
 {id:'pierce', name:'Aguja del umbral', rarity:'rare', max:2, text:'Tus balas atraviesan un enemigo adicional por nivel.'},
 {id:'mercy', name:'Agua olvidada', rarity:'common', max:9, text:'Recupera 2 de vida. Una opción segura para continuar.'},
 {id:'halo', name:'Memoria incandescente', rarity:'epic', max:1, text:'+25% de daño. Con Brasa cautiva: otro +15% de daño.'},
 {id:'lens', name:'Lente del retorno', rarity:'rare', max:2, unlock:1, text:'+30% de velocidad de proyectil y +10% de daño.'},
 ...newItems,
 ...memoryItems,
 {id:'veil', name:'Velo del guardián', rarity:'epic', max:1, unlock:2, text:'La invulnerabilidad tras recibir daño dura 0,5 s más.'},
]);
export const roomNames = ['Atrio de las promesas','Archivo hundido','Patio de ceniza','Galería de ecos','Foso de los nombres','Almacén de juramentos','Cripta de las cartas','Escalera rota','Compuerta del olvido'];
export const lore = [
 'Aquí abajo llegan los recuerdos que alguien desecha desde las alturas.',
 'Los custodios sellan cada promesa. Nadie recuerda quién les dio la orden.',
 'La ceniza lleva la misma marca que la llave del umbral.',
 'Una carta dice: «La paz de arriba depende de vuestro silencio».',
 'Las almas del fondo no nacieron aquí. Fueron olvidadas.',
 'Los santuarios superiores compran calma entregando sus culpas al pozo.',
 'El guardián no protege un tesoro: teme lo que caerá si abre la compuerta.',
 'Si el cielo necesita nuestro dolor, quizá la escalera no sea un camino de redención.',
 'Más allá espera otro mundo. Hoy has abierto el primer paso.',
];
