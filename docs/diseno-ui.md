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
integraciones del navegador. Escala CSS conserva 16:9; backing de 640×360 conserva
píxeles nativos y evita cambiar el tamaño de simulación según DPR. Los menús son DOM.
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
| Habilidad | Poder del personaje; se carga pasando cerca de balas sin recibir daño |
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
