# Balance y datos de la campaña

Fuente editable: src/data/balance.js, worlds.js, weapons.js, characters.js y src/data.js.
Unidades: px, segundos y radianes. Estos son valores de la versión, no un balance
validado con una población de jugadores. Ningún reloj obliga a esperar para alargar la partida.

## Curva de los seis mundos
Cada mundo: inicio, 7 salas de combate de 2–3 oleadas, jefe y hasta 2 refugios.
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
| Media luna del retorno | boomerang | 1.5 | 1 | 0.55 | 280 | 1000 | 2.73 | common |

Dos ranuras. Cada arma conserva su recarga al alternar, así que Q no permite
eludir la cadencia. Máximo 6 orbitales; pools llenos omiten emisiones.
Brasa (+25%, máx.4), Pulso (+12%, máx.4), Suela (+12%, máx.3), Vasija (+1 PV,
máx.2), Eco partido (dos laterales al 25%, máx.2), Aguja (+1 penetración,máx.2),
Agua (+2 vida,máx.9), Memoria (×1,5,máx.1), Lente (+30% velocidad y 10% daño,máx.2),
Velo (+0,5 s de invulnerabilidad,máx.1). Daño de estadísticas limitado a ×3,6 antes
de bonificaciones de acceso a mundos o pasivas. No se acumulan multiplicadores por recalcular.

En orbital/área, Eco añade 12% de daño por nivel en lugar de duplicar áreas enteras.
En orbital/área/rayo, Aguja añade 8% por nivel para no ser inútil con penetración amplia.
Los ecos laterales no repiten toda una ráfaga ni cada perdigón.
Sinergias de dos armas: Sal+Voz reduce dispersión 20%; Moneda+Astrolabio añade un
rebote (máx.3); Luz+Aguja añade penetración; Tinta+Sol añade daño 10%.
Brasa+Memoria añade ×1,35, sujeto al límite de estadísticas.

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
Una sala = 1 eco; victoria completa = 6 adicionales. Lente cuesta 5, Velo 10.
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
