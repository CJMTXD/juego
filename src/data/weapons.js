// Daño por proyectil, intervalo en segundos, velocidad px/s, alcance px, apertura en radianes.
export const weapons = {
 needle:{id:'needle',name:'Aguja de ceniza',mode:'straight',damage:1,interval:0.2,speed:360,range:650,count:1,spread:0,rarity:'common',source:'inicial / cofre',special:'Precisa y de largo alcance.',tone:280,shape:0},
 scatter:{id:'scatter',name:'Abanico de sal',mode:'scatter',damage:0.6,interval:0.55,speed:300,range:240,count:5,spread:0.55,rarity:'common',source:'cofre',special:'Cinco fragmentos: potente de cerca.',tone:130,shape:1},
 burst:{id:'burst',name:'Voz entrecortada',mode:'burst',damage:1.1,interval:0.65,speed:420,range:520,count:3,spread:0.04,burstGap:0.07,rarity:'rare',source:'cofre',special:'Ráfaga de tres pulsos que siguen tu apuntado.',tone:420,shape:2},
 ricochet:{id:'ricochet',name:'Moneda del regreso',mode:'bounce',damage:1.5,interval:0.35,speed:300,range:900,count:1,spread:0,bounces:2,rarity:'rare',source:'cofre',special:'Rebota dos veces en las paredes.',tone:600,shape:3},
 homing:{id:'homing',name:'Hilo del destino',mode:'homing',damage:1.1,interval:0.26,speed:260,range:600,count:1,spread:0,turn:3,rarity:'rare',source:'cofre',special:'Curva hasta el enemigo más cercano; giro limitado.',tone:520,shape:4},
 beam:{id:'beam',name:'Luz del testimonio',mode:'beam',damage:0.5,interval:0.1,speed:14000,range:420,count:1,spread:0,pierce:4,rarity:'rare',source:'cofre / jefe',special:'Rayo de pulsos penetrantes, alcance medio.',tone:880,shape:5},
};
