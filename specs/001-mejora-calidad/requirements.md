# 001 — Mejora de calidad del sitio

**Estado:** requisitos acordados. Diseño escrito. Sin decisiones bloqueantes.
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
5. El selector de idioma es alcanzable y operable por teclado, y su estado
   actual se comunica de forma programática, no solo por color.
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
y 136,4 kB de primera carga** `[medido]`, muy por debajo de los techos. Lo que la
enmienda desbloquea es poder volver a meter React —componentes de 21st.dev, islas
interactivas de T10— sin que el peso sea por sí solo el argumento para rechazarlo.

### RNF-3 · SEO y metadatos

**Criterios de aceptación**

1. Datos estructurados `schema.org/Event` válidos según el validador de Google,
   en ambos idiomas.
2. `og:image` presente, de 1200×630, con el título y las fechas legibles.
   *Línea base: ausente.*
3. Enlace canónico correcto por idioma, y `noindex` mientras el sitio esté en una
   URL provisional.
4. Descripción y título propios por idioma, sin texto duplicado entre versiones.

### RNF-4 · Privacidad

**Criterios de aceptación**

1. Sin analítica, sin cookies y sin tipografías remotas.
2. Todo contenido de terceros —hoy solo el mapa— se carga únicamente por acción
   explícita de la persona.

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
2. La verificación falla con código de salida distinto de cero al incumplirse un
   presupuesto, de modo que sirva en integración continua.
3. Los resultados quedan registrados en `verification.md` con fecha y commit.

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
| A6 | Subdominio definitivo | El sitio vive en la URL de Cloudflare Pages con `noindex` |
| A7 | Traducción al inglés de los textos largos | Se puede lanzar primero en español con la estructura bilingüe ya lista |

## Trazabilidad

Cada tarea de `tasks.md` debe referenciar los requisitos que satisface. Ningún
requisito puede quedar sin al menos una tarea asociada.
