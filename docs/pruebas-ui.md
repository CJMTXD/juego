# Verificación de interfaz — entrega hasta fase 5

## Comprobado en el entorno de desarrollo
- 47 pruebas de lógica: 44 existentes más migración/validación de preferencias UI.
- `tests/browser.cjs`: seis mundos, cinco personajes, armas, selección, pausa, audio,
  sprites originales y estrés de pools. `tests/depth-browser.cjs`: santuario, diaria,
  desvíos, seis jefes y final; perfil normal separado del laboratorio.
- `tests/ui-layout.cjs`, `tests/ui-flow.cjs`: documento sin scroll/desborde, menús fuera
  de la arena, título completo, preparación en dos toques y selección persistente.
- `tests/ui-screens.cjs`: Santuario/Armería/Códice/Personajes/Opciones en cuatro tamaños;
  contenedores sin desborde horizontal y una sola zona de desplazamiento.
- `tests/mobile-browser.cjs`: 390×844, 844×390, 768×1024 y 1920×1080; ratón/teclado y
  punteros táctiles mediante Chromium/CDP, multitoque simultáneo y cancelación,
  autoapuntado/joystick derecho, habilidad, arma, zurdo, controles grandes y margen,
  ahorro, persistencia, foco/orientación, rectángulos sin invadir el campo.
- Caché de instalación bajo `/juego/`, recarga y comienzo de partida con red cortada.
- `scripts/check-pwa.mjs`: todos los módulos y recursos disponibles, manifiesto de
  ámbito relativo, PNG de 192 y 512 correctos. Sin recursos de fuentes externos.
- Servidores Python y Node con `--lan`: HTTP 200, MIME de manifiesto/JS/iconos y
  direcciones de interfaces locales. No se modificó la simulación ni sus datos.

Las capturas están en `docs/capturas/`. Son estados de prueba, algunos con enemigos
inyectados en el laboratorio. No representan una partida humana ni una medición física.

## Pendiente de probar por el usuario
Una partida en PC y otra en Android/iPhone real: comodidad del joystick, tamaño de
hitbox, gestos del sistema, llamada/rotación, instalación y consumo/rendimiento. Wake
Lock, vibración, fullscreen y prompt de instalación dependen del navegador; que no
existan no debe bloquear el juego. El .bat no se ejecutó nativamente en Windows.
Fases 6–8 y mando opcional permanecen pendientes, según la pausa solicitada en fase 5.

## Repetir las pruebas
En PowerShell, arrancar `node server.cjs --port 8040 --lan`. En otra terminal:

```powershell
$env:GAME_URL = "http://127.0.0.1:8040"
node --test tests/game.test.mjs tests/depth.test.mjs tests/ui.test.mjs
node scripts/check-pwa.mjs
node tests/ui-layout.cjs
node tests/ui-flow.cjs
node tests/ui-screens.cjs
node tests/mobile-browser.cjs
node tests/browser.cjs
node tests/depth-browser.cjs
```

Las pruebas de navegador requieren Playwright y Chromium en el equipo de desarrollo;
el juego y los servidores no necesitan instalar esos paquetes. La caché solo sirve
el juego: nunca sustituye, guarda ni borra localStorage.


## Capturas revisadas
[Inicio móvil](capturas/titulo-movil.png) · [Vertical](capturas/movil-vertical.png) ·
[Horizontal](capturas/movil-horizontal.png) · [Tableta](capturas/tableta.png) ·
[Escritorio](capturas/escritorio.png). Las dimensiones de viewport están en CSS px;
las capturas de dispositivos de DPR 2 contienen el doble de píxeles por eje.
Contraste mínimo del texto base/secundario sobre las superficies: 6,98:1.
