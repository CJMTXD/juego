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


## Claridad de compras — fase 1
Implementado: Santuario con filtros Armas/Almas/Mejoras/Ítems/Lore, imágenes, saldo,
estados y panel de confirmación antes de gastar. Armería y Códice comparten tarjetas
y detalles de armas: estadísticas base, cuatro formas y bajas acumuladas. Árbol
explica efecto actual/siguiente y probabilidades reales de rareza, no porcentajes
fijos inventados. Catálogos no omiten condiciones. Sin cambios de combate, precios,
reglas ni esquema de guardado v3. Preparación explícita pendiente en fase 2.
Verificado: 47 pruebas existentes, tres de catálogo, servidor HTTP 200 y pantallas
secundarias en cuatro tamaños sin errores de consola ni desbordes horizontales.

## Claridad de compras y preparación — fases 1 y 2
51 pruebas de lógica: las 47 previas y cuatro nuevas de catálogo/preparación.
Nuevos recorridos `tests/clarity-browser.cjs` y `tests/preparation-browser.cjs`:
cinco pestañas del Santuario y un detalle por pestaña; estados sin saldo/adquirida,
compra confirmada y sin doble cargo, tarjetas compartidas de Armería/Códice;
bloques de equipo, cuadrículas, exactamente tres ofertas, ayuda descartable tras
recarga, revisión en Opciones y regreso del Santuario sin renovar ofertas ni perder
arma, mejora o semilla escrita. Capturas en `docs/capturas/claridad/`, cuatro tamaños.
Se adaptan los recorridos antiguos a confirmación de compra y Opciones avanzadas;
se conservan sus comprobaciones de migración, diaria, seis mundos y seis jefes.

## Cierre de verificación de claridad
- Pasan las 51 pruebas de lógica y los ocho recorridos de navegador: browser,
  depth-browser, ui-layout, ui-flow, ui-screens, mobile-browser, clarity-browser y
  preparation-browser. Sin errores de consola registrados.
- Pruebas nuevas adicionales de navegador: elegir otra alma con Enter o toque,
  arma personal correcta, volver a elegir el alma actual sin perder el arma,
  tecla reasignada R, texto adaptado al modo táctil y semilla inválida después de
  volver al resumen. Una compra solo descuenta una vez.
- Sintaxis de 51 archivos comprobada y HTTP 200 en portada/módulos/service worker.
  check-pwa comprueba los 46 recursos; CACHE el-umbral-clarity-3.
- Comparación con respaldo b6e4a8e: 27 archivos protegidos idénticos, incluidos
  controles, HUD, simulación, renderizado, datos y guardado. También idénticos el
  cuerpo de updateHud, el bucle frame y las pausas automáticas de main.js.
  El CSS previo se conserva completo; solo se añaden selectores de estos menús.
- [Índice de las 56 capturas](capturas/claridad/README.md): cinco pestañas y detalles,
  evoluciones, preparación y ambas cuadrículas, en los cuatro tamaños pedidos.
  Se revisaron capturas móviles, de tableta y escritorio; no hay corte horizontal
  de texto ni scroll del documento. Las listas largas se desplazan dentro del menú.
- La emulación no sustituye una prueba física de Windows/Android/iPhone. No se
  ejecutó iniciar.bat nativamente; el servidor existente responde correctamente.

Comandos adicionales en PowerShell, con el servidor ya arrancado:

```powershell
node --test tests/game.test.mjs tests/depth.test.mjs tests/ui.test.mjs tests/clarity.test.mjs
node tests/clarity-browser.cjs
node tests/preparation-browser.cjs
```

## Ronda de campo, minimapa y recuerdos — cierre
- 69 pruebas de lógica, sin fallos ni saltos: previas + nuevos ítems/recetas, 50
  campañas de 60 ofertas, proyectiles reales, topes y progreso por arma, migración
  v1/v2/v3, urnas con versión interna 1, garantías, devoluciones y aspectos sin poder.
- Diez recorridos de navegador pasan: browser, depth-browser, ui-layout, ui-flow,
  ui-screens, mobile-browser, clarity-browser, preparation-browser, field-stability y
  memories-browser. Se conserva campaña, diaria y aislamiento de perfiles.
- field-stability reproduce el fallo anterior y comprueba inicio/5/130 s, aviso,
  jefe y minimapa sin variar dimensiones. Ratón y táctil, con autoapuntado y joystick
  derecho, cuatro tamaños; sin intersección con campo, habilidad ni controles.
  Rotación y viewport 40 px más bajo se comprueban como cambios legítimos de ventana.
- memories-browser: seis secciones del Santuario, apertura, duplicado, detalle,
  colección/filtros, última apertura tras recarga, ítem específico y minimapa que
  abre mapa pausado. Compra desde preparación diaria conserva identidad y árbol
  vacío; los desbloqueos de urna no se transfieren a esa partida diaria.
- 200000 sorteos nominales por urna y 20000 aperturas por tipo con comprobación en
  cada apertura; además urn-balance imprime 50000 por tipo con/sin garantías.
- check-pwa valida 52 recursos, rutas relativas y caché el-umbral-memories-8.
  Sintaxis: 67 archivos. HTTP 200: portada, módulos nuevos y service worker.
  weapon-balance, campaign-balance, item-balance y urn-balance ejecutados.
- Estrés Chromium con los 44 ítems y pools llenos (128/512/16/64), 240 pasos de
  simulación+dibujo: mediana 0,60 ms, p95 12,10 ms en este entorno. Pools conservan
  tamaño e identidad. No se infiere FPS de teléfonos a partir de esta medición.
- [48 capturas actuales](capturas/recuerdos/README.md), en 390×844, 844×390,
  768×1024 y 1920×1080. Revisadas: controles fuera del campo, mapa sin tapar
  habilidad/joysticks, precio/garantías legibles y detalles sin recorte horizontal.
  Etiquetas del HUD conservan las elipsis anteriores; el texto completo sigue en
  el DOM y el mapa ampliado permite consultar el contexto. Menús usan un solo scroll.

Pendiente de prueba humana: comodidad real de joysticks, barra del navegador móvil,
rotación/llamadas en Android/iPhone, Windows nativo y duración humana 15–25 minutos.
La ronda se detiene aquí para esa prueba, con commits locales y sin push.

## Ampliación del ciclo
82 pruebas de lógica; suite de navegador existente y nueva `expansion-browser.cjs`.
Tamaños390×844,844×390,768×1024,1920×1080. Capturas nuevas:
`docs/capturas/ampliacion/`: combate/minimapa, retos, transferencia/vista previa,
transición y resultados. Verificados multitoque, modo zurdo, controles grandes,
apuntado manual, pausa, campo estable, PWA offline y rutas bajo /juego/.
La prueba nueva descarga un PNG960×640 y confirma importación/respaldo y perfil
semanal sin árbol/asistencia. Catálogo de urnas actualizado de36 a38 recuerdos.
Fixture de desvíos identifica por tipo (existen nuevas ramas de fusión/rival) y
navega alrededor de cobertura. No se eliminan los obstáculos para hacerlo pasar.
Pendientes: pruebas humanas en Windows, Android/iPhone físicos y duración15–25min.
