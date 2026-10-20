import {weapons} from './weapons.js';
// Ocho parejas curadas: sacrificio de dos ranuras; DPS moderado a cambio de utilidad.
export const fusions=[
 {id:'f_needle_beam',name:'Costura del testimonio',pair:['needle','beam'],base:'beam',damage:.65,interval:.14,count:1,pierce:2,finalEffect:'split',text:'Luz que atraviesa y al ascender se divide en dos.'},
 {id:'f_scatter_burst',name:'Coro de la orilla',pair:['scatter','burst'],base:'scatter',damage:.55,interval:.5,count:5,spread:.45,finalEffect:'backfan',text:'Abanico que añade una respuesta hacia atrás.'},
 {id:'f_coin_orbit',name:'Balanza del firmamento',pair:['ricochet','orbit'],base:'orbit',damage:3.6,interval:2,count:3,orbitRadius:58,finalEffect:'reflect',text:'Sellos orbitales que al ascender interceptan balas.'},
 {id:'f_area_charge',name:'Semilla del eclipse',pair:['area','charge'],base:'area',damage:6,interval:1.25,count:1,radius:42,finalEffect:'quake',text:'Sello que culmina en pulsos sobre el mismo lugar.'},
 {id:'f_homing_moon',name:'Carta que vuelve',pair:['homing','boomerang'],base:'homing',damage:1.35,interval:.3,count:1,turn:3,finalEffect:'chain',text:'Busca un enemigo y enlaza con otro al ascender.'},
 {id:'f_needle_coin',name:'Llave de carbón',pair:['needle','ricochet'],base:'ricochet',damage:1.6,interval:.34,count:1,bounces:3,finalEffect:'return',text:'Rebota tres veces y su forma final regresa.'},
 {id:'f_burst_homing',name:'Hilo de voces',pair:['burst','homing'],base:'burst',damage:1,interval:.62,count:3,projectileMode:'homing',turn:2.2,finalEffect:'frost',text:'Ráfaga guiada que termina frenando a sus víctimas.'},
 {id:'f_beam_moon',name:'Luna del testigo',pair:['beam','boomerang'],base:'boomerang',damage:1.55,interval:.6,count:1,pierce:3,finalEffect:'moon',text:'Luna penetrante que se convierte en orbital al volver.'},
];
export const arsenal={...weapons,...Object.fromEntries(fusions.map((f,i)=>[f.id,{...weapons[f.base],...f,fusion:true,shape:(i+2)%10,rarity:'epic',source:'Altar de fusión',special:f.text,tone:500+i*40}]))};
