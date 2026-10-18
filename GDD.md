# El umbral — título provisional

## Visión y alcance
Bullet hell roguelike 2D cenital para PC, HTML5 Canvas, módulos ES y CSS, sin motor.
Un personaje asciende del infierno al cielo entre mundos mitológicos conectados.
La nueva autorización permite completar el ciclo jugable sin nuevas preguntas.
Se conserva el apuntado con ratón pedido originalmente.

Entrega actual: **primera zona del infierno jugable de principio a fin**. No se han
implementado los mundos superiores. Título, protagonista e historia son propuestas,
no decisiones definitivas; véase docs/historia.md. El final cierra esta primera zona.
La duración objetivo del juego ampliado es 15–25 min; aún no se ha calibrado con humanos.

## Funciones implementadas
- Inicio, opciones, pausa manual/automática, muerte, reinicio y victoria con epílogo.
- WASD normalizado, hitbox visible de radio 4 px frente a cuerpo visual 32×32.
- Apuntado independiente al ratón; disparo automático opcional o clic sostenido.
- Controles reasignables, detección de conflictos, restauración y guardado local.
- Impulso breve con invulnerabilidad y recarga visible.
- Dos enemigos: Custodio de ceniza y Lamentador; oleadas configuradas según profundidad.
- Tres patrones con aviso previo: anillo, abanico y espiral (esta última en el jefe).
- Colisiones barridas, daño, invulnerabilidad tras impacto y muerte permanente de partida.
- Mapa conectado por semilla: inicio, 7 salas de combate, jefe y hasta 2 refugios laterales.
- Diseño de mapa, encuentros y recompensas reproducibles con la misma semilla y desbloqueos.
- Puertas bloqueadas durante el combate; solo se viaja a salas conectadas. Refugios curan una vez.
- Elección de 1 entre 3 mejoras diferentes tras cada sala. Rarezas, límites y sinergia explícita.
- Jefe El Sellador, 180 PV, tres fases con descanso y limpieza de balas al cambiar.
- Ecos persistentes al morir, abandonar o vencer; compra de dos nuevas opciones para futuras partidas.
- Guardado v1 validado y recuperación de JSON corrupto; aviso si falla el almacenamiento.
- Sonidos sintetizados de disparo, impacto, daño, muerte, recompensa, curación y victoria.
- Silenciar, reducir efectos/sacudida, sprites provisionales originales hechos con matrices.

## Controles iniciales
WASD: movimiento; ratón: dirección; Espacio: impulso; Esc: pausa.
Automático activado por defecto; si se desactiva, mantener clic izquierdo.
El tiempo no avanza en menús/recompensas, ni al perder foco. Reanudar es manual.
Se puede usar el mapa o caminar hacia las puertas abiertas.

## Balance provisional y patrones
Resolución lógica 640×360. Simulación fija 1/120 s; acumulación máxima de 0,05 s por fotograma.
Jugador: 170 px/s, 5 PV, daño recibido 1, invulnerabilidad 0,9 s tras impacto.
Impulso: 0,16 s a velocidad ×2,8; invulnerabilidad 0,18 s; recarga 1,5 s.
Bala aliada: 360 px/s, radio 3, daño 1, una cada 0,2 s. Pool 128.
Balas enemigas: radio 4, daño 1; pool 512; lleno omite emisiones, sin sobrescribir balas activas.
Custodio: 7 PV; Lamentador: 6 PV y aproximación a 20 px/s; vida +1 por cada 3 niveles de profundidad.
Aparecen a más de 125 px del jugador; señal de llegada inicial de 1,4 s.

| Patrón | Velocidad | Cantidad | Ángulo | Cadencia | Aviso |
| --- | --- | --- | --- | --- | --- |
| Anillo | 90 px/s | 12 | 360°, huecos de 30° | 2,6 s | 0,65 s |
| Abanico | 105 px/s | 5 | 60° hacia la posición fijada al avisar | 2,1 s | 0,60 s |
| Espiral | 95 px/s | 6 | 360°, gira 21,8° por emisión | 1,1 s | 0,55 s |

El jefe añade 5 px/s por fase; cambios al 66% y 33% de vida, descanso 1,5 s.
Los proyectiles no persiguen al jugador después de emitirse. Ángulos internos en radianes.
Aún es necesario evaluar justicia y diversión mediante partidas humanas.

## Mejoras y progreso
Común 70%, rara 25%, épica 5%, renormalizadas entre categorías elegibles por elección.
Brasa: daño +25%, máx. 4. Pulso: cadencia +12%, máx. 4. Suela: movimiento +12%, máx. 3.
Vasija: +1 PV máximo y curación, máx. 2. Eco partido: +2 laterales al 55% de daño, máx. 2.
Aguja: +1 penetración, máx. 2. Agua: cura 2, máx. 9. Memoria: daño ×1,5, máx. 1.
**Sinergia** Brasa + Memoria: ×1,35 adicional. Estadísticas recalculadas desde la base.
Lente: velocidad de bala +30% y daño +10%, máx. 2; se desbloquea por 5 ecos.
Velo: +0,5 s de invulnerabilidad tras daño, máx. 1; se desbloquea después por 10 ecos.
Ecos: 1 por sala completada y +6 por victoria. No son mejoras permanentes de poder.
Inventario, vida y mapa se reinician; solo opciones, ecos, desbloqueos y estadísticas se guardan.
Cerrar/recargar durante una partida la descarta: no hay guardado de partida en curso.

## Dirección artística
Pixel art cartoon cenital original, cabeza grande, contorno oscuro, luz arriba a la izquierda.
Sprites provisionales 32×32; jefe 64×64; balas aliadas cuadradas y amenazas romboidales.
Nearest-neighbor, escala entera cuando cabe, reducción solo para pantallas pequeñas.
Paleta provisional actual (19 colores, máximo 24):
#17151C #27232D #38343F #514B56 #716976 #948995 #44352F #665044
#D3C3A1 #EEE1BF #A97663 #49394F #70556E #66705A #3F7F92 #A2E1E8
#FF385D #FF922E #FFE34B
Los tres últimos se reservan para amenazas y señales. La paleta definitiva queda pendiente.

## Archivos y ejecución
`index.html`, `styles.css`: interfaz; `src/input.js`: entrada; `src/simulation.js`: juego;
`src/render.js`: dibujo/matrices; `src/data.js`: configuraciones; `src/map.js`: generación;
`src/storage.js`: validación; `src/audio.js`: síntesis; `src/main.js`: bucle y menús.
`iniciar.bat` detecta Python/Node y usa `server.py` o `server.cjs`; abre tras enlazar el puerto.
PowerShell: `.\iniciar.bat`. Alternativa: `node server.cjs` o `python server.py`.
Abrir http://127.0.0.1:8000. Cerrar servidor con Ctrl+C. No abrir index.html con doble clic.
Se necesita Python 3 o Node.js LTS, sin instalar paquetes para jugar.

## Comprobaciones y límites
10 pruebas Node: 1000 semillas, movimiento, disparos, pools, colisión barrida, daño/muerte,
avisos, tres patrones, mejoras, límites, sinergia y validación del guardado.
Recorrido automático de zona hasta victoria con balas reales y todos los estados del jefe;
usa invulnerabilidad de prueba para aislar el flujo, no acredita dificultad ni duración humanas.
Chromium: opciones, conflictos de teclas, persistencia al recargar, semilla inválida,
mapa, combate, pausa por Escape/foco, abandono y reinicio; sin errores JavaScript.
Servidores Python y Node responden HTTP 200. Lanzador .bat revisado, no ejecutado en Windows.
Pruebas: `node --test tests/game.test.mjs` (Node 22+ recomendado).

## Próxima tarea
Jugar la primera zona para ajustar dificultad y duración antes de crear mundos superiores.
Arte final, música, narrativa definitiva y el resto del ascenso siguen pendientes.

## Ampliación — fase 1 completada
Respaldo previo e167276. Balance existente extraído a src/data/balance.js sin alterar
los valores ni el flujo jugable. Las 10 pruebas previas siguen pasando.
Siguiente fase: cuatro armas configurables; todavía sin mundos ni personajes adicionales.

## Ampliación — fase 2 completada
Cuatro armas en src/data/weapons.js: Aguja, Abanico, Voz y Moneda. Dos ranuras y Q
configurable para alternar. Los cofres ofrecen arma o mejora; ráfagas limitan los ecos
laterales a una emisión por ciclo. Escopeta + ráfaga reduce dispersión 20%. 11 pruebas y
recorrido de zona anterior correctos; menús y combate comprobados en Chromium.
