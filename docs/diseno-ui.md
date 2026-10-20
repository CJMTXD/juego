# Diseño de interfaz — El umbral

## Alcance y auditoría
Esta entrega termina en la fase 5 para pruebas del usuario. Fases 6–8 pendientes:
rediseño completo de tarjetas secundarias, arte/pulido final y rendimiento en equipos
móviles reales. No cambian reglas, daño, enemigos, progresión ni pools.

Problemas encontrados: #panel está dentro de un canvas lógico 640×360, con overflow
auto; body también desplaza. .layout reserva 640 px + columna, imposible en teléfonos.
Hay siete botones de igual peso, preparación dispersa entre título/draft/keepsake,
fuentes de 10–12 px y contraste bajo. input.js solo trata ratón y teclado; coordenadas
pointer usan dimensiones visuales sin distinguir multitáctil. resize() presupone
640 px y un margen vertical fijo. Los servidores solo escuchan loopback y no hay PWA.
El guardado v3 debe conservarse: nuevas preferencias son opcionales y validadas.

## Sistema de diseño
- Fondo #17151C, panel #27232D, superficie #38343F, texto #EEE1BF, secundario #D3C3A1.
  Acento funcional #A2E1E8; no usar #948995 como texto pequeño. Texto AA: 4,5:1 mínimo.
- Región: infierno #FF922E, purgatorio #A2E1E8, paraíso #EEE1BF. Acento regional
  solo en marcos/etiquetas; no alterar colores de amenaza ni dibujar sobre el combate.
- Consolas / Courier New / monospace del sistema, sin fuentes externas ni licencia
  adicional. Texto normal 16 px, apoyo mínimo 14 px, título responsive 32–72 px.
- Objetivos táctiles 44×44 px mínimo; acciones de combate 52–72 px. Separación 8 px.
- Marcos de escalones, borde 2 px, sombra dura, estado seleccionado explícito + marca,
  presionado desplazado 2 px, bloqueado con etiqueta (no solo color). Foco cian 3 px.
- Iconos originales en matrices de 8×8/16×16, SVG local generado, bordes sin suavizar:
  corazón, esquiva, habilidad, ecos, arma, mochila, mapa, cada tipo de sala y navegación.
  Siempre acompañados de nombre accesible; decorativos aria-hidden.
- Transición corta 120–180 ms; respetar reducir efectos y prefers-reduced-motion.
- Sonidos suaves de selección/confirmación/regreso usan audio sintetizado existente.

## Arquitectura
src/input.js traduce teclado/ratón. src/ui/touch.js traduce punteros independientes
a las mismas teclas/acciones y coordenadas de apuntado. simulation.js y render.js
conservan su resolución lógica y reglas. src/ui/ controla pantallas, HUD, dibujos e
integraciones del navegador. Escala CSS conserva 16:9; simulación siempre 640×360. El bitmap se adapta al DPR
(hasta ×2) y al detalle elegido (×1/×0,5); no cambia coordenadas, hitboxes ni velocidad.
Los menús son DOM.
Sin body scroll en combate; una sola zona de scroll por pantalla de menú; paneles
largos no se anidan en el campo. Cambiar pantalla y orientación limpia entradas/reloj.

## Esquemas de pantalla
Escritorio, título: [paisaje de ascenso | EL UMBRAL / Jugar / Diaria / progreso]
[barra: Santuario · Armería · Códice · Personajes · Opciones]. Sin campo ni HUD detrás.
Teléfono: título compacto, Jugar, Diaria, progreso y navegación de dos/tres columnas.

Preparación: [Atrás · Preparar ascenso · Comenzar (fijo)]
[1 Personaje — 2 Arma — 3 Reglas] [resumen editable de selecciones anteriores]
[Pestaña elegida: tarjetas de almas / tres armas / dificultad y pactos plegados].
Dos toques desde título: Jugar → Comenzar con lo último seleccionado, arma personal
por defecto si la opción previa no está en las tres. Elección inicial de mejora se
mantiene después de Comenzar; no se elimina ninguna recompensa del juego.

Combate escritorio: [vida | esquiva | habilidad | reloj | pausa]
[campo 16:9 centrado; sin columnas laterales ni controles sobre amenazas]
[arma + progreso | alternativa | Mapa | Mochila]. Ayuda narrativa breve, no bloque fijo.
Mapa/mochila: pantalla pausada con Volver; mapa 5×5, leyenda plegable, ítems con detalle.

Combate vertical: HUD compacto / campo 16:9 arriba / arma y utilidades / controles
abajo; joystick izquierdo y acciones derechas. Horizontal: HUD y arma compactos,
campo centrado entre carriles laterales de control. El dedo no tapa amenazas.
Tableta: igual horizontal o vertical según espacio, con zonas seguras y 100dvh.

Pantallas secundarias: cabecera y Atrás fijos, contenido en un único scroll. En esta
entrega se adapta su contenedor y legibilidad; rejillas/filtros finales quedan fase 6.
Pausa: Continuar principal, Mapa/Mochila/Opciones secundarios, Abandonar separado.
Resultado: resumen existente con retorno al Santuario; no se modifica la economía.

## Entrada móvil y opciones
Joystick flotante con pointer capture por dedo y zona muerta. Botones independientes
para esquiva/habilidad/cambio. Autoapuntado al enemigo activo más cercano por defecto;
modo manual usa joystick derecho y disparo automático. Teclado/ratón conservan preferencias.
Opciones: modo táctil automático/siempre/nunca, zurdo, escala, opacidad, margen,
apuntado, vibración, rendimiento y escala visual. Los valores se guardan y validan.
Gestos bloqueados solo en juego/controles; listas de menú siguen desplazándose.
Pausa en blur/visibility/orientación, sin reanudación automática. Pantalla completa y
Wake Lock sujetos al navegador; PWA/offline necesitan HTTPS (GitHub Pages o localhost).
Wi-Fi HTTP permite jugar; instalación y Wake Lock pueden no estar disponibles allí.

## Glosario uniforme
| Término visible | Significado |
|---|---|
| Jugar | Preparar una partida usando las selecciones anteriores |
| Ecos | Moneda permanente, se gasta entre partidas en el Santuario |
| Fichas | Moneda temporal de tiendas; se pierde al terminar |
| Esquiva | Desplazamiento rápido con invulnerabilidad breve (antes «impulso») |
| Habilidad (Poder en el botón táctil) | Poder del personaje; se carga pasando cerca de balas sin recibir daño |
| Roce | Pasar cerca de una bala; cada bala carga una sola vez |
| Hitbox | Punto central que recibe impactos, menor que el dibujo del personaje |
| Evolución | Cambio de comportamiento del arma al sumar bajas propias |
| Nivel de arma | 1–4; objetivos acumulados de 100, 250 y 500 bajas |
| Salas superadas | Combates terminados de los ocho obligatorios, incluido el jefe |
| Mochila | Ítems temporales, cantidades, sets y combinaciones de esta partida |
| Códice | Registro permanente de habitantes, objetos y recetas descubiertos |
| Pacto | Reto voluntario que aumenta ecos; no es obligatorio |
| Santuario | Compras y desbloqueos entre partidas |
| Partida diaria | Misma semilla UTC para todos; sin ventajas permanentes |

## Verificación por fase
Sintaxis, HTTP, pruebas de lógica conservadas y navegador sin errores. Capturas en
390×844, 844×390, 768×1024, 1920×1080. Comprobar scroll único, controles ≥44 px,
selecciones persistentes, guardado antiguo, movimiento multitoque, acciones simultáneas,
rotación, cancelación de puntero, vuelta de foco y base /juego/ de GitHub Pages.
La emulación no sustituye pruebas de iOS/Android reales ni acredita FPS en esos equipos.


## Estado al terminar fase 5
Implementados: pantallas separadas, título animado, preparación persistente, HUD,
mapa/mochila pausados, controles táctiles independientes, autoapuntado o joystick de
apuntado, modo zurdo, escala/opacidad/margen, pausa por orientación/foco, fullscreen,
Wake Lock y vibración opcionales, modo ahorro, manifiesto/caché e inicio LAN.
Joystick de movimiento: ocho direcciones digitales normalizadas por la simulación
existente. Se conserva exactamente su velocidad; no se añadió aceleración analógica.
El modo táctil automático respeta el puntero principal de equipos híbridos; ratón y
teclado mantienen sus preferencias. También se puede forzar Siempre/Nunca.

La opacidad mínima es 0,65 y los controles nunca bajan de 44 px. Las zonas táctiles
quedan fuera del rectángulo del canvas. En horizontal reservan carriles; en vertical
se sitúan debajo. Las preferencias solo amplían el esquema v3 existente.
Ahorro: dibujo 30 FPS (simulación 120 Hz), menos efectos; detalle normal o mitad.
Automático usa memoria/CPU reportadas, cuando están disponibles. No se promete una
medición física a partir de emulación. Pantalla completa/instalación/Wake Lock varían
por navegador; gestos reservados por el sistema no se pueden garantizar bloqueados.

Pendientes por la pausa solicitada: fase 6 tarjetas/filtros completos de pantallas
secundarias; fase 7 arte y pulido finales; fase 8 perfilado en Android/iOS reales y
validación de legibilidad/rendimiento. Mando opcional queda para esa revisión.


## Claridad de compras — fase 1
Implementado: Santuario con filtros Armas/Almas/Mejoras/Ítems/Lore, imágenes, saldo,
estados y panel de confirmación antes de gastar. Armería y Códice comparten tarjetas
y detalles de armas: estadísticas base, cuatro formas y bajas acumuladas. Árbol
explica efecto actual/siguiente y probabilidades reales de rareza, no porcentajes
fijos inventados. Catálogos no omiten condiciones. Sin cambios de combate, precios,
reglas ni esquema de guardado v3. Preparación explícita pendiente en fase 2.
Verificado: 47 pruebas existentes, tres de catálogo, servidor HTTP 200 y pantallas
secundarias en cuatro tamaños sin errores de consola ni desbordes horizontales.

## Preparación explícita — implementada
Se sustituye la navegación por pestañas como acceso principal:
- Escritorio y teléfono: [Atrás | Preparar partida | Comenzar fijo].
  [Tu personaje: retrato/habilidad/Cambiar | Tu arma: icono/daño/Cambiar].
  [Ayuda descartable] [Mejora inicial: tarjetas visibles].
  [Dificultad y opciones avanzadas · N pactos activos].
- Cambiar: cuadrícula de tarjetas con Elegido, estadísticas y bloqueo explicado;
  tocar Elegir vuelve al resumen. Volver y Escape regresan sin elegir.
- Reglas: dificultad visible y Opciones avanzadas plegado para pactos, mundo y semilla.
- Santuario: [Atrás fijo] [Ecos visibles] [Armas/Almas/Mejoras/Ítems/Lore].
  Tarjeta → detalle completo → Comprar o Volver. No se compra al abrir la tarjeta.
  Las tarjetas sin saldo siguen siendo consultables; solo la confirmación está
  deshabilitada y dice Te faltan N ecos. Adquiridas al final de cada filtro.
- Armería/Códice reutilizan el componente de armas en modo consulta; las compras de
  armas se confirman en el Santuario entre partidas. La tienda conserva sus precios.

Iconos de armas: makeWeaponSprite con forma 1–4 y marcas existentes; no se inventa
un sprite nuevo por evolución. Orbitales explican radio/duración efectivos, en vez
de presentar el límite interno de recorrido 10000 como distancia de ataque.
Suerte muestra un ejemplo normalizado de raros/épicos en Brasa tenue con las tres
rareza disponibles. Cambia con dificultad y disponibilidad, no es +2% absoluto.
Ayuda de preparación: marca local independiente de presentación; no reutiliza ni
oculta las ayudas de combate. Se consulta en Opciones → Revisar ayuda de preparación.
Los selectores CSS añadidos están limitados a catálogo/preparación; estilos anteriores
conservados. No hay una segunda zona desplazable ni paneles modales anidados.

Glosario adicional: **Comprable** significa que hay saldo y aún no se adquirió;
**Te faltan N ecos** permite leer, pero deshabilita la confirmación; **Adquirida**
impide pagar de nuevo; **Elegido** señala la selección de esta preparación;
**No ofrecida esta vez** es un arma desbloqueada fuera de las tres opciones actuales.
Los textos calculados de daño se redondean a tres decimales, sin redondear simulación.

## Recuerdos nuevos — implementado
Campo estable: .arena-wrap tiene filas explícitas para HUD, sala, jefe, campo,
herramientas y dos líneas de aviso/ayuda. Una fila vacía sigue reservada aunque su
contenido se oculte. En horizontal corto, la fila de jefe reserva 48 px; en táctil
vertical, el campo conserva 16:9 por ancho. El viewport dinámico controla el espacio;
ResizeObserver escala el dibujo. No se usa el largo de un texto para decidir su alto.

Minimapa: botón independiente del flujo, con SVG de los iconos ya existentes,
conexiones, actual/visitadas y contador /8. Si hay margen amplio junto al campo,
usa 146×176; si cabe un margen compacto, 104×62. En vertical usa el espacio de sala/
jefe junto al HUD. Sin margen en horizontal, usa la fila reservada antes del campo,
entre los carriles táctiles, separada de la barra del jefe. No se superpone a la
habilidad ni a joysticks; tocar abre el mapa pausado. /8 cuenta combates y jefe.
Revelar el mapa mediante ítems no elimina la condición de entrada del archivo secreto.

Santuario/Armería/Códice/urnas: el componente compartido indica «Mejora: [arma]» con
icono y nombre, o «Afecta al personaje» / «Afecta a todas las armas». Las compras de
arma y sus recuerdos disponibles se agrupan cuando comparten destinatario, mostrando
propiedad y forma máxima registrada desde esta versión. No se inventa el historial
anterior. Los catálogos no omiten desafíos ni venden los exclusivos de urnas.

Urnas: pestaña propia; saldo y Atrás fijos. Tarjetas con precio final (incluido el
árbol), probabilidades nominales y próximas, garantías y devolución por rareza.
Resultado guardado antes de animar; animación de 0,45 s solo en el icono, omitible,
sin destellos y desactivada con reducir efectos. No hay temporizadores de presión.
La última apertura puede revisarse sin pagar. Colección 36, filtros tradición/rareza,
siluetas para faltantes; imágenes y detalle del mismo catálogo. Aspectos opcionales:
Memoria pálida usa la ropa existente; Marfil del ciclo usa dos tonos de la paleta y
no altera las balas ni estadísticas. No se amplía la paleta de 24 colores.

Glosario adicional:
- Urna de recuerdos: apertura opcional con ecos para ampliar botín o colección.
- Garantía: tras el número indicado sin cierta rareza, la siguiente apertura la asegura.
- Duplicado: recuerdo ya reunido; se convierte automáticamente en ecos.
- Crédito de evolución: progreso adicional de un arma; no es otra baja ni añade
  recompensas por enemigos. El HUD distingue bajas reales y créditos con «+».
- Fragmento: historia conocida; cuenta para una condición del final verdadero.
