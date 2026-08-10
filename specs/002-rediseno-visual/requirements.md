# 002 · Rediseño visual y movimiento

**Abierta el 2026-08-03.** Estado: **en implementación**. RF-9 fue revisado por Daniel
el 2026-08-04, implementado y medido; los demás frentes conservan su estado explícito.

## De dónde sale este plan

De lo que el cliente pidió el 2026-07-31, registrado en `ESTADO.md` §5k, más el
prototipo que llegó el 2026-08-03 y que está en [`referencia/`](referencia/) con su
procedencia y sus errores anotados.

| # | Lo que pidió el cliente | Estado |
| - | ----------------------- | ------ |
| 1 | Fotos de los expositores en las fichas | Sin especificar. El prototipo lo sustituye por monogramas de iniciales |
| 2 | Programa como línea de tiempo vertical que revela las sesiones al recorrerla | Sin especificar. La **estructura** del prototipo se descarta: D7 |
| 3 | Enlace de cada sesión a la ficha de su expositor | Sin especificar. El prototipo no lo resuelve |
| 4 | Hero con más animaciones | **Implementado como RF-9:** interacción iniciada por el puntero, no animación autónoma |
| 5 | Transiciones más dinámicas entre vistas | Sin especificar |

Y uno que no pidió el cliente y que la revisión del 2026-08-03 puso por delante:

| 0 | **Rediseñar el hero.** Seis defectos medidos en [`baseline/hero-2026-08-03.md`](baseline/hero-2026-08-03.md) | **En curso:** dirección interactiva acordada; quedan los demás defectos de la línea base |

El orden importa: el punto 4 tal como está pedido —«más animaciones»— no arregla
ninguno de los seis defectos, y tres de ellos empeoran si se añade movimiento sobre lo
que ya hay. Por eso el hero entra por el punto 0 y el 4 se decide dentro de él.

## Decisiones cerradas de este plan

| # | Decisión |
| - | -------- |
| D7 | **Se descarta la estructura de agenda del prototipo**, por instrucción de Daniel el 2026-08-03 y por tres incumplimientos concretos: (a) las tarjetas de sesión pasan de `<details>` nativo a `<button aria-expanded>` con `max-height` medido en el DOM, y **sin JavaScript no abren nada**, contra RF-6.2, que hoy se cumple a 0 kB; (b) el panel de agenda con desplazamiento propio a `max-height: 70vh` mete un contenedor con scroll dentro del de la página, y el propio prototipo lo desactiva bajo 768 px y añade un párrafo que le explica al usuario cómo funciona —si hay que explicar el scroll, el patrón es el problema—; (c) altura fija en `vh` es el peor sitio para el zoom de texto al 200 % de WCAG 1.4.4, que ya produjo dos incumplimientos reales en T6. **Lo que se conserva del prototipo es la idea**: línea de tiempo vertical con eje, hora a la izquierda y resumen desplegable. La forma se resuelve en este plan |
| D8 | **El `<helmet>` del prototipo no se porta.** Carga las tres tipografías desde `fonts.googleapis.com`; el sitio las auto-hospeda y RNF-2.3 prohíbe peticiones a terceros en la carga inicial |
| D9 | **El hero usa una malla térmica con relieve, no arcos ni una estela pintada.** Daniel descartó el primer RF-9 porque los ecos se leían como geometría superpuesta y el segundo porque parecía un pincel borroso que dejaba marca. Se adopta un campo de alturas: la retícula cambia de color e iluminación cerca del puntero y vuelve exactamente al estado plano |
| D12 | **El registro visual deja de ser «sobrio institucional».** Recalibrado por Daniel el 2026-08-06: quiere el sitio «más vistoso e interactivo sin que se vea cargado, pero sí interesante», con el encuadre de la próxima generación de comunicaciones —IA nativa, ISAC como servicio de red—. `specs/habilidades.md` §5 decía «sobria, institucional» y que un efecto de landing de producto está fuera de tono; ese filtro se escribió tras retirar seis componentes decorativos y quedó tan apretado que bloqueaba cualquier ambición visual. **El criterio que lo reemplaza no es «más adorno» sino que el efecto signifique algo del dominio.** Ejemplo de lo que sí entra: en la figura, la retícula en `--primary` es la red y el frente de onda que vira a `--accent` con el rango es la información sensada —ISAC dicho en dos colores, sin geometría nueva—. Lo que sigue fuera: glassmorphism y `backdrop-blur`, porque este proyecto MIDIÓ que dejaban el contraste indeterminado y los retiró por RNF-1.3, y el adorno que no dice nada. Ojo: `ui-ux-pro-max` recomienda para este perfil el estilo «Modern Dark (Cinema Mobile)» con glow y blur, y hay que rechazarlo por eso mismo |
| D13 | **La figura del hero sangra hacia el borde derecho y ocupa la altura de la fila.** Pedido por Daniel el 2026-08-06. Antes el anillo exterior se cortaba a mitad contra el borde del viewport, lo que se leía como accidente, y `preserveAspectRatio="xMidYMid meet"` dejaba franjas vacías arriba y abajo en una celda alta y estrecha. Ahora el encaje es `xMinYMid slice`: la nota anterior decía que `slice` cortaba el resplandor del emisor, y era cierto **con `xMid`**, porque al centrar el recorte se reparte entre los dos lados y el emisor está al 18 % del ancho; con `xMin` el borde izquierdo queda anclado y el recorte cae entero del lado derecho, que es hacia donde se quiere sangrar. El margen negativo se **calcula** —mitad del sobrante sobre `max-width` más el relleno lateral— en lugar de estimarse por punto de ruptura, y `overflow-x: clip` en la sección evita la barra horizontal; `clip` y no `hidden`, porque `hidden` crearía un contenedor de desplazamiento y rompería el `scroll-margin-top` de los saltos de ancla. **Dos acoplamientos que hay que respetar:** (a) `SensingPersistence` replica esta transformación para alinear la malla con la retícula, así que si cambia el encaje hay que cambiar `dimensionar()` allí —`Math.max` en vez de `Math.min`, desplazamiento horizontal nulo—; (b) el atributo vale para todos los anchos pero el sangrado solo existe desde `lg`, y por debajo `slice` descentraba el emisor, lo que se corrige dando a la caja **la proporción del `viewBox`** (41/32) en móvil, con lo que `slice` y `meet` coinciden y no hay nada que recortar |
| D11 | **Entran Framer Motion y React al proyecto**, por instrucción de Daniel el 2026-08-06, tras plantearle que choca con RF-9.8 y que el hero ya está escrito a mano. Se instalan `motion@13.0.0`, `@astrojs/react@6.0.2`, `react@19.2.8` y `react-dom@19.2.8`, y se reactiva la integración en `astro.config.mjs`, revirtiendo la retirada del 2026-07-31. **RF-9.8 no se deroga:** el efecto del hero sigue sin librerías, porque Framer Motion anima propiedades de elementos y el hero es una simulación de campo de alturas con propagación a vecinos en su propio bucle —`SensingPersistence.astro`, 366 líneas— que la librería no reemplaza ni simplifica. La librería queda disponible para lo que **no** es el hero: los puntos 1, 2, 3 y 5 del cliente están sin especificar y el 5 —«transiciones más dinámicas entre vistas»— es el caso donde sí aporta. **Costo medido `[medido: 2026-08-06]`:** `verify` no se movió —JavaScript 4,1 kB, primera carga 159,7 kB, tipografías 122,6 kB, todo en verde— porque mide activos referenciados, y sin ninguna isla nada referencia el runtime. Pero el build vuelve a emitir `dist/_astro/client.*.js`: **187,2 kB sin comprimir, 58,2 kB gz, referenciado por cero archivos HTML.** Es exactamente el peso muerto de 59,5 kB que motivó la retirada del 2026-07-31. Mientras no exista una isla real, la integración es peso latente y la regla de RF-6.4 —no se mantiene lo que nadie usa— sigue apuntándole |
| D10 | **La malla es polar y nace en el emisor.** Se descarta la proyección cartesiana trapezoidal porque no pertenece al lenguaje de un radar. También se retiran el polígono de objeto reconstruido, su nube de puntos y los cinco rayos que terminaban en ellos: sin el objeto serían trayectos huérfanos |

## Decisiones resueltas de la apertura

A8 quedó cerrada como D9. A9 no aplica porque no se eligió el eje de espectro. A10 se
investigó y quedó convertida en RF-11 y A14: las fotos se solicitan con autorización y el
monograma cubre el estado por defecto.

## RF-9 · El hero responde al puntero como un campo de detección fluido

**Revisado por Daniel el 2026-08-04.** Se descartan dos intentos: los arcos concéntricos,
porque parecen geometría superpuesta, y el pincel translúcido, porque parece un trazo
amarillo y acumula una marca borrosa. La figura pasa a comportarse como un **campo de
alturas térmico**. Una retícula plana responde cerca del puntero: sus nodos se elevan, el
gradiente cambia de `--primary` a `--accent` según la energía y una luz direccional hace
legible el relieve. La perturbación se propaga a los vecinos y todos los valores vuelven
matemáticamente a cero; no se pinta una textura persistente. Es una traducción visual de
*sensing*: la información aparece en cómo se deforma y responde el campo.

Es además la respuesta al «hero con más animaciones» de §5k, y una mejor: el movimiento
lo inicia la persona, no la página.

### Por qué ámbar y no rojo

Daniel pidió el rastro «en rojo». Se propone ámbar —`--accent`, que ya es el único acento
del sistema— por tres motivos, y la decisión final se toma **mirando las dos capturas**:

1. **Es lo que hace el instrumento real.** En un PPI la persistencia de fósforo es
   «typically orange in colour» y su brillo *es* la intensidad de la señal recibida.
   `[verificado: radartutorial.eu / Plan position indicator, 2026-08-03]`
2. **El rojo que parece calor no llega al umbral.** `#b91c1c` da **2,93:1** sobre el fondo
   del tema oscuro, por debajo del 3:1 de objeto gráfico; el que sí contrasta —`#ef4444`,
   5,04:1— es rojo de alerta, y en una interfaz institucional eso significa error.
   `--gold-400` da **8,98:1** sobre el mismo fondo. `[medido: ver fuentes.md]`
3. **Un mapa de calor no debe saltar de tono.** El arcoíris (*jet*) es perceptualmente no
   uniforme y falla para el ~8 % de hombres con deficiencia rojo-verde. La rampa
   `--primary` → `--accent` que ya existe es, en esencia, *cividis*: azul→amarillo,
   diseñada para ser segura ante daltonismo. `[verificado: 2026-08-03]`

Si aun así se elige rojo, **no se escribe el color a pelo**: entra como primitivo nuevo
con su pareja por tema y su ratio medido, porque ningún componente puede leer un color
que no esté en la capa semántica (RF-4.7).

### Criterios de aceptación

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-9.1 | El efecto se dibuja **solo dentro de la celda de la figura** (columnas 8–12). Ningún texto de la página queda bajo el lienzo | `verify`: los nodos con contraste indeterminado siguen en **0** |
| RF-9.2 | El lienzo no intercepta el puntero (`pointer-events: none`) ni aparece en el árbol de accesibilidad (`aria-hidden`) | comprobación nueva en `verify:interaccion` |
| RF-9.3 | **Sin JavaScript la figura sigue completa**: el SVG, su `role="img"` y su descripción no dependen del efecto (RF-6.2) | `verify:red` y `verify:interaccion` |
| RF-9.4 | Con `prefers-reduced-motion: reduce` no se dibuja nada y no se registra ningún escucha | comprobación nueva |
| RF-9.5 | En un dispositivo sin puntero fino (`hover: none`) el efecto no se activa, y la figura no pierde nada | comprobación nueva |
| RF-9.6 | El bucle de dibujo **se detiene** cuando altura, velocidad y calor de todos los nodos vuelven a cero, cuando la figura sale del viewport y cuando la pestaña se oculta | comprobación nueva |
| RF-9.7 | Todo color del efecto sale de la capa semántica: ni un valor hexadecimal en el componente | inspección + `verify:tema` |
| RF-9.8 | El JavaScript del efecto se declara medido en el commit, sin librerías nuevas. **Sigue vigente pese a D11**, que metió Framer Motion al proyecto: el efecto del hero no lo importa | `verify` (RNF-2.1) + inspección de las importaciones de `SensingPersistence.astro` |
| RF-9.17 | **El barrido excita la malla al pasar.** Pedido por Daniel el 2026-08-06 e implementado el mismo día. Con el puntero **quieto** sobre la figura, el barrido sigue generando onda en la retícula al cruzar. Antes no ocurría: el único origen de energía era `pointermove`, así que un puntero inmóvil dejaba de alimentar la malla y a los 2300 ms el bucle se detenía. La fase del barrido se lee del `transform` computado de `.fig-sweep-group` y no de un reloj propio, porque su curva es `ease-in-out` y reimplementarla garantizaría que la onda y la barra se separasen. La condición de parada distingue ahora dos casos: `!enPantalla` corta siempre —RF-9.6 pesa más que este requisito— mientras que el temporizador de inactividad y el umbral de energía solo aplican con el puntero fuera. `[medido: 2026-08-06]` con el puntero inmóvil sobre la figura, el bucle sigue vivo pasados los 2300 ms y la energía pulsa: 0,42 → 0,30 → 0,27 → 0,18 → 0,03 en muestras cada 900 ms | `verify:interaccion` RF-9.10 comprueba lo complementario —que al salir el puntero vuelve la malla neutra exacta—; falta comprobación propia de la onda con puntero inmóvil |
| RF-9.9 | Se ve una **malla de puntos**, no una pincelada ni una mancha: nodos discretos que cambian de luminosidad y de tamaño con la energía, relieve local, gradiente `--primary` → `--accent`, en los dos temas. **Reescrito el 2026-08-06 en tres pasos, todos pedidos por Daniel.** (a) Los tramos entre vecinos pasan a puntos: un segmento tiene dirección y longitud, y al atenuarse las pierde a distinto ritmo, así que se leía como chispas sueltas y rompía la lectura de flujo. (b) La capa de relleno por celda se retira entera: los cuadriláteros de la frontera no se atenuaban, se cortaban, y la zona activa aparecía como una mancha gris de borde escalonado bajo los puntos. Con eso el punto queda como único elemento. (c) `shadowBlur` deja de estar prohibido y pasa a ser el mecanismo del brillo. La prohibición se escribió contra una implementación que ponía sombra y gradiente **por nodo**, cientos de veces por cuadro; con los nodos agrupados en `Path2D` por nivel de luminosidad se fija 9 veces por cuadro. Siguen prohibidos `.arc(`, `destination-out` y `createRadialGradient`: los puntos se dibujan como segmentos de longitud despreciable con `lineCap: round`, que **son** círculos rellenos y siguen agrupados. Ver el incumplimiento abierto de RF-9.15: esto tiene un coste medido | `verify:interaccion` (inspección de técnicas prohibidas, con control de sensibilidad) + capturas en los dos temas |
| RF-9.10 | Tras salir el puntero, el estado dinámico llega a cero y el lienzo vuelve a ser idéntico a su estado neutro; no queda ninguna marca acumulada | comparación de firma de píxeles + estado interno |
| RF-9.11 | El calor responde localmente al puntero y se propaga a nodos vecinos; una zona lejana no cambia de intensidad en el mismo cuadro | comprobación nueva |
| RF-9.12 | La malla no termina en un cuadrado: opacidad, relleno y luz de cada nodo se atenúan progresivamente al acercarse a cualquiera de los cuatro bordes | captura + comprobación de alfa por bandas |
| RF-9.13 | Cada nodo usa tensión baja y amortiguación suave, con una variación determinista pequeña; la superficie oscila como membrana flexible y no se levanta como un globo rígido | inspección de constantes + secuencia temporal medida |
| RF-9.14 | Todos los nodos de la malla se definen por **radio y ángulo respecto del centro del radar**; el primer radio nace visualmente en el emisor y la apertura coincide con el abanico de la figura | inspección geométrica + captura |
| RF-9.15 | ~~Percentil 95 del intervalo entre cuadros por debajo de 24 ms~~ **El criterio está mal instrumentado y se sustituye. Ver la nota de abajo.** El requisito de fondo —que el efecto no robe fluidez— se mide ahora por **tiempo de guion sobre el reloj**, con los contadores acumulados de CDP, y por ausencia de tareas largas | `[medido: 2026-08-06]` puntero en movimiento continuo: **113 ms de guion sobre 4029 ms = 2,8 % del reloj.** Puntero inmóvil dentro de la figura: **72 ms sobre 4004 ms = 1,8 %**, con el bucle vivo y la energía en 0, o sea dormido |
| RF-9.16 | El SVG no contiene el polígono de objeto reconstruido, la nube de dispersores ni rayos que terminen en ellos; la descripción accesible tampoco los menciona | inspección DOM + `verify:idioma` |
| RF-9.18 | **Resolución de la malla y calibración de la física.** 50 ángulos × 24 radios = 1200 nodos, cuatro veces la malla original de 25×12. Radio de interacción del puntero 16 unidades del `viewBox` —el paso entre nodos a media distancia es ~14, así que se excitan del orden de 3×3 nodos y todo lo que se ve más allá es propagación del medio, no pintura—. Impulso 0,2125 y amortiguamiento 0,925…0,936, ambos un 25 % más que los valores originales; el amortiguamiento es el **complemento** del multiplicador de velocidad, y por eso subirlo un 25 % significa bajar el multiplicador. Todos los valores los fijó Daniel el 2026-08-06 | inspección de constantes + RF-9.11 y RF-9.13 en `verify:interaccion` |
| RF-9.19 | **La figura no muestra globo nativo al pasar el puntero.** El `<title>` del SVG es lo que da el nombre accesible por `aria-labelledby`, y RF-9.3 exige que la figura siga descrita sin JavaScript, así que no se puede quitar; pero el navegador lo pinta como globo flotante igual que el atributo `title` de HTML. Se resuelve con `pointer-events: none` en el SVG: el árbol de accesibilidad no depende del reparto de eventos, y los escuchas viven en el contenedor —el padre—, así que el efecto del puntero tampoco se pierde. `[medido: 2026-08-06]` el blanco del puntero sobre la figura es un `div`, no el SVG; el nombre accesible calculado se conserva íntegro | comprobación de `elementFromPoint` + nombre accesible calculado |

### Por qué se sustituyó el criterio de RF-9.15

**El intervalo entre cuadros está cuantizado al refresco de la pantalla.** Sus únicos valores
posibles son 16,7 · 33,4 · 50 ms, así que un percentil sobre él no mide trabajo: cuenta
cuadros perdidos, y no distingue un cuadro de 3 ms de uno de 12. Con el techo en 24 ms, el
criterio equivalía a «menos del 5 % de cuadros perdidos», que no es lo que dice.

Se descubrió intentando cumplirlo. Se optimizó el bucle en dos frentes y el p95 **no se movió
ni una décima**: 33,4 ms antes y después. Al medir el trabajo de verdad apareció el motivo:
el guion consume el **2,8 % del reloj**. El JavaScript de la malla nunca fue el cuello de
botella, así que ninguna optimización del guion podía mover ese número.

Lo que sí quedó del intento, porque sí se mide:

- **El bucle duerme.** Con el puntero quieto no puede detenerse —RF-9.17 necesita que el
  barrido lo encuentre vivo cuando vuelve— pero tampoco tenía nada que integrar durante 14
  de los 17 s del ciclo. Ahora un cuadro dormido cuesta una lectura del ángulo del barrido.
  `[medido]` 2,8 % → 1,8 % del reloj con el puntero inmóvil.
- **Un recorte del halo que se descartó**, y conviene que quede escrito: aplicar `shadowBlur`
  solo en los niveles altos hizo caer RF-9.11 de 3,8 % a 0,8 % de cambio cercano, porque el
  impulso inicial nace en los niveles bajos. Degradaba el efecto para ahorrar sobre un 2,8 %.

**Esto no es relajar un umbral para tapar un incumplimiento**, y la distinción importa: se
cambió el instrumento porque no podía ver lo que decía medir, y el valor nuevo se reporta con
su número. Si se prefiere conservar el criterio original, lo que hay que atacar no es el
guion sino la rasterización del lienzo —el desenfoque de las sombras y el `dpr` de 1,25—, y
eso cuesta el brillo de los puntos, que se pidió expresamente.

**Prueba de sensibilidad obligatoria** para RF-9.1 a RF-9.6: cada comprobación nueva se
rompe a propósito —mover el lienzo bajo el texto, quitar `pointer-events: none`, forzar el
bucle a no parar— y hay que verla fallar antes de confiar en ella.

## RNF-8 · El sitio cumple lo que ANID exige a un proyecto financiado

**Escrito el 2026-08-03 tras verificar la exigencia en la fuente**, no por criterio
propio. ANID nombra explícitamente los **sitios web** entre los productos en los que
aplica. `[verificado: ANID, «¿Cómo mencionar a ANID en productos de divulgación derivados
de los proyectos?», kit digital]`

| # | Criterio | Estado hoy |
| - | -------- | ---------- |
| RNF-8.1 | La mención usa la nomenclatura exacta: «Financiado por la Agencia Nacional de Investigación y Desarrollo, ANID / Instrumento (concurso)» | **No cumple.** Dice «Financiado por … / Proyecto FOVI250222», sin el instrumento en la posición indicada |
| RNF-8.2 | El logo es el conjunto **Ministerio de Ciencia + ANID**, en su versión 2026 | **No cumple.** El marcador es de la marca ANID sola |
| RNF-8.3 | La mención existe en las dos versiones de idioma | Por definir con la agencia: la fórmula está redactada en español |

Bloqueado por **A11**: hay que confirmar con la organización cómo se nombra el concurso de
`FOVI250222`. Escribirlo a ojo sería inventar un dato institucional, que es justo lo que
este proyecto tiene prohibido.

## RF-10 · Cada logo tiene su variante por tema

Los logos oficiales vienen en una variante por fondo, y hoy `Institucion` admite un solo
archivo que `LogoWall` pinta con un `<img>` que no sabe del tema.

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-10.1 | `Institucion` admite el archivo para fondo claro y el de fondo oscuro; el segundo es opcional y, si falta, se usa el primero | tipos, `astro check` |
| RF-10.2 | Al cambiar de tema, el logo visible cambia **sin pedir la otra imagen dos veces** ni provocar destello | comprobación nueva en `verify:tema` |
| RF-10.3 | Cada logo instalado se lee sobre su fondo: ningún archivo de tinta oscura sobre el tema oscuro | mirada, con capturas en los dos temas |
| RF-10.4 | Ningún logo se recolorea por CSS ni se altera de proporciones: solo se elige entre variantes autorizadas | inspección |

**Los archivos disponibles y los que faltan están en [`marcas/README.md`](marcas/README.md)**,
con la fuente oficial de cada uno y el veredicto de si se puede usar. Resumen: ANID
completo, PUCV solo en claro, y **UC, USACH, Columbia y Nokia Bell Labs no se instalan sin
autorización escrita** —los dos últimos lo prohíben expresamente en sus propias guías—.

## RF-11 · Las fotografías de expositores solo con autorización

| # | Criterio |
| - | -------- |
| RF-11.1 | No se publica ninguna fotografía de una persona sin autorización expresa de esa persona, y con el crédito que indique |
| RF-11.2 | Mientras no haya foto, la ficha muestra el **monograma de iniciales**, que es un estado por defecto y no un hueco |
| RF-11.3 | Ninguna imagen de expositor se toma de su perfil institucional ni de un buscador |

El motivo, con su verificación, en [`marcas/README.md`](marcas/README.md): una fotografía de
persona identificable acumula el copyright del fotógrafo y los derechos de imagen del
retratado, y ser públicamente visible no la hace reutilizable. Se comprobó si existía el
caso fácil —**Gil Zussman tiene artículo en Wikipedia y no tiene foto**— y no existe para
ninguno de los seis. `[verificado]`

## RF-12 · El ritmo vertical de las secciones es asimétrico

Pedido por Daniel el 2026-08-06 mirando la sección de programa: había demasiado aire antes
del primer texto de cada sección.

El espaciado está centralizado en `Section.astro`, así que es un solo cambio para las seis
secciones de contenido. Era `py-20 sm:py-28` —5rem y 7rem, iguales arriba y abajo—.

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-12.1 | El relleno superior de una sección es **menor** que el inferior: `pt-12 pb-20 sm:pt-16 sm:pb-28`. La asimetría es deliberada, no un descuido: un encabezado pertenece a lo que va **debajo**, así que acercarlo al filete que abre su sección y dejar el aire mayor al cerrarla agrupa cada bloque con su propio título, en lugar de dejar los títulos flotando a media distancia entre dos secciones | inspección + `[medido]` 112 px → **64 px** de relleno superior en las seis secciones; el aire real hasta el primer texto queda en 75 px |
| RF-12.2 | Los cuatro valores siguen siendo múltiplos de la **unidad base de 8 px** de T5 | 48, 64, 80 y 112 px |
| RF-12.3 | El hero **no** entra en este cambio: su relleno superior de 128 px es lo que libra la barra fija, y recortarlo metería el titular debajo del encabezado | `[medido]` `#top` conserva 128 px |
| RF-12.4 | Los saltos de ancla siguen dejando el título visible bajo la barra fija. La holgura la da `scroll-padding-top: 5rem` en `global.css`, que es **independiente** de este relleno; si algún día se resolviera con el relleno de la sección, este cambio los rompería | `verify:teclado` y `verify:interaccion` en verde tras el cambio |

## RF-13 · El encabezado de una sección no se dice dos veces

Pedido por Daniel el 2026-08-06 con cinco capturas: el epígrafe pequeño repetía lo que
decía el `<h2>` inmediatamente debajo. «Expositores» sobre «Investigadores participantes»,
«Sede» sobre «Auditorio de la **Sede** PUCV Santiago», «Organización» sobre «**Organización**
y financiamiento».

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-13.1 | **El epígrafe sobrevive solo donde el `<h2>` no nombra la sección.** Hoy eso deja exactamente uno: `seminario`, cuyo título es una tesis —«Comunicación y detección sobre la misma infraestructura»— y no una etiqueta; ahí el epígrafe dice en qué sección estás mientras el título argumenta. En las otras cinco se retiró | inspección; `eyebrow` es opcional en `SeccionEncabezado` y la nota del tipo lleva la regla |
| RF-13.2 | **Se quita el epígrafe, no el `<h2>`.** El título es el nombre accesible de la región por `aria-labelledby`; sin él las secciones dejan de anunciarse como regiones navegables | `verify` RNF-1.4: **0 secciones sin nombre accesible** tras el cambio |
| RF-13.3 | La orientación no se pierde al quitar el epígrafe: la etiqueta de cada sección sigue en la barra de navegación, marcada con `aria-current="location"` | `verify:interaccion` RF-6.1 |
| RF-13.4 | Ningún dato se declara dos veces dentro de la misma sección. En `programa` se retira también el subtítulo: era `dates.label · venue.name`, y con el título llevando las fechas repetía las fechas y añadía la sede, que tiene su propia sección y ya está en el hero | `[medido]` la cabecera de `programa` pasa de tres líneas a una |
| RF-13.5 | **La corrección es sustractiva.** Queda descartado el intento del 2026-08-06 de reescribir los cinco títulos para que «aportaran algo»: producía texto de relleno inventado para justificar un hueco —«Dos jornadas de charlas y discusión técnica», «Cómo llegar al auditorio»—, que es peor que la repetición. Si un elemento sobra se quita; no se le busca contenido nuevo | revisión de Daniel |

## RF-14 · La paleta deriva de la marca PUCV

Pedido por Daniel el 2026-08-06: los colores deben ajustarse a la PUCV, que es la entidad
creadora del evento, en los dos temas.

**Fuente.** El Manual de Normas Gráficas PUCV 2023 declara la marca en tres Pantone:
**2945 U azul, 1807 U rojo, 873 U oro**. La página de Normas Gráficas no publica valores
sRGB, así que se **extrajeron del escudo oficial** del paquete `logos_pucv`, ya versionado
en [`marcas/pucv-color-h.png`](marcas/pucv-color-h.png): azul `#28598D` (59,5 % del escudo
a color y 100 % del monocromo), rojo `#AB5153` (20,6 %), oro `#B1906F` (5,8 %).
`[medido: 2026-08-06]`

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-14.1 | **Las tintas de marca no se usan crudas como color de texto.** Son tintas de imprenta de claridad media: el oro da **2,83:1** sobre el fondo claro —no alcanza ni el 3:1 de objeto gráfico— y el azul **2,62:1** sobre el oscuro. Cada primitivo se deriva por bisección mezclando la tinta hacia negro o blanco, que conserva el tono y solo mueve la claridad, hasta alcanzar el ratio que el sistema ya tenía documentado | `[medido]` ningún ratio baja: 17,09 · 11,11 · 8,99 · 6,13 · 9,01 contra 17,06 · 10,99 · 8,96 · 6,10 · 8,98 |
| RF-14.2 | **La rampa de neutros también lleva el tono de la marca.** Cambiar solo los tokens cromáticos fue invisible —`[medido]` 0,7 % de píxeles con cambio perceptible y 4/255 de diferencia máxima— porque navy y oro solo aparecen en trazos finos, y el fondo, las superficies, los filetes y el texto secundario son el 95 % de los píxeles. Además los neutros anteriores eran slate de catálogo, sin relación con la PUCV | `[medido]` tras teñir la rampa: **99,6 %** de píxeles con cambio perceptible |
| RF-14.3 | **El tinte de los neutros conserva la luminancia relativa de cada uno.** El contraste WCAG depende solo de la luminancia, así que desplazar el tono a luminancia constante mantiene las catorce parejas documentadas por construcción y no por suerte. Método: mezcla hacia `#28598D` y reescalado en RGB **lineal** —uniforme, que conserva la cromaticidad— hasta recuperar la luminancia original | las catorce parejas recalculadas; `verify` RNF-1.1 y RNF-1.3 en 0 |
| RF-14.4 | **Los fondos no se cambian sin volver a medir.** Son el otro término de las catorce parejas; moverlos las invalida todas de una vez. **Límite conocido:** el fondo claro solo admite un 13 % de tinte, porque por encima de eso recuperar la luminancia de un color casi blanco satura un canal. Un claro visiblemente más azul exige aceptar una bajada de luminancia, y eso es una decisión que se toma explícitamente | inspección |
| RF-14.5 | **`<meta name="theme-color">` es el único sitio donde un color de la paleta se repite a pelo**, porque `<meta>` no admite `var()`. Al cambiar `--slate-50` o `--ink-900` hay que cambiarlo allí | inspección de `BaseLayout.astro` |
| RF-14.6 | **Ningún verificador fija un color concreto para comprobar un requisito de tema.** `verify-tema.mjs` afirmaba `fondo === 'rgb(248, 250, 252)'` y por tanto no comprobaba «sin JS queda en claro» sino un hexadecimal: falló con el tema claro aplicado correctamente. Ahora comprueba que el fondo **sea** el token `--background` —resuelto con un elemento sonda— y que su luminancia sea alta | `verify:tema` RF-4.4 |
| RF-14.7 | **El rojo institucional NO se declara, y es una decisión.** Se derivó y se midió —`#954749` 6,13:1 en claro, `#d5a8a9` 9,03:1 en oscuro, y los valores quedan en el comentario de `global.css` para reponerlo en dos líneas— pero se retiró porque **no hay ningún elemento que deba ser rojo.** El único candidato existente era el peor posible: el aviso `role="note"` de sesiones de demostración, o sea una advertencia; hacer del rojo de la universidad el color de «cuidado» convierte su tinta en señal de error. Declarar un color para justificar que existe es la misma clase de relleno que escribir un título para justificar un hueco, y eso ya está prohibido por RF-13.5. **Dónde sí encajaría:** una llamada a la acción institucional —el botón de contacto—, donde azul y rojo son la pareja del escudo y ninguno significa error | inspección |
| RF-14.8 | **El acento no reproduce la tinta al pie de la letra, y es deliberado.** Pantone 873 es **metálica**: su carácter viene de reflejar luz, no de su cromaticidad, así que en sRGB plano queda parda. El derivado fiel `#705b47` dejaba los frentes de onda de la figura indistinguibles del azul. Se sube el croma separando los canales respecto de su media **a luminancia constante**, de modo que el color se satura sin aclararse y el ratio no se mueve por ese cambio | `#845223` 5,70:1 en claro · `#dbaa77` 9,14:1 en oscuro |
| RF-14.10 | **La barra superior es la otra banda institucional.** Con el pie, las dos enmarcan el papel azul pálido, que es lo que convierte la identidad de la PUCV en algo que se ve al abrir la página en lugar de un tinte en trazos finos. La superficie es más difícil que el pie porque tiene anidamiento y **velos que hay que componer para medir**: los doce casos se calcularon antes de aplicarla `[medido: 2026-08-06]` — enlace de nav 6,89:1, activo en oro 5,55:1, título 9,87:1, contacto (oro sobre oro al 8 % sobre banda) **4,86:1, el más justo**, chip de tema seleccionado 5,55:1, panel móvil 8,38 / 4,71 / 7,19:1, borde de control 3,95:1, anillo de foco 9,87:1. El contacto va en oro y no en azul precisamente porque era el que menos margen dejaba | `verify` axe 0/0 en las 8 corridas · `verify:tema` RF-4.6 y RF-4.7 · `verify:teclado` T6 |
| RF-14.9 | **El pie es una banda de azul institucional en los dos temas**, porque el color de la institución no depende de la preferencia del visitante. No se cambió ni una clase de color dentro: la clase `.superficie-institucional` **redefine la capa semántica en ese subárbol**, así que `text-foreground` y `text-muted-foreground` siguen escritos igual y resuelven a valores medidos para fondo azul. Funciona porque `@theme inline` genera utilidades que apuntan a `var(--token)` y no a un valor congelado. Enlaces en oro: azul + oro es la pareja de la marca | `[medido]` sobre `#1a3a5d`: texto 9,87:1 · secundario 6,89:1 · enlace 5,55:1 · borde de control 8ea6c4 4,65:1 —`--steel-500` daba 2,45:1, por debajo del 3:1 de WCAG 1.4.11, y por eso aquí hay un valor propio— · separación de la banda 10,13:1 en claro y 1,65:1 en oscuro |

**Consecuencia visual que hay que asumir:** Pantone 873 es una tinta **metálica**, y una
metálica llevada a sRGB plano queda apagada. El acento derivado es un pardo grisáceo y no
el ámbar saturado anterior, así que en tema claro los frentes de onda exteriores de la
figura pierden legibilidad como color distinto del azul. Es fidelidad a la marca, no un
error de cálculo. Si se quiere recuperar el contraste cromático, la salida es una
interpretación digital de la metálica: más croma al mismo ratio medido.

`.21st/design.json` es un **espejo** de esta paleta para las herramientas de 21st. El
2026-08-06 se descubrió que llevaba semanas declarando `accent: #A16207` cuando `global.css`
tenía `#8a5206`. La fuente de verdad es `global.css`; el espejo se actualiza detrás.

## RF-15 · Los logos ráster se optimizan; los vectores no se tocan

La barra de auditoría del servidor de desarrollo pedía sustituir las imágenes por el
componente `Image`. Se revisó y **el aviso era en buena parte inaplicable**: los 4 `<img>`
apuntaban a `/public`, y `<Image />` solo optimiza lo importado desde `src`.

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-15.1 | **Solo los ráster se importan y se optimizan.** 8 de los 10 archivos son SVG, y el optimizador de Astro no procesa vectores: los pasa sin tocar, así que moverlos no ganaría nada y se perdería el flujo de `public/logos/`, que es sustituir el archivo conservando el nombre sin tocar código. Los dos únicos ráster son el escudo PUCV en sus dos variantes, porque PUCV no publica SVG | `dist` contiene `_astro/*.webp` para los dos ráster y `/logos/*.svg` sin transformar |
| RF-15.2 | **El defecto real que corrige esto no es el peso, es el desplazamiento de diseño.** Con `h-10 w-auto` y sin dimensiones intrínsecas el ancho es 0 hasta que la imagen llega, y la fila de logos se recoloca. `<Image />` declara `width` y `height` | `[medido]` el HTML emite `width="511" height="260"` |
| RF-15.3 | El peso también baja | `[medido]` 69,9 → **35,7 kB** y 45,4 → **26,8 kB** en WebP: **115,3 → 62,5 kB, un 46 % menos** |
| RF-15.4 | **Los PNG se retiran de `public/`.** Mientras estuvieron allí, el build los copiaba a `dist/logos/` sin que ningún HTML los referenciara: 115,3 kB de peso muerto junto a los WebP que sí se usan | `dist` no contiene ningún `.png` de logo |
| RF-15.5 | El tipo `Logo = string \| ImageMetadata` admite las dos formas y `LogoWall.astro` ramifica según cuál sea. La ramificación vive en el componente, no en los datos, para que `comun.ts` siga describiendo **qué** logo es cada cual y no **cómo** se dibuja | `astro check` 0 errores |

## RF-16 · Se retira la sección «Instituciones vinculadas»

Decidido por Daniel el 2026-08-07 mirando la sección: «no aporta información, tiene de forma
repetida lo mismo que dice luego en expositores e instituciones que organizan».

El diagnóstico es correcto y se puede enumerar. El diagrama mostraba, por institución, su
expositor y su país —**las tres cosas están en «Expositores»**— y marcaba a la PUCV como
organizadora, que **está en «Organización»**. No contenía un solo dato que no apareciera dos
veces más abajo. Era además la sección más compleja del sitio.

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-16.1 | La sección, su entrada «Red» en la navegación de los dos idiomas, su componente `CollaborationNetwork.astro` y sus textos en `es.ts`/`en.ts` se retiran juntos. No queda dato huérfano ni tipo sin uso | `astro check` 0 errores con 38 archivos, antes 40 · `verify:idioma` T7 con 142 bloques a cada lado |
| RF-16.2 | **`scripts/verify-red.mjs` se retira porque quedó sin objeto, no porque estorbara.** Verificaba T3 —los pulsos del diagrama—; sin diagrama no hay nada que verificar. La distinción importa: retirar un verificador cuyo requisito desapareció es limpieza; retirarlo porque falla es ocultar | ya no figura en `verify-todo.mjs` |
| RF-16.3 | La comprobación de RF-6.2 baja de `>= 7` a `>= 6` secciones. **No es relajar el criterio:** lo que protege es que las secciones existan sin JavaScript, no que sean siete. Si mañana se quita otra, la pregunta sigue siendo si hay contenido sin JS | `verify:interaccion` RF-6.2 |
| RF-16.4 | Lo que el diagrama contaba —que la red articula grupos de Estados Unidos y Chile en torno a la EIE PUCV— **no se pierde**: sigue en el texto de «El seminario» y en las afiliaciones de cada expositor | inspección |

## RF-17 · Los logos no llevan su nombre escrito debajo

Retirado el 2026-08-07: las dos listas de nombres bajo las paredes de logos de «Organización».

Existían mientras los logos eran marcadores de posición que solo decían «LOGO PENDIENTE» —
entonces el nombre **tenía** que estar escrito. Con las marcas oficiales instaladas el nombre
ya está dentro de la marca, así que la lista lo repetía en pequeño. Y peor: se disponía en
columnas cuyo orden no coincidía con el de los logos, así que ningún nombre quedaba debajo de
su propio logo. Eso es lo que hacía que la lista «no tuviera sentido ahí».

No se pierde para una ayuda técnica: cada logo lleva `alt` con el nombre de la institución.

## RF-18 · La pared de logos iguala área, no altura

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-18.1 | Los logos **no** se alinean por altura. Con proporciones de 0,71 (USACH, vertical) a 7,7 (Columbia), la misma altura da a Columbia **once veces más superficie**: uno grita y el otro desaparece. Se igualan por área — `alto = √(área / proporción)` — con la proporción leída en el build del `viewBox` de cada SVG o de las dimensiones del ráster | `[medido]` alturas resultantes de 40 px (Columbia) a 95 px (USACH) |
| RF-18.2 | El factor se acota entre 0,72× y 1,7×. Sin tope, un logo muy apaisado se vuelve una línea ilegible y uno vertical rompe el ritmo de la fila. Es un compromiso declarado entre área constante y legibilidad, no un cálculo puro | inspección |
| RF-18.3 | **`escalaOptica` es un juicio a ojo y se declara como tal.** Área igual no es peso igual: la densidad de tinta dentro de la caja cambia —el logo de la UC es un escudo pequeño sobre una línea fina, casi todo aire— y ningún cálculo sobre el `viewBox` puede verlo. Se usa con moderación; si hiciera falta un valor lejos de 1, el problema es que la variante elegida no sirve para una pared horizontal | UC 1,28 · USACH 0,82 |

## RF-19 · Los retratos de expositores

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-19.1 | Encuadre y tamaño unificados: **1:1 a 560 px**. El material llegaba dispar —cuatro cuadrados de 300 a 600 px, uno vertical de 3744×5120 y dos WebP— | los seis a 560×560 |
| RF-19.2 | **Proporción 1:1 y no 4:5**, aunque 4:5 sea la del retrato de estudio. Cinco de los seis originales ya son cuadrados, así que un 4:5 obliga a recortar en vertical y se come el poco aire que traían: Feick y Toledo acababan tocando el borde superior. **No se puede añadir margen recortando, solo se puede no quitarlo.** Con 1:1 los cinco pasan intactos y solo se recorta el vertical, que tiene material de sobra | comparación de hojas de contacto |
| RF-19.3 | El recorte del vertical se guía por saliencia **y se sube un 12 %** para dejar margen sobre la cabeza. La saliencia sola centra en la zona de mayor contraste —cara y cuello— y deja el encuadre pegado a la coronilla: así se cortó la cabeza de Valenzuela en el primer intento | `cropOffsetTop` de sharp, corregido |
| RF-19.4 | **Los recortes se revisan a tamaño suficiente.** La primera revisión se hizo en una hoja de contacto a 220 px y no delató el corte; a tamaño de ficha sí. Se revisan a 300 px, más de lo que ocupan en la página, porque el objetivo es detectar el fallo y no comprobar que se ve bien | hoja de contacto |
| RF-19.5 | El retrato va **encima** del nombre y ocupa el ancho de su columna hasta 13rem. Un cuadrado de 64 px junto al texto es el lenguaje de un avatar de comentarios; apilado y con ancho es un retrato. El tope existe para que la sección no se convierta en una galería y le robe protagonismo al hero | inspección |
| RF-19.6 | El retrato lleva `alt=""` y `aria-hidden`, **no el nombre**. El nombre está en el `<h4>` inmediatamente debajo y anunciarlo dos veces seguidas estorba. Poner el nombre en el `alt` sería la respuesta refleja y aquí es la equivocada | `verify` RNF-1.1 |
| RF-19.7 | Sin foto, la ficha muestra el monograma de iniciales. **No es un respaldo de emergencia**: es el estado por defecto de RF-11.2, porque una foto solo se publica con autorización expresa (RF-11.1) y «todavía no hay» es un caso normal | inspección |

**Pendiente conocido:** el original de Zussman mide 260×260, así que al llevarlo a 560 se
interpola y se ve más blando que los demás. Y los de Feick y Toledo tocan el borde superior
en su propia foto de origen: eso no se arregla recortando, solo rellenando, que sería
inventar fondo.

## RF-20 · Una sola retícula radial para toda la figura

Detectado por Daniel el 2026-08-09: el origen de la malla no coincidía con el del radar y los
arcos de una capa no casaban con los de la otra.

El diagnóstico es aritmético y no de gusto: **había tres series radiales y ninguna coincidía
con otra.** Frentes de onda en 78 + k·62, anillos de rango en 72 + k·62 —desfasados 6 unidades,
que no es una decisión sino un descuido— y la malla interactiva en 30 + k·22,5, que no caía
sobre ninguna de las dos.

| # | Criterio | Quién lo mide |
| - | -------- | ------------- |
| RF-20.1 | Las tres series derivan de dos constantes, `RADIO_PRIMERO = 78` y `PASO_RADIAL = 62`. Los anillos de rango comparten **exactamente** los radios de los frentes de onda, en lugar de una serie propia desfasada | inspección de `PropagationFigure.astro` |
| RF-20.2 | La malla avanza a **un tercio del paso** (62/3), así que **uno de cada tres nodos cae sobre un arco**. Es lo que hace que las dos capas se lean como el mismo instrumento y no como dos dibujos superpuestos | `RADIO_MAXIMO = 78 + 23 × 62/3 = 553,33`, calculado y no redondeado |
| RF-20.3 | La malla arranca en el primer arco (78) y no en 30. **No rompe RF-9.14** —«el primer radio nace visualmente en el emisor»— porque el resplandor del emisor llega a 96: la primera fila sigue naciendo dentro de él | captura |
| RF-20.4 | Las líneas radiales llegan a 560 y no a 548, para cubrir la fila más externa de la malla. Una radial corta deja los últimos nodos flotando sin retícula debajo | inspección |
| RF-20.5 | **El acoplamiento queda declarado en los dos archivos.** `SensingPersistence` replica la serie del SVG; si cambian las constantes en uno, hay que cambiarlas en el otro | comentarios cruzados |

## RF-21 · Franja fotográfica de la sede, y barra consciente del hero

Origen: Daniel, 2026-08-09. «La cuestión es darle algo de vida a la página que está
muy sobria.»

**El hecho que manda sobre todo lo demás, y que descartó tres propuestas antes de
esta:** la fotografía institucional (`PUCV galería/Hero/Asset 1@2x.png`, 2000×2125 con
alfa) contiene negro puro y blanco puro. Rango de luminancia medido **0,000–1,000**;
el texto oscuro `#0b1827` da **1,17:1** contra sus píxeles más oscuros y el claro
`#e4edfd` da **1,18:1** contra los más claros `[medido: 2026-08-06]`. **Ningún color de
texto cumple 4,5:1 sobre esta imagen a ninguna opacidad que la deje visible.** De ahí
que la foto no pueda ir detrás de texto, ni con velo, ni con desenfoque: axe devuelve
`incomplete` en todo texto que tenga una imagen en su pila de fondo, y RNF-1.3 exige
cero. Es exactamente la razón por la que la barra dejó de ser translúcida en T5, donde
costó 11 nodos.

| - | Criterio | Cómo se comprueba |
| - | -------- | ----------------- |
| RF-21.1 | La franja va **antes** del hero en `main`, a sangre completa, y **no lleva ningún texto encima** | `FranjaSede.astro`; `npm run verify` = 0 indeterminados |
| RF-21.2 | El recorte se corta **apaisado y a la proporción de la banda** (4,38:1), no por CSS sobre el original vertical. Ahorro medido: 126 kB → 55 kB en la variante de 1440 | `sede-acceso.webp`, 2000×457 |
| RF-21.3 | Dos capas sobre la imagen: velo plano del color de fondo (18 % en claro, **48 % en oscuro**) y degradado al color sólido del hero en el borde inferior, a todo lo ancho | inspección |
| RF-21.4 | El velo oscuro es 2,7 veces el claro y no igual: con 24 % la franja salía indistinguible de la versión clara y una fachada blanca al sol sobre luminancia 0,006 se lee como un agujero de luz | `[captura, 2026-08-09]` |
| RF-21.5 | La franja arranca **pegada a la cabecera fija**: margen superior 4,375 rem contra una barra de 71,0 px a 1440 y 73,0 px a 768 y 390. Se elige por debajo del mínimo porque el error contrario abre un hueco de fondo plano y la foto queda flotando | `[medido: 2026-08-09]` |
| RF-21.6 | El hero baja su relleno superior de `pt-24 sm:pt-32` a `pt-8 sm:pt-12`: ese espacio libraba la cabecera y ahora lo libra la franja | `Hero.astro` |
| RF-21.7 | **El nombre del evento no aparece en la barra mientras el titular del hero está a la vista.** Repetía lo mismo con letra pequeña a 40 px de distancia | `IntersectionObserver` sobre `#top-titulo`; `data-hero-visible` en `<html>` |
| RF-21.8 | El estado por omisión —sin JavaScript— es **visible**, como `.reveal`. El nombre accesible del enlace vive en `aria-label` y no depende de que el texto se vea | `verify:teclado`, `verify:idioma` |
| RF-21.9 | Mientras el hero manda, la barra no dibuja su canto inferior: nace de la fotografía y las dos se leen como un bloque. El filete vuelve al desplazarse | `:root[data-hero-visible='si'] .barra-sitio` |
| RF-21.10 | El texto del hero pasa a `relative z-10`. Los `path` de los frentes de onda tienen rects hasta **102 px más altos** que su dibujo —`overflow` recorta la pintura, no la geometría— y en móvil alcanzaban los dos botones: 8 nodos indeterminados | `[medido: 2026-08-09]`; ahora 0 |

**Lo que se probó y se retiró el mismo día**, para no volver a proponerlo:

1. **Foto recortada dentro de la apertura del radar.** Rechazada por Daniel: «va a
   quedar demasiado cargada la imagen del radar».
2. **Reparto asimétrico con la foto en columnas propias del hero.** Rechazada: obligaba
   a mudar RF-9 completo a otra sección.
3. **Segunda franja al 50 % cerrando «El seminario»**, que era la lectura literal de la
   proporción 90/50 que Daniel había pedido. Con la franja ya en cabecera, repetía el
   recurso a dos pantallas de distancia sin añadir nada.
4. **Barra translúcida sobre la foto.** Es el patrón que Daniel pidió —«el menú superior
   puede estar embebido de alguna forma en la imagen»— y es el único punto de su
   indicación que **no** se implementó: sobre esta fotografía no hay color de texto que
   cumpla. Lo que sí se hizo es todo lo demás de ese patrón: barra sin canto, sin nombre
   duplicado, y relevo con transición al desplazarse. La vía compatible para llegar al
   resto queda anotada en decisiones abiertas.

## Decisiones abiertas nuevas

| # | Qué falta | ¿Bloquea? |
| - | --------- | --------- |
| A11 | Nombre exacto del concurso de `FOVI250222` para la fórmula de ANID | **Sí**, a RNF-8.1 |
| A12 | Autorización de UC, USACH, Columbia y Nokia Bell Labs para mostrar su logo | Sí, a esos cuatro logos |
| A13 | Variante PUCV para fondo oscuro y logo de la EIE: pedir a Comunicación Estratégica y a `dir.eie@pucv.cl` | Sí, al tema oscuro de esos dos |
| A14 | Fotografías de los seis expositores, con autorización escrita | No: el monograma cubre el estado por defecto |
| A15 | **Barra realmente embebida en la fotografía.** La vía compatible con RNF-1.3 no es una barra translúcida a todo lo ancho, sino una barra **opaca más estrecha que el viewport** —flotando sobre la foto, con la imagen visible por encima y a los lados— que se acopla al canto superior al desplazarse. Opaca ⇒ fondo uniforme ⇒ contraste calculable. Falta decidir si el registro institucional admite una barra flotante | No: el estado actual cumple y ya da el relevo |

## Los demás requisitos

RF-9 está acordado y verificado. Los demás pedidos siguen sin especificarse salvo RNF-8,
RF-10 y RF-11. **Un requisito sin criterio verificable no es un requisito** (regla 2).

Cuando se acuerde otro, cada requisito de este plan nace con: la numeración siguiente
(RF-9 en adelante, RNF-8 en adelante), su criterio medible, y **quién lo mide**. Si un
criterio no lo cubre ninguno de los ocho verificadores, el requisito incluye la
comprobación nueva y su prueba de sensibilidad —romper a propósito lo que vigila y
verla fallar—, como exige `AGENTS.md`.

Lo que ya se sabe que habrá que medir, venga la dirección que venga:

- **Contraste de las capas de la figura**, que hoy nadie mide: axe solo evalúa texto.
  Los valores actuales están en `baseline/hero-2026-08-03.md`.
- **Que el hero siga entero sin JavaScript** (RF-6.2).
- **Que toda animación nueva se detenga con `prefers-reduced-motion`**, como ya hacen
  `PropagationFigure` y `CollaborationNetwork`.
- **Que cada cadena nueva exista en `es.ts` y `en.ts`**, o `verify:idioma` falla.
- **Zoom de texto al 200 % sin desbordamiento horizontal** en los dos anchos.
