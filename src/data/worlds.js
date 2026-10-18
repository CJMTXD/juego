// Cada mundo define enemigos, comportamiento del jefe, ambiente, arte y motivo musical.
export const worlds=[
 {id:'ashes',name:'Depósito de ceniza',region:'Infierno · círculo del olvido',floor:'#38343F',detail:'#514B56',accent:'#665044',tile:0,health:1,speed:1,density:1,hazard:'embers',music:[110,130.81,146.83,164.81],tempo:0.48,
  lore:['Los recuerdos que caen desde arriba alimentan el depósito.','La marca del sello también está grabada en las cartas del cielo.','El dolor de abajo paga la calma de arriba.'],
  enemies:[{id:'keeper',name:'Custodio de ceniza',health:7,radius:12,pattern:'ring',speed:0,behavior:'stay'}, {id:'mourner',name:'Lamentador',health:6,radius:11,pattern:'fan',speed:20,behavior:'seek'}, {id:'cinder',name:'Recolector de brasas',health:5,radius:10,pattern:'spiral',speed:14,behavior:'strafe'}],
  boss:{name:'El Sellador',health:180,mechanic:'marks',patterns:['ring','fan','spiral'],quote:'Si abro el sello, recordarán lo que hicieron.'}},
 {id:'salt',name:'Dársena de sal',region:'Infierno · río de los nombres',floor:'#35444A',detail:'#514B56',accent:'#948995',tile:1,health:1.3,speed:1.04,density:1,hazard:'tide',music:[130.81,155.56,196,174.61],tempo:0.43,
  lore:['El río pesa cada nombre antes de dejarlo pasar.','Las balanzas no miden pecados: miden quién puede pagar.','Los talleres del ascenso reparan las pesas a cambio de silencio.'],
  enemies:[{id:'oarsman',name:'Remero sin orilla',health:7,radius:11,pattern:'cross',speed:22,behavior:'strafe'}, {id:'weigher',name:'Pesador de sal',health:9,radius:12,pattern:'wave',speed:0,behavior:'stay'}, {id:'reed',name:'Junco de vidrio',health:5,radius:10,pattern:'ribbon',speed:18,behavior:'flee'}],
  boss:{name:'La Tasadora de nombres',health:250,mechanic:'tide',patterns:['cross','wave','ribbon'],quote:'Todo nombre pesa. El tuyo todavía cambia.'}},
 {id:'threads',name:'Terrazas del hilo',region:'Purgatorio · terrazas de los vínculos',floor:'#465044',detail:'#66705A',accent:'#948995',tile:2,health:1.7,speed:1.08,density:1,hazard:'wind',music:[146.83,174.61,220,196],tempo:0.39,
 lore:['Cada nombre es un hilo. El río entregó los nudos a estos talleres.','La Hilandera cose rutas para quienes no pueden pagar la balanza.','La corte de las cimas ordenó cortar los lazos que unían a los caídos.'],
 enemies:[{id:'knot',name:'Nudo peregrino',health:8,radius:11,pattern:'petals',speed:20,behavior:'orbit'}, {id:'spool',name:'Carrete hueco',health:7,radius:10,pattern:'sweep',speed:24,behavior:'blink'}, {id:'needleling',name:'Aguja errante',health:6,radius:10,pattern:'weave',speed:25,behavior:'flee'}],
 boss:{name:'La Hilandera del intervalo',health:360,mechanic:'teleport',patterns:['petals','sweep','weave'],quote:'Puedo coser un camino. No puedo elegir por ti.'}},
 {id:'roots',name:'Jardín del peso',region:'Purgatorio · terrazas de la deuda',floor:'#5B5668',detail:'#716976',accent:'#66705A',tile:3,health:2.2,speed:1.12,density:1,hazard:'roots',music:[164.81,196,246.94,220],tempo:0.36,
 lore:['Las raíces crecen con el peso que el río negó a los vivos.','El Medidor protege un jardín que solo florece cuando alguien recuerda.','La primera cosecha fue enviada arriba. El hambre se quedó en las raíces.'],
 enemies:[{id:'gardener',name:'Jardinero de hueso',health:9,radius:12,pattern:'lantern',speed:16,behavior:'seek'}, {id:'rootling',name:'Raíz penitente',health:8,radius:10,pattern:'roots',speed:18,behavior:'orbit'}, {id:'scalebird',name:'Ave de las pesas',health:7,radius:11,pattern:'scales',speed:30,behavior:'strafe'}],
 boss:{name:'El Medidor de estaciones',health:480,mechanic:'charge',patterns:['lantern','roots','scales'],quote:'No arranques las raíces. Reparte el peso.'}},
];
