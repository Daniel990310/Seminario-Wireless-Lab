# Instrucciones para agentes

Sitio web del seminario internacional **Beyond Connectivity: Wireless Sensing in
mmWave and Sub-THz Bands** (PUCV, 21–22 de octubre de 2026).

Este archivo es la entrada obligatoria antes de tocar el repositorio. Si algo de
aquí contradice lo que parezca razonable a primera vista, gana este archivo: cada
regla existe porque su ausencia ya causó un problema concreto.

## Lo primero

**Leer [`ESTADO.md`](ESTADO.md), y en concreto su bloque «EMPIEZA AQUÍ»**, que está
arriba del todo y es lo único imprescindible para retomar: qué quedó a medio hacer, qué
acción está pendiente y qué no se toca sin respuesta de un tercero. El resto de ese
archivo es historia.

Dice también con qué reglas conviven los distintos entornos desde los que se desarrolla
este proyecto (Claude Code en navegador, móvil y PC, y Antigravity). Ninguno de ellos ve
la conversación de los otros: lo único compartido es el repositorio, así que **si no está
escrito aquí, no ocurrió**.

✅ **Al 2026-08-27 el sitio publicado está al día** (versión `c5149c53`) y ya no muestra
ninguna marca sin autorización, así que **el enlace se puede mandar a las instituciones**.
Cómo se comprobó, y las dos trampas que aparecieron al desplegar, en «EMPIEZA AQUÍ» §1.

```bash
git fetch origin && git status -sb   # ¿parto del estado que creo?
npm install
npm run build        # genera dist/
npm run verify:todo  # los seis verificadores en cadena
npm run check        # tipos
```

Los seis cubren accesibilidad y peso (`verify`, la autoridad), tema, teclado, idioma,
SEO e interacción; la tabla con qué mide cada uno está en
[`specs/README.md`](specs/README.md). Hay un séptimo, `npm run verify:publicado -- <url>`,
que comprueba el **sitio en vivo** y queda fuera de la cadena porque depende de la red.

**Eran siete hasta el 2026-08-07**, cuando `verify:red` se retiró junto con la sección
que comprobaba (RF-16): quedó sin objeto, no relajado. Estos documentos siguieron
diciendo «siete» —y listando un guion inexistente en el bloque de arranque— hasta el
2026-08-25.

**Un fallo de la cadena se reproduce aislado antes de creérselo.** Pasó dos veces el
2026-08-25: `verify:todo` terminó en 1 señalando `verify:tema`, y `verify:tema` a solas dio
exit 0 con sus 17 criterios en verde.

La causa **no es del sitio ni de la comprobación, y tampoco es contención de CPU**, que fue
la primera explicación y era una conjetura. Al leer la traza completa aparece la firma real
`[medido]`:

```
page.goto: net::ERR_NO_BUFFER_SPACE at http://127.0.0.1:53728/
    at scripts/verify-tema.mjs:126
```

Es **agotamiento de sockets de Windows**: cada verificador levanta su propio servidor y su
propio Chromium, y tras muchas corridas seguidas en la misma sesión —siete cadenas, más
capturas y diagnósticos— los puertos efímeros no alcanzan. `netstat` mostraba 62 conexiones
en `TIME_WAIT`.

Cómo se distingue de una regresión de verdad, que es lo que importa: **un criterio que
incumple imprime su línea con `✗`**; esto **aborta el proceso** y no imprime ninguna, así
que en el resumen aparece el verificador en rojo sin ningún criterio fallado debajo. Si al
mirar el detalle no hay línea `✗`, buscar `ERR_` en la salida antes de tocar código.

**Nunca reescribir historia ya publicada en la rama de trabajo** (`push --force`,
rebase de commits empujados). Hay clones en varios entornos y se rompen todos.
Para deshacer algo, un commit que revierte.

**`npm run verify` es la autoridad.** Ninguna afirmación de mejora vale sin él.
Requiere un `build` previo y termina con código 1 si algo incumple.

## El proyecto se desarrolla con spec-driven development

Todo vive en [`specs/`](specs/). Leer [`specs/README.md`](specs/README.md) antes
de escribir código.

| Documento | Para qué |
| --------- | -------- |
| [`specs/README.md`](specs/README.md) | Flujo, regla de procedencia, nomenclatura |
| [`specs/001-mejora-calidad/requirements.md`](specs/001-mejora-calidad/requirements.md) | Qué debe cumplirse |
| [`specs/001-mejora-calidad/design.md`](specs/001-mejora-calidad/design.md) | Cómo y por qué |
| [`specs/001-mejora-calidad/tasks.md`](specs/001-mejora-calidad/tasks.md) | Qué hacer y en qué orden |
| [`specs/001-mejora-calidad/verification.md`](specs/001-mejora-calidad/verification.md) | Última medición. **Generado, no editar** |
| [`specs/baseline/auditoria-2026-07-29.md`](specs/baseline/auditoria-2026-07-29.md) | Línea base contra la que se compara |
| [`specs/fuentes.md`](specs/fuentes.md) | De dónde sale cada cifra |
| [`specs/habilidades.md`](specs/habilidades.md) | Qué skills usar, cuándo y con qué precauciones |

### Reglas que no se negocian

1. **No se implementa lo que no está en los requisitos.** Si aparece algo nuevo,
   primero se agrega al documento y después se escribe el código.
2. **Un requisito sin criterio verificable no es un requisito.** «Que se vea
   profesional» no sirve; «contraste ≥ 4,5:1 medido con axe-core» sí.
3. **Toda cifra lleva marca de procedencia**: `[medido]`, `[dataset]`,
   `[verificado]` o `[supuesto]`. Ver `specs/README.md`. Una cifra sin fuente
   termina tratada como hecho, y eso ya pasó en este proyecto.
4. **Los errores se corrigen dejando registro**, no reescribiendo la conclusión.
   El criterio con que se falló importa tanto como la corrección.

## Trampas de medición ya descubiertas

No volver a caer en estas. Cada una produjo un número falso que llegó a un
documento.

**Anular las transiciones antes de medir contraste.** axe mezcla el color del
texto con el fondo si lo evalúa a media transición de opacidad. Sin anularlas, 16
nodos reales aparecen como 67. Ya está resuelto dentro de `scripts/verify.mjs`;
si se mide por otra vía, hay que replicarlo.

**kB decimal, 1 kB = 1000 bytes.** No binario. Mezclar convenciones hizo que el
mismo archivo apareciera como 109,3 kB y 106,8 kB.

**RNF-2.2 no mide imágenes.** `primeraCarga` es `javascript + css + html +
tipografias`, y nada más (`scripts/verify.mjs`, la función que arma los grupos).
Así que «primera carga 166,3 kB de 260» en verde **no dice nada** sobre la
fotografía de la banda, que es el archivo más pesado que se sirve: 33,0 kB en la
variante de 1440 y 115,1 kB en la de 2752 `[medido: 2026-09-22]`. Al cambiar una
imagen o su `quality`, esa cifra hay que medirla aparte —`ls` sobre `dist/_astro/`
después de `npm run build`— y decirla con su número. Dar por bueno el presupuesto
como si cubriera la imagen es exactamente la clase de número falso que esta
sección existe para evitar.

**Los nodos `incomplete` de axe no son aprobaciones.** Significan que no se pudo
determinar el contraste, normalmente porque el texto va sobre un fondo no
uniforme. RNF-1.3 exige resolverlos.

**Las imágenes diferidas no son primera carga.** Los logos llevan
`loading="lazy"`: contarlos infla el peso con bytes que la mayoría de las visitas
nunca descarga.

**`gzip -9` de GNU y `zlib` de Node difieren ~0,3 %.** Una variación de ese orden
no indica un cambio real.

**Un verificador en verde no es una página revisada.** En T2 axe daba 0 hallazgos
mientras el selector de la barra no mostraba ninguna opción resaltada: las dos
instancias compartían `name`, y para axe un radio desmarcado es perfectamente
válido. Lo destapó mirar la captura. **Revisar visualmente en ambos temas antes de
declarar una tarea completada**, y convertir en comprobación lo que se encuentre.

**El ámbito de un grupo de radios es el documento, no el `fieldset`.** Dos
instancias del mismo control con el mismo `name` forman un grupo: inicializar la
segunda desmarca la primera. Cada instancia necesita su propio `name` y hay que
sincronizarlas al cambiar.

**`overflow-hidden` recorta en silencio.** No hay barra de desplazamiento ni
desborde visible que avise; el contenido simplemente desaparece. En el menú móvil
de 15rem «Sistema» se perdía 8 px. Se mide comparando la caja del elemento contra
la del ancestro que recorta, no a ojo.

**Toda comprobación nueva se somete a prueba de sensibilidad.** Antes de confiar en
que una comprobación protege algo, hay que romper deliberadamente lo que vigila y
verla fallar. Una comprobación que nunca ha fallado no se ha probado.

**Un `>=` puede ocultar dos errores que se compensan.** `verify:teclado` comprobaba
«alcanzados `>=` enfocables» y daba **35 de 34**: pasaba con un elemento de margen. Debajo
había dos defectos de signo contrario `[medido: 2026-08-25]` —contaba los tres radios del
selector de tema como tres paradas de Tab, cuando un grupo de radios es **una**; y excluía
por `width > 0` a los enlaces que envuelven una imagen diferida, que miden 0 de ancho hasta
que la imagen llega—. Se destaparon al cambiar la pared de logos, no antes. **Cuando una
comprobación cuenta cosas, la relación correcta es la igualdad**, y la identidad de cada
elemento no puede depender de su posición: el recorrido desplaza la página, así que un
elemento que se mueve sale como «no alcanzado» y su gemelo como «alcanzado de más». Ahora
cada enfocable se sella con un atributo antes de recorrer y el informe dice **cuál** falta.

**`getComputedStyle` devuelve el `display` del elemento, no el del ancestro que lo
esconde.** El `<summary>` del menú móvil vive dentro de un contenedor `lg:hidden`: a
1440 px no se dibuja ni se puede enfocar, pero su propio `display` sigue siendo
`list-item`. Lo que dice si algo está representado en la página es **tener cajas**,
`getClientRects().length`. Es la misma trampa ya registrada para el conteo de animaciones.

**Un verificador intermitente es peor que uno que falla.** «El foco se ve en todo el
recorrido» daba verde o rojo en la misma corrida: el mapa se carga al entrar en pantalla,
el propio recorrido con Tab desplaza la página, y el `<iframe>` existía o no según el
momento. Y el hallazgo no era real —al enfocar un `<iframe>` el foco entra en el documento
embebido, cuyo indicador **ninguna hoja de estilos nuestra puede pintar**—. Se excluye
`iframe` con el motivo escrito; el botón «Cargar mapa», que sí gobernamos, sigue medido.

**Lo que se publica es `dist/`, no lo que el HTML referencia.** Son dos preguntas
distintas y confundirlas dejó dos marcas sin autorización alojadas en el sitio. `public/`
se copia **verbatim** a `dist/`: tras retirar UC y Nokia de la maqueta el 2026-08-25, sus
archivos seguían en `public/logos/` y `https://…/logos/uc.svg` habría respondido **200** sin
que ninguna página lo enlazara `[medido: 2026-08-27]`. Alojar no es mostrar, pero sigue
siendo publicar. Los ráster no tenían el problema: viven en `src/assets/` y Astro **solo
los emite si alguien los importa**. En la misma revisión apareció que `public/logos/README.md`
se servía en `/logos/README.md` con 200 — documentación interna, con rutas y con qué
instituciones no han autorizado su marca, en el sitio de la Universidad. **Nada que no sea
el sitio va en `public/`, y antes de desplegar se mira `dist/`.**

**El texto dentro de un SVG no lo mide nadie.** Al reponer los marcadores de logo el
2026-08-25 se recuperaron del historial los SVG originales y **no se reinstalaron**: traían
los colores escritos a mano de la paleta anterior a la identidad PUCV y sobre el fondo claro
de hoy no llegan a 4,5:1. Puestos en HTML con la capa semántica, el aspecto es el mismo y
`verify` **sí** los mide. Es la misma familia que los trazos de `PropagationFigure`.

**Solo cuenta como peso lo que la página referencia.** `@astrojs/react` emite su
runtime de cliente aunque no quede ninguna isla que hidratar. Tras T3 no queda
ninguna, así que `client.*.js` se genera pero **ningún archivo de `dist` lo
menciona**: son ~55 kB comprimidos que ningún navegador pide. Contarlos habría
castigado justamente el cambio que eliminó el JavaScript. `scripts/verify.mjs` lee
las referencias del HTML y mide los huérfanos aparte, sin ocultarlos.

**`pathLength` no normaliza el guion si hay `vector-effect="non-scaling-stroke"`.**
Con ese `vector-effect` el `stroke-dasharray` se mide en **píxeles de pantalla**: el
valor computado sale como «16px, 84px» y el patrón se repite a lo largo del trazo.
En un eje de 470 px aparecían ~4,7 guiones donde se esperaba uno. Si se anima un
pulso con guiones sobre un SVG estirado, diseñar en espacio de pantalla y desplazar
**un período exacto** por ciclo, que es lo único que empalma el bucle a cualquier
escala. Comprobado midiendo, no leyendo la especificación.

**Astro saca el `<script>` a un archivo si pasa de 4 kB.** El proyecto presumía de que
«Astro 5 renderiza cada `<script>` tal como se declara»; es verdad **solo por debajo del
umbral de inlinado de Vite**, 4 kB por omisión. El guion de `SensingPersistence` lo pasó,
salió como `_astro/….js` y rompió el criterio de T3 «el navegador no pide ningún .js».
Se resolvió subiendo `vite.build.assetsInlineLimit` a 12 kB, con el razonamiento y el
techo en `astro.config.mjs`. **No usar `is:inline` para esto**: ese modo no transforma
TypeScript `[verificado]`. Y ojo con subir el límite más de lo necesario: la hoja de
estilos usa el mismo umbral y debe seguir siendo un archivo aparte.

**El verificador de cadenas leía JavaScript como si fuera marcado.** RF-1.7 buscaba texto
entre `>` y `<` sobre el archivo entero, así que una comparación como `d > radio && otra`
entraba por el `>` y salía por el `<`: falso positivo. Ya se excluyen `<script>` y
`<style>`, y para no abrir un agujero se añadió una comprobación aparte de cadenas
asignadas a `textContent`/`innerHTML` desde un guion. Probado en los dos sentidos.

**Ningún verificador mide los trazos de un SVG.** axe evalúa contraste de **texto**, así
que una figura puede estar dibujada a 1,3:1 con todos los verificadores en verde. Es lo
que pasa hoy con `PropagationFigure`: los anillos de rango y las radiales usan `--border`
—«filete decorativo, sin umbral»— y quedan entre **1,27:1 y 1,49:1** en los dos temas
`[medido: specs/002-rediseno-visual/baseline/hero-2026-08-03.md]`. No incumple WCAG
1.4.11 porque el `<desc>` del SVG lleva la información en texto, pero contradice al
propio `Hero.astro`, que declara la figura «contenido ilustrativo, no decoración». Al
juzgar una figura, medir sus capas, no solo pasar `verify`.

**Un elemento en `display: none` no ejecuta animaciones.** Al contar animaciones hay
que filtrar por elementos representados (`getClientRects().length`). Sin filtrar,
una vista alternativa oculta por punto de quiebre cuenta como animación que falta:
daba «4/5 animando» y parecía un fallo donde no lo había.

**Una ruta del sistema no se compara con una URL sin normalizar el separador.** Es la
misma familia que la trampa siguiente, y costó una cifra falsa durante semanas.
`relative()` devuelve `_astro\hoja.css` en Windows; el HTML referencia
`_astro/hoja.css`. `verify.mjs` decidía con esa comparación si un archivo estaba
referenciado, así que **todo `.js` o `.css` en subcarpeta salía como huérfano** y se
descontaba del peso: la hoja de estilos del sitio, 11,8 kB que el navegador sí
descarga, quedaba fuera de RNF-2.2 y el informe decía «CSS 0,0 kB». Peor: una sesión
explicó ese cero afirmando que el CSS iba en línea, sin abrir el HTML a comprobar que
había un `<link rel="stylesheet">`. **Toda ruta que se compare con una URL o con el HTML
pasa por `rutaWeb()`.** Y el error favorecía al proyecto, que es la dirección que menos
se nota: al corregir, la primera carga pasó de 140,7 a **152,5 kB**.

**`new URL('..', import.meta.url).pathname` se rompe en Windows.** Da
`/C:/Users/...`, con una barra inicial que `readdir`/`readFile` no resuelven:
`npm run verify` fallaba con «No existe dist/» aunque `dist/` existiera. Usar
`fileURLToPath(new URL(...))` de `node:url`, que normaliza por plataforma. Este
proyecto se desarrolla desde varios sistemas operativos (ver [`ESTADO.md`](ESTADO.md)),
así que toda ruta derivada de `import.meta.url` tiene que pasar por `fileURLToPath`,
no por `.pathname`. También aplica a la ruta fija de Chromium del sandbox de origen
(`/opt/pw-browsers/chromium`): se usa solo si `existsSync` la encuentra, y fuera de
ese entorno Playwright resuelve el suyo.

## Decisiones cerradas: no reabrir sin acuerdo

| # | Decisión |
| - | -------- |
| D1 | Una sola página con anclas. No se fragmenta en páginas por sección |
| D2 | Bilingüe español e inglés, con selector. **El título oficial nunca se traduce** |
| D3 | Registro de asistentes: previsto en la especificación, no implementado |
| D4 | Swiss Modernism 2.0 más minimalismo; Crimson Pro y Atkinson Hyperlegible Next |
| D5 | Dos temas con selector: claro por omisión, oscuro y «según el sistema» |
| D12 | **La banda del encabezado muestra Santiago con la cordillera, no la sede, y su altura es una relación fija** (2026-09-22, decidido por Daniel en el panel de `/ajustar`). Dos cambios que van juntos: el archivo es `santiago-cordillera.webp`, recortado a 2752 × 391 px —el encuadre está horneado, no en una propiedad—, y `--alto-franja` pasa de un `clamp` a `calc(100vw / 7.04)`. Motivo del segundo: con el `clamp`, la relación de la banda solo se mantenía entre 686 y 1219 px de ancho y cada pantalla veía un recorte distinto, de 4,17:1 a 15,39:1 `[medido: 2026-09-22]`. La altura lleva además un tope por alto de ventana, `max(0px, min(100vw / 7.04, 100vh - 32rem))`, y sin banda por debajo de 36rem de alto: **el bloque de texto del hero tiene prioridad sobre la fotografía** y sin el tope se cortaba en ventanas anchas y bajas. Cuando el tope actúa, el recorte deja de ser constante; es el único modo de cumplir las dos cosas que se pidieron. Verificado en 18 combinaciones de pantalla, el texto entra en todas `[medido: 2026-09-22]`. `quality` de la banda es 78, no 58: a 58 se veían bloques en la nieve. `sede-acceso.webp` se conserva sin usar |
| D7 | **Se descarta la estructura de agenda del prototipo de rediseño** (2026-08-03): acordeón que no abre sin JavaScript y panel con desplazamiento propio a `70vh`. Se conserva la idea de línea de tiempo vertical. Detalle y los tres motivos en [`specs/002-rediseno-visual/requirements.md`](specs/002-rediseno-visual/requirements.md) |
| D8 | **Las tipografías siguen auto-hospedadas.** El prototipo las carga desde `fonts.googleapis.com`; ese `<helmet>` no se porta (RNF-2.3) |
| D6 | **Se adopta shadcn/ui sobre Radix.** El cliente busca un sitio interactivo. **No se materializó en ningún componente**: las 5 interacciones de RF-6 se resolvieron con HTML nativo, porque RF-6.2 exige que el contenido exista sin JavaScript. El 2026-07-31, por instrucción de Daniel, **se retiró React y la base de shadcn** —`@astrojs/react`, `react`, `react-dom`, `clsx`, `tailwind-merge`, `components.json`, `src/lib/utils.ts`—: nada de eso lo usaba ningún componente y la integración emitía 59,5 kB de runtime huérfano en cada build. **Reinstalarlo es un comando** si aparece un componente que lo justifique; el candidato natural es el registro de asistentes (RF-3). Ver la enmienda de RF-6 y `design.md` §6.6 |

## Ya evaluado y descartado

No volver a proponer esto sin un argumento nuevo. El detalle está en
[`design.md` §1](specs/001-mejora-calidad/design.md).

| Propuesta | Por qué no |
| --------- | ---------- |
| **daisyUI** | 388 kB de CSS y vocabulario de tokens incompatible con el que ya se usa. Su patrón de temas sí se adoptó |
| **tailkits-ui** | Cero soporte de modo oscuro en 30 archivos, sin `sr-only`, `alt="Logo"` genérico, y categorías de landing de producto |
| **Componentes decorativos de Magic UI** | `MagicCard`, `BorderBeam`, `AuroraText`, `Marquee`, `Particles`: efectos de interfaz, no del tema del seminario |
| **Motion (`motion/react`)** | 35 kB por un único efecto que CSS resuelve con `stroke-dashoffset` |
| **Panel de agenda con desplazamiento propio** (`max-height: 70vh`) | Scroll dentro del scroll de la página. El prototipo que lo propuso lo desactiva bajo 768 px y le añade un párrafo explicando al usuario cómo funciona; y una altura fija en `vh` es lo peor para el zoom de texto al 200 % (WCAG 1.4.4), que ya costó dos defectos en T6 |
| **Acordeón con `max-height` medido en el DOM** | No abre sin JavaScript: incumple RF-6.2. `<details>` nativo hace lo mismo a 0 kB y ya está en uso |
| **Cargar las tipografías desde `fonts.googleapis.com`** | Petición a terceros en la carga inicial (RNF-2.3). Están auto-hospedadas |
| **Subir un presupuesto sin acuerdo del cliente** | El presupuesto disciplina al código. Cambiarlo es una decisión del cliente, registrada como decisión cerrada (así se hizo con D6) |

**Sobre los logos institucionales**, tres reglas, y la tercera se aprendió tarde:

1. **No se generan ni se aproximan con ninguna herramienta**, aunque los skills
   instalados sean capaces de hacerlo.
2. **No se extraen de una página renderizada.** Se toman del paquete que publica su
   dueño, o no se toman.
3. **No se publican sin autorización de su titular.** El 2026-08-25, al preparar los
   correos que la pedían, se midió qué mostraba la URL publicada: mostraba las cuatro
   marcas de terceros —UC, USACH, Nokia Bell Labs y Columbia— y el borrador a Columbia
   decía «no las hemos publicado» `[medido]`. En dos de los cuatro casos el titular ya
   había dicho **por escrito** que su uso exige consentimiento previo. Volvieron a
   marcador de posición. **Que el cliente asuma la responsabilidad cubre el riesgo de
   quien la asume; no convierte a nadie en dueño de una marca ajena.**

Nombrar a una institución **sí** se puede: es un hecho, no uso de marca. Por eso el
marcador lleva el nombre escrito. El estado de cada trámite está en
[`specs/gestion/correos-instituciones.md`](specs/gestion/correos-instituciones.md).

Hoy están instaladas PUCV, EIE y el conjunto **Ministerio de Ciencia + ANID**: las dos
primeras son marcas del cliente, y la tercera **es obligatoria** por RNF-8.

## Servidores MCP: cuál sirve para qué

Detalle completo, con cuotas y lecciones medidas, en
[`specs/habilidades.md`](specs/habilidades.md) §6bis, §7 y §8. Lo esencial:

- **Antes de programar contra la API de una librería, consultar la fuente.** En
  este orden: `node_modules` si está instalada —es el código exacto que corre—,
  luego **Context7**, y la búsqueda web al final. Saltarse esto costó una métrica
  equivocada durante semanas: RNF-2.1 informaba «0,0 kB de JavaScript» en una
  página que sí lo ejecuta, por un cambio de comportamiento de Astro v5.
- **Context7** responde «¿cómo se comporta esta herramienta?»: configuración,
  migraciones, API pública. Un concepto por consulta, máximo tres por pregunta.
- **21st.dev** responde «¿qué componente interactivo pongo aquí?». Su único caso
  natural en el plan es T10. Se le pide **una pieza acotada por llamada**, nunca
  una sección entera. `search` es gratis; `get_component` son 2 al día y
  `generate` se agota sin previo aviso.
- Casi todas las tareas que quedan son del primer tipo, no del segundo.
- **Ninguna decisión de diseño se declara terminada sin mirar capturas** de los
  dos temas y los dos anchos. Leer el código y suponer no cuenta.

## Convenciones de código

- **Contenido en archivos de datos.** Nada de texto escrito en componentes: todo
  sale de `src/data/`. La organización del seminario debe poder actualizar el
  sitio sin tocar marcado ni estilos (RNF-5).
- **Comentarios en español, y explican el *por qué*.** Un comentario que repite lo
  que hace el código no aporta. Si una decisión no es evidente, el comentario
  debe decir qué alternativa se descartó y por qué.
- **Ningún componente referencia un token primitivo**, solo la capa semántica.
  Así cambiar de tema es sustituir un bloque de valores (RF-4.7).
- **Antes de agregar una dependencia**, medir su costo contra RNF-2 y preguntarse
  **qué se obtiene por ese peso**. Radix cuesta 36 kB y entrega comportamiento
  accesible resuelto: se adopta. Motion cuesta 35 kB y compra un solo efecto que
  CSS hace gratis: se descarta. El criterio no es el tamaño en abstracto.
- **Un presupuesto propuesto por quien implementa no es un requisito del cliente.**
  Si una decisión se apoya en un número que uno mismo fijó, hay que decirlo en esos
  términos y no presentarla como aritmética inevitable. Ya pasó con el techo de
  40 kB de JavaScript, que llevó a rechazar shadcn/ui por un motivo que no era del
  cliente.
- **Sin peticiones a terceros en la carga inicial** (RNF-4). El mapa se carga solo
  si la persona lo pide.
- `astro check` sin errores ni advertencias.

## Estructura

```
AGENTS.md              este archivo
CLAUDE.md              puntero a este archivo
specs/                 especificaciones (leer primero)
scripts/verify.mjs     verificador de accesibilidad y peso
.claude/skills/        skills instalados (ver specs/habilidades.md)
src/
├── data/              todo el contenido editable
├── dev/               panel de ajuste visual — NO se construye, ver abajo
├── layouts/           <head>, SEO, datos estructurados
├── pages/             composición
├── components/        secciones y piezas — todas `.astro`, ninguna `.tsx`
├── styles/global.css  sistema de diseño
└── assets/fonts/      tipografías auto-hospedadas
public/logos/          logos institucionales (hoy marcadores de posición)
public/og/             imágenes para compartir, generadas con `npm run og`
```

**No hay dependencias de interfaz.** El sitio se compone solo con Astro: sin React, sin
`src/lib/`, sin `components.json`. Si hace falta una isla, se instala la integración
entonces y se escribe el motivo.

### El panel de ajuste visual (`/ajustar`)

`npm run dev` → <http://localhost:4321/ajustar>. Muestra la página **real** dentro de un
iframe con un panel de perillas al lado: encuadre y zoom de la fotografía de la franja,
velo, alto, fondos de sección, encuadre de los retratos y edición de textos en sitio.

Existe por un problema concreto: Daniel sabe qué quiere ver y describirlo en palabras
—«la imagen un poco más abajo»— cuesta varias vueltas y acaba en un número que el agente
adivina. El panel **no adivina**: emite el valor exacto y el archivo donde va, y eso es lo
que se pega en el chat.

Tres propiedades que no se pueden perder al tocarlo:

1. **No se publica.** La ruta la inyecta `panelDeAjuste()` en `astro.config.mjs` solo con
   `command === 'dev'`. Por eso el archivo vive en `src/dev/` y no en `src/pages/`: una
   página de `src/pages/` se construye siempre. En producción la ruta no está protegida,
   **no existe**. `[verificado: 2026-09-22, npm run build → dist/ajustar ausente]`
2. **No escribe en el repositorio.** El borrador vive en `localStorage`. Lo que sale del
   panel es texto para pegar; implementarlo sigue siendo un cambio revisado.
3. **Avisa antes de enamorarse.** Poner una imagen bajo un texto hace que axe devuelva ese
   texto como contraste indeterminado y `npm run verify` falla (RNF-1.3, la nota larga está
   en `FranjaSede.astro`). El panel lo dice en rojo en cuanto se activa, en vez de dejar que
   se descubra al implementarlo.

Comprobado el 2026-09-22 con Playwright sobre el servidor de desarrollo: monta los diez
grupos de controles, el encuadre mueve la fotografía real (`50% 50%` → `50% 72%`), el
informe emite el valor y el archivo, el marco a 390 px activa el diseño móvil de verdad, el
borrador sobrevive a recargar y el aviso de accesibilidad aparece. `[medido]`

## Git

Rama de trabajo: `claude/framework-app-profesional-n4wa0t`.

**Si un `push` devuelve 403, no es falta de permisos: es la cuenta equivocada.** En el
PC hay dos cuentas de GitHub en `gh` y la activa suele ser `danielcaignet-dataseed`, que
se usa en otros proyectos; **este repositorio es de `Daniel990310`**. Resuelto el
2026-09-21 con un ayudante de credenciales **local al repositorio**, que pide el token de
esa cuenta concreta sin cambiar la cuenta activa del sistema:

```bash
git config --local --replace-all credential.helper ""
git config --local --add credential.helper '!f() { echo username=Daniel990310; echo password=$(gh auth token --user Daniel990310); }; f'
```

Se prefiere a `gh auth switch` porque eso es estado global: cambiarlo para empujar aquí
rompe cualquier trabajo simultáneo en los otros repositorios. El token **no queda escrito
en `.git/config`**; se pide al llavero en cada invocación.

Los mensajes de commit explican **por qué** se hizo el cambio y qué se descartó,
no solo qué archivos se tocaron. Si una medición cambió, el mensaje incluye el
número antes y después.

## Pendientes que dependen de terceros

No son tareas de implementación. Están registrados como decisiones abiertas no
bloqueantes (A3–A7) en `requirements.md`:

- Afiliación de Rodolfo Feick, hoy «por confirmar»
- Correo institucional real (`seminario.wireless@pucv.cl` es un ejemplo)
- Logos oficiales: los 7 de `public/logos/` son marcadores de posición
- ~~Subdominio definitivo~~ **Resuelto el 2026-09-21**: el cliente compró
  **`bcsensing.org`** ante la demora de la DTI. El repositorio ya apunta ahí; falta
  configurar el panel y desplegar. Ver «EMPIEZA AQUÍ» de `ESTADO.md`
- Si el seminario tiene costo o es gratuito: hace falta para `offers` en el JSON-LD
- Traducción al inglés de los textos largos

**El host de producción no se escribe a mano en ningún archivo.** Sale de
`PRODUCTION_HOST`, que `astro.config.mjs` deriva de `PRODUCTION_SITE`. Lo importan
`BaseLayout.astro`, `src/pages/robots.txt.ts` y `scripts/verify-seo.mjs`. Hasta el
2026-09-21 había **dos** literales del dominio viejo decidiendo si el sitio se indexa:
olvidar uno al cambiar de dominio dejaba el sitio con `noindex` permanente y el
verificador en verde. Es justo el defecto que RNF-7.4 prohíbe, dentro del propio
verificador.
