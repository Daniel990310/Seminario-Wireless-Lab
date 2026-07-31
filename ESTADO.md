# Estado y continuidad

Este archivo existe para que el trabajo pueda **cambiar de entorno sin perder el
hilo**. El proyecto se desarrolla desde varios sitios —Claude Code en el navegador,
en el móvil, en el PC, y Antigravity— y ninguno de ellos ve el historial de
conversación de los otros. Lo único compartido es el repositorio. Por lo tanto:

> **Si no está escrito en el repositorio, no ocurrió.**

Actualizado: **2026-07-30 noche** · Rama de trabajo: `claude/framework-app-profesional-n4wa0t`
· Último commit de tarea: `dcaf20a` (T5, RNF-1.4 y T4b)

> **`npm run verify` está en verde por primera vez:** 0 hallazgos de axe,
> 0 nodos indeterminados, 0 secciones sin nombre, todos los presupuestos
> cumplidos. Los tres verificadores en verde con `npm run verify:todo`.
>
> Commits de esta sesión, todos en la rama de trabajo:
>
> | Commit | Qué |
> | ------ | --- |
> | `dcaf20a` | T5, RNF-1.4 y T4b en el código |
> | `3f147c2` | Registro en las especificaciones |
> | `707475d` | Retirada de `Ripple`, sin uso tras T5 |
> | `a6610d4` | RNF-2.1 pasa a medir también el JavaScript en línea |

## 0b. Primera sesión de Antigravity — 2026-07-30, noche

Traspaso recibido de Claude (§0). Se leyeron `AGENTS.md`, `ESTADO.md`, `requirements.md`,
`design.md`, `tasks.md`, `habilidades.md` y `fuentes.md`. Verificación completa ejecutada
y confirmada:

```
npm run verify:todo (Windows, commit 9fbbf8c)
  Accesibilidad:  0 hallazgos, 104 indeterminados (→T5), 7 sin nombre (→T6)
  RF-4:           17/17 criterios ✓
  T3:             7/7 criterios ✓
  Peso:           JS 0,0 kB | primera carga 124,4 kB | tipografías 110,9 kB
```

Lo que se hizo:

1. **Investigación profunda del MCP de 21st.dev.** Se documentaron las 13 herramientas
   del servidor, sus parámetros y costos. Se verificó el formato de `.21st/design.json`
   (antes marcado como `[medido]` sin especificación pública; ahora `[verificado]`).
2. **Flujo SDD modificado.** `specs/habilidades.md` §6bis reescrito con un flujo de
   5 fases (Explorar → Evaluar → Prototipar → Implementar → Verificar) que integra
   21st.dev como catálogo de referencia sin romper las reglas del proyecto. El filtro de
   registro visual (§5) reemplaza al de peso como barrera principal.
3. **`.21st/design.json` creado.** Tokens del tema claro del proyecto para que `generate`
   y `get_inspiration` respeten la identidad visual. Versionado a propósito: útil que
   viaje a todos los clones.

**Las 3 preguntas que quedaron abiertas aquí ya están respondidas.** Se conservan con
su respuesta porque el registro de qué se preguntó importa:

| Pregunta | Respuesta de Daniel, 2026-07-30 |
| -------- | ------------------------------- |
| ¿Agregar T4b (refinamiento visual)? | **Sí.** Ya está completada; ver §5d |
| ¿Confirmar RF-6 / T10 (componentes interactivos)? | **Sí.** T10 desbloqueada |
| ¿Rotar la API key de 21st.dev? | **Hecha y revocada la anterior.** Ver §6b |

**Lo que decía esta sección sobre la siguiente tarea quedó obsoleto:** T4, T4b, T5 y
la parte de T6 que cierra RNF-1.4 están completadas. El estado vigente está en §4.

## 0. Traspaso a Antigravity — 2026-07-30, tarde

Lo que cambió en esta sesión y hay que saber antes de escribir una línea de código:

1. **El presupuesto de peso ya no bloquea.** Daniel lo relajó explícitamente. Los
   techos de RNF-2.1/2.2/2.6 pasan a ser **tripwire informativo**: se miden, se
   reportan en el commit, no se usan para descartar trabajo. Enmienda completa y su
   alcance exacto en `requirements.md`, apartado «Enmienda del 2026-07-30». **No
   inventar un techo nuevo:** no hay cifra, y ese es justamente el error que ya se
   cometió una vez.
2. **Accesibilidad sigue bloqueante.** RNF-1 no se tocó. `npm run verify` sigue
   siendo la autoridad ahí, y los dos incumplimientos abiertos (§4) son el trabajo
   de T5 y T6, no regresiones.
3. **El MCP de 21st.dev funciona** desde el PC de Daniel (§6b). Cómo aprovecharlo,
   qué gasta cuota y qué no: `specs/habilidades.md` §6bis. Con el peso relajado, la
   objeción principal contra sus componentes React desaparece; queda la de registro
   visual (§6bis y `habilidades.md` §5): es una conferencia académica, no una
   landing de producto.
4. **La clave `API_KEY_21ST` no va en un `.env`.** Claude Code no lee `.env`. En
   Antigravity el mecanismo puede ser otro: verificarlo antes de suponerlo, y no
   copiar el patrón `.env` porque «funcionó en el otro lado».
5. **Siguiente tarea sin bloqueo: T4 (tipografía).** T5 y T6 son las que cierran los
   incumplimientos abiertos. T10 sigue bloqueada por RF-6, y el peso relajado **no**
   la desbloquea: lo que falta es que Daniel confirme que quiere esos componentes.

Primer comando, siempre: `git fetch origin && npm ci && npm run build && npm run
verify:todo`. Si eso no corre, nada de lo de arriba es accionable todavía.

**Confirmado desde el PC de Daniel (Windows), en la misma tarde:** los tres
verificadores corren igual en Windows que en el entorno original. Se encontró y
corrigió un bug de portabilidad real: `scripts/verify.mjs` resolvía su propia
carpeta con `new URL('..', import.meta.url).pathname`, que en Windows da
`/C:/Users/...` y rompe el acceso a `dist/`. Corregido con `fileURLToPath`. Ver la
trampa nueva en `AGENTS.md`.

---

## 1. Antes de tocar nada, en cualquier entorno

```bash
git fetch origin
git status -sb                       # ¿hay divergencia con el remoto?
git log --oneline -5                 # ¿coincide con el «último commit» de arriba?
npm ci                               # dependencias exactas del lockfile
npm run build && npm run verify:todo # ¿de qué estado real parto?
```

Si `git status -sb` muestra que la rama va **detrás** o **divergida**, resolver eso
primero. Si el «último commit» de arriba no coincide con `git log`, este archivo
está desactualizado: creer al repositorio, no a este archivo, y corregirlo.

## 2. Reglas de convivencia entre entornos

Estas reglas no son burocracia: cada una evita una forma concreta de perder
trabajo.

1. **Nunca `git push --force` ni `--force-with-lease` en esta rama.** Hay clones en
   el móvil, en el PC y en Antigravity. Reescribir historia publicada rompe todos
   los demás clones. Si hace falta deshacer algo, se hace con un commit nuevo que
   revierte.
2. **Un entorno a la vez sobre la misma tarea.** Dos agentes trabajando la misma
   tarea T no se fusionan bien: el conflicto no es de texto, es de criterio.
   Antes de empezar, mirar en `specs/001-mejora-calidad/tasks.md` si la tarea ya
   está marcada como en curso.
3. **Empujar al terminar cada tarea, no al final de la sesión.** Una tarea
   completada y sin empujar es trabajo que el siguiente entorno va a rehacer.
4. **Actualizar este archivo en el mismo commit que cierra una tarea.** Si se
   actualiza aparte, se olvida.
5. **`npm run verify` en verde antes de declarar cualquier cosa terminada.** Es la
   autoridad del proyecto sobre accesibilidad (RNF-6). Sin él, «mejoré la
   accesibilidad» es una opinión. Desde la enmienda del 2026-07-30 los tres techos
   de peso son informativos: se miden y se declaran, pero no invalidan el trabajo.

## 3. Qué leer, y en qué orden

| Archivo | Para qué |
| ------- | -------- |
| [`AGENTS.md`](AGENTS.md) | **Entrada obligatoria.** Comandos, convenciones, decisiones cerradas D1–D6 y las **trampas de medición ya descubiertas**. Leerlo evita repetir errores que ya costaron tiempo |
| [`specs/README.md`](specs/README.md) | Cómo funciona el flujo SDD y qué significan las marcas de procedencia |
| [`specs/001-mejora-calidad/requirements.md`](specs/001-mejora-calidad/requirements.md) | **Lo único que se puede implementar.** Lo que no está aquí, no se hace |
| [`specs/001-mejora-calidad/tasks.md`](specs/001-mejora-calidad/tasks.md) | T1 a T10, con la comprobación verificada de cada una ya cerrada |
| [`specs/fuentes.md`](specs/fuentes.md) | Registro de procedencia: toda cifra con su forma de reproducirla |
| [`specs/habilidades.md`](specs/habilidades.md) | Qué skills usar y con qué precauciones |

`CLAUDE.md` es solo un puntero a `AGENTS.md`, para que las instrucciones sirvan a
cualquier herramienta y no solo a Claude Code.

## 4. Estado por tarea

| Tarea | Estado |
| ----- | ------ |
| T1 · Comando de verificación (RNF-6) | **Completada y verificada.** `npm run verify` |
| T2 · Tokens en tres capas y selector de tema (RF-4) | **Completada y verificada.** 0 hallazgos de contraste en las 4 corridas |
| T3 · Quitar Motion y montar la base de shadcn/ui | **Completada y verificada.** JavaScript a 0,0 kB. Ver §5 |
| T4 · Tipografía | **Completada y verificada.** Crimson Pro + Atkinson Hyperlegible Next (122,6 kB) |
| T4b · Refinamiento visual | **Completada y verificada.** Sin componentes del catálogo: ver §5d |
| T5 · Retícula de 12 columnas (RNF-1.3) | **Completada y verificada.** 104 → **0** nodos indeterminados. Ver §5b |
| T6 · Nombres accesibles y teclado (RNF-1.4) | **Completada y verificada.** 12 criterios en `npm run verify:teclado`. Ver §5e |
| T7 · Sitio bilingüe (RF-1) | Pendiente |
| T8 · `og:image` por idioma | Pendiente |
| T9 · Verificación final | Pendiente |
| T10 · Componentes interactivos (RF-6) | **Desbloqueada: RF-6 confirmada por Daniel el 2026-07-30.** |

### Lo que mide el verificador ahora mismo

Con `npm run build && npm run verify` al cerrar T4:

| Comprobación | Valor | Límite | |
| ------------ | ----- | ------ | - |
| RNF-1.1 Hallazgos axe WCAG 2.1 AA | 0 | 0 | cumple |
| RNF-1.3 Nodos con contraste indeterminado | **0** (eran 104) | 0 | cumple |
| RNF-1.4 Secciones sin nombre accesible | **0** (eran 7) | 0 | cumple |
| RNF-1.5 Saltos de nivel en encabezados | 0 | 0 | cumple |
| RNF-2.1 JavaScript comprimido | **0,0 kB** | 115 kB → informativo | cumple |
| RNF-2.2 Primera carga comprimida | **136,1 kB** | 260 kB → informativo | cumple |
| RNF-2.6 Tipografías | **122,6 kB** | 125 kB → informativo | cumple |

Los tres techos de peso siguen impresos porque siguen siendo la referencia con la que
se compara, pero desde la enmienda del 2026-07-30 no bloquean (§0). El código de
`scripts/verify.mjs` **no se cambió**: si algún día un peso supera su techo, `verify`
va a terminar en 1 por eso. En ese momento hay dos salidas honestas —declarar el
exceso en el commit y seguir, o pedirle a Daniel una cifra nueva— y ninguna es
inventarle un techo.

Los dos incumplimientos abiertos **no son regresiones**: están en la línea base y
su corrección pertenece a T5 y T6. `npm run verify` termina con código 1 por ellos,
y eso es correcto.

Hay cuatro verificadores, y `npm run verify:todo` los corre en cadena:

| Comando | Qué cubre |
| ------- | --------- |
| `npm run verify` | **La autoridad.** axe-core en 2 anchos × 2 temas, y los presupuestos de peso |
| `npm run verify:tema` | Los 16 criterios de RF-4 que axe no puede evaluar: destello al cargar, sin JavaScript, teclado, persistencia sin cookies, sincronía entre las dos instancias del selector |
| `npm run verify:red` | Los 7 criterios de T3: que el pulso recorra, que se detenga con movimiento reducido, y que el navegador no pida ningún `.js` |
| `npm run verify:teclado` | Los 12 criterios de T6 que axe no decide: jerarquía de encabezados, foco visible en todo el recorrido, contraste del anillo, menú móvil por teclado y zoom de texto al 200 % sin desbordar |

Todos requieren un `npm run build` previo.

## 5b. T5, cómo quedó y qué falta

**Completada el 2026-07-30: 104 → 0 nodos indeterminados.** `[medido]` Con RNF-1.4
cerrado en la misma sesión, `npm run verify` quedó **en verde por primera vez**.

Lo que se hizo, con la causa medida de cada grupo antes de tocar nada (el desglose
salió de correr axe y agrupar los nodos `incomplete` por selector y `messageKey`):

| Grupo | Nodos | Causa medida | Qué se hizo |
| ----- | ----- | ------------ | ----------- |
| Hero | ~10 | Los dos degradados de contraste y `grid-backdrop` quedaban bajo el texto | La figura pasa a columnas propias (8–12) en una retícula de 12; se eliminan los degradados; las tarjetas Fechas/Lugar quedan opacas, sin `backdrop-blur` |
| Header | 11 | La barra `fixed` era transparente sobre esos degradados | Fondo `bg-background` opaco y filete permanentes |
| ProgramPending y VenueLocator | 9 | `Ripple` renderizado detrás del texto | Frentes de onda a una banda propia y, después, retirados: ver abajo |
| Cola larga | 14 | `Ripple` y los `path` del SVG **por rects**, no a la vista | `Ripple` retirado; pie de figura del hero suprimido |

### La lección que cuesta cara: `overflow-hidden` no encoge los rects

Los últimos 14 nodos resistieron tres intentos y la causa no era la que parecía.
Leyendo la fuente de axe-core (`node_modules/axe-core/axe.js`, función
`_getBackgroundStack`) el mecanismo es este:

1. `getTextElementStack(node)` calcula **un rect por cada línea de texto**.
2. Para cada línea toma el centro y busca qué elementos lo cubren.
3. Si el elemento no es el primero de esa pila → `bgOverlap`.
4. Si dos líneas del mismo texto dan pilas distintas → `elmPartiallyObscuring`.
5. Si un elemento de la pila tiene fondo y no cubre todos los rects de texto →
   `elmPartiallyObscured`.

La clave es que axe usa **`clientRects`**, y `overflow: hidden` recorta el dibujo
pero **no** encoge los rects de los hijos. Por eso:

- Los círculos de `Ripple` miden hasta 470–540 px, llevan `background-color`
  (`bg-foreground/25`) y sus rects atravesaban la banda que los contenía,
  alcanzando textos de otras secciones al apilarse en móvil.
- Los `path` de los frentes de onda del SVG tienen rects mucho mayores que su
  parte visible: unas líneas del pie de figura caían dentro y otras fuera, de
  modo que las pilas diferían.

Tres hipótesis se **descartaron midiendo**, no razonando, y conviene no repetirlas:
no era el `header` fijo (forzarlo a `position: static` empeora de 14 a 20 nodos), no
era la cadena de ancestros sin fondo (declarar `bg-background` no cambió nada), y no
era que los nodos quedaran fuera del viewport (con la página entera dentro del
viewport salen exactamente los mismos).

### Lo que se retiró, y por qué

- **`Ripple` en `ProgramPending` y `VenueLocator`.** Además del problema de rects,
  usaba `shadow-xl`, que contradice la regla del propio sistema de separar con
  retícula y no con elevación (`global.css`, `.surface`). El motivo físico de la
  propagación sigue presente y mejor resuelto en la figura del hero.
  `src/components/ui/ripple.tsx` **queda en el repositorio sin uso**: revertir es
  reponer el import. Si se decide que no vuelve, ese archivo y el token
  `--animate-ripple` de `global.css` sobran.
- **El pie de la figura del hero.** Se había añadido en esta misma sesión; no lo
  pide ningún requisito. La descripción no se pierde: el SVG ya declara
  `role="img"` y `aria-labelledby="fig-title fig-desc"`.

### Efectos colaterales, los tres deliberados

- Desapareció el script que sincronizaba la barra con el desplazamiento. Era
  JavaScript **inline** en el HTML, que RNF-2.1 no contabiliza: ver §5c.
- El panel de `VenueLocator` tenía altura fija y su texto desbordaba en anchos
  estrechos. Pasó a altura mínima. Era un defecto real de composición.
- La barra ya no es translúcida sobre el hero. Es una pérdida de efecto a cambio
  de 11 nodos y de un script menos.

## 5d. T4b, refinamiento visual

Hecha después de T5, no antes, porque T5 rehacía la retícula. **No entró ningún
componente de 21st.dev**, y la razón está medida en `habilidades.md`: el catálogo
devuelve retículas de puntos con WebGL, degradados y heros de lista de espera, y el
filtro de registro visual los descarta. Se trabajó sobre lo que una dirección
minimalista sí exige: precisión de espaciado, alineación y detalle.

Cuatro cambios, cada uno por un defecto concreto y no por gusto:

| Qué | Defecto | Cambio |
| --- | ------- | ------ |
| `ProgramPending` | Único bloque centrado de la página, flotando en una caja gris con mucho aire muerto: leía como cartel de error | Alineado al mismo eje que el resto, en dos columnas, como ficha de estado |
| `SpeakerCard` | Tarjeta con caja que terminaba en un filete suelto al pie, que no separaba nada | Ficha sin caja, colgando de un filete **superior**, que sí marca dónde empieza |
| Sección Sede | `lg:items-center` dejaba un vacío grande sobre la dirección | `lg:items-start` |
| Figura del hero | Encerrada en una caja con borde, leía como «una imagen» | Suelta en su columna, a la altura del bloque de texto |

Y una quita: **el `grid-backdrop` del hero**. Su paso de 72 px no se alineaba con la
retícula de 12 columnas ni con nada, y competía con la retícula **polar** del radar,
que sí significa algo —son los anillos de rango—. Dos retículas que dicen cosas
distintas es una de más. `grid-backdrop` sigue en uso en la banda del localizador,
donde evoca un plano y ahí sí viene a cuento.

`npm run verify:todo` en verde después de cada cambio, y revisión visual en los dos
temas y los dos anchos.

## 5e. T6, y por qué se automatizó lo que WCAG deja como manual

RNF-1.4 se cerró junto con T5. Lo que quedaba —foco visible, recorrido por teclado
y zoom de texto— son las tres cosas que WCAG deja como **comprobación manual**, y
una comprobación manual que no se automatiza es una que se deja de hacer. De ahí
`scripts/verify-teclado.mjs`, con 12 criterios. `[medido]`

**Un falso positivo que conviene no repetir.** La primera versión medía el foco
llamando a `el.focus()` desde JavaScript y daba 2 de 3 elementos sin anillo. Era la
prueba la que estaba mal: el navegador distingue si el foco vino del teclado, y el
foco programático no siempre activa `:focus-visible`. Recorriendo con `Tab` de
verdad salen **39 paradas, todas con anillo**, con ratios de 7,24:1 en claro y
7,96:1 en oscuro contra un umbral de 3:1.

**Dos defectos reales de WCAG 1.4.4, ambos corregidos:**

Los `media query` de Tailwind se resuelven en `rem` sobre el tamaño **inicial** del
navegador. Quien amplía solo la tipografía —sin ampliar la página— sigue recibiendo
el diseño de escritorio con el texto al doble. Eso desbordaba:

1. **La barra de navegación**, a 1440 px. Resuelto con `flex-wrap`: crece hacia
   abajo en lugar de salirse.
2. **La sección Sede**, a 390 px, exactamente 28 px. La causa era de retícula, no
   de texto: los items de una retícula traen `min-width: auto`, así que el correo
   largo imponía un ancho mínimo y `overflow-wrap` nunca llegaba a partir nada.
   Resuelto con `min-w-0` en la columna y en las celdas del `dl`, más
   `overflow-wrap: break-word` en `body`.

El diagnóstico útil fue que **los cuatro elementos se salían los mismos 28 px**: eso
descarta el contenido de cada uno y señala a un ancestro común.

Los nombres de expositor pasaron de `h3` a `h4`. El rótulo del grupo ya era `h3`, así
que cada nombre se anunciaba como su hermano y el índice de encabezados quedaba plano.

## 5c. RNF-2.1 ahora sí mide todo el JavaScript

**Corregido el 2026-07-30.** Antes `verify` informaba `JavaScript comprimido
0,0 kB` porque solo sumaba los archivos `.js` de `dist/`. El sitio sí ejecuta
JavaScript —menú móvil, selector de tema, carga diferida del mapa— y ese código
vive **dentro del HTML**: Astro 5 renderiza cada `<script>` tal como se declara,
sin agruparlo ni sacarlo a un archivo. `[verificado]` en la documentación de Astro
(«`<script>` tags are rendered directly as declared», cambio de v5).

La cifra de archivos no era falsa y `verify:red` tampoco: el navegador no pide
ningún `.js`. Pero publicar «0,0 kB de JavaScript» invitaba a leer «este sitio no
tiene JavaScript», que es distinto. Se corrigió la **medición**, no el sitio:

- `medirPeso` calcula `javascriptEnLinea` por **diferencia de gzip** del HTML con
  y sin los bloques `<script>` en línea. Comprimir los fragmentos por separado
  sobrestima: dentro del HTML comparten diccionario con el resto del documento.
- `application/ld+json` queda fuera: son metadatos, no código.
- RNF-2.1 pasa a medir archivos + en línea. **Resultado: 1,1 kB** contra un techo
  de 115 kB. `[medido]`
- `primeraCarga` **no** cambia y no lo suma dos veces: ese peso ya estaba contado
  dentro de `html`.

Es el mismo tipo de corrección que ya se hizo con las transiciones de opacidad en
la medición de contraste (`fuentes.md`): cuando el verificador mide de una forma
que induce a error, se arregla el verificador.

## 5. T3, cómo quedó

Motion fuera, haz reimplementado con SVG y `stroke-dashoffset`, base de shadcn/ui
montada. El resultado más relevante: **el sitio ya no envía JavaScript**.

`CollaborationNetwork` era la única isla hidratada. `Ripple` se importa en
`ProgramPending.astro` y `VenueLocator.astro` **sin** directiva `client:`, así que
Astro lo renderiza en el build. Al pasar la red a Astro puro no queda ninguna isla:
la página no referencia ningún `.js` y el navegador no pide scripts.

| | Antes (T2) | Después (T3) |
| - | ---------- | ------------ |
| JavaScript comprimido | 109,6 kB | **0,0 kB** |
| Primera carga | 247,0 kB | **136,4 kB** (−45 %) |

**Dos cosas que conviene saber antes de tocar este componente:**

1. **La geometría está fijada por construcción, no medida.** Las columnas laterales
   son retículas de dos filas iguales **sin separación**, con la tarjeta centrada en
   su fila: así los extremos del trayecto caen siempre al 25 % y al 75 % del alto,
   sea cual sea el largo del texto. La separación visual se hace con relleno dentro
   de la fila, que no mueve el centro. Si se añade una tercera institución por lado,
   **hay que recalcular los trayectos**, no solo agregar el dato. Está advertido en
   el bloque `network` de `src/data/seminar.ts`.
2. **El guion del pulso se mide en píxeles de pantalla, no en porcentaje.** Con
   `vector-effect="non-scaling-stroke"`, `pathLength` no normaliza el
   `stroke-dasharray`. Por eso el ciclo desplaza **un período exacto**: es lo único
   que empalma el bucle a cualquier escala. Está explicado en la cabecera del
   componente y registrado como trampa en `AGENTS.md`.

**shadcn/ui:** `components.json` configurado, **ninguna primitiva de Radix
instalada**. Cada una se justifica por el componente que habilita; las que hagan
falta llegan con T10.

**Siguiente tarea: T4** (tipografía). Ojo con el hallazgo ya verificado: Atkinson
Hyperlegible **no tiene versión variable**; la que sí la tiene es «Next», y además
pesa menos (33.996 B en 1 archivo, contra 34.732 B en 2). Está en `specs/fuentes.md`.

## 6. Git: cómo está el remoto

- El **PR #1 ya se fusionó** a `main` (2026-07-29), pero llevaba un estado viejo
  (`9a978d8`, el sitio inicial). **No contiene T1 ni T2.**
- La rama de trabajo tiene **13 commits sin fusionar** por delante de ese punto: es
  todo el trabajo SDD.
- El contenido de la rama es un **superconjunto** de `main`: `main` no tiene nada
  que la rama no tenga. No hay que fusionar nada hacia atrás.
- Como el PR #1 está cerrado, el trabajo posterior necesita un **PR nuevo**. No
  reabrir ni reutilizar el #1.
- **No crear PR sin que Daniel lo pida.**

## 6b. Servidor MCP de 21st.dev

**FUNCIONA desde el PC de Daniel.** `[verificado]` El 2026-07-30, ya con la clave
nueva, `mcp__21st__get_usage` respondió autenticado: `tier: free`, 2 recuperaciones de
código por día (2 disponibles), búsquedas sin límite diario. La clave está definida como
variable de entorno de **usuario** en Windows, que es una de las dos vías válidas, y las
shells que abre esta sesión ya la ven (`$env:API_KEY_21ST` tiene valor). Antes de fijarla
a nivel de usuario no la veían; eso quedó resuelto.

Lo que sigue es la cronología de cuando no funcionaba, que se conserva porque explica
qué mirar si vuelve a fallar:

1. En el entorno original (sandbox remoto), la política de red denegaba
   `21st.dev:443` (403 en el túnel CONNECT). Confirmado con
   `curl "$HTTPS_PROXY/__agentproxy/status"` y contrastado contra hosts permitidos.
   Registrado en `specs/habilidades.md`.
2. Desde el PC de Daniel (Windows, sin ese proxy), `claude mcp list` muestra:
   - `21st: ⏸ Pending approval (run \`claude\` to approve)` — falta aprobar el
     servidor en una sesión **interactiva**, con `/mcp`. Una sesión no interactiva
     (como esta) no puede completar esa aprobación.
   - `[Warning] mcpServers.21st: Missing environment variables: API_KEY_21ST` — la
     variable no está definida en el proceso que arrancó esta sesión. Se lee al
     iniciar; exportarla después no la inyecta en una sesión ya en marcha.

Para dejarlo funcionando, en una terminal interactiva del PC:

```powershell
$env:API_KEY_21ST = "la-clave-rotada"
claude
```

y aprobar `21st` cuando `/mcp` lo pida. Si se quiere persistente entre sesiones,
definir `API_KEY_21ST` como variable de entorno de usuario en Windows en vez de
exportarla cada vez, o usar el bloque `env` de `.claude/settings.local.json` (que
Claude Code inyecta antes de expandir `.mcp.json`, y que está en `.gitignore`). Las dos
vías están documentadas en `.env.example`; es la vía (a) la que quedó en uso.

**Qué pasó el 2026-07-30 con la clave:**

- Daniel fijó una clave nueva con
  `[System.Environment]::SetEnvironmentVariable('API_KEY_21ST','<clave>','User')`. La
  clave que hay ahora en el entorno autentica contra 21st.dev. `[verificado]`
- **La clave comprometida se revocó en el dashboard de 21st.dev.** `[verificado]`
  Daniel lo confirmó el 2026-07-30. **Incidente cerrado.**

  Conviene retener por qué hacían falta los dos pasos: cambiar el valor de la
  variable de entorno solo decide *cuál se usa*, no invalida la anterior. La clave
  que se pegó en el chat siguió siendo válida hasta que se borró desde
  <https://21st.dev>. La documentación del propio servidor pide además generar una
  clave nueva en vez de reaprovechar las anteriores a la migración de Magic.

  Comprobación posterior a la revocación: `get_usage` siguió respondiendo
  autenticado (`tier: free`, 2 recuperaciones disponibles), lo que confirma que la
  variable de entorno lleva la clave nueva y no la revocada. `[medido]`
- La clave **no** quedó en el historial de PowerShell
  (`ConsoleHost_history.txt` no contiene ninguna ocurrencia de `API_KEY_21ST`).
  `[verificado]`
- El `.env` sin versionar ya no existe en este clon. Pendiente cerrado para este
  entorno; sigue anotado por si el archivo reaparece en otro. `[verificado]`
- Una variable de entorno de usuario vive en texto plano en `HKCU:\Environment` y la
  lee cualquier proceso del usuario. Es aceptable para una clave de tier free; no lo
  sería para una credencial con costo asociado.

Para que un proceso nuevo (Claude Code o Antigravity) tome la clave, basta abrir una
terminal nueva después de fijar la variable: un proceso ya en marcha no la ve.

**Un `.env` NO alimenta esto.** Claude Code no carga archivos `.env`. Hasta el
2026-07-30, `.gitignore`, `.env.example` y `specs/habilidades.md` afirmaban que la
clave podía "vivir en el entorno o en un `.env` local"; la segunda mitad era falsa y
hacía perder tiempo. Los tres archivos quedaron corregidos.

Sigue sin ser bloqueante: nada antes de T10 lo necesita.

## 7. Pendientes que no dependen del código

Registrados como decisiones abiertas no bloqueantes A3–A7 en las especificaciones.
Ninguno impide avanzar:

- Logos institucionales oficiales (PUCV, EIE, ANID, UC, USACH, Nokia Bell Labs,
  Columbia). **Los marcadores dicen «logo pendiente» a propósito. Está prohibido
  generarlos o aproximarlos con cualquier herramienta**, incluidas las skills de
  diseño. Un logo institucional inventado es un problema, no un adelanto.
- Afiliación de Rodolfo Feick, por confirmar.
- Correo institucional definitivo (ahora hay uno provisional).
- Programa del seminario: `program.days` está vacío a propósito y la página muestra
  el estado provisional. Al poblarlo, la sección se rellena sola.
- Subdominio propio en Cloudflare Pages.

## 8. Nota para Antigravity u otro agente

El proyecto no depende de Claude Code. Todo lo que hace falta está en el
repositorio, y en particular:

- Las instrucciones viven en `AGENTS.md`, no en `CLAUDE.md`, justamente para que
  sirvan a cualquier herramienta.
- La autoridad sobre calidad es `npm run verify`, un script de Node con Playwright
  y axe-core. No depende de ningún agente ni servicio.
- La regla de procedencia aplica igual: **toda cifra que se escriba en un `.md`
  lleva marca `[medido]`, `[dataset]`, `[verificado]` o `[supuesto]`**, y si es
  `[medido]`, la forma de reproducirla. Esto se puso porque hubo cifras inventadas
  antes; ver la advertencia del artefacto de 67 nodos en `specs/fuentes.md`.
- No implementar nada que no esté en `requirements.md`. Si hace falta algo nuevo,
  primero se escribe el requisito.
