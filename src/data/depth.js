// Valores de la ampliación: segundos, píxeles y multiplicadores. Sin esperas artificiales.
export const depth = {
 evolution:{thresholds:[100,250,500],damage:[1,1.08,1.14,1.2],names:['Despertar','Recuerdo','Ascenso','Forma verdadera'],maxProjectiles:11},
 economy:{killEvery:8,boss:4,world:3,win:12,deathFactor:0.65,minDeath:1,maxCurrency:1000000,history:30,startingLoans:2,reroll:4,roomHeal:2},
 weaponCosts:{needle:0,scatter:8,boomerang:10,burst:12,ricochet:12,homing:16,beam:18,area:18,orbit:22,charge:24},
 tree:{vitality:{name:'Vasija firme',base:18,growth:2,max:1,text:'+1 vida inicial.'},stride:{name:'Paso recordado',base:10,growth:2,max:2,text:'+3% velocidad por nivel.'},luck:{name:'Estrella discreta',base:12,growth:2,max:3,text:'+2 puntos de peso raro por nivel.'},discount:{name:'Mano del guía',base:14,growth:2,max:2,text:'-5% en compras de santuario por nivel.'}},
 purchases:{character:24,item:10,super:30,lore:3,skin:12,reroll:4},
 caps:{damage:4.2,speed:260,cadence:0.065,healingSteal:12,sets:4,super:1,pacts:5},
 graze:{margin:15,charge:4,maximum:100,abilitySeconds:4,cooldown:0.12,specialKey:'KeyE'},
 rooms:{shopCost:6,altarHeal:2,altarCost:1,challengeWaves:4,challengeRepeatHealth:1,secretGraze:12,minibossHealth:80,judgmentDamage:0.15,judgmentHealthCost:1},
 accessibility:{hitboxSizes:[1,1.5,2],normal:['#FF385D','#FF922E','#FFE34B'],alternative:['#EEE1BF','#D3C3A1','#A2E1E8']},
 debug:{currency:1000},
};
// Cada nivel conserva avisos y huecos. La densidad añade élites, no ráfagas instantáneas.
export const difficulties=[
 {id:'ember',name:'Brasa tenue',health:1,speed:1,density:0,elite:0,heal:1,echoes:1,rare:0,extraPhases:0},
 {id:'oath',name:'Juramento',health:1.12,speed:1.04,density:0,elite:0.12,heal:0.9,echoes:1.35,rare:4,extraPhases:0},
 {id:'terrace',name:'Terraza del juicio',health:1.24,speed:1.08,density:1,elite:0.2,heal:0.8,echoes:1.7,rare:7,extraPhases:1},
 {id:'sphere',name:'Esfera severa',health:1.38,speed:1.12,density:1,elite:0.3,heal:0.7,echoes:2.1,rare:10,extraPhases:1},
 {id:'memory',name:'Memoria absoluta',health:1.55,speed:1.16,density:1,elite:0.4,heal:0.6,echoes:2.6,rare:14,extraPhases:2},
];
export const pacts=[
 {id:'swift',name:'Viento prestado',text:'Enemigos se mueven 20% más rápido.',echoes:0.15},
 {id:'frail',name:'Vasija agrietada',text:'-1 vida máxima.',echoes:0.2},
 {id:'horde',name:'Coro del fondo',text:'Un enemigo adicional por oleada (máximo 4).',echoes:0.2},
 {id:'thirst',name:'Agua escasa',text:'Curación reducida un 25%.',echoes:0.15},
 {id:'burden',name:'Deuda ajena',text:'Enemigos con un 15% más de vida.',echoes:0.2},
];
export const achievements=[
 {id:'first',name:'Primer sello',text:'Vence a un jefe.'},{id:'ascend',name:'Ciclo completo',text:'Completa la campaña desde el fondo.'},
 {id:'grazer',name:'Entre las gotas',text:'Roza 100 balas entre partidas.'},{id:'alchemist',name:'Memoria enlazada',text:'Descubre tres recetas.'},
 {id:'evolved',name:'Forma verdadera',text:'Lleva un arma al nivel final.'},{id:'daily',name:'Recuerdo compartido',text:'Completa una diaria.'},
 {id:'true',name:'Nadie queda abajo',text:'Obtén el final verdadero.'},
];
