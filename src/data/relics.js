// Pertenencia por identificador; los niveles repetidos no cuentan como piezas de un set.
export const mythologies={inferno:'Infierno',river:'Egipcia',threads:'Nórdica',olympus:'Olimpo',dawn:'Alba'};
export const itemGroups={ember:'inferno',halo:'inferno',cinder:'inferno',ash:'inferno',heart:'river',mercy:'river',scale:'river',reed:'river',step:'threads',veil:'threads',knot:'threads',rune:'threads',pulse:'olympus',fork:'olympus',laurel:'olympus',oath:'olympus',lens:'dawn',pierce:'dawn',prism:'dawn',dawn:'dawn'};
export const newItems=[
 {id:'cinder',name:'Carbón fiel',rarity:'common',max:2,text:'La quemadura de la receta dura más.'},
 {id:'ash',name:'Ceniza del regreso',rarity:'rare',max:1,shopUnlock:true,text:'El impulso recarga un 8% antes.'},
 {id:'scale',name:'Pesa vacía',rarity:'rare',max:1,shopUnlock:true,text:'Más óbolos de sala al vencer enemigos.'},
 {id:'reed',name:'Junco inscrito',rarity:'common',max:2,text:'+10% al alcance de las armas por nivel.'},
 {id:'knot',name:'Nudo del paso',rarity:'common',max:1,text:'Cada roce carga un punto adicional de habilidad.'},
 {id:'rune',name:'Runa de la vuelta',rarity:'rare',max:1,shopUnlock:true,text:'El impulso recarga un 8% antes.'},
 {id:'laurel',name:'Laurel incompleto',rarity:'common',max:1,text:'Cada quinta descarga hace un 15% más de daño.'},
 {id:'oath',name:'Juramento audible',rarity:'rare',max:1,shopUnlock:true,text:'La habilidad cargada dura un segundo más.'},
 {id:'prism',name:'Prisma sin dueño',rarity:'common',max:1,text:'+10% de velocidad de proyectiles.'},
 {id:'dawn',name:'Rocío de nadie',rarity:'rare',max:1,shopUnlock:true,text:'Recupera 1 de vida adicional al ascender de mundo.'},
];
export const recipes=[
 {id:'living_ash',name:'Ceniza viva',requires:['ember','halo'],effect:'burn',text:'Los impactos queman brevemente; no propagan quemaduras infinitas.'},
 {id:'equal_scale',name:'Balanza compartida',requires:['heart','mercy'],effect:'mercy',text:'Cada 20 bajas recupera 1 de vida; máximo 6 curaciones.'},
 {id:'return_thread',name:'Hilo del retorno',requires:['step','veil'],effect:'trail',text:'La esquiva deja una zona que frena a los perseguidores.'},
 {id:'echo_oath',name:'Coro del juramento',requires:['pulse','fork'],effect:'rear',text:'Cada quinta descarga emite tres ecos hacia atrás.'},
 {id:'ownerless_light',name:'Luz sin dueño',requires:['lens','pierce'],effect:'prism',text:'Un impacto cada 0,7 s abre dos rayos laterales.'},
];
// Los niveles 2/3/4 se suman. Los topes globales se aplican después.
export const sets={
 inferno:[{pieces:2,bulletSpeed:0.05},{pieces:3,burn:0.08},{pieces:4,damage:0.05}],
 river:[{pieces:2,health:1},{pieces:3,heal:0.1},{pieces:4,discount:0.1}],
 threads:[{pieces:2,speed:0.04},{pieces:3,dash:0.1},{pieces:4,graze:1}],
 olympus:[{pieces:2,cadence:0.03},{pieces:3,pierce:1},{pieces:4,damage:0.05}],
 dawn:[{pieces:2,bulletSpeed:0.08},{pieces:3,damage:0.04},{pieces:4,ability:0.5}],
};
export const superItems=[
 {id:'furnace',name:'Manto de la brasa',myth:'inferno',recipe:'living_ash',kills:100,healthCost:0,speed:0.8,damage:1.15,text:'Disparos sólidos rebotan y se ensanchan. Movimiento -20%.',shopUnlock:false,effect:'furnace'},
 {id:'balance',name:'Balanza invertida',myth:'river',boss:1,healthCost:2,speed:1,damage:1.2,text:'Recuperas 1 vida cada 12 bajas, hasta 12 veces. -2 vida máxima.',shopUnlock:true,effect:'vampire'},
 {id:'loom',name:'Telar del retorno',myth:'threads',recipe:'return_thread',secret:true,healthCost:1,speed:1,damage:1,text:'La esquiva se vuelve un salto de 100 px. Recarga 2 s y -1 vida máxima.',shopUnlock:true,effect:'teleport'},
 {id:'crown',name:'Corona sin voz',myth:'olympus',boss:4,healthCost:1,speed:1,damage:1,text:'Invoca órbitas de protección, pero reduce el alcance de tu arma a la mitad. -1 vida.',shopUnlock:true,effect:'orbits'},
 {id:'nobody',name:'Lente de nadie',myth:'dawn',recipe:'ownerless_light',graze:80,difficulty:2,healthCost:0,speed:1,damage:1.25,text:'Tiempo enemigo al 65%. Tu vida máxima queda en 1.',shopUnlock:true,effect:'time'},
];
export const relicBalance={burnSeconds:0.8,burnFraction:0.16,burnStep:0.2,mercyKills:20,mercyCap:6,vampireKills:12,trailSeconds:0.9,trailRadius:55,prismCooldown:0.7,prismDamage:0.22,prismSpeed:360,superOrbitSeconds:1.5,superOrbitDamage:1.6,superOrbitRadius:70,superOrbitLife:1.2,teleport:100,loomRecharge:2};
