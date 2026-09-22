# 001 — Mejora de calidad del sitio

**Estado:** requisitos acordados. Diseño escrito. Sin decisiones bloqueantes.
**Implementación:** T1 a T10 completadas y verificadas (`tasks.md`). El cierre formal
de 001 está pendiente: la tabla de primitivas de RF-6 no refleja lo que se
implementó, y hay trabajo sin requisito. Lista en [`../README.md`](../README.md) §Estado.
**Línea base:** [`../baseline/auditoria-2026-07-29.md`](../baseline/auditoria-2026-07-29.md)
**Procedencia de las cifras:** [`../fuentes.md`](../fuentes.md)

## Objetivo

Elevar la calidad del sitio del seminario en accesibilidad, rendimiento,
estructura y alcance idiomático, con criterios medibles en lugar de
apreciaciones.

## Decisiones cerradas

Acordadas el 29 de julio de 2026:

| # | Decisión | Detalle |
| - | -------- | ------- |
| D1 | **Una sola página** | Se mantiene el scroll con anclas. No se fragmenta en páginas por sección. |
| D2 | **Bilingüe español e inglés, con selector** | El título oficial permanece **siempre en inglés**, en ambos idiomas del sitio. |
| D3 | **Registro de asistentes sin definir** | Se deja previsto en la especificación, no se implementa. |
| D4 | **Revisión visual general** | Swiss Modernism 2.0 más minimalismo, con tipografía Crimson Pro y Atkinson Hyperlegible. |
| D5 | **Dos temas con selector** | Claro por omisión, oscuro como alternativa, más la opción «según el sistema». |
| D6 | **Se adopta shadcn/ui sobre Radix** | Decisión del cliente, 30 de julio. Busca un sitio interactivo y no solo informativo. Revierte el rechazo anterior, que se apoyaba en un presupuesto de JavaScript que no venía del cliente. |

## Requisitos funcionales

### RF-1 · Sitio bilingüe

El contenido debe estar disponible en español e inglés, con selección explícita
por parte de la persona.

**Criterios de aceptación**

1. Existen rutas separadas y estables por idioma; ninguna versión depende de
   detección automática del navegador para ser alcanzable.
2. El título oficial del seminario aparece en inglés en ambos idiomas, sin
   traducirse.
3. Cada versión declara su idioma en el atributo `lang` del documento.
4. Ambas versiones se referencian mutuamente con `hreflang`, más un `x-default`.
5. El cambio de idioma es alcanzable y operable por teclado, y el idioma actual
   del documento se comunica de forma programática, no solo por color.

   > **Enmienda del 31 de julio de 2026, decidida por Daniel.** La redacción
   > anterior —«el selector … su estado actual se comunica de forma
   > programática»— presuponía un control con dos opciones y una marcada. Con
   > **exactamente dos idiomas**, el patrón «Select a language · Two languages»
   > del U.S. Web Design System define un **único** control que muestra el idioma
   > de destino: en la página en español dice «English». No hay estado que marcar,
   > porque el idioma actual lo declara `<html lang>`, que ya exige el criterio 3.
   >
   > Se adopta ese patrón por tres razones: es el estándar de accesibilidad para
   > este caso exacto; la implementación anterior producía dos píldoras
   > segmentadas idénticas y contiguas en la barra —idioma y tema— que se
   > confundían entre sí; y evita el desplegable, que cuesta una interacción de
   > más y esconde que existe otra versión.
   >
   > Lo que **no** se adopta del USWDS: su sugerencia de `role="button"` en el
   > enlace. Este control navega a otra URL, y anunciarlo como botón le indicaría
   > al lector de pantalla que la acción ocurre en esta página.
6. Cambiar de idioma conserva la sección en la que se estaba.
7. Ninguna cadena de texto queda escrita directamente en los componentes: todas
   provienen de la fuente de contenido por idioma.
8. El sitemap incluye ambas versiones.

### RF-2 · Contenido en una sola página

**Criterios de aceptación**

1. Todas las secciones son alcanzables por ancla desde la navegación.
2. La navegación funciona sin JavaScript.
3. La sección de programa muestra la agenda cuando hay datos y un aviso
   provisional cuando no, sin cambios en el marcado.

### RF-4 · Selector de tema claro y oscuro

**Criterios de aceptación**

1. Tres estados seleccionables: claro, oscuro y «según el sistema». El claro es
   el valor por omisión cuando no hay preferencia guardada.
2. El tema se aplica **antes del primer pintado**: no hay destello del tema
   equivocado al cargar.
3. La preferencia persiste entre visitas mediante `localStorage`, sin cookies.
4. Sin JavaScript el sitio queda en tema claro y sigue siendo funcional.
5. El selector es operable por teclado y su estado actual se comunica de forma
   programática, no solo por color.
6. **Ambos temas cumplen RNF-1 por separado**: cero hallazgos de axe en cada uno.
7. Ningún componente referencia un token primitivo: todos leen la capa
   semántica, de modo que cambiar de tema sea sustituir un bloque de valores.
8. `color-scheme` se declara en cada tema, para que los controles nativos del
   navegador acompañen al tema elegido.
9. La figura de propagación funciona en ambos temas sin duplicar el SVG.

### RF-6 · Componentes interactivos

Deriva de D6. **Confirmado por el cliente (Daniel) el 30 de julio de 2026.**
Se acuerdan las interacciones propuestas a continuación para mejorar la usabilidad del sitio.

Criterio para incluir una interacción: **debe resolver un problema real de
lectura del contenido**, no agregar movimiento. Una conferencia se consulta para
responder «cuándo», «quién» y «dónde»; la interacción tiene que hacer eso más
rápido.

| Interacción | Problema que resuelve | Primitiva |
| ----------- | --------------------- | --------- |
| Programa por jornada en pestañas | Dos días completos en una lista obligan a buscar; separados se consulta el día que interesa | `Tabs` |
| Resumen de cada sesión desplegable | Los títulos de charla no dicen de qué trata; el resumen completo alargaría la página | `Accordion` |
| Ficha de expositor en diálogo | Reseña y línea de investigación sin abandonar la página ni alargar la tarjeta | `Dialog` |
| Selector de tema de tres estados | RF-4 | `ToggleGroup` |
| Sección activa resaltada en la navegación | En scroll largo se pierde la ubicación | Ninguna: `IntersectionObserver` propio |

> **Enmienda del 31 de julio de 2026: ninguna primitiva de Radix se usó.** La
> columna «Primitiva» de la tabla anterior es **la propuesta original, no lo
> implementado**, y se conserva para que se vea qué se descartó y por qué.
>
> | Interacción | Propuesta | Implementado |
> | ----------- | --------- | ------------ |
> | Programa por jornada | `Tabs` | Mejora progresiva sobre el patrón ARIA de la W3C |
> | Resumen de sesión | `Accordion` | `<details>` nativo |
> | Ficha de expositor | `Dialog` | `<details>` nativo |
> | Selector de tema | `ToggleGroup` | Radios nativos (T2) |
> | Sección activa | Ninguna | `IntersectionObserver` propio |
>
> **El motivo es el criterio 2 de este mismo requisito**: el contenido tiene que
> seguir accesible sin JavaScript. Eso descarta de entrada cualquier componente que
> solo exista al hidratar, y con él el catálogo de React completo. Se buscó en
> 21st.dev antes de decidir: los ocho resultados de pestañas eran
> `react-aria-components`, Headless UI o shadcn, y ninguno funciona sin hidratar.
>
> **Consecuencia sobre D6**, que hay que decir sin adornos: la decisión del cliente
> de adoptar shadcn/ui sobre Radix **no se materializó en ningún componente**. Lo que
> el cliente pedía —«un sitio interactivo y no solo informativo»— se cumplió con HTML
> nativo. Si Daniel quiere específicamente shadcn/ui en el producto y no solo el
> resultado, eso es una decisión nueva y necesita un requisito nuevo.
>
> **Segunda enmienda, 2026-07-31: la base se retiró, por instrucción de Daniel.** La
> base montada en T3 —`@astrojs/react`, `react`, `react-dom`, `clsx`,
> `tailwind-merge`, `components.json` y `src/lib/utils.ts`— no la usaba ningún
> componente, no quedaba ni un `.tsx` ni una directiva `client:`, y la integración
> emitía **59,5 kB comprimidos de runtime de cliente en cada build** que ningún
> archivo de `dist` referenciaba. Se comprobó antes de borrar que nada de lo previsto
> para el próximo plan —fotos de expositores, línea de tiempo animada, hero con más
> movimiento, transiciones entre idiomas— lo necesita: eso se resuelve con
> `astro:assets`, CSS y la API de transiciones del navegador. Detalle y fuentes en
> `design.md` §6.6.
>
> Reinstalarlo es un comando. El candidato natural sigue siendo RF-3, el registro de
> asistentes, que es interacción que HTML nativo resuelve peor.
>
> Detalle en `ESTADO.md` §5h y §5j.

**Criterios de aceptación**

1. Cada interacción es operable **solo con teclado**, y el foco es visible en
   ambos temas.
2. El contenido sigue siendo accesible sin JavaScript: las pestañas degradan a
   secciones consecutivas y los resúmenes a texto visible. Nada de contenido que
   solo exista al hidratar.
3. Cero hallazgos de axe con los componentes montados y desplegados, no solo en
   su estado inicial.
4. Ninguna primitiva se instala sin un componente que la use.
5. El texto sale de los archivos de datos por idioma, nunca del componente.

**Fuera de esta propuesta:** el selector de idioma. Con dos idiomas, dos enlaces
son mejores que un menú desplegable: menos peso, menos código y una interacción
menos que verificar.

### RF-3 · Registro de asistentes (previsto, no implementado)

**Criterios de aceptación**

1. La especificación de diseño describe dónde entraría la sección y qué datos
   requeriría, sin agregar código ni dependencias.
2. Ningún servicio de terceros se integra mientras la decisión esté abierta.

### RF-7 · Fichas de expositor con reseña verificable

**Escrito el 31 de julio de 2026, después del código** (`3fe4c74`). Esto infringe la
regla 1 de `../README.md` —primero el requisito, después la implementación— y queda
registrado en lugar de disimularse: el requisito se redacta a partir de lo que se
implementó, así que su valor está en fijar los criterios de aquí en adelante, no en
haber guiado la construcción.

Los títulos de charla no dicen de qué trata la sesión y una tarjeta con solo nombre y
afiliación no permite saber a quién se va a escuchar.

**Criterios de aceptación**

1. Cada expositor tiene reseña y línea de investigación **en ambos idiomas**, con la
   clave tipada en `ContenidoIdioma`: añadir un expositor sin su reseña en los dos
   idiomas **no compila**.
2. Cada reseña se apoya en un **perfil público citable** —página institucional,
   repositorio académico— y la ficha enlaza esa fuente, de modo que cualquier dato sea
   comprobable por quien lea.
3. Ningún dato institucional sin confirmar se publica como confirmado. Lo que está
   `[probable]` va marcado «por confirmar» (A3), aunque las fuentes públicas
   concuerden.
4. La ficha se despliega **sin JavaScript** (deriva de RF-6.2).
5. Cero hallazgos de axe **con la ficha desplegada**, no solo cerrada.

### RF-8 · Programa: estado provisional y programa de ejemplo

**Escrito el 31 de julio de 2026, después del código** (`3fe4c74`), igual que RF-7 y
con la misma advertencia.

El programa real no existe todavía y el sitio tiene que poder mostrarse igual, sin
que la sección quede vacía y sin que nadie confunda una demostración con la agenda.

**Criterios de aceptación**

1. Con `program.days` vacío, la sección muestra el aviso provisional sin cambios en el
   marcado (ya exigido por RF-2.3).
2. El programa de ejemplo está **apagado por omisión**, detrás de una única bandera
   explícita en el código, no de una variable de entorno ni de un archivo suelto.
3. La bandera **solo surte efecto si el programa real está vacío**: dejarla encendida
   por descuido no puede sobrescribir una agenda publicada.
4. Con la bandera encendida, la sección muestra un **aviso visible** con `role="note"`,
   anunciado **antes** del programa, que declara que las sesiones son ficticias. El
   aviso no es opcional ni desactivable por configuración.
5. Los verificadores pasan **con la bandera encendida**, no solo apagada.

**El motivo se declara aquí y no solo en el código:** un programa apócrifo en el sitio
de un evento real, con fechas y sede reales, es información falsa con la que alguien
podría organizar un viaje. Es el mismo criterio que prohíbe generar los logos
institucionales.

## Requisitos no funcionales

### RNF-1 · Accesibilidad — WCAG 2.1 nivel AA

**Criterios de aceptación**

1. **Cero** hallazgos de axe-core en las reglas `wcag2a`, `wcag2aa`, `wcag21a` y
   `wcag21aa`, en ambos idiomas y en 1440×900 y 390×844.
   *Línea base: 16 nodos con contraste insuficiente.*
2. Todo texto alcanza 4,5:1, o 3:1 si es texto grande según la definición WCAG.
   La medición se hace **con las transiciones anuladas** (ver la nota
   metodológica de la línea base).
3. Los 28 nodos hoy indeterminados quedan resueltos: o se mide un ratio que
   cumple, o el texto deja de superponerse a un fondo no uniforme. El resultado
   se documenta en `verification.md`.
   *Línea base: 28 nodos sin determinar.*
4. Cada `<section>` tiene nombre accesible y se anuncia como región.
   *Línea base: 0 de 7.*
5. La jerarquía de encabezados refleja la jerarquía real del contenido: un rótulo
   de grupo no comparte nivel con los elementos que agrupa.
6. Todo elemento interactivo tiene foco visible con contraste suficiente contra
   su fondo.
7. El recorrido por teclado cubre toda la página en orden lógico, sin trampas de
   foco, incluido el menú móvil.
8. Con `prefers-reduced-motion: reduce` no queda movimiento activo, **incluido**
   el que se anima desde JavaScript.
9. El contenido es utilizable con un zoom de texto del 200 % sin pérdida de
   información ni desbordamiento horizontal.

### RNF-2 · Rendimiento

**Criterios de aceptación**

1. JavaScript transferido ≤ **115 kB comprimidos** por idioma.
   *Línea base: 109,3 kB.*
2. Peso total de la primera carga ≤ **260 kB comprimidos**, sin contar el mapa
   que se carga a petición.
   *Línea base: 241 kB.*
3. Ninguna petición a dominios de terceros en la carga inicial.
   *Línea base: cumple.*
4. Sin desplazamiento de diseño perceptible por la carga de tipografías.
5. El sitio es funcional y legible con JavaScript deshabilitado; lo que se pierde
   son refinamientos, no contenido ni navegación.

6. Las tipografías no superan **125 kB** en total (subconjunto latino).
   *Línea base: 108,3 kB con tres familias.*

### Cómo se fijaron estos presupuestos

Los valores anteriores —40 kB de JavaScript y 180 kB de primera carga— **no
venían del cliente: los propuse yo**, y la revisión de D6 los dejó sin sustento.
Los nuevos se derivan de una medición, no de una preferencia `[medido]`:

| Capa | gzip | Qué compra |
| ---- | ---- | ---------- |
| `react` + `react-dom` | 60,0 kB | Base necesaria para Radix |
| 5 primitivas de Radix | +36,2 kB | Pestañas, acordeón, diálogo, menú y grupo de alternancia |
| Componentes propios | ~7 kB | Las islas del sitio |
| **Total previsto** | **~103 kB** | Con 115 kB de techo queda margen |

Proyección de la primera carga: 119,7 kB de tipografías + ~103 kB de JavaScript +
~14 kB de HTML + ~10 kB de CSS ≈ **247 kB**, contra un techo de 260 kB.

**Motion queda fuera.** Cuesta 35 kB y solo compra el haz animado de la red de
colaboración, que se resuelve con SVG y `stroke-dashoffset` sin coste. Radix
cuesta prácticamente lo mismo y compra interacción real. El criterio no es el
tamaño en abstracto, sino qué se obtiene por cada kilobyte.

Con `client:visible` cada isla se carga por separado, así que el peso del primer
pintado es menor que el total. El presupuesto cubre el total, que es el caso
pesimista.

### Enmienda del 2026-07-30: el cliente relaja los techos de peso

**Daniel, en sesión: «el presupuesto de carga de datos no es una limitación para el
proyecto».** Como los números de RNF-2.1, 2.2 y 2.6 nunca vinieron del cliente —los
propuso el agente, como dice el párrafo de arriba—, esta instrucción los desautoriza y
manda.

Alcance exacto, para que nadie lo estire:

- **Se relajan** los tres techos numéricos: 2.1 (115 kB de JavaScript), 2.2 (260 kB de
  primera carga) y 2.6 (125 kB de tipografías).
- **Siguen en pie, y no son presupuestos de peso:** 2.3 (ninguna petición a terceros en
  la carga inicial), 2.4 (sin desplazamiento de diseño por tipografías) y 2.5 (el sitio
  funciona y se lee con JavaScript deshabilitado). Ninguno de los tres depende de
  cuántos kB se transfieren, así que la enmienda no los toca.

**No se ha fijado un techo nuevo, y el agente no lo va a inventar**: inventar cifras de
presupuesto es exactamente el error que este apartado documenta. Hasta que Daniel dé
una cifra —o diga que no quiere ninguna—, los valores siguen en `scripts/verify.mjs`
como **tripwire informativo**: se miden y se reportan, y superarlos es un dato que hay
que declarar en el commit, no un motivo para descartar trabajo. Las comprobaciones de
accesibilidad (RNF-1) siguen siendo bloqueantes sin cambio alguno.

En la práctica, hoy no cambia nada: al cerrar T3 el sitio va en **0,0 kB de JavaScript
y 136,4 kB de primera carga** `[medido]`, muy por debajo de los techos. **Corrección del
2026-07-31: esa cifra de primera carga estaba baja en 11,8 kB** por un defecto del
medidor que descartaba la hoja de estilos como huérfana; la medición correcta es
**152,5 kB**, que sigue muy por debajo del techo de 260 kB. Ver `../fuentes.md`. Lo que la
enmienda desbloquea es poder volver a meter React —componentes de 21st.dev, islas
interactivas de T10— sin que el peso sea por sí solo el argumento para rechazarlo.

### RNF-3 · SEO y metadatos

**Criterios de aceptación**

1. Datos estructurados `schema.org/Event` válidos según el validador de Google,
   en ambos idiomas.

   > **Cerrado el 2026-07-31.** `validator.schema.org` da **0 errores y 0 avisos** en
   > `/` y `/en/` sobre la URL publicada, con `Event`, `Place`, `PostalAddress`,
   > `Country`, `Organization` y `Person` reconocidos `[medido]`. La comprobación
   > estaba pendiente desde T8 porque exige URL pública; ahora está automatizada en
   > `npm run verify:publicado`, que llama al validador y falla si aparece cualquier
   > error o aviso. `verify:seo` sigue comprobando la estructura sobre `dist/`, que es
   > lo que se puede hacer sin red.
2. `og:image` presente, de 1200×630, con el título y las fechas legibles **y
   contenidos dentro del cuadrado central de 630×630**. El nombre del archivo lleva
   número de versión.
   *Línea base: ausente.*

   > La condición del cuadrado se añadió el 2026-09-22, **medida**. El cartel anterior
   > era correcto a 1200×630 y se veía bien en LinkedIn; el defecto estaba en otra
   > parte. **WhatsApp no siempre muestra la vista previa grande**: a menudo la reduce
   > a una miniatura cuadrada y recorta la imagen por el centro. Recortado así, el
   > cartel cortaba todas las líneas a media palabra —«…nnectivity:», «…ensing»,
   > «…ands»— `[medido: recorte central reproducido con Playwright sobre la imagen
   > publicada]`.
   >
   > **No se puede resolver dando otra imagen a WhatsApp: no existe tal campo.** Lee
   > `og:image`, el mismo que LinkedIn, X, Facebook, Slack y Telegram. Y sustituirlo
   > por un logo suelto dejaría a LinkedIn —donde un seminario académico se difunde—
   > con un cuadro sin título ni fechas, que es lo que este mismo criterio prohíbe.
   >
   > No se verifica sobre el PNG: exige saber **dónde** está cada elemento, no cómo se
   > ve el resultado. Lo mide `scripts/generar-og.mjs`, que aborta si el bloque legible
   > se sale de `x ∈ [285, 915]`. La captura saldría perfecta y `verify:seo` aprobaría
   > igual, así que sin esa medición el fallo solo se descubre mirando un teléfono.
   >
   > **El número de versión del nombre existe porque las plataformas cachean la vista
   > previa por URL**, y durante mucho tiempo. Cambiar el contenido dejando el mismo
   > nombre no actualiza los enlaces ya compartidos ni los reenvíos: Facebook tiene un
   > depurador manual, WhatsApp no tiene ninguno. Se sube en `src/data/og.ts` cada vez
   > que cambia el aspecto del cartel.
   >
   > El peso se vigila de paso: **WhatsApp descarta la vista previa grande por encima
   > de unos 300 kB** `[Probable]`. Las actuales pesan 191 y 190 kB `[medido]`.
3. Enlace canónico correcto por idioma, y `noindex` mientras el sitio esté en una
   URL provisional.
4. Descripción y título propios por idioma, sin texto duplicado entre versiones.
5. **El sitio sirve un `/robots.txt` generado a partir de la URL del build**, no un
   archivo estático. En producción declara la ubicación del sitemap; mientras la URL
   sea provisional prohíbe todo el rastreo.

   > Añadido el 2026-09-21, al comprar el dominio propio. Un `robots.txt` escrito a
   > mano en `public/` se copiaría **verbatim** a cualquier despliegue y anunciaría el
   > sitemap de producción desde una URL de previsualización. Es la misma familia del
   > fallo de `SITE_URL` de RNF-7.2: un archivo que no sabe dónde está publicado.
   > `<link rel="sitemap">` en el `<head>` **no sustituye** a esto: los rastreadores no
   > lo usan para descubrir el sitemap.
6. Los datos estructurados declaran `url` e `image` propios de cada idioma.

   > Añadido el 2026-09-21. `schema.org/Event` los lista como recomendados y el
   > resultado enriquecido de evento de Google no se construye sin `image`. Las dos
   > piezas ya existen en la página —el enlace canónico y la imagen para compartir—,
   > así que es exponerlas en el JSON-LD, no producir nada nuevo.

7. **Los datos estructurados declaran el régimen de acceso**: `isAccessibleForFree` y
   una `Offer` con precio y moneda, tomados de los datos y no escritos en el marcado.

   > Añadido el 2026-09-22, **cuando el dato existió**. Hasta entonces esto era una
   > decisión abierta y no un pendiente de implementación: nadie había confirmado si el
   > seminario tenía costo, y la regla de procedencia prohíbe inventarlo. Daniel
   > confirmó ese día que **la asistencia es gratuita**.
   >
   > Google necesita **las dos** cosas para mostrar el distintivo «Gratis» en el
   > resultado de evento: `isAccessibleForFree: true` **y** una `Offer` con `price: 0`.
   > Solo con la primera no construye el resultado enriquecido. Y `priceCurrency` va
   > aunque el precio sea cero, porque `schema.org/Offer` la exige y sin ella el
   > validador descarta la oferta entera.
   >
   > El dato vive en `comun.acceso` y no en el layout —RNF-5.1—, y no se traduce: un
   > precio no tiene idioma. **El riesgo que esto introduce y por el que el criterio se
   > verifica**: si el seminario pasara a cobrar y nadie tocara los datos, el sitio
   > seguiría anunciando «Gratis» en Google. Un precio viejo en un resultado de
   > búsqueda es peor que no declarar precio, así que el verificador comprueba que el
   > JSON-LD **concuerde con los datos**, no que diga «gratis».
   >
   > La `url` de la oferta es la página del seminario y no una de inscripción: RF-3
   > —registro de asistentes— está fuera de alcance y esa página no existe.

### RNF-4 · Privacidad

**Criterios de aceptación**

1. Sin analítica, sin cookies y sin tipografías remotas.
2. Todo contenido de terceros —hoy solo el mapa— se carga únicamente por acción
   explícita de la persona.
3. **El criterio se comprueba sobre el HTML que el borde entrega, no sobre `dist/`, y
   con cabeceras de navegador.**

   > Añadido el 2026-09-22 **por un fallo real, no por precaución**. Dos segundos
   > después de que la zona de Cloudflare activara, Cloudflare creó por su cuenta un
   > sitio de Web Analytics con `auto_install: true` y regla `host:* paths:*`, y
   > empezó a inyectar `static.cloudflareinsights.com/beacon.min.js` en todas las
   > páginas `[medido: 2026-09-22]`. Nadie lo pidió.
   >
   > **Ningún verificador podía verlo**, y ese es el punto: todos miraban `dist/`, y
   > esto no está en `dist/`. Lo añade el borde **después** del despliegue. Un sitio
   > que cumple RNF-4.1 en el repositorio puede incumplirlo en producción, y el
   > repositorio no se entera.
   >
   > **Y hay que pedirlo como navegador.** La inyección es condicional: un `curl` sin
   > `User-Agent` de navegador recibe el HTML limpio. Un criterio escrito sin esa
   > cabecera habría pasado en verde con el beacon puesto, que es peor que no tenerlo.
   >
   > Lo destapó la CSP de RNF-7.7 al bloquear el script. Sin ella habría seguido ahí.
   > Se corrigió poniendo `auto_install: false` en el sitio de Web Analytics —la acción
   > reversible mínima, en vez de borrarlo— y **la configuración vive en Cloudflare, no
   > en el repositorio**: por eso el criterio tiene que medirla en vivo cada vez.
   >
   > Solo cuentan los **subrecursos** (`<script src>`, `<link href>`, `<img src>`,
   > `<iframe src>`). Los `<a href>` a las universidades y a los perfiles de los
   > expositores son navegación, no peticiones, y no los prohíbe nada.

### RNF-5 · Mantenibilidad

La organización del seminario debe poder actualizar el sitio sin tocar marcado ni
estilos.

**Criterios de aceptación**

1. Todo el contenido editable vive en archivos de datos por idioma.
2. Publicar el programa consiste en poblar una estructura de datos.
3. Reemplazar un logo consiste en sustituir un archivo, conservando el nombre.
4. `astro check` sin errores ni advertencias.
5. Cada decisión de diseño no evidente queda explicada en el código, con el
   motivo y no solo la descripción.

### RNF-6 · Verificación automatizada

**Criterios de aceptación**

1. La auditoría de accesibilidad y el presupuesto de peso se ejecutan con un
   comando del proyecto, no con scripts ad hoc externos.

   > **La auditoría corre WCAG 2.1 AA *más* las buenas prácticas de axe**, desde el
   > 2026-09-22. Antes `runOnly` excluía `best-practice`, con un comentario que decía
   > que esas reglas «se informan pero no bloquean» —y **ni siquiera se ejecutaban**—.
   >
   > Ese hueco costó un defecto real. El enlace «Saltar al contenido», el **primer
   > elemento interactivo de la página**, apuntaba a `#contenido`, un ancla que no
   > existía en ninguna parte: con teclado se pulsaba Tab y Enter y no se iba a ningún
   > sitio. Este verificador daba 0 violaciones porque la regla `skip-link` de axe está
   > etiquetada `best-practice`. **Lo destapó Lighthouse, no nosotros.**
   >
   > Medido sobre el sitio publicado antes de arreglarlo: con solo `wcag*`, 0
   > violaciones; con `best-practice`, `skip-link` y `region` `[medido]`. La segunda
   > venía arrastrada: axe solo exime al enlace de salto de estar dentro de un landmark
   > si su destino existe.
   >
   > Con el ancla puesta, las tres páginas dan 0 violaciones con el juego ampliado, así
   > que ampliarlo no costó nada. Si alguna regla de `best-practice` resulta
   > inaceptable, se excluye **esa** por nombre y se escribe por qué; no se vuelve a
   > apagar la categoría entera.
2. La verificación falla con código de salida distinto de cero al incumplirse un
   presupuesto, de modo que sirva en integración continua.
3. Los resultados quedan registrados en `verification.md` con fecha y commit.

### RNF-7 · Publicación

**Escrito el 31 de julio de 2026, después del código** (`a906415`, `17572a9`,
`8f4bdfc`). Tercera y última vez que esto pasa en 001; las tres quedan declaradas.

**Criterios de aceptación**

1. El despliegue se hace con **configuración versionada** en el repositorio
   (`wrangler.jsonc`), no con ajustes hechos a mano en un panel que nadie más ve.
2. La URL pública se declara por entorno —`SITE_URL` o la variable equivalente del
   proveedor—. **Si nadie la declara, el sitio no se indexa**: `noindex` obligatorio,
   para que un despliegue mal configurado no pueda publicar enlaces canónicos ni
   imágenes apuntando a un dominio que no existe.
3. Mientras el dominio sea provisional, **ambas páginas llevan `noindex, nofollow`**.
4. **Ningún verificador queda atado a un dominio concreto.** Un verificador que da por
   bueno un host fijo deja de comprobar en cuanto el dominio cambia, que es
   exactamente lo que ocurrió antes de `8f4bdfc`.
5. Lo publicado se comprueba **contra la URL en vivo**, no solo contra `dist/`:
   `npm run verify:publicado`. Queda fuera de `verify:todo` a propósito, porque
   depende de la red y de un servicio de terceros, y la autoridad sobre el
   cumplimiento no puede depender de que haya conexión.
6. **Una URL inexistente devuelve `404` con una página del sitio**, con el mensaje en
   **ambos idiomas** y enlace de vuelta a cada versión del inicio.

   > Añadido el 2026-09-22, medido sobre el sitio publicado: `/pagina-que-no-existe`
   > devolvía **`404` con 0 bytes** —una página en blanco—, porque el proyecto no tiene
   > `src/pages/404.astro` y Cloudflare sirve el suyo, que está vacío. El código HTTP
   > era correcto; lo que faltaba era la página. Para un sitio que se difunde por
   > enlace, QR y programa impreso, una letra mal copiada dejaba a la persona en blanco
   > sin manera de llegar al seminario. **No sustituye al 404: no se redirige al
   > inicio.** Un redirección 302 al inicio produce un «soft 404», que Google trata
   > como contenido duplicado del inicio y desaconseja explícitamente.
   >
   > **El mensaje va en los dos idiomas en una sola página, y no una por idioma.** Un
   > sitio estático sirve un único `404.html` para cualquier ruta que no exista:
   > `/en/lo-que-sea` y `/lo-que-sea` reciben el mismo archivo, y no hay nada en el
   > borde que pueda elegir. Servir uno por idioma exigiría lógica de Worker, que este
   > sitio no tiene y que RNF-7.1 evita a propósito. Dos frases cuestan menos que un
   > Worker.
7. **El sitio declara una `Content-Security-Policy`** generada en el build a partir de
   lo que las páginas realmente contienen, no escrita a mano.

   > Añadido el 2026-09-22. Las cabeceras servidas eran `X-Frame-Options`,
   > `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy` `[medido sobre
   > el sitio publicado]` — `_headers` **sí funciona** en Workers con activos estáticos,
   > lo que el comentario del propio archivo dejaba en duda al nombrar solo a Pages y
   > Netlify—. Faltaba la única que limita **qué puede ejecutarse** si alguna vez se
   > inyecta contenido.
   >
   > Se genera y no se escribe a mano porque el contenido medido lo exige: cada página
   > lleva **9 scripts en línea y 4 estilos en línea**, todos producidos por Astro, y
   > sus hashes **cambian en cada build**. Una CSP escrita a mano quedaría obsoleta al
   > primer cambio de contenido y rompería el sitio en silencio —el navegador no avisa,
   > solo deja de ejecutar—. Con hashes no hace falta `'unsafe-inline'` en `script-src`.
   >
   > **Lo que esta CSP no cubre, y por qué.** Las páginas llevan **34 atributos
   > `style="…"`**, y los hashes de `style-src` no se aplican a los atributos: exigirían
   > `'unsafe-hashes'` con 34 hashes, que es peor que el problema. Se declara
   > `style-src-attr 'unsafe-inline'` y **se dice así**, en lugar de presentar la
   > política como más estricta de lo que es. El resto sí queda cerrado: sin
   > `'unsafe-inline'` en `script-src`, `object-src 'none'`, `form-action 'none'` —el
   > sitio no tiene formularios `[medido]`— y `frame-src` limitado a
   > `https://www.openstreetmap.org`, que es el único tercero del sitio y solo se carga
   > por acción explícita (RNF-4.2).
   >
   > `frame-ancestors` se declara `'self'` para **concordar** con el
   > `X-Frame-Options: SAMEORIGIN` que ya se sirve. Dos cabeceras que dicen cosas
   > distintas sobre lo mismo es una contradicción que alguien acabará resolviendo mal.

## Fuera de alcance

- Registro de asistentes (RF-3 queda como previsión).
- Panel de administración de contenidos: se mantiene la edición por archivos.
- Más de dos idiomas.
- Fragmentación en varias páginas (D1).

## Decisiones abiertas

### Bloqueantes

| # | Decisión | Bloquea | Estado |
| - | -------- | ------- | ------ |
| A1 | Referencias de repositorios a revisar e incorporar | `design.md` | **Resuelta** — ver `design.md` §1 |
| A2 | Fondo claro institucional u oscuro instrumento | `tasks.md` | **Resuelta** — D5: ambos, claro por omisión |

### No bloqueantes

| # | Decisión | Impacto si se resuelve tarde |
| - | -------- | ---------------------------- |
| A3 | Afiliación de Rodolfo Feick | Se publica con «por confirmar» |
| A4 | Correo institucional de contacto | Queda un valor de ejemplo |
| A5 | Logos oficiales | Se publica con marcadores de posición |
| A6 | ~~Subdominio definitivo~~ | **Resuelta el 2026-09-21 por la vía alternativa**: ante la demora de la DTI, el cliente compró **`bcsensing.org`** («BC» por *Beyond Connectivity*, el título corto). Es el dominio canónico y el que va impreso. Si el subdominio PUCV llega después, redirige 301 hacia aquí, no al revés: cambiar el canónico una vez indexado cuesta más que mantener la redirección |
| A7 | Traducción al inglés de los textos largos | Se puede lanzar primero en español con la estructura bilingüe ya lista |

## Trazabilidad

Cada tarea de `tasks.md` debe referenciar los requisitos que satisface. Ningún
requisito puede quedar sin al menos una tarea asociada.
