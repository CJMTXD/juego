# El umbral — ascenso de seis mundos

Bullet hell roguelike cenital original en Canvas, JavaScript y CSS, sin motor ni paquetes
para jugar. Seis mundos del infierno al cielo, 18 enemigos, seis jefes, cinco personajes,
diez armas con cuarenta formas, veinte ítems, recetas, cinco superítems, cinco dificultades,
santuario y desbloqueos guardados en el navegador.

## Jugar en Windows

Descarga [el ZIP del juego](https://github.com/CJMTXD/juego/archive/refs/heads/main.zip),
extrae todo y ejecuta `iniciar.bat`. También puedes usar **Code → Download ZIP** en GitHub.
Desde PowerShell en esta carpeta:

```powershell
.\iniciar.bat
```

Necesitas **Python 3** (activa Add Python to PATH al instalar) o **Node.js LTS**.
El lanzador detecta cualquiera y abre el navegador cuando el servidor está enlazado.
Mantén abierta su terminal. Para terminar, pulsa Ctrl+C. Si el puerto 8000 está ocupado,
cierra el servidor anterior. Si no abre navegador, entra en http://127.0.0.1:8000.
No abras index.html directamente: los módulos necesitan HTTP.

Alternativas: `node server.cjs` o `python server.py` y abrir la dirección anterior.

## Controles y partida

- WASD: moverse; ratón: apuntar; Espacio: impulso; Q: cambiar de arma; E: habilidad de roce; Esc: pausa.
- Disparo automático por defecto; en Opciones puedes desactivarlo y mantener clic.
- F3 muestra FPS, DPS, balas y tiempo de sala. `?debug=1` abre además el laboratorio
  desde la pausa: armas, ítems, ecos y salto a mundo/jefe. Usa un guardado separado
  y los trucos no conceden recompensas en partidas.
- El punto claro es tu hitbox. Rombos cálidos hacen daño; cuadrados azules son aliados.
- Limpia la sala, elige mejora o arma y usa una puerta o el mapa para avanzar.
- Los jefes desbloquean mundos; puedes comenzar en cualquier mundo ya abierto.
- Dos ranuras de arma. La armería muestra estadísticas, comportamiento y obtención.
- Al morir pierdes mejoras temporales. Los ecos permiten desbloquear nuevas opciones.
- Los personajes se abren por partidas, ecos, jefes o compras: su selección explica cada condición.
- Roza rombos sin tocarlos para cargar E. Cada bala solo cuenta una vez; durante
  invulnerabilidad no carga. Cada personaje tiene una habilidad distinta.
- Compra armas con ecos en el santuario y elige una de tres al iniciar. Cada arma
  evoluciona a 100/250/500 bajas, conservadas al cambiar durante esa partida.
- Las recetas y sets premian combinar piezas. Consulta condiciones de los cinco
  superítems en el códice: solo uno por partida, con su desventaja.
- Las ramas laterales ofrecen tienda, juicio, desafío repetible, secreto, minijefe
  y altar. Sus fichas se pierden al terminar; los ecos del resumen se conservan.
- Vence desde el fondo para abrir la siguiente dificultad. Los pactos son voluntarios.
- La diaria usa fecha UTC y semilla compartible sin árbol ni pactos. No hay ranking en línea.
- Final verdadero: dificultad Terraza del juicio o superior, salida desde el fondo,
  tres fragmentos y visita al archivo secreto.

Progreso, mundos y opciones son locales al navegador y dirección usada. Borrar sus datos
borra el guardado. Cambiar de navegador/dirección no comparte progreso. Cerrar una partida
la descarta: no hay guardado a mitad del combate. Se migra el guardado de la primera versión.

## Desarrollo y validación

Con Node 22+:

```powershell
node --test tests/game.test.mjs tests/depth.test.mjs
```

Prueba opcional de interfaz con Playwright y Chromium ya instalados:

```powershell
node tests/browser.cjs
node tests/depth-browser.cjs
```

Herramientas de balance (sin paquetes):

```powershell
node scripts/weapon-balance.mjs
node scripts/campaign-balance.mjs
```

La primera imprime DPS de las 40 formas; la segunda simula cuatro campañas favorables.
Accesibilidad en Opciones: reasignación, realce de balas, paleta alternativa, tamaño
visual de hitbox, destellos/sacudida, música/silencio y números de daño.

El juego no necesita esas herramientas. El servidor debe estar activo para la prueba de interfaz.
GDD.md resume el estado; docs/balance.md contiene valores y curva; docs/historia.md separa
lo implementado de las propuestas. El objetivo de 15–25 minutos necesita medición humana;
las pruebas automáticas completas usan invulnerabilidad y apuntado perfecto para aislar el flujo.
El .bat está revisado, pero no se ejecutó nativamente en Windows desde el entorno Linux.
