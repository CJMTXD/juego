// Objetivos secuenciales: se avanza como máximo un eslabón por partida terminada.
export const personalStories={
 remender:{steps:[{key:'healed',goal:3,text:'Recupera 3 de vida en una partida.'},{key:'flawlessBoss',goal:1,text:'Vence a un jefe sin perder vida.'},{key:'won',goal:1,text:'Completa el ascenso desde el fondo.'}],epilogue:'El recuerdo que buscaba era el acto de reparar. Su nombre vuelve con cada hilo.'},
 hollow:{steps:[{key:'blocked',goal:3,text:'Absorbe tres golpes con escudos en una partida.'},{key:'bossNoDash',goal:1,text:'Vence a un jefe sin esquivar en su sala.'},{key:'won',goal:1,text:'Completa el ascenso desde el fondo.'}],epilogue:'La vasija no estaba vacía: guardaba el lugar de quien todavía no había regresado.'},
 courier:{steps:[{key:'dashes',goal:20,text:'Usa veinte esquivas en una partida.'},{key:'perfect',goal:3,text:'Completa tres salas con rango S en una partida.'},{key:'won',goal:1,text:'Completa el ascenso desde el fondo.'}],epilogue:'La carta llegó a todas las manos. Ninguna debía ser la última.'},
 weaver:{steps:[{key:'grazes',goal:30,text:'Roza treinta balas en una partida.'},{key:'abilities',goal:3,text:'Activa tres veces tu habilidad en una partida.'},{key:'won',goal:1,text:'Completa el ascenso desde el fondo.'}],epilogue:'La última hebra no cerró el tejido. Dejó un paso para quien vendría después.'},
 witness:{steps:[{key:'kills',goal:100,text:'Derrota cien habitantes en una partida.'},{key:'bossNoAbility',goal:1,text:'Vence a un jefe sin activar la habilidad en su sala.'},{key:'won',goal:1,text:'Completa el ascenso desde el fondo.'}],epilogue:'El testigo bajó la luz hasta la ceniza. Por primera vez, ambas contaron la misma historia.'},
};
export const weeklyMutators=[
 {id:'dry',name:'El río recuerda poco',text:'Curación ×0,75; los avisos y recompensas se conservan.',heal:.75,health:1},
 {id:'weight',name:'La deuda compartida',text:'Vida enemiga ×1,12; velocidad de balas sin cambios.',heal:1,health:1.12},
 {id:'rotation',name:'Armas prestadas',text:'El arma cambia al entrar en cada sala. Su evolución se conserva.',heal:1,health:1},
];
export function weeklyIdentity(date=new Date()){const monday=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()));monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7);const key=monday.toISOString().slice(0,10),week=Math.floor(monday.getTime()/604800000);let seed=2166136261;for(const c of 'umbral-week-'+key)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;return {key,seed,mutator:weeklyMutators[((week%3)+3)%3]};}
