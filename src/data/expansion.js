// Límites de la ampliación. Coordenadas en los 640×360 lógicos, tiempos en segundos.
export const expansion = {
 version:1, scenery:{capacity:8,jarHealth:2,jarCoins:1,bodyMargin:3},
 elite:{base:0.03,worldStep:0.018,doubleChance:0.22,warning:0.8,safeRadius:60,ringCount:10,ringSpeed:80,gap:0.62,coins:2,itemChance:0.18,speed:1.22,leechHeal:0.06,childHealth:0.28,childCount:2,eventCapacity:16},
 rank:{fast:32,steady:60,graze:3,coins:{D:0,C:1,B:1,A:2,S:3},streakEvery:3,streakCoins:1},
 candles:{capacity:4,dropEvery:3,cost:3,clearRadius:100,slow:0.6,seconds:3,heal:1},
 familiar:{capacity:2,cost:6,blockCooldown:2,shotCooldown:1,damage:1,speed:220,range:300,mark:0.08},
 rival:{health:60,healthPerWorld:18,maxHealth:160,speed:34,maxDamage:1,warning:1,interval:2.2,bulletSpeed:90,reward:4,items:3},
 fusion:{thresholds:[40,100],maxLevel:3},
 mastery:{kills:[100,500,1500],names:['Voz','Memoria','Testimonio'],victories:[1,3,10]},
 profile:{spentPerPoint:1,runPoints:10,levels:[0,60,180,400,800],titles:['Recién llegado','Portador de ecos','Guardián del hilo','Voz del ciclo','Memoria compartida']},
 spiral:{healthStep:0.12,maxHealth:1.2,speedStep:0.02,maxSpeed:0.16,echoes:3},
 assist:{minSpeed:0.7,minHitbox:0.8,health:1,heal:1},
 personal:{chargeBonus:0.02},
};
export const eliteMarks = [
 {id:'shield',name:'Escudado',icon:'▣',text:'El primer proyectil rompe el escudo.'},
 {id:'mirror',name:'Espejo',icon:'◇',text:'Absorbe la primera bala y devuelve un disparo tras 0,8 segundos de aviso.'},
 {id:'divide',name:'Divisor',icon:'Ⅱ',text:'Al caer anuncia dos ecos pequeños; estos no vuelven a dividirse.'},
 {id:'revenge',name:'Vengativo',icon:'○',text:'Al caer avisa un anillo con un hueco dirigido hacia tu posición.'},
 {id:'swift',name:'Veloz',icon:'»',text:'Se mueve un 22% más rápido. Conserva los avisos de ataque.'},
 {id:'leech',name:'Sanguijuela',icon:'♥',text:'Al perder vida el jugador recupera un 6% de su vida máxima.'},
];
// Ocho planos con pasillos en cruz de al menos 80 px. Cada mundo asigna materiales propios.
const plans = [
 [['pillar',208,88,32,32],['pillar',400,240,32,32]],
 [['pit',192,232,64,32],['pit',384,96,64,32]],
 [['pillar',224,104,32,48],['pillar',384,208,32,48]],
 [['pit',176,80,80,32],['pillar',432,248,32,32]],
 [['pillar',176,240,48,32],['pit',400,80,64,32]],
 [['pillar',208,96,32,32],['pillar',400,96,32,32],['pit',192,248,64,32]],
 [['pit',192,96,48,48],['pit',400,216,48,48]],
 [['pillar',208,216,32,48],['pillar',400,96,32,48]],
];
const materials=['Sello de carbón','Pesa de sal','Carrete del vínculo','Raíz de la deuda','Columna del juramento','Vasija del alba'];
export const roomTemplates=materials.map((material,world)=>plans.map((plan,index)=>({id:`${world}:${index}`,name:`${material} · ${index+1}`,material,objects:plan.map(o=>({kind:o[0],x:o[1],y:o[2],w:o[3],h:o[4]}))})));
export const candles=[
 {id:'calm',name:'Vela de calma',text:'Despeja balas a menos de 100 píxeles.'},
 {id:'mirror',name:'Vela de reflejo',text:'Absorbe el siguiente golpe. No acumula escudos.'},
 {id:'time',name:'Vela del tiempo',text:'Balas enemigas un 40% más lentas durante 3 segundos.'},
 {id:'ash',name:'Vela de ceniza',text:'Recupera 1 vida, ajustada por dificultad.'},
];
export const familiars=[
 {id:'ward',name:'Junco que escucha',myth:'river',text:'Orbita y bloquea una bala pequeña cada 2 segundos.',mask:['..XX....','.XXXX...','XXOOXX..','XXOOXX..','.XXXX...','..XX....','.X..X...','........']},
 {id:'spark',name:'Brasa sin dueño',myth:'inferno',text:'Dispara 1 de daño cada segundo, alcance 300.',mask:['...X....','..XXX...','.XXXXX..','XXOOXXX.','XXOOXXX.','.XXXXX..','..XXX...','........']},
 {id:'glean',name:'Hilo recolector',myth:'nordic',text:'Cada vasija rota concede una ficha adicional.',mask:['..XXXX..','.XX..XX.','XX....XX','X..XX..X','XX....XX','.XX..XX.','..XXXX..','........']},
 {id:'mark',name:'Ojo del testimonio',myth:'olympus',text:'Marca un enemigo cercano: recibe un 8% más de daño.',mask:['........','..XXXX..','.XXXXXX.','XXXOOXXX','XXXOOXXX','.XXXXXX.','..XXXX..','........']},
];
