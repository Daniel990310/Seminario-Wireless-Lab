# 001 — Mejora de calidad del sitio

**Estado:** requisitos acordados. Diseño escrito. Tareas bloqueadas por A2.
**Línea base:** [`../baseline/auditoria-2026-07-29.md`](../baseline/auditoria-2026-07-29.md)

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
| D4 | **Revisión visual general** | El tratamiento visual se rehace, no se ajusta. Alcance a definir con las referencias. |

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

1. JavaScript transferido ≤ **40 kB comprimidos** por idioma.
   *Línea base: 109,3 kB.*
2. Peso total de la primera carga ≤ **180 kB comprimidos**, sin contar el mapa
   que se carga a petición.
   *Línea base: 241 kB.*
3. Ninguna petición a dominios de terceros en la carga inicial.
   *Línea base: cumple.*
4. Sin desplazamiento de diseño perceptible por la carga de tipografías.
5. El sitio es funcional y legible con JavaScript deshabilitado; lo que se pierde
   son refinamientos, no contenido ni navegación.

El presupuesto de 40 kB es deliberadamente exigente: obliga a decidir si la
sección que hoy cuesta 109 kB justifica ese peso o se resuelve de otra forma.

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
| A2 | **Fondo claro institucional u oscuro instrumento** | `tasks.md` | Abierta — recomendación en `design.md` §3 |

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
