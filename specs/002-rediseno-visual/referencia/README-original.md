# Handoff: Beyond Connectivity — Sitio del seminario (Wireless Lab)

## Overview
Sitio de una sola página (en español) para el seminario **Beyond Connectivity**: portada/hero, descripción del evento, agenda por bloques horarios con tarjetas expandibles de charlas y ponentes, panel lateral de información, y franja de logos de instituciones patrocinantes.

## About the Design Files
Los archivos de este bundle son **referencias de diseño hechas en HTML** — prototipos que muestran la apariencia y el comportamiento buscados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Vue, Astro, etc.) usando sus patrones y librerías establecidos. Si no existe todavía un entorno, elegir el framework más apropiado (para un sitio de evento estático, algo como Astro o Next.js estático es razonable) e implementarlo ahí.

`Beyond Connectivity - Sitio.dc.html` es un "Design Component": el markup vive dentro de `<x-dc>` y la lógica en la clase `Component extends DCLogic` al final del archivo. `support.js` es solo el runtime que hace funcionar ese formato — **no debe portarse**. Lee el `.dc.html` como fuente de verdad de valores exactos (colores, tamaños, copy); todos los estilos están inline en el markup.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciados, copy y transiciones son los definitivos. Se espera recreación pixel-perfect usando los componentes y utilidades del codebase destino.

## Cómo leer el archivo de diseño
- Todo el estilo es **inline** en los atributos `style` — no hay hojas de estilo ni clases. Al portar, conviene extraer a los tokens/utilidades del codebase.
- `<sc-for list="{{ ... }}" as="item">` = un `.map()` sobre el array expuesto por `renderVals()`.
- `<sc-if value="{{ ... }}">` = render condicional.
- `{{ nombre }}` = interpolación de un valor devuelto por `renderVals()` en la clase `Component`.
- `style-hover="..."` = estado `:hover`.
- Los datos del seminario (bloques, charlas, ponentes) están como arrays en la clase de lógica: **son el contenido real y deben migrarse tal cual**, idealmente a un JSON/CMS.

## Screens / Views
Es una sola vista con secciones apiladas verticalmente. En orden:

1. **Hero / portada** — Título del seminario, bajada, fecha y lugar. Punto de entrada visual.
2. **Descripción del evento** — Párrafos introductorios sobre el objetivo del seminario.
3. **Agenda** — El núcleo de la página. Bloques cronológicos; cada charla es una **tarjeta expandible** que revela resumen y bio del ponente. Los bloques de **pausa/café y almuerzo** son tarjetas de menor jerarquía (sin expansión).
4. **Panel lateral de información** — Columna con datos prácticos (fecha, sede, inscripción, contacto). En desktop es sticky con `max-height: 70vh` y scroll propio; en móvil colapsa al flujo normal bajo el contenido.
5. **Franja de logos** — Instituciones organizadoras y patrocinantes, en SVG (ver `/logos`).

Para medidas, colores, tipografías y copy exactos de cada sección: leer directamente los atributos `style` del `.dc.html`. Están todos explícitos y no hay herencia de clases que resolver.

## Interactions & Behavior
- **Tarjetas de charla expandibles**: clic en la cabecera alterna abierto/cerrado. La animación usa `max-height` + `opacity` con transición. La altura de destino se **mide en el DOM** al abrir (el contenido es de altura variable), en vez de usar un `max-height` fijo grande — así el cierre no queda con delay.
  - ⚠️ **Punto abierto conocido**: la medición se recalcula en cada render, aunque no haya cambiado el contenido. En la implementación real, resolverlo con un **`ResizeObserver`** sobre el contenido interno (o el equivalente del framework), midiendo solo cuando cambia de verdad. Alternativa aceptable: `grid-template-rows: 0fr → 1fr`, que anima altura automática sin medir nada — es la vía recomendada si el codebase lo permite.
- **Hover** en tarjetas y enlaces: cambios sutiles de fondo/borde, definidos en `style-hover`.
- **Panel lateral**: sticky con scroll interno en desktop (≥ breakpoint), estático y colapsado en móvil.
- **Responsive**: layout de dos columnas (agenda + panel) que colapsa a una sola columna en móvil.
- Sin estados de carga ni error: el contenido es estático.

## State Management
- `openId` (o índice equivalente): qué tarjeta de charla está expandida. Un solo estado para toda la agenda — conviene decidir explícitamente si se permite más de una tarjeta abierta a la vez (el prototipo actual asume acordeón de una sola).
- Altura medida del contenido expandido (ver nota de `ResizeObserver` arriba).
- Sin data fetching: todo el contenido está embebido.

## Design Tokens
Los valores exactos están inline en el `.dc.html`. Al portar, extraerlos a los tokens del codebase destino en lugar de repetirlos. Conviene recorrer el archivo y consolidar:
- **Colores**: buscar `color:` / `background:` / `border` en el archivo — la paleta es acotada (1–2 fondos + acento).
- **Tipografía**: el `<helmet>` al inicio del template contiene los `<link>` a las fuentes; las escalas de tamaño están en los `style` inline.
- **Espaciado, radios y sombras**: `padding` / `gap` / `border-radius` / `box-shadow` inline.

## Assets
`/logos` — 7 SVG de instituciones: ANID, Columbia, EIE-PUCV, Nokia Bell Labs, PUCV, UC, USACH. Son los archivos originales del proyecto y deben usarse tal cual (no rehacer ni vectorizar de nuevo). Verificar con la organización el uso correcto de cada marca antes de publicar.

## Files
- `Beyond Connectivity - Sitio.dc.html` — el diseño completo (markup + lógica + datos del seminario).
- `support.js` — runtime del formato de prototipado. **No portar.** Se incluye solo para que el `.dc.html` se pueda abrir en un navegador y verse tal como fue diseñado.
- `logos/*.svg` — assets de marca.

## Trabajo pendiente conocido
1. Resolver la medición de altura de las tarjetas expandibles (`ResizeObserver` o `grid-template-rows`) — ver arriba.
2. Aligerar visualmente los bloques de **pausa y almuerzo** en la agenda: deben tener menos peso que las charlas (menos padding, sin borde fuerte, tipografía más discreta). En el prototipo actual todavía compiten en jerarquía con las charlas.
