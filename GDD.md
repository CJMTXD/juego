# El umbral — título de trabajo

## Visión y estado
Bullet hell roguelike cenital original para PC: Canvas + módulos JavaScript + CSS,
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
- Veinte ítems, cinco recetas automáticas sin consumir piezas y cinco sets que suman
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
