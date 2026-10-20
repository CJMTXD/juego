// Recuerdos temporales: cantidades por nivel; máximo uno. Todo efecto nuevo se configura aquí.
export const memoryItems=[
 {
  "id": "coal_seal",
  "name": "Sello de carbón",
  "myth": "inferno",
  "rarity": "common",
  "source": "normal",
  "text": "Con más de la mitad de vida, todas las armas causan un 8% más de daño.",
  "effects": {
   "healthyDamage": 0.08
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "ember_boot",
  "name": "Huellas de ceniza",
  "myth": "inferno",
  "rarity": "common",
  "source": "normal",
  "text": "La esquiva deja durante 0,9 segundos una zona de radio 55 píxeles que ralentiza perseguidores.",
  "effects": {
   "trail": 1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "kiln_tooth",
  "name": "Diente del horno",
  "myth": "inferno",
  "rarity": "rare",
  "source": "sanctuary",
  "text": "Todas las armas causan un 18% más de daño; te mueves un 8% más lento.",
  "effects": {
   "damage": 0.18,
   "speed": -0.08
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXOOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_cinder",
  "name": "Ojo del rescoldo",
  "myth": "inferno",
  "rarity": "rare",
  "source": "urn",
  "text": "Aguja de ceniza obtiene 1 crédito de evolución extra cada 5 bajas propias; no cuenta como enemigo eliminado.",
  "effects": {
   "evolveEvery": 5
  },
  "weapon": "needle",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOXOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_salvo",
  "name": "Sal del depósito",
  "myth": "inferno",
  "rarity": "epic",
  "source": "urn",
  "text": "Añade un rebote a los disparos del Abanico de sal, máximo 3; su alcance se reduce un 15%.",
  "effects": {
   "bounce": 1,
   "range": -0.15
  },
  "weapon": "scatter",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOXOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "ferry_coin",
  "name": "Óbolo sin dueño",
  "myth": "river",
  "rarity": "common",
  "source": "normal",
  "text": "Recibes una ficha adicional cada 6 bajas. Máximo 999 fichas.",
  "effects": {
   "coinEvery": 6
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXXOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "river_band",
  "name": "Venda del río",
  "myth": "river",
  "rarity": "common",
  "source": "normal",
  "text": "Toda curación recibida aumenta un 10%; conserva fracciones. No cura por sí sola.",
  "effects": {
   "heal": 0.1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXXOOX",
   "XOOOOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "salt_mirror",
  "name": "Espejo de la Tasadora",
  "myth": "river",
  "rarity": "rare",
  "source": "judgment",
  "text": "La habilidad despeja balas en un radio de 120 píxeles con cualquier alma; dura 0,5 segundos menos.",
  "effects": {
   "clear": 30,
   "duration": -0.5
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOOOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_scale",
  "name": "Pesa del recuerdo",
  "myth": "river",
  "rarity": "rare",
  "source": "urn",
  "text": "Cada jefe vencido añade 1 eco antes de los multiplicadores del resumen, máximo 6; al morir se aplica la reducción habitual.",
  "effects": {
   "bossEcho": 1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOOOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_vessel",
  "name": "Vasija de la orilla",
  "myth": "river",
  "rarity": "epic",
  "source": "urn",
  "text": "Si entras en una sala con toda la vida, bloqueas su primer impacto. Pierdes 1 de vida máxima, mínimo 1.",
  "effects": {
   "entryShield": 1,
   "health": -1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXOOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "seam",
  "name": "Costura del paso",
  "myth": "threads",
  "rarity": "common",
  "source": "normal",
  "text": "La esquiva recarga 0,08 segundos antes; se respeta el mínimo global de 0,8 segundos.",
  "effects": {
   "dash": 0.08
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXOOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "route",
  "name": "Plano de los nudos",
  "myth": "threads",
  "rarity": "common",
  "source": "normal",
  "text": "Revela tipos y conexiones del mapa; no abre el secreto. Te mueves un 2% más rápido.",
  "effects": {
   "reveal": 1,
   "speed": 0.02
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOXOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "cold_spool",
  "name": "Carrete del silencio",
  "myth": "threads",
  "rarity": "rare",
  "source": "secret",
  "text": "La esquiva deja un rastro ralentizador; la habilidad dura 0,5 segundos más.",
  "effects": {
   "trail": 1,
   "duration": 0.5
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOXOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_thread",
  "name": "Hebra que vuelve",
  "myth": "threads",
  "rarity": "rare",
  "source": "urn",
  "text": "Hilo del destino gira 1 radián por segundo más rápido; causa un 8% menos de daño.",
  "effects": {
   "turn": 1,
   "damage": -0.08
  },
  "weapon": "homing",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXXOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_moon",
  "name": "Luna del telar",
  "myth": "threads",
  "rarity": "epic",
  "source": "urn",
  "text": "Media luna del retorno atraviesa 1 enemigo más y regresa 0,1 segundos antes; causa un 8% menos de daño.",
  "effects": {
   "pierce": 1,
   "returnEarly": 0.1,
   "damage": -0.08
  },
  "weapon": "boomerang",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXXOOX",
   "XOXOOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "bronze_syllable",
  "name": "Sílaba de bronce",
  "myth": "olympus",
  "rarity": "common",
  "source": "normal",
  "text": "Tras rozar 10 balas en la partida, todas las armas disparan un 5% más rápido.",
  "effects": {
   "grazeCadence": 0.05
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOOOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "court_seal",
  "name": "Sello del testimonio",
  "myth": "olympus",
  "rarity": "rare",
  "source": "sanctuary",
  "text": "Luz del testimonio causa un 12% más de daño mientras guardas al menos 50 de carga de habilidad. Solo aparece desde Terraza del juicio.",
  "effects": {
   "chargedDamage": 0.12
  },
  "weapon": "beam",
  "max": 1,
  "shopUnlock": true,
  "minDifficulty": 2,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOOOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "trial_bell",
  "name": "Campana del juicio",
  "myth": "olympus",
  "rarity": "rare",
  "source": "challenge",
  "text": "La habilidad dura 0,5 segundos más y despeja balas en un radio de 110 píxeles con cualquier alma.",
  "effects": {
   "duration": 0.5,
   "clear": 20
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXOOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_laurel",
  "name": "Laurel de la deuda",
  "myth": "olympus",
  "rarity": "rare",
  "source": "urn",
  "text": "Cada baja carga 6 puntos de habilidad, hasta 100; todas las armas causan un 8% menos de daño.",
  "effects": {
   "killCharge": 6,
   "damage": -0.08
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXOOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_sun",
  "name": "Sol del juramento",
  "myth": "olympus",
  "rarity": "epic",
  "source": "urn",
  "text": "En Recuerdo y Ascenso, Sol en una vasija anticipa su explosión final por un 15% menos de daño. En Forma verdadera da un 5% más de daño a cambio de un 10% menos de alcance. No duplica explosiones.",
  "effects": {
   "sunfall": 1,
   "finalDamage": 0.05,
   "finalRange": -0.1,
   "damage": -0.15
  },
  "weapon": "charge",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOXOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "glass_feather",
  "name": "Pluma del alba",
  "myth": "dawn",
  "rarity": "common",
  "source": "normal",
  "text": "Proyectiles un 8% más rápidos; viento y corrientes te desplazan un 20% menos.",
  "effects": {
   "bulletSpeed": 0.08,
   "anchor": 0.2
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": false,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXOXOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOXOOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "margin_note",
  "name": "Nota al margen",
  "myth": "dawn",
  "rarity": "rare",
  "source": "miniboss",
  "text": "Los impactos directos de todas las armas causan un 10% más de daño a jefes y minijefes.",
  "effects": {
   "bossDamage": 0.1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOXXOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOXOOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "dawn_thread",
  "name": "Hilo del primer día",
  "myth": "dawn",
  "rarity": "rare",
  "source": "sanctuary",
  "text": "Al vencer un jefe con la mitad de vida o menos, recuperas 1 de vida. Máximo 3 curaciones por partida, ajustadas a dificultad.",
  "effects": {
   "bossHeal": 1
  },
  "weapon": null,
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOXXXOOX",
   "XOOXOOOX",
   "XOOOOOOX",
   "XOOOXOOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 },
 {
  "id": "urn_prism",
  "name": "Prisma del archivo",
  "myth": "dawn",
  "rarity": "rare",
  "source": "urn",
  "text": "Astrolabio roto tiene 10 píxeles más de radio orbital; causa un 10% menos de daño.",
  "effects": {
   "orbitRadius": 10,
   "damage": -0.1
  },
  "weapon": "orbit",
  "max": 1,
  "shopUnlock": true,
  "sprite": [
   "..XXXX..",
   ".XOOOOX.",
   "XOOOOOOX",
   "XOXXOOOX",
   "XOOOOOOX",
   "XOOOOXOX",
   ".XOOOOX.",
   "..XXXX.."
  ]
 }
];
export const memoryRecipes=[
 {
  "id": "warm_seal",
  "name": "Sello tibio",
  "requires": [
   "coal_seal",
   "ember"
  ],
  "effect": "memory",
  "bonuses": {
   "burn": 0.08
  },
  "text": "Los impactos activan la quemadura: 8% del impacto cada 0,2 segundos durante 0,8 segundos."
 },
 {
  "id": "returned_toll",
  "name": "Peaje devuelto",
  "requires": [
   "ferry_coin",
   "scale"
  ],
  "effect": "memory",
  "bonuses": {
   "recipeCoinEvery": 9
  },
  "text": "Una ficha adicional cada 9 bajas."
 },
 {
  "id": "return_seam",
  "name": "Costura del regreso",
  "requires": [
   "seam",
   "step"
  ],
  "effect": "memory",
  "bonuses": {
   "dashInvulnerability": 0.025
  },
  "text": "La esquiva concede 0,025 segundos más de invulnerabilidad, máximo 0,26 segundos."
 },
 {
  "id": "bound_voice",
  "name": "Voz atada",
  "requires": [
   "bronze_syllable",
   "pulse"
  ],
  "effect": "memory",
  "bonuses": {
   "activeDamage": 0.08
  },
  "text": "Todas las armas causan un 8% más de daño durante la habilidad."
 },
 {
  "id": "dawn_map",
  "name": "Mapa del alba",
  "requires": [
   "glass_feather",
   "lens"
  ],
  "effect": "memory",
  "bonuses": {
   "reveal": 1
  },
  "text": "Revela tipos y conexiones del mapa; no abre el secreto."
 },
 {
  "id": "mist_path",
  "name": "Camino de bruma",
  "requires": [
   "cold_spool",
   "veil"
  ],
  "effect": "memory",
  "bonuses": {
   "trailDuration": 0.3
  },
  "text": "El rastro de esquiva dura 0,3 segundos más."
 }
];
// Topes adicionales: nunca reemplazan los topes globales de depth.js.
export const memoryBalance={bouncesMax:3,damageCap:0.35,speedCap:0.15,cadenceCap:0.15,abilityMin:1,abilityMax:6,dashInvulnerabilityMax:0.26,bossHeals:3,bossEchoes:6,coinsMax:999,grazeRequired:10,chargedRequired:50,healthyFraction:0.5,serviceHeal:2,serviceCoins:2,serviceCharge:10};
export const memorySourceNames={normal:'Recompensas de sala',sanctuary:'Catálogo del Santuario',urn:'Urnas del Santuario; después recompensas de sala',judgment:'Aceptar una bendición del juicio',secret:'Conservar el fragmento secreto',challenge:'Completar la sala de desafío',miniboss:'Vencer al minijefe'};
// Servicios renovables: garantizan tres elecciones distintas incluso con todo el inventario al máximo.
export const memoryServices=[{id:'restore',name:'Agua del camino',rarity:'common',max:1,service:'heal',text:'Recupera 2 de vida, ajustada a dificultad y pactos. Repetible.'},{id:'memory_coins',name:'Fichas del camino',rarity:'common',max:1,service:'coins',text:'Obtén 2 fichas para esta partida. Repetible.'},{id:'memory_charge',name:'Voz del camino',rarity:'common',max:1,service:'charge',text:'Carga 10 puntos de habilidad, hasta 100. Repetible.'}];
