// Segundos, píxeles y multiplicadores; efectos acotados para conservar la legibilidad.
export const extras={
 ability:{heal:1,clearRadius:90,invulnerability:0.45,speed:1.3,slow:0.55,damage:1.25,pierce:1},
 graze:{pulse:0.18},
 rooms:{kinds:['shop','judgment','challenge','secret','miniboss','altar'],names:{shop:'Mercado de las voces',judgment:'Juicio del testigo',challenge:'Cámara de la deuda',secret:'Archivo sin nombre',miniboss:'Vigía del umbral',altar:'Altar del regreso'},killCoinEvery:3,scaleBonus:1,challengeGrowth:0.2,minibossRadius:18,secretCoins:4,judgmentCoins:8,shopDiscount:0.1},
 effects:{entrySeconds:0.8,defeatSeconds:0.6,numberLife:0.45,numberCooldown:0.1,numberSpeed:24,hitStop:0.025},
 tutorial:{minimumMove:40,returningRuns:3},
 daily:{character:'remender',difficulty:0},
};
export const abilities={
 remender:{name:'Puntada de regreso',text:'Recupera 1 vida y despeja balas cercanas.'},
 hollow:{name:'Vasija despierta',text:'Recarga el escudo de la sala y despeja balas cercanas.'},
 courier:{name:'Carta urgente',text:'Recarga el impulso; +30% de velocidad durante 4 s.'},
 weaver:{name:'Tiempo tejido',text:'Balas enemigas 45% más lentas durante 4 s.'},
 witness:{name:'Verdad encendida',text:'+25% daño y una penetración durante 4 s.'},
};
// Semilla UTC estable: mismos préstamos, personaje y reglas, sin ventajas permanentes.
export function dailyIdentity(date=new Date()){const key=date.toISOString().slice(0,10);let seed=2166136261;for(const c of key)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;return {key,seed};}
