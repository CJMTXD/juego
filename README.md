# El umbral — ascenso de seis mundos

Bullet hell roguelike cenital original en Canvas, JavaScript y CSS, sin motor ni paquetes
para jugar. Seis mundos del infierno al cielo, 18 enemigos, seis jefes, cinco personajes,
diez armas, mejoras, sinergias y desbloqueos guardados en el navegador.

## Jugar en Windows

Descarga **Code → Download ZIP** en GitHub, extrae todo y ejecuta `iniciar.bat`.
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

- WASD: moverse; ratón: apuntar; Espacio: impulso; Q: cambiar de arma; Esc: pausa.
- Disparo automático por defecto; en Opciones puedes desactivarlo y mantener clic.
- F3 muestra FPS, DPS, balas y tiempo de sala. También se activa con `?debug=1`.
- El punto claro es tu hitbox. Rombos cálidos hacen daño; cuadrados azules son aliados.
- Limpia la sala, elige mejora o arma y usa una puerta o el mapa para avanzar.
- Los jefes desbloquean mundos; puedes comenzar en cualquier mundo ya abierto.
- Dos ranuras de arma. La armería muestra estadísticas, comportamiento y obtención.
- Al morir pierdes mejoras temporales. Los ecos permiten desbloquear nuevas opciones.
- Los nuevos personajes se abren por partidas, ecos o jefes: su selección explica cada condición.

Progreso, mundos y opciones son locales al navegador y dirección usada. Borrar sus datos
borra el guardado. Cambiar de navegador/dirección no comparte progreso. Cerrar una partida
la descarta: no hay guardado a mitad del combate. Se migra el guardado de la primera versión.

## Desarrollo y validación

Con Node 22+:

```powershell
node --test tests/game.test.mjs
```

Prueba opcional de interfaz con Playwright y Chromium ya instalados:

```powershell
node tests/browser.cjs
```

El juego no necesita esas herramientas. El servidor debe estar activo para la prueba de interfaz.
GDD.md resume el estado; docs/balance.md contiene valores y curva; docs/historia.md separa
lo implementado de las propuestas. El objetivo de 15–25 minutos necesita medición humana;
las pruebas automáticas completas usan invulnerabilidad y apuntado perfecto para aislar el flujo.
El .bat está revisado, pero no se ejecutó nativamente en Windows desde el entorno Linux.
