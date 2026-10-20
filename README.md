# El umbral — ascenso de seis mundos

Bullet hell roguelike cenital original en Canvas, JavaScript y CSS, sin motor ni paquetes
para jugar. Seis mundos del infierno al cielo, 18 enemigos, seis jefes, cinco personajes,
diez armas con cuarenta formas, 44 ítems, once recetas, cinco superítems, cinco dificultades,
santuario y desbloqueos guardados en el navegador.

## Jugar desde la web o el celular

Abre [El umbral en GitHub Pages](https://cjmtxd.github.io/juego/).
**Jugar → Comenzar** usa tus selecciones anteriores; puedes cambiarlas en la preparación.
En celular, arrastra en la zona de movimiento y usa Esquiva, Poder y Cambiar. Dispara
automáticamente hacia el enemigo más cercano. En Opciones puedes activar joystick
derecho, modo zurdo, tamaño, opacidad, margen y ahorro de rendimiento.

Mapa y Mochila pausan la partida; cerrar vuelve al combate. Rotar o perder foco
pausa y requiere reanudar manualmente. El modo móvil no cambia tus teclas ni la opción
de disparo del ratón. Mando queda pendiente.

Para instalar: menú del navegador → Instalar aplicación; en iPhone, Compartir →
Añadir a inicio. Espera la primera carga completa con conexión para disponer de
caché offline. Instalación, pantalla completa y pantalla encendida dependen del
navegador. Opciones → Buscar actualización aplica una versión nueva sin interrumpir
el combate. Cada navegador/dirección tiene su propio guardado; no hay nube compartida.

## Jugar en Windows

Descarga [el ZIP del juego](https://github.com/CJMTXD/juego/archive/refs/heads/main.zip),
extrae todo y ejecuta `iniciar.bat`. También puedes usar **Code → Download ZIP** en GitHub.
Desde PowerShell en esta carpeta:

```powershell
.\iniciar.bat
```

Necesitas **Python 3** (activa Add Python to PATH al instalar) o **Node.js LTS**.
El lanzador detecta cualquiera y abre el navegador cuando el servidor está enlazado.
También muestra `Celular en la misma Wi-Fi: http://...:8000`: abre esa dirección en
el teléfono conectado a la misma red. Si Windows solicita permiso, permite la red
privada para este servidor. La dirección Wi-Fi HTTP permite jugar; para instalar y
usar funciones que exigen HTTPS, utiliza GitHub Pages.
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
node --test tests/game.test.mjs tests/depth.test.mjs tests/ui.test.mjs
```

Prueba opcional de interfaz con Playwright y Chromium ya instalados:

```powershell
node tests/browser.cjs
node tests/depth-browser.cjs
node tests/ui-layout.cjs
node tests/ui-flow.cjs
node tests/ui-screens.cjs
node tests/mobile-browser.cjs
```

Herramientas de balance (sin paquetes):

```powershell
node scripts/check-pwa.mjs
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


## Estado del rediseño
Entrega hasta la fase 5, lista para prueba del usuario. Quedan fases 6–8: diseño
completo de tarjetas secundarias, pulido final y rendimiento en teléfonos reales.
La campaña y las reglas existentes no se modificaron. Diseño y glosario en
[docs/diseno-ui.md](docs/diseno-ui.md); validación en [docs/pruebas-ui.md](docs/pruebas-ui.md).

Compras claras: abre Santuario, elige una sección y toca una tarjeta para leer el
panel completo. Solo «Comprar por N ecos» gasta moneda. Armería y Códice muestran
las mismas estadísticas y evoluciones de armas. Precios y guardado v3 sin cambios.

Al pulsar **Jugar**, usa **Cambiar personaje** o **Cambiar arma** en los dos bloques
superiores. La mejora inicial está debajo. **Comenzar** siempre está arriba; puedes
entrar con Jugar → Comenzar. Desde una opción bloqueada puedes ir al Santuario y
volver sin perder tus elecciones. Dificultad y opciones avanzadas agrupan los pactos,
el mundo y la semilla. La ayuda se consulta en Opciones.

Esta entrega se guarda con commits locales, sin push por la instrucción específica.
Windows: abre `iniciar.bat`. No requiere nuevas dependencias para jugar.

Verificación de esta entrega: 51 pruebas de lógica, ocho recorridos de navegador y
PWA correctos. [Capturas de los menús](docs/capturas/claridad/README.md) y resultados
en [docs/pruebas-ui.md](docs/pruebas-ui.md). El combate y el guardado se conservan.

### Campo, minimapa y recuerdos nuevos
El campo ya no cambia de tamaño al ocultar ayudas o mostrar al jefe. El minimapa
permanece visible sin ocupar el campo: tócalo para abrir el mapa completo pausado.
Santuario, Armería y Códice identifican el arma concreta o el destinatario de una mejora.

Hay 24 ítems nuevos y seis recetas, con efectos, condiciones y riesgos configurados.
Santuario → **Urnas** abre dos urnas opcionales con ecos (6/12 base). Muestra precio,
probabilidades y garantías antes de pagar; devuelve ecos por duplicados. No hay dinero
real, anuncios ni esperas. **Colección** permite consultar los recuerdos y equipar
aspectos cosméticos. Los nueve ítems exclusivos amplían el botín; no los recibes
automáticamente dentro de la partida. La diaria excluye estos ítems y el árbol.
Se conserva el guardado v3 y sus controles; no se guarda una partida en curso.

En Windows, abre `iniciar.bat` (Python 3 o Node.js LTS). No hay dependencias nuevas
para jugar. Diseño completo en [docs/diseno-contenido-nuevo.md](docs/diseno-contenido-nuevo.md).
Pruebas adicionales para desarrollo, en PowerShell con el servidor activo:

```powershell
$env:GAME_URL = "http://127.0.0.1:8040"
node --test tests/game.test.mjs tests/depth.test.mjs tests/ui.test.mjs tests/clarity.test.mjs tests/memories.test.mjs tests/urns.test.mjs
node tests/field-stability.cjs
node tests/memories-browser.cjs
node scripts/check-pwa.mjs
node scripts/weapon-balance.mjs
node scripts/campaign-balance.mjs
node scripts/item-balance.mjs
node scripts/urn-balance.mjs
```

Esta ronda queda en commits locales, sin push. Pruebas físicas de Android/iPhone y
Windows, y duración de partida con una persona, siguen pendientes.
