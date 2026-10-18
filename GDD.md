# Prototipo bullet hell roguelike

## Visión y decisiones
Juego 2D para PC en HTML5 Canvas, módulos JavaScript y CSS, sin motor.
Primero una zona pequeña; salas, mejoras y ascenso mitológico quedan planeados.
Título, protagonista y duración definitiva pendientes.

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
Paleta fija actual (12 colores, máximo 24):
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
Comprobar sensaciones de movimiento con el usuario. Después: un enemigo con un patrón,
daño, muerte y reinicio (fase 2). Reasignación de controles, audio y guardado pendientes.

## Validación de esta tarea
Sintaxis de módulos y servidor correcta. Chromium: HTTP 200, sin errores JavaScript;
movimiento 170 px/s, diagonal, dirección, cadencia, pool, bordes y pausa comprobados.
Lanzador .bat revisado; ejecución nativa en Windows pendiente.
