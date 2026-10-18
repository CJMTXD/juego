# Prototipo bullet hell roguelike

## Visión y decisiones
Juego 2D para PC en HTML5 Canvas, módulos JavaScript y CSS, sin motor.
Visión confirmada: bullet hell roguelike cenital de esquiva y combate contra enemigos y jefes.
El personaje comienza en el infierno y asciende hacia el cielo, pasando por mundos distintos
con identidad visual, enemigos y jefe propios. Inspiración libre en La Divina Comedia y otras
mitologías, incluido el Olimpo, con personajes, nombres y diseños originales.
Las historias de cada zona darán contexto a la siguiente; explicación narrativa aún propuesta.
Título, protagonista y trama pendientes; opciones en docs/historia.md no confirmadas.
Duración objetivo de la partida completa: 15–25 minutos, pendiente de medir.

Alcance inicial confirmado: una zona pequeña del infierno, 1–2 enemigos,
2–3 patrones y 1 jefe. Se construirá por fases; todavía no está implementada.

## Jugabilidad prevista (no implementada)
Controles reasignables en menú y guardados; disparo automático activable/desactivable.
Salas conectadas y encuentros variables con lógica; mejoras temporales por partida,
con rarezas, límites y sinergias. Muerte permanente de la partida; desbloqueos entre
partidas y guardado validado/versionado. Ataques con señal previa, reacción y vías de
escape; sin apariciones encima del jugador. Amenazas, balas aliadas y decoración se
distinguirán por forma y color. Ningún sistema de esta lista debe anticipar su fase.

## Fase actual: 1 — movimiento, hitbox y disparo
Implementado: arena 640×360, WASD con diagonal normalizada, apuntado con ratón,
disparo automático, pool de 128 balas y pausa al perder foco con reanudación manual.
El disparo sigue la dirección del ratón al emitirse; no busca enemigos.
Punto blanco = hitbox real. Figura provisional = 32×32.
No hay enemigos, daño, colisiones con entidades, progreso ni preferencias guardadas.
No se necesita persistencia todavía; se añadirá versionada al introducir preferencias.

## Balance provisional
Jugador: 170 px/s; hitbox: radio 4 px. Bala aliada: 360 px/s, radio 4 px,
una bala cada 0,2 s (5/s), ángulo libre de 0–360° hacia el ratón, sin dispersión.
Simulación: pasos de 1/120 s y máximo 0,05 s acumulados por fotograma.
Las balas desaparecen al llegar al borde; pool lleno omite emisiones.
Antes de añadir blancos se implementará colisión barrida para proyectiles rápidos.

## Arte
Pixel art cartoon cenital original; formas provisionales, luz arriba a la izquierda.
Tamaños previstos: comunes 32×32, jefes 64×64, balas 8–16, losetas 16×16.
Paleta inicial propuesta, usada provisionalmente (12 colores, máximo 24; pendiente de confirmar):
#17151C #27232D #38343F #514B56 #716976 #948995
#D3C3A1 #EEE1BF #49394F #70556E #3F7F92 #A2E1E8
Nuevos colores de amenazas se decidirán al añadir el primer enemigo.

## Archivos y ejecución
index.html y styles.css: página; src/input.js: entrada; src/simulation.js: simulación;
src/render.js: dibujo; src/data.js: parámetros; src/main.js: bucle y pausa.
assets/: reservado para recursos. iniciar.bat: lanzador Windows con Python o Node.
En PowerShell: `./iniciar.bat`. Alternativa: `node server.cjs` y abrir
http://127.0.0.1:8000. No abrir index.html directamente: usa módulos ES.

## Pendientes y próxima tarea
Fase 1 en revisión: esperar la elección explícita del modo de apuntado antes de modificarlo.
El ratón fue elegido en la petición inicial; la nueva petición vuelve a abrir esta decisión.
Conservar el prototipo existente hasta recibir respuesta. Después, validar la fase 1 y detenerse.
Ejecución de iniciar.bat en Windows pendiente: solo se revisó desde Linux.
Orden posterior: 2) enemigo, patrón, daño, muerte y reinicio; 3) salas conectadas;
4) mejoras y sinergias; 5) jefe; 6) meta-progresión y guardado; 7) pulido, audio y arte final.
Menú de controles, opción de disparo y persistencia aún pendientes; no se presentan como hechos.

## Validación de esta tarea
Sintaxis de módulos y servidor correcta. Chromium: HTTP 200, sin errores JavaScript;
movimiento 170 px/s, diagonal, dirección, cadencia, pool, bordes y pausa comprobados.
Lanzador .bat revisado; ejecución nativa en Windows pendiente.
