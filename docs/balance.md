# Balance y datos de la campaña

Fuentes editables: src/data/balance.js, depth.js, relics.js, evolutions.js, extras.js,
weapon-balance.js, worlds.js, weapons.js, characters.js y src/data.js.
Unidades: px, segundos y radianes. Estos son valores de la versión, no un balance
validado con una población de jugadores. Ningún reloj obliga a esperar para alargar la partida.

## Curva de los seis mundos
Cada mundo: inicio, 7 salas de combate de 2–3 oleadas, jefe, un refugio y un desvío especial cuando el mapa permite dos ramas.
Los dos primeros limitan a 2 enemigos simultáneos; después a 3. La vida sube más
que la velocidad para no exigir reflejos cada vez más extremos. Los avisos crecen
en los patrones más complejos. Las mejoras acompañan el incremento de vida.

| Mundo | Vida común × | Velocidad de bala × | Máx. enemigos | Vida jefe | Mecánica |
|---|---:|---:|---:|---:|---|
| Depósito de ceniza | 1 | 1 | 2 | 180 | embers / marks |
| Dársena de sal | 1.55 | 1.04 | 2 | 300 | tide / tide |
| Terrazas del hilo | 2.1 | 1.08 | 3 | 450 | wind / teleport |
| Jardín del peso | 2.8 | 1.12 | 3 | 620 | roots / charge |
| Corte de los juramentos | 3.5 | 1.16 | 3 | 820 | mirrors / echo |
| Esfera del alba vacía | 4.2 | 1.2 | 3 | 1080 | eclipse / eclipse |

Los jefes cambian al 66% y 33%, limpian balas y descansan 1,5 s. Los peligros
anuncian 1,5 s antes de activarse durante 1,5 s; luego descansan. Siempre queda
una zona de suelo segura. El suelo claro no atenúa las amenazas: contorno oscuro
y rombos cálidos se dibujan después del fondo y de los efectos aliados.

## Personajes
| Alma | Vida | px/s | Radio | Daño × | Arma inicial |
|---|---:|---:|---:|---:|---|
| Remendadora de ecos | 5 | 170 | 4 | 1 | Aguja de ceniza |
| Portador del hueco | 6 | 145 | 5 | 0.8 | Moneda del regreso |
| Mensajera velada | 4 | 190 | 3 | 0.95 | Voz entrecortada |
| Tejedora de bruma | 5 | 165 | 4 | 0.92 | Astrolabio roto |
| Testigo del alba | 4 | 175 | 4 | 1 | Luz del testimonio |

El Portador pierde daño y velocidad por su escudo; la Mensajera tiene menos vida
por movilidad/hitbox; la Tejedora necesita combatir cerca a cambio de su aura;
el Testigo pierde su bono al recibir daño. Desbloqueos no añaden poder universal.

## Armas
DPS nominal sin mejoras, aciertos ideales de un ciclo, sin sumar penetración ni
suponer que todos los perdigones golpean a distancia. Media luna puede golpear dos
veces: su DPS práctico depende del retorno. Los orbitales requieren acercarse.

| Arma | Modo | Daño | Cantidad | Intervalo | px/s | Alcance | DPS nominal | Rareza |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Aguja de ceniza | straight | 1 | 1 | 0.2 | 360 | 650 | 5.00 | common |
| Abanico de sal | scatter | 0.6 | 5 | 0.55 | 300 | 240 | 5.45 | common |
| Voz entrecortada | burst | 1.1 | 3 | 0.65 | 420 | 520 | 5.08 | rare |
| Moneda del regreso | bounce | 1.5 | 1 | 0.35 | 300 | 900 | 4.29 | rare |
| Hilo del destino | homing | 1.1 | 1 | 0.26 | 260 | 600 | 4.23 | rare |
| Luz del testimonio | beam | 0.5 | 1 | 0.1 | 14000 | 420 | 5.00 | rare |
| Astrolabio roto | orbit | 3.5 | 3 | 2 | 0 | 10000 | 5.25 | epic |
| Tinta de la balanza | area | 5.5 | 1 | 1.2 | 0 | 270 | 4.58 | rare |
| Sol en una vasija | charge | 5.6 | 1 | 1.1 | 520 | 620 | 5.09 | epic |
| Media luna del retorno | boomerang | 1.5 | 1 | 0.55 | 280 | 1000 | 5.45 (ida+retorno) | common |

Dos ranuras. Cada arma conserva su recarga al alternar, así que Q no permite
eludir la cadencia. Máximo 6 orbitales; pools llenos omiten emisiones.
Brasa (+25%, máx.4), Pulso (+12%, máx.4), Suela (+12%, máx.3), Vasija (+1 PV,
máx.2), Eco partido (dos laterales al 25%, máx.2), Aguja (+1 penetración,máx.2),
Agua (+2 vida,máx.9), Memoria (×1,25,máx.1), Lente (+30% velocidad y 10% daño,máx.2),
Velo (+0,5 s de invulnerabilidad,máx.1). Daño de estadísticas limitado a ×3,6 antes
de bonificaciones de acceso a mundos o pasivas. No se acumulan multiplicadores por recalcular.

En orbital/área, Eco añade 12% de daño por nivel en lugar de duplicar áreas enteras.
En orbital/área/rayo, Aguja añade 8% por nivel para no ser inútil con penetración amplia.
Los ecos laterales no repiten toda una ráfaga ni cada perdigón.
Sinergias de dos armas: Sal+Voz reduce dispersión 20%; Moneda+Astrolabio añade un
rebote (máx.3); Luz+Aguja añade penetración; Tinta+Sol añade daño 10%.
Brasa+Memoria añade ×1,15, sujeto al límite de estadísticas.

## Patrones enemigos
Cantidades máximas: los anillos con hueco y la lluvia omiten balas para preservar
un corredor. El abanico fija la dirección al anunciar, no persigue después.

| Patrón | Formación | Balas | px/s base | Cada s | Aviso s | Apertura ° |
|---|---|---:|---:|---:|---:|---:|
| ring | ring | 12 | 90 | 2.6 | 0.65 | 360 |
| fan | fan | 5 | 105 | 2.1 | 0.6 | 60 |
| cross | cross | 8 | 90 | 2.5 | 0.8 | 360 |
| wave | fan | 7 | 85 | 2.8 | 0.8 | 86 |
| ribbon | sine | 3 | 85 | 2.4 | 0.85 | 34 |
| petals | gapped | 10 | 90 | 2.7 | 0.85 | 360 |
| sweep | sweep | 4 | 105 | 2.2 | 0.85 | 37 |
| weave | sine | 5 | 80 | 2.8 | 0.9 | 69 |
| lantern | fan | 4 | 80 | 2.6 | 0.9 | 57 |
| roots | curve | 8 | 80 | 2.9 | 0.9 | 360 |
| scales | cross | 8 | 100 | 2.7 | 0.9 | 360 |
| mirrorFan | fan | 3 | 90 | 2.8 | 1 | 40 |
| vortex | curve | 6 | 90 | 2.4 | 0.9 | 360 |
| judgment | gapped | 14 | 85 | 3 | 1 | 360 |
| eclipse | gapped | 18 | 85 | 3.1 | 1.1 | 360 |
| falling | ceiling | 8 | 95 | 3.2 | 1.1 | 0 |
| constellation | paired | 9 | 90 | 3 | 1 | 92 |
| spiral | spiral | 6 | 95 | 1.1 | 0.55 | 360 |

Enemigos aparecen a más de 125 px y anuncian su llegada. No se emiten proyectiles
a menos de 45 px del jugador. Embestidas y teletransportes muestran trayectoria/destino.
La lluvia deja un corredor de 130 px; los anillos finales reservan un hueco angular.
Estas reglas reducen riesgos; no prueban que toda combinación sea justa para toda persona.

## Progreso, opciones y duración
Mejoras/cofres: categorías común 70%, rara 25%, épica 5%, renormalizadas si faltan
opciones. Jefes: armas rara 65% / épica 35%. Cofre permite elegir arma o mejora.
Ecos: una unidad cada 8 bajas, 4 por jefe, 3 por mundo superado y 12 por victoria.
Se suma el bono de dificultad y pactos; al morir se resta 35%, con al menos 1 si
hubo baja o roce. No se paga por esperar quieto. Santuario: armas 8–24 ecos (Aguja gratis),
ítems 10, catálogos de superítem 30, almas 24, fragmentos 3, aspectos 12 y reintento 4.
Una campaña base de 270 bajas paga 87 ecos antes de pactos. Precios en depth.js.
El primer mundo está abierto; cada jefe desbloquea el siguiente y se guarda al instante.
Acceso a un tramo desbloqueado: +16% de daño por mundo inicial para compensar parte
del equipo ausente. No cambia una campaña iniciada desde el fondo.

Objetivo humano: 15–25 minutos para el ascenso completo. El recorrido automático
sin daño y con apuntado perfecto mide un límite favorable, no la duración humana.
Las decisiones, desplazamientos, esquiva y fallos varían la duración. La primera hora
permite practicar cada tramo desbloqueado. Aún hace falta calibración con jugadores.

## Arte y recursos
Paleta fija de 24 colores; los cinco tonos nuevos son pisos apagados, no amenazas.
#17151C #27232D #38343F #514B56 #716976 #948995 #44352F #665044 #D3C3A1 #EEE1BF #A97663 #49394F #70556E #66705A #3F7F92 #A2E1E8 #FF385D #FF922E #FFE34B #35444A #465044 #5B5668 #756F68 #A69C84

Sprites originales por matrices: personajes/enemigos 32×32, jefes 64×64, armas
16×16; losetas 16×16. Caché de suelo y enemigos solo del mundo actual. Sin PNG
externos ni suavizado; los iconos de arma tienen transparencia binaria.


## Ampliación: armas y builds
`node scripts/weapon-balance.mjs` imprime las 40 formas. Cuenta satélites al daño real,
retorno doble y cuatro pulsos sísmicos; no promete acertar todos ni suma todas las
cadenas/reflejos/quemaduras. DPS inicial ideal: 4,23–5,45; formas finales primarias
aproximadamente 6,09–9,90, más utilidades/efectos condicionados. Penetración sirve
contra grupos, no multiplica el daño al mismo objetivo. Proyectiles secundarios no
activan cadenas recursivas. Recargas individuales impiden abusar de Q.

Evolución por bajas atribuidas al arma emisora: N2=100, N3=250, N4=500. Cambiar de
arma no borra contadores. La ruta base tiene unas 270 bajas: llegar a N3 premia
concentrar el uso, N4 es un objetivo opcional del desafío repetible. No se bajaron los
umbrales solicitados. Las formas aseguran un disparo centrado para no fallar al apuntar.

20 ítems, cinco recetas sin consumo de piezas y cinco sets a 2/3/4 piezas. Las curas
por receta se limitan a 6 y robo de vida a 12 por partida. Brasa+Memoria pasa de
×2,025 a ×1,4375 antes de niveles de Brasa: menos obligatoria frente a movilidad,
penetración y utilidad. Quemadura: 8% del impacto cada 0,2 s durante 0,8 s; Carbón
extiende 0,15 s por nivel. Nunca acumula quemaduras infinitas sobre el mismo enemigo.

Topes: daño base de estadísticas ×3,6, tras sets/superítem ×4,2; velocidad 260 px/s,
vida 8, penetración de mejoras 6 y recarga mínima de impulso 0,8 s. Los efectos finales
se calculan después sobre el daño del arma, de modo que el límite no elimina su identidad.
Recalcular no aplica multiplicadores acumulativos. La Lente de nadie reduce vida a 1.

Árbol: +1 PV (18 ecos); velocidad +3% por nivel, máximo 2 (10/20); suerte +2 puntos
raros, máximo 3 (12/24/48); descuento 5% por nivel, máximo 2 (14/28). No hay un árbol
infinito de daño. Los cuatro sets egipcios descuentan 10% en tienda de fichas, no en
santuario. Junco aumenta radio orbital/alcance; Prisma da utilidad de daño al rayo.

## Dificultades y pactos
| Nivel | Vida × | Bala × | Densidad adicional | Élites | Cura × | Ecos × | Fases jefe |
|---|---:|---:|---:|---:|---:|---:|---:|
| Brasa tenue | 1 | 1 | 0 | 0% | 1 | 1 | 3 |
| Juramento | 1.12 | 1.04 | 0 | 12% | .9 | 1.35 | 3 |
| Terraza del juicio | 1.24 | 1.08 | 1 | 20% | .8 | 1.7 | 4 |
| Esfera severa | 1.38 | 1.12 | 1 | 30% | .7 | 2.1 | 4 |
| Memoria absoluta | 1.55 | 1.16 | 1 | 40% | .6 | 2.6 | 5 |

La curación fraccionaria conserva el resto. Élites: vida ×1,35, movimiento ×1,15,
intervalo ×0,9, conservando al menos aviso+0,35 s. Las fases extra reutilizan familias
con abanico lento adicional, limpian balas al cambiar y mantienen descanso. Máximo
cuatro enemigos simultáneos. Pactos: +20% movimiento, -1 PV, +1 enemigo, -25% cura o
+15% vida enemiga; bonus aditivo de ecos +15/+20/+20/+15/+20%. No encadenan daño instantáneo.

## Roce y salas opcionales
Roce a 15 px de la hitbox real más radio de bala: una vez por bala, +4 carga (Nudo y
set añaden puntos), sin contar golpes ni invulnerabilidad. A 100, E consume la carga:
cura 1/despeja 90 px, escudo, movilidad ×1,3, tiempo ×0,55 o daño ×1,25, según alma.
Base 4 s, +1 Juramento audible, +0,5 set del alba. La gracia de activación es 0,45 s.

Una ficha cada 3 bajas; Pesa suma otra. Tienda 6, altar cura 2 por 1, juicio +15% daño
por -1 PV máximo o 8 fichas por 1 daño. Secreto exige 12 roces o una receta y entrega
4 fichas una vez. Minijefe base 80 PV con dos patrones y avisos. Desafío 4 oleadas;
repetir cuesta 1 PV y aumenta vida enemiga 20% cada vez. Se puede omitir todo desvío.

## Medición reproducible de campaña
`node scripts/campaign-balance.mjs`: seis mundos, supervivencia forzada y puntería
perfecta, sin tiempo humano de decisiones ni desplazamientos. Tras corregir un
teletransporte prematuro que podía sacar un enemigo del mapa, las semillas 42/123/2026
terminan en 12,65 / 12,29 / 13,01 min en Brasa tenue (270 bajas, N3). Semilla 42 en
Memoria absoluta: 21,97 min (384 bajas, N3). No se infiere de esto una duración humana.
El objetivo estándar sigue siendo 15–25 min; necesita sesiones reales. No se obliga
a esperar ni a visitar el desafío para completar la historia.
