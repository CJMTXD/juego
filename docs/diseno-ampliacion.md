# Ampliación del ciclo — diseño y comprobación

Se conserva la campaña, 640×360/120 Hz, pools y paleta. Se amplían módulos sin
sustituir sistemas existentes. Guardado externo v3; datos nuevos opcionales con
subversión 1 y validación. Publicación autorizada por la última frase del encargo.

## Fase 0 · Acceso y visibilidad
Minimapa permanente ya implementado: comprobar su presencia real, añadir mundo y
salas al invalidar su caché, recalcular al volver a la arena. Urnas ya implementadas:
acceso directo desde título. Aviso de actualización pendiente fuera del combate,
con activación explícita, sin reiniciar una partida ni borrar guardados.
Pruebas: cuatro viewports, doce variantes de entrada, 5/130 s y barra del jefe.

## Fase A1–A3 · Arquitectura de salas y encuentros
Ocho geometrías por mundo (48 configuraciones con materiales regionales), elegidas
por semilla/tipo. Corredor central horizontal y vertical libres, puertas despejadas;
jefes sin obstáculos centrales. Hasta 8 elementos por sala: pilares, abismos y
vasijas destructibles (2 PV, 1 ficha, una vez). Jugador/enemigos resuelven ejes;
balas usan segmento contra caja expandida; abismos bloquean cuerpos, no proyectiles.
Marcas élite: 6 tipos, una o dos, sin cadenas infinitas de divisiones. Reflejo y
anillo de muerte avisan 0,8 s, suprimen emisiones a menos de 60 px; anillo con hueco.
Rango D/C/B/A/S: tiempo, vida perdida, roces; 0–3 fichas, +1 cada 3 perfectas.
Asistencia excluye rangos. Pruebas de corredores, colisiones rápidas, determinismo,
marcas y topes; bot con esquiva y sin invulnerabilidad informa sin certificar justicia.

## Fase A4–A7 · Desvíos y equipo
Rival opcional en una rama extra conectada: equipo anterior validado, máximo 3 ítems,
vida/daño/velocidad acotados. 4 ecos extra y un recuerdo al vencer; sin rival diario.
Velas: ranura + 3 en cola, C reasignable; calma radio 100, reflejo un golpe,
tiempo ×0,6 durante 3 s, ceniza cura 1. Botón fuera del campo, cuatro acciones en 2×2.
Familiares: máximo 2, escudo orbital (1 bloqueo/2 s), apoyo (1 daño/1 s), recolector
(+1 ficha/vasija), señalador (+8% daño a un blanco); tiendas/juicios y catálogos de urna.
Fusión: rama opcional, 8 parejas curadas, consume ambas armas, 3 formas a 40/100 bajas;
no se vende ni entra al botín normal. Se descubre en Armería. Pruebas de adquisición,
consumo, atribución, límites de pools y guardado del rival.

## Fase B · Persistencia y retos
Maestría cosmética por bajas reales de arma (100/500/1500), victorias por alma.
Tres objetivos secuenciales propios por alma; epílogo/aspecto y pasiva +2% de carga
por roce al completar, solo normal. Rangos de perfil por ecos gastados y partidas.
Espiral opcional tras victoria: recicla 6 mundos, vida +12% por vuelta hasta +120%,
velocidad +2% hasta +16%, 3 ecos por mundo; récord sin ventajas permanentes.
Reto semanal por lunes UTC, catálogo igual, sin árbol/urnas/asistencia, tres mutadores
curados (menos curación, enemigos resistentes, arma rotativa); cobro semanal único.
Pruebas de fronteras UTC, aislamiento, migración, liquidación única y topes.

## Fase C–D · Presentación y robustez
Escenas de 3 paneles por transición, introducción y finales: pixel art reutilizado,
texto corto, omisión sin espera y movimiento reducido. Música por mundo existente
ampliada con intensidad por balas, refugios silenciosos, volumen separado música/efectos.
Exportación JSON/código con SHA-256, límite 256 KiB, versión, validación y vista
previa; confirmación, copia anterior antes de importar. Nunca importar durante combate.
Asistencia normal: balas ×0,7–1, vida +1, cura +1 en refugio, hitbox ×0,8;
progreso conservado, sin marcas/rangos/retos. Resultado PNG local con semilla/equipo.
Bot: estrategia de movimiento evaluando balas/obstáculos, sin invulnerabilidad;
JSON de resultados y tabla en balance. No demuestra por sí solo que todo patrón
sea esquivable por humanos. Pruebas de integridad, corrupción, respaldo, aislamiento,
PNG, consola, PWA, cuatro tamaños y regresiones existentes.

Verificación A1–A3: 73 pruebas, navegador y campañas favorables completos pasan.
Bot de supervivencia añadido antes de terminar la fase para comprobar contenido
nuevo desde ahora; no necesita esperar al pulido. Ocho geometrías reutilizadas con
materiales regionales: 48 configuraciones, no 48 planos dibujados independientemente.

Verificación A4–A7: 76 pruebas, adquisición/colas/fusión real/migración del rival;
campo estable en doce variantes. El rival interpreta tres recuerdos como +3 PV
por pieza dentro del tope160; no reproduce todas las sinergias del jugador. Las ramas
extra no sustituyen tiendas/juicios previos y solo aparecen donde cabe conexión válida.
Los dos familiares básicos siempre pueden ofrecerse; dos adicionales se abren en urnas.

Verificación B:79 pruebas y recorridos existentes. Espiral comienza una partida
nueva desbloqueada por victoria; cada seis mundos añade presión hasta los topes.
Reto semanal reutiliza el bloqueo de preparación de la diaria y lleva identidad
semanal propia para el cobro. Familias/árbol/urnas no se transfieren al perfil neutral.
