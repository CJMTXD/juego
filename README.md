# El umbral (título provisional)

Bullet hell roguelike de navegador, sin motor ni paquetes. Primera zona completa:
mapa por semilla, oleadas, mejoras, jefe de tres fases, muerte/reinicio y desbloqueos locales.

## Jugar en Windows

1. Instala Python 3 desde python.org (marca **Add Python to PATH**) o Node.js LTS.
2. Abre esta carpeta en VS Code y ejecuta en PowerShell:

   ```powershell
   .\iniciar.bat
   ```

Se abre el navegador. Mantén abierta la terminal del servidor. Si el puerto 8000
está ocupado, cierra el servidor anterior. Si el navegador no se abre, entra en
http://127.0.0.1:8000. Para terminar el servidor, pulsa Ctrl+C.

También puedes ejecutar `node server.cjs` o `python server.py` y abrir esa dirección.
No abras index.html directamente: los módulos necesitan un servidor HTTP.

WASD mueve, ratón apunta, Espacio da impulso y Esc pausa. El disparo es automático;
puedes desactivarlo en Opciones y mantener clic izquierdo para disparar.
El punto claro es tu hitbox. Los rombos cálidos son enemigos; los cuadrados azules, tuyos.
Tras limpiar una sala elige una mejora y usa una puerta o el mapa para continuar.
Los refugios curan una vez. Al morir se pierden las mejoras; conserva ecos para desbloquear
nuevas opciones desde Inicio. El jefe cierra la primera zona y muestra su final.

El guardado pertenece al navegador y a la dirección usada. Borrar datos del navegador
elimina el progreso. Las partidas en curso no se guardan; las opciones sí.

## Comprobar el código

Con Node 22+ (no necesario si juegas usando Python):

```powershell
node --test tests/game.test.mjs
```

La ruta completa de combate se prueba con invulnerabilidad de prueba; no mide dificultad.
El lanzador Windows debe comprobarse en Windows. El resto de las comprobaciones y
los valores de balance están en GDD.md. Los mundos superiores aún no están construidos.
