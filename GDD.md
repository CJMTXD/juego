# El umbral — título de trabajo

## Visión y estado
**Estado actual:** ronda de campo/minimapa/recuerdos/urnas implementada; lista para prueba del usuario.
El historial de entregas anteriores se conserva debajo.
Las fases 6–8 de interfaz están pendientes. La campaña y el balance se conservan.

Bullet hell roguelike cenital original para PC y móviles: Canvas + módulos JavaScript + CSS,
sin motor ni dependencias para jugar. Ascenso del infierno al cielo, inspirado en
estructuras míticas, con un único más allá fragmentado por el ciclo de los recuerdos.
Esta ampliación está implementada en ocho fases con commits; respaldo inicial c1f4d66.
El objetivo de acabado comercial requiere pruebas humanas; no se afirma un premio ni
una calidad validada comercialmente. Historia confirmada/propuestas: docs/historia.md.

## Campaña implementada
| Orden | Región | Mundo | Peligro | Guardián |
|---|---|---|---|---|
| 1 | Infierno | Depósito de ceniza | Brasas | El Sellador |
| 2 | Infierno | Dársena de sal | Corriente | La Tasadora de nombres |
| 3 | Purgatorio | Terrazas del hilo | Viento | La Hilandera del intervalo |
| 4 | Purgatorio | Jardín del peso | Raíces | El Medidor de estaciones |
| 5 | Paraíso | Corte de los juramentos | Espejos | Las Dos Voces |
| 6 | Paraíso | Esfera del alba vacía | Eclipse | El Jardín que Olvida |

Tres enemigos propios por mundo; 18 patrones configurados y seis jefes de 3–5 fases.
Cada mapa conectado tiene inicio, siete combates de 2–3 oleadas, jefe y hasta dos
ramas. Un refugio y un desvío especial cuando caben dos; con una rama, es la especial.
Desvíos por mundo: tienda, juicio, desafío repetible, secreto, minijefe y altar.
Cada jefe guarda inmediatamente el acceso al siguiente mundo. Puede practicarse un
tramo ya desbloqueado; solo una victoria desde el fondo abre la siguiente dificultad.

## Combate y equipo implementados
- WASD normalizado; ratón apunta; disparo automático opcional o clic sostenido.
  Espacio esquiva, Q cambia entre dos armas, E gasta la carga de roce, Esc pausa,
  F3 muestra métricas. Siete acciones reasignables, sin conflictos.
- Cuerpo 32×32 y hitbox real radio 3–5 px según alma (Remendadora 4 px).
  Escala visual ×1/1,5/2 independiente de la colisión. Colisión barrida para balas.
- Roce: banda exterior de 15 px, +4 carga una vez por bala; excluye golpes e
  invulnerabilidad. A 100 permite habilidad de 4 s. Cinco almas: Remendadora
  (cura/despeja), Portador (escudo), Mensajera (movilidad), Tejedora (tiempo),
  Testigo (potencia). Todas conservan su arma, estadísticas y pasiva distintivas.
- Diez armas configurables y cuarenta formas, con evoluciones a 100/250/500 bajas
  atribuidas al arma que las causó. Sus contadores persisten dentro de la partida.
  Botín global limitado a armas compradas. Selección inicial de tres con estadísticas.
- Cuarenta y cuatro ítems, once recetas automáticas sin consumir piezas y cinco sets que suman
  bonos a 2/3/4 piezas distintas. Códice registra descubrimientos, ingredientes y bonos.
- Cinco superítems, uno por partida, con condiciones exigentes y desventajas. Comprar
  su catálogo no concede el objeto ni omite el reto. Manto: receta+100 bajas;
  Balanza/Corona: jefe específico sin perder vida; Telar: receta+secreto;
  Lente de nadie: receta+80 roces+dificultad 3+, a cambio de vida máxima 1.

## Santuario, recompensas y rejugabilidad
Ilar custodia la Antesala de los recuerdos. Ecos compran armas, almas, catálogos,
fragmentos, bestiario, aspectos, reintentos y cuatro ramas pequeñas. Árbol máximo:
+1 PV, +6% velocidad, +6 puntos de peso raro y -10% precios; costos crecientes.
Resumen al morir/ganar: mundo, bajas, jefes, arma usada y ecos por fuente.
Ecos: cada 8 bajas +1, jefe +4, mundo superado +3, victoria +12; derrota -35%, mínimo
1 si hubo baja/roce. Dificultad y pactos añaden bonus; liquidación una sola vez.
Cinco dificultades: Brasa tenue / Juramento / Terraza del juicio / Esfera severa /
Memoria absoluta. Solo la primera comienza abierta. Pactos voluntarios hasta cinco.
Marcas por alma/dificultad; siete logros, estadísticas y últimas 30 partidas.

Final normal tras el sexto jefe. Final verdadero: victoria desde el fondo en nivel
3+, tres fragmentos conocidos y archivo secreto visitado. Diaria por fecha UTC:
semilla y catálogo compartidos, Remendadora, sin árbol/pactos/reintentos; victoria
diaria cobrada una sola vez. No hay clasificación ni cuentas en línea.

## Balance, justicia y rendimiento
Valores comentados: src/data/balance.js, depth.js, relics.js, evolutions.js,
extras.js, weapon-balance.js, weapons.js, characters.js, worlds.js y src/data.js.
Tablas y lógica completas: docs/balance.md. No hay esperas para inflar duración.
Vida por mundo ×1/1,55/2,1/2,8/3,5/4,2; jefes 180/300/450/620/820/1080 PV.
Dificultades: vida ×1–1,55, bala ×1–1,16, ecos ×1–2,6, cura ×1–0,6 conservando
fracciones. Máximo cuatro enemigos; fases extra conservan aviso, descanso y limpieza.
Avisos de patrones 0,55–1,1 s, peligros 1,5 s y suelo seguro; apariciones a más de
125 px, proyectiles fuera de 45 px. Teletransportes solo después de su señal.
Brasa+Memoria ya no domina tanto: Memoria ×1,25 y sinergia ×1,15. Topes finales:
daño de estadísticas ×4,2, velocidad 260 px/s, vida 8 y seis orbitales simultáneos.
Pools: 128 balas aliadas, 512 enemigas, 16 enemigos y 64 partículas compartidas con
números de daño. Hijos de efectos no se propagan recursivamente; pool lleno omite
emisiones. Caché de suelo/enemigos solo del mundo actual. Simulación fija 120 Hz.

Objetivo estándar humano **15–25 minutos**, aún por validar. Simulación favorable con
invulnerabilidad/puntería perfecta: semillas 42/123/2026, 12,65/12,29/13,01 minutos;
dificultad máxima semilla 42, 21,97. Base 270 bajas: N3 por uso concentrado; N4 exige
el desafío repetible opcional. Los números no demuestran justicia para toda persona.

## Arte, sonido y accesibilidad
Pixel art cartoon original, vista cenital, cabeza grande y contorno oscuro. Matrices:
39 sprites distintos; almas/enemigos 32×32, jefes 64×64, armas 16×16, losetas 16×16.
Escala sin suavizado. Aliados cuadrados cian, enemigos rombos cálidos con borde oscuro.
Paleta fija de 24 colores, sin ampliación durante esta entrega:
#17151C #27232D #38343F #514B56 #716976 #948995 #44352F #665044
#D3C3A1 #EEE1BF #A97663 #49394F #70556E #66705A #3F7F92 #A2E1E8
#FF385D #FF922E #FFE34B #35444A #465044 #5B5668 #756F68 #A69C84.
Música/ambiente sintetizados por mundo; capa de intensidad, timbres por arma y sonidos
de impacto/daño/muerte/recompensa/evolución. Entrada breve y onda de derrota de jefes.
Silencio, música, paleta alternativa, realce de amenazas, números opcionales,
reducción de efectos, desactivar destellos y sacudida; consejos integrados no modales.

## Guardado, pruebas y decisiones de alcance
Guardado local v3 valida datos y migra v1/v2: ecos, opciones, teclas, almas, mundos y
compras antiguas de Lente/Velo. No se guarda una partida en curso. Pausa al perder
foco y reanudación manual sin saltos. No se envían datos a ningún servidor.
F3 solo métricas. ?debug=1 abre laboratorio, con guardado aparte ascenso-debug-v3,
armas/ítems/ecos/carga y salto a mundo/jefe; trucos sin recompensas ni logros.

Interpretaciones sencillas: faltando dos armas compradas, Ilar presta alternativas
solo al inicio; el arma personal también se presta sin abrirla como botín global.
Recetas activan efectos en vez de consumir piezas para no romper sets. Salas nuevas
son desvíos, no alargan obligatoriamente la campaña; el minijefe usa una variante del
habitante local con dos patrones. Diaria es local, sin tabla competitiva en línea.

44 pruebas de lógica: 1000 mapas, seis mundos, campaña completa, cuarenta formas con
daño real, guardado, condiciones de superítems, economía, dificultad, roce y pools.
Dos pruebas Chromium: compras/opciones/migración/diaria, seis desvíos, seis jefes y
final; consola sin errores. Estrés 640 balas/16 enemigos/64 partículas: mediana ~0,6 ms,
p95 ~10,9 ms en este entorno headless; no garantiza FPS de otros equipos.
Node/Python sirven HTTP 200. iniciar.bat revisado; Windows nativo no disponible aquí.

## Ejecución y próxima tarea
Windows: extraer ZIP completo y abrir iniciar.bat (Python 3 o Node.js LTS).
Pruebas y comandos de balance en README.md. Próxima tarea: jugar una campaña real
para medir dificultad, legibilidad y duración en el PC del usuario.

## Rediseño de interfaz — fase 1
Auditoría y sistema de diseño en docs/diseno-ui.md. Se conserva tipografía monoespaciada
local, aumenta legibilidad y se separarán menús de la arena. Interpretación del orden:
esta entrega termina en fase 5 para prueba del usuario; fases 6–8 quedan pendientes.
No cambia simulación ni balance. Respaldo Git realizado antes de editar. Glosario:
«Esquiva» sustituye «Impulso» y «Habilidad» explica la carga por roce.
Verificación inicial: 44 pruebas y ambos recorridos de navegador pasan. Se estabilizó
el fixture de desafío (el viento podía llevar al jugador hasta una puerta antes del
clic de repetir); no se cambió la regla de movimiento ni viaje del juego.

## Rediseño de interfaz — fase 2
Menús fuera de #stage, a pantalla completa, sin scroll del documento ni canvas que
fuerce un ancho mínimo. Escala 16:9 mediante ResizeObserver y viewport dinámico/zona
segura; se conservan 640×360 lógicos. Tipografía de 16 px, apoyo ≥14 y foco visible.
Se reemplazó la hoja de estilos de interfaz conservando todos los identificadores
que consume el controlador. Capturas de cuatro tamaños y navegador sin errores;
servidor HTTP 200. El título y HUD completos se rediseñan en las siguientes fases.

## Rediseño de interfaz — fase 3
Título con escena pixel art original animada, Jugar principal, Diaria secundaria y
navegación etiquetada. Preparación por pasos (personaje/arma/reglas) con Comenzar y
Atrás fijos; recuerda selecciones válidas en preferencias UI v3. Dos toques Jugar →
Comenzar conservan la mejora inicial: aparece preseleccionada y es editable antes de
empezar. No se consume partida ni se paga nada al salir de la preparación. La diaria
no sobrescribe las selecciones normales. Sonidos suaves respetan silencio.
44 pruebas de lógica y recorridos de navegador anteriores adaptados al flujo nuevo;
título y preparación capturados en cuatro tamaños, título sin scroll ni errores.

## Rediseño de interfaz — fase 4
Campo sin columnas: HUD de vida/esquiva/habilidad, arma con icono, nivel y progreso
separados, alternativa y botones Mapa/Mochila. Mapa e inventario abren pantalla pausada;
viajar desde mapa y volver reanudan sin acumular tiempo. Mapa 5×5 grande, iconos
originales, estado visitado/actual, leyenda plegable y explicación del contador.
Mochila con iconos/cantidades y detalle por toque/foco/cursor, efectos y recetas.
Acento por región, mensajes breves y ayuda inicial que deja de ocupar espacio.
Capturas HUD/mapa en cuatro tamaños; pruebas de navegador recorren seis mundos,
desvíos y final sin errores. No se cambiaron simulación, estadísticas ni guardado.


## Rediseño de interfaz — fase 5
Controles táctiles con captura por dedo: joystick flotante de ocho direcciones,
esquiva/habilidad/cambio simultáneos y autoapuntado al enemigo más cercano. Opción
joystick derecho, zurdo, tamaño 0,85/1/1,2, opacidad 0,65–1 y margen 0–24 px. En
horizontal, carriles fuera del campo; en vertical, controles debajo. Objetivos ≥44 px.
Disparo táctil automático sin sobrescribir la opción del ratón. Entrada limpia en
cancelación, menús, foco, pagehide y rotación. Se reanuda manualmente sin saltos.

PWA local: iconos originales, manifiesto y precaché de todos los módulos; funciona
bajo /juego/ y sin conexión después de una carga completa. Nueva versión en espera
se aplica desde Opciones; no reinicia una partida en curso. No hay sincronización
entre navegadores. Mantiene guardado local v3 con preferencias nuevas validadas y
consejos descartados persistentes. Pantalla completa, Wake Lock y vibración son
opcionales según plataforma; para instalar/Wake Lock se necesita HTTPS compatible.

Modo ahorro: dibujo a 30 FPS, efectos reducidos y bitmap opcional a media resolución;
simulación sigue a 120 Hz. Modo normal hasta 60 FPS, DPR limitado a 2. Detección de
recursos orientativa; el usuario puede cambiarla. No se tocó simulation.js, render.js,
configuraciones de combate, enemigos, armas, patrones, economía ni guardado de progreso.

iniciar.bat pasa --lan al servidor elegido; Python/Node imprimen la dirección Wi-Fi.
MIME del manifiesto/iconos corregidos en ambos. GitHub Actions publica solo archivos
del juego, con rutas relativas. No se requieren frameworks ni paquetes para jugar.

Verificación: 47 pruebas de lógica/migración; dos recorridos de combate completos;
UI/título/preparación/HUD/mapa y cinco pantallas secundarias en 390×844, 844×390,
768×1024 y 1920×1080; capturas revisadas. Multitáctil Chromium real emulado, acciones
simultáneas, apuntado, zurdo, tamaño grande, márgenes, cancelación, foco/rotación y
PWA offline bajo /juego/ comprobados. Node y Python LAN responden HTTP 200.
La emulación no sustituye un teléfono real; rendimiento físico y .bat nativo pendientes.
Se detiene aquí, conforme a la fase 5: fases 6–8 y mando opcional quedan planeados.
Próxima tarea: probar una partida en escritorio y celular antes de continuar el rediseño.

Publicación: se integra la acción static.yml creada por el usuario durante el trabajo.
Se conserva su configuración de Pages; se limita el artefacto a archivos del juego
para evitar despliegues duplicados y publicar únicamente los recursos necesarios.


## Claridad de compras — fase 1
Implementado: Santuario con filtros Armas/Almas/Mejoras/Ítems/Lore, imágenes, saldo,
estados y panel de confirmación antes de gastar. Armería y Códice comparten tarjetas
y detalles de armas: estadísticas base, cuatro formas y bajas acumuladas. Árbol
explica efecto actual/siguiente y probabilidades reales de rareza, no porcentajes
fijos inventados. Catálogos no omiten condiciones. Sin cambios de combate, precios,
reglas ni esquema de guardado v3. Preparación explícita pendiente en fase 2.
Verificado: 47 pruebas existentes, tres de catálogo, servidor HTTP 200 y pantallas
secundarias en cuatro tamaños sin errores de consola ni desbordes horizontales.

## Claridad de preparación — fase 2
Implementado: bloques simultáneos Tu personaje / Tu arma, botones explícitos de
cambio, cuadrículas con Elegido y bloqueos, mejora inicial visible, dificultad y
opciones avanzadas plegadas con contador de pactos. Comenzar y Atrás permanecen en
la cabecera. La selección vuelve al resumen y entrar al Santuario conserva equipo,
mejora y semilla escrita; las compras actualizan el perfil preparado sin renovar
ofertas gratis. La regla de tres ofertas/préstamos/reintentos se conserva.
La ayuda inicial descartable utiliza una marca local de presentación independiente
(el-umbral-preparation-help-v1, separada para laboratorio), sin ampliar el guardado
v3 ni sus preferencias. Opciones permite revisar la explicación. La ayuda de cambio
de arma lee la tecla asignada y muestra el botón en dispositivos táctiles.
No se modificaron HUD, textos/ayudas de combate, controles, simulación ni datos.
Pendiente: comodidad en teléfonos físicos; el rediseño general de fases 6–8 sigue
fuera de esta tarea. No se sube a GitHub: se respeta la regla específica sin push.

## Cierre de claridad — implementado y comprobado
51 pruebas de lógica, ocho recorridos de navegador y PWA pasan. 56 capturas en cuatro
tamaños documentadas en docs/pruebas-ui.md. Se conservan idénticos al respaldo los
27 archivos de combate/datos/guardado, el HUD, el bucle de juego y el CSS anterior.
Las estadísticas de daño calculadas se redondean a tres decimales solo al mostrarlas.
La semilla escrita se valida incluso al comenzar desde el resumen; nunca se guarda
una partida en curso. Pendiente: prueba humana de comodidad en dispositivos reales.

## Recuerdos nuevos — fase 1 implementada
Reproducido: 844×390 pasaba de 468×263 a 397×223 al mostrar el jefe.
La arena usa filas reservadas para HUD, sala, jefe, avisos y ayudas. Ocultar textos
no redistribuye el espacio del campo; solo viewport/orientación lo cambian.
Prueba field-stability: inicio/5/130 s, aviso, jefe y mapa, cuatro tamaños con ratón
y táctil, rotación y altura variable. Lógica previa y PWA pasan. Contenido pendiente.

## Recuerdos nuevos — fase 2 implementada
Minimapa permanente con iconos compartidos, conexiones visibles, sala actual,
visitadas y contador /8. Usa el margen si caben 156 px; en vertical ocupa el espacio
reservado junto al HUD y en horizontal compacto la barra superior. Nunca invade el
rectángulo del canvas ni mueve sus filas. Un toque abre el mapa pausado con leyenda.

## Recuerdos nuevos — fase 3 implementada
Tarjetas y detalles identifican Mejora + icono/nombre para armas concretas; el resto
indica personaje o todas las armas. Se registra la forma máxima observada por arma
como extensión opcional de meta en v3, sin atribuir logros antiguos no registrados.
Armería/Códice comparten componentes. 51 pruebas y cuatro tamaños de menús pasan.

## Recuerdos nuevos — fase 4 diseñada, aún no implementada
Base en docs/diseno-contenido-nuevo.md: 24 ítems (9 de urna), seis recetas, sets
ampliados sin cambiar sus escalones y dos urnas de 6/12 ecos. Garantías y duplicados
explícitos; sin dinero real ni presión. Se conserva v3 con extensión opcional validada.

## Recuerdos nuevos — fase 5 implementada
24 ítems configurados, 6 recetas sin consumir piezas y sets con 8–9 piezas por
tradición. Nueve ítems de urna permanecen bloqueados hasta fase 6; no se venden
individualmente. Cuatro desvíos conceden su ítem una vez al aceptar/completar el reto.
Códice progresivo, iconos matriciales distintos, detalle de obtención y arma afectada.
Tres servicios renovables completan ofertas agotadas. Pruebas de 50 campañas y
balas reales comprueban efectos/topes. Balance y duración simulada en docs/balance.md.

## Recuerdos nuevos — fase 6 implementada
Dos urnas opcionales de Ilar, 6/12 ecos base (descuento del árbol respetado).
Probabilidades nominales y de la próxima apertura, garantías persistentes por tipo,
duplicados convertidos en 1/3/6 ecos. Se guarda el resultado antes de animar; se
puede omitir y revisar la última apertura. Colección de 36 con filtros/siluetas,
nueve ítems exclusivos que solo amplían botín, aspectos opcionales y cartas/fragmentos.
Guardado sigue v3, con extensión urns versión interna 1 validada y migración sin
borrar datos anteriores. Diaria excluye ítems de urna y usa árbol vacío.
Pruebas: 200000 sorteos nominales por urna; 20000 aperturas por tipo con todos los
costos, garantías y duplicados comprobados; navegador en cuatro tamaños.

## Recuerdos nuevos — cierre de fase 7
Implementadas las siete fases de esta ronda: campo estable, minimapa permanente,
destinatario de compras, diseño, 24 ítems, seis recetas y urnas/colección de 36.
Se ajustan Sal y Sol para conservar utilidad al evolucionar. Se evita recorrer y
crear listas de progreso de armas cada fotograma: se sincronizan al descubrir,
disparar por primera vez o evolucionar. Pools y ataques enemigos se conservan.
Guardado v3 y preferencias previas se mantienen; extensión urns versión interna 1.
Próxima tarea: prueba humana de una partida en móvil; duración humana 15–25 minutos,
comodidad física y comportamiento de la barra del navegador siguen por validar.
Esta ronda termina con commits locales y sin push conforme a la instrucción específica.

Corrección de aislamiento: comprar en el Santuario desde una preparación diaria
conserva su identidad, árbol vacío y exclusión de ítems de urna. Las compras sí
actualizan el grupo de botín de una preparación normal, sin renovar sus tres ofertas.

## Ampliación del ciclo — fase 0
Minimapa y urnas existen y pasan las doce variantes de tamaño/entrada. No se
reprodujo su ausencia con recursos actuales; una versión antigua instalada es una
posibilidad, no una causa confirmada del dispositivo del usuario. Se corrige la
invalidación del mapa entre mundos/contador, se reposiciona al volver al combate,
se añade acceso directo a Urnas y aviso de versión pendiente en el título.
Diseño de esta ronda: docs/diseno-ampliacion.md. 69 pruebas base pasan.

## Ampliación — A1–A3 implementados
48 configuraciones de sala (ocho geometrías compartidas con seis materiales),
colisiones barridas contra pilares, abismos infranqueables y vasijas con fichas.
Puertas/pasillos centrales libres. Seis marcas élite con máximo dos, aviso de 0,8 s,
división sin recursión y proyectiles suprimidos a menos de 60 px. Rangos D–S con
0–3 fichas y +1 cada tres perfectas. Se conserva el campo estable y los pools.
73 pruebas pasan; bot de supervivencia sin bloqueos >180 s en tres semillas,
muere entre salas 5–8: es una estrategia limitada, no prueba de balance humano.
El comprobador anterior, que permanecía inmóvil, ahora navega alrededor de pilares.
Campañas favorables completas y prueba de navegador pasan. Resto de bloques pendiente.

## Ampliación — A4–A7 implementados
Rival opcional en rama adicional del mundo 2; usa retrato/arma de la última partida,
retiene hasta tres recuerdos como resistencia acotada (+3 PV por pieza), sin copiar
sinergias potencialmente infinitas. 60+18/mundo PV, máximo160, daño1, aviso1s.
Cuatro velas (C reasignable/botón) con ranura+cola3, cada tres salas y tienda3 fichas.
Cuatro familiares, máximo2, tienda/juicio6 fichas; dos catálogos nuevos en urnas.
Las urnas conservan precios, garantías y probabilidades por rareza; colección38.
Fusión en ramas de mundos3/5: ocho parejas, sacrificio explícito, tres formas40/100;
catálogo separado de las diez armas normales. Historial del rival guardado en
meta.journey versión1 dentro del v3. No altera ni borra compras previas.
76 pruebas pasan, navegador sin errores, campo estable en doce variantes. Bot sin
bloqueos; límites de piscinas conservados. Reto/maestría/presentación aún pendientes.
