# El umbral — juego del ascenso (título de trabajo)

## Visión y estado
Bullet hell roguelike 2D cenital para PC: Canvas, módulos JavaScript y CSS, sin motor
ni dependencias de ejecución. Se amplió la versión inicial conservando sus módulos,
entrada, mapa conectado, pools, colisión barrida y guardado. Respaldo: e167276.
Las siete fases están implementadas y tienen commits; cada arma/personaje/mundo de
la fase 5 se añadió y probó antes del siguiente. No se presentan propuestas como funciones.

## Campaña implementada
| Orden | Región | Mundo | Mecánica ambiental | Guardián |
|---|---|---|---|---|
| 1 | Infierno | Depósito de ceniza | Brasas anunciadas | El Sellador |
| 2 | Infierno | Dársena de sal | Corriente lateral | La Tasadora de nombres |
| 3 | Purgatorio | Terrazas del hilo | Viento ascendente | La Hilandera del intervalo |
| 4 | Purgatorio | Jardín del peso | Raíces que ralentizan | El Medidor de estaciones |
| 5 | Paraíso | Corte de los juramentos | Espejos de un reflejo | Las Dos Voces |
| 6 | Paraíso | Esfera del alba vacía | Bandas de eclipse | El Jardín que Olvida |

Cada mundo tiene tres enemigos comunes propios (18 en total), tres patrones propios,
suelo/decoración diferentes, música/ambiente y un jefe de tres fases. Jefes: marcas,
movimiento con las corrientes, teletransporte anunciado, embestida, eco reflejado y sello central.
La campaña termina con un epílogo tras el sexto jefe. Mundos por semilla, conectados;
cada uno tiene inicio, 7 combates, jefe y hasta 2 refugios laterales. Sala limpia abre
puertas tras elegir mejora o arma. No aparecen enemigos a menos de 125 px.

## Combate y controles
WASD normalizado; ratón apunta; disparo automático opcional o clic sostenido.
Espacio: impulso; Q: alternar dos armas; Esc: pausa; F3: datos de depuración.
Todas las acciones de movimiento/impulso/arma se reasignan con detección de conflictos.
Se pausa al perder foco y se reanuda manualmente, sin saltos ni tiempo acumulado.
Punto claro = hitbox real; cuerpo de 32×32. Balas aliadas cuadradas/cian y amenazas
romboidales/cálidas. Daño y proyectiles rápidos usan colisión barrida.

## Personajes y equipo
Cinco almas seleccionables, con retratos, estadísticas, arma y pasiva visibles:
- Remendadora: 5 PV, 170 px/s, radio 4; Aguja; cura cada seis salas.
- Portador: 6 PV, 145 px/s, radio 5, daño ×0,8; Moneda; escudo de un impacto por sala.
- Mensajera: 4 PV, 190 px/s, radio 3, daño ×0,95; Voz; impulso recarga 1,1 s.
- Tejedora: 5 PV, 165 px/s, radio 4, daño ×0,92; Astrolabio; aura que ralentiza balas.
- Testigo: 4 PV, 175 px/s, radio 4; Luz; +15% daño con vida completa.
Portador: 3 partidas o primer jefe. Mensajera: 8 ecos acumulados o primer jefe.
Tejedora: jefe 3. Testigo: jefe 5. Remendadora disponible desde el inicio.

Diez armas configurables: Aguja, Abanico, Voz, Moneda, Hilo, Luz, Astrolabio, Tinta,
Sol y Media luna. Modos: recto, dispersión, ráfaga, rebote, guiado, rayo, orbital,
área retardada, carga y retorno. Cofres y jefes permiten sustituir equipo; las
recargas se conservan al alternar. Armería muestra todos los valores y cómo obtenerlas.
Las mejoras anteriores siguen presentes; Eco y Aguja tienen efecto alternativo
sobre armas de área/orbital/rayo para no resultar inútiles. Sinergias limitadas.

## Balance y rendimiento
Datos editables en src/data/balance.js, weapons.js, characters.js, worlds.js y src/data.js.
Tablas completas de valores, curvas, patrones, rarezas y límites: **docs/balance.md**.
Resolución 640×360, simulación 120 Hz, acumulación máxima 0,05 s.
Vida enemiga por mundo ×1 / 1,55 / 2,1 / 2,8 / 3,5 / 4,2.
Jefes: 180 / 300 / 450 / 620 / 820 / 1080 PV. Máximo 2 enemigos al inicio, 3 después.
Los avisos crecen de 0,55 a 1,1 s según patrón; peligros avisan 1,5 s y dejan suelo seguro.
Balas más rápidas no sustituyen señales y huecos de escape. Aún hace falta evaluar
combinaciones difíciles con jugadores; las comprobaciones no demuestran justicia universal.

Pools fijos: 128 balas aliadas, 512 enemigas, 16 enemigos y 64 partículas. Reinicio de
propiedades al reutilizar; no se sobrescriben balas activas. Suelo y sprites de enemigos
se preparan al entrar en un mundo; no se conservan familias de todos los mundos en caché.
F3 o ?debug=1 muestra FPS, DPS de cinco segundos, balas activas y tiempo de sala.

Objetivo humano de campaña: **15–25 minutos**, pendiente de validar con partidas humanas.
Tres simulaciones de apuntado perfecto e invulnerabilidad de prueba, sin decisiones,
viaje manual ni errores: 11,56 / 13,78 / 14,12 minutos. Son un límite favorable,
no mediciones de duración humana. No se añadieron esperas artificiales para alcanzar el objetivo.

## Progreso y opciones
Guardado local v2 validado, migra v1 sin perder ecos/opciones; avisa si no puede escribir.
Cada jefe guarda de inmediato el siguiente mundo y sus desbloqueos. Se puede empezar
en un mundo ya abierto con un bono de acceso (+16% daño por nivel inicial).
Ecos: 1 por sala, +6 por victoria. Lente cuesta 5, Velo 10. Opciones nuevas, sin mejoras
permanentes obligatorias. Mejoras, vida y mapa se reinician al morir; cerrar una partida
la descarta. Personajes, mundos, estadísticas y preferencias persisten en ese navegador.
Silencio, música/ambiente y reducción de efectos son independientes. Audio empieza
solo tras interacción; cada mundo tiene motivo, tempo y ambiente sintetizados propios.
Cada arma usa timbre y tono propios. Partículas y pausa de impacto se reducen con la opción.

## Arte y narrativa
39 sprites originales distintos en matrices: 5 almas, 18 enemigos, 6 jefes y 10 armas.
Comunes 32×32, jefes 64×64, armas 16×16; nearest-neighbor y transparencia binaria comprobada.
Paleta compartida de 24 colores; cinco nuevos pisos apagados. Lista en docs/balance.md.
Los fondos se aclaran sin reutilizar los colores reservados para amenazas.
El más allá es un mundo común al que distintas culturas dieron nombres diferentes.
Las memorias descartadas conectan seis historias; fragmentos, objetos y frases breves.
Todo el contenido implementado y las propuestas pendientes están separados en docs/historia.md.
Título definitivo y futuras historias siguen abiertos; la campaña actual tiene cierre.

## Archivos y comprobaciones
src/input.js, simulation.js, render.js, map.js, storage.js, audio.js, weapons.js y projectiles.js;
src/data/: configuraciones. index.html / styles.css: interfaz; assets/: reservado para exportaciones.
iniciar.bat detecta Python/Node y abre después de enlazar el servidor. No instala paquetes.
En PowerShell: `.\iniciar.bat`; alternativa `node server.cjs` o `python server.py`.
Pruebas de lógica: `node --test tests/game.test.mjs` (Node 22+).
Prueba opcional de interfaz: `node tests/browser.cjs` con Playwright/Chromium disponibles.

21 pruebas de lógica pasan: 1000 semillas, seis mundos completos, diez armas con daño
real, habilidades, guardado/migración, mejoras, peligros, pools y campaña hasta el final.
Chromium: selección de cinco almas, entrada/combate en seis mundos, opciones, pausa,
armería, música activada, consola sin errores y 39 sprites únicos con alfa 0/255.
Estrés: 640 balas, 16 enemigos y 64 partículas; mediana ~0,7 ms y percentil 95 ~10,8 ms
para cálculo+dibujo en Chromium headless de este entorno. No garantiza el FPS de otro equipo.
Servidores HTTP y sintaxis comprobados; ejecución nativa del .bat en Windows pendiente.

## Próxima tarea
Jugar una campaña completa en el PC del usuario para calibrar dificultad y duración real.

## Profundidad — fase 1
Respaldo c1f4d66. Configuración de progresión, dificultades, economía y límites en
src/data/depth.js. Guardado v3 migra v1/v2 conservando monedas, opciones y desbloqueos.
Interpretación: cuando no haya dos armas compradas, el guía prestará dos alternativas
solo para la selección inicial; no las añade al botín ni al desbloqueo permanente.
El arma personal también puede prestarse al personaje; su compra abre el botín global.
