# Estado y continuidad

Este archivo existe para que el trabajo pueda **cambiar de entorno sin perder el
hilo**. El proyecto se desarrolla desde varios sitios —Claude Code en el navegador,
en el móvil, en el PC, y Antigravity— y ninguno de ellos ve el historial de
conversación de los otros. Lo único compartido es el repositorio. Por lo tanto:

> **Si no está escrito en el repositorio, no ocurrió.**

Actualizado: **2026-07-31** · Rama de trabajo: `claude/framework-app-profesional-n4wa0t`
· Último commit de tarea: `00e00f4` (T10)

> **001 queda CERRADA el 2026-07-31, T1 a T13.** La revisión del flujo SDD encontró el
> código en verde y el rastro documental atrasado. Se corrigió en dos tandas:
>
> 1. **Sincronización** (`f9f2e79`): `tasks.md` daba T10 por parcial y T4 sin nota de
>    cierre, `specs/README.md` seguía describiendo el proyecto en T3 con tres
>    verificadores de siete, y cuatro conteos de criterios se citaban desfasados.
> 2. **Regularización**: RF-6 enmendado —ninguna primitiva de Radix se usó, y por tanto
>    **D6 no se materializó en ningún componente**—; **RF-7, RF-8 y RNF-7** creados para
>    las tres piezas que se habían implementado sin requisito (reseñas, programa de
>    ejemplo, despliegue), con **T11, T12 y T13**; `design.md` §6 y §7 con el «cómo y
>    por qué» de T5 a T13, que vivía solo en este archivo.
>
> **Las dos comprobaciones que T8 dejó abiertas están cerradas** (T13):
> `validator.schema.org` da **0 errores y 0 avisos** en `/` y `/en/`, y quedó
> automatizado en `npm run verify:publicado`, 20 criterios en verde `[medido]`. Lo único
> que sigue exigiendo ojos es la previsualización real al compartir el enlace.
>
> **Después del cierre, el 2026-07-31:** se retiró React y toda la base de shadcn/ui,
> que ningún componente usaba, y al investigarlo apareció que **la primera carga estaba
> subestimada en 11,8 kB** por un defecto del medidor —152,5 kB, no 140,7—. Ambas cosas
> en §5k, con lo que el cliente pidió para el próximo plan y con qué se hace cada parte.
>
> Lo que queda abierto no es código: A3–A7 y poblar `program.days`.

> **El plan `001-mejora-calidad` está completo: T1 a T10.**
>
> Los **siete verificadores en verde** con `npm run verify:todo`, y `astro check`
> sin errores ni advertencias. La tabla de línea base contra resultado está en §5i.
>
> | Tarea | Dónde está el detalle |
> | ----- | --------------------- |
> | T5 · Retícula de 12 columnas | §5b · 104 → 0 nodos indeterminados |
> | RNF-2.1 · Medición del JavaScript | §5c · pasa a incluir el código en línea |
> | T4b · Refinamiento visual | §5d |
> | T6 · Foco, teclado y zoom | §5e · dos incumplimientos reales de WCAG 1.4.4 |
> | T7 · Sitio bilingüe | §5f · español en `/`, inglés en `/en/` |
> | T8 · Imágenes para compartir | §5g |
> | T10 · Interacción | §5h · las 5 resueltas, ninguna con Radix |
> | T9 · Cierre y cifras finales | §5i |
> | Reseñas y programa de ejemplo | §5j |
>
> **PR #2 fusionado en `main`** el 2026-07-31 (`df22be4`). `main` y la rama de
> trabajo tienen ahora **el mismo árbol**. Ver §6.
>
> **Sitio publicado (provisional, con `noindex`):**
> <https://seminario-wireless-lab.danielcaignet99.workers.dev> · Ver §6c.

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
| T7 · Sitio bilingüe (RF-1) | **Completada y verificada.** 15 criterios en `npm run verify:idioma`. Ver §5f |
| T8 · `og:image` por idioma | **Completada y verificada.** 20 criterios en `npm run verify:seo`. Ver §5g |
| T9 · Verificación final | **Completada.** Tabla línea base contra resultado en §5i. `astro check` 0/0/0 |
| T10 · Componentes interactivos (RF-6) | **Completada.** Las 5 interacciones resueltas, ninguna con Radix. Ver §5h |
| T11 · Reseñas y programa de ejemplo (RF-7, RF-8) | **Completada.** Requisito escrito después del código, declarado como tal. Ver §5j |
| T12 · Publicación (RNF-7) | **Completada.** Workers con `noindex` provisional. Ídem sobre el requisito. Ver §6c |
| T13 · Comprobar el sitio publicado (RNF-3.1, RNF-7) | **Completada.** `npm run verify:publicado`, 20 criterios. Ver §6d |

### Lo que mide el verificador ahora mismo

Con `npm run build && npm run verify:todo` el **2026-07-31 sobre `8f4bdfc`**, exit 0
`[medido]`. La columna «al cerrar T4» se conserva porque dos cifras cambiaron sin que
el sitio empeorara, y verlas juntas evita leerlo como una regresión:

| Comprobación | Al cerrar T4 | Hoy | Límite | |
| ------------ | ------------ | --- | ------ | - |
| RNF-1.1 Hallazgos axe WCAG 2.1 AA | 0 | 0 | 0 | cumple |
| RNF-1.3 Nodos con contraste indeterminado | **0** (eran 104) | 0 | 0 | cumple |
| RNF-1.4 Secciones sin nombre accesible | **0** (eran 7) | 0 | 0 | cumple |
| RNF-1.5 Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 JavaScript comprimido | 0,0 kB | **1,4 kB** | 115 kB → informativo | cumple |
| RNF-2.2 Primera carga comprimida | 136,1 kB | **140,7 kB** | 260 kB → informativo | cumple |
| RNF-2.6 Tipografías | 122,6 kB | 122,6 kB | 125 kB → informativo | cumple |

**RNF-2.1 no subió porque volviera JavaScript**: desde T8 la métrica incluye el que
Astro inlinea en el HTML, que antes no se contaba en ninguna parte (§5c). Los archivos
`.js` siguen en 0,0 kB y no hay ninguna isla que hidratar. Los 4,6 kB de más en la
primera carga se reparten así: **1,4 kB** son ese JavaScript en línea que la medición de
T4 no veía, y los **3,2 kB** restantes son HTML —reseñas de expositores y el marcado de
las pestañas—. `[medido: resta entre las dos corridas; no es un desglose que el
verificador imprima]`

Los tres techos de peso siguen impresos porque siguen siendo la referencia con la que
se compara, pero desde la enmienda del 2026-07-30 no bloquean (§0). El código de
`scripts/verify.mjs` **no se cambió**: si algún día un peso supera su techo, `verify`
va a terminar en 1 por eso. En ese momento hay dos salidas honestas —declarar el
exceso en el commit y seguir, o pedirle a Daniel una cifra nueva— y ninguna es
inventarle un techo.

**Ya no hay incumplimientos abiertos.** Este párrafo decía que los dos que quedaban
—RNF-1.3 y RNF-1.4— venían de la línea base y que `verify` terminaba en 1 por ellos.
T5 y T6 los cerraron, y desde entonces `npm run verify` termina en 0: comprobado el
2026-07-31 sobre `8f4bdfc` con `npm run verify:todo`, exit 0. Cualquier fallo a partir
de aquí es una regresión.

Hay siete verificadores, y `npm run verify:todo` los corre en cadena:

| Comando | Qué cubre |
| ------- | --------- |
| `npm run verify` | **La autoridad.** axe-core en 2 anchos × 2 temas, y los presupuestos de peso |
| `npm run verify:tema` | Los 16 criterios de RF-4 que axe no puede evaluar: destello al cargar, sin JavaScript, teclado, persistencia sin cookies, sincronía entre las dos instancias del selector |
| `npm run verify:red` | Los 7 criterios de T3: que el pulso recorra, que se detenga con movimiento reducido, y que el navegador no pida ningún `.js` |
| `npm run verify:teclado` | Los 12 criterios de T6 que axe no decide: jerarquía de encabezados, foco visible en todo el recorrido, contraste del anillo, menú móvil por teclado y zoom de texto al 200 % sin desbordar |
| `npm run verify:idioma` | Los 19 criterios de RF-1: ambas rutas, `lang`, `hreflang` recíproco, título sin traducir, control de idioma por teclado, conservación de la sección, sitemap, cero cadenas en componentes y **textos sin traducir** |
| `npm run verify:seo` | Los 22 criterios de RNF-3: imágenes para compartir de 1200×630 por idioma, metadatos absolutos, canónico por idioma, sin descripciones duplicadas, `noindex` provisional y `schema.org/Event` completo |
| `npm run verify:interaccion` | RF-6: que el contenido siga entero sin JavaScript, que el resaltado de sección siga a la lectura y se exponga con `aria-current`, y que no haya primitivas de Radix instaladas sin usar |

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

## 5k. Se retiró React, y el medidor de peso estaba mal

**2026-07-31, por instrucción de Daniel.** La pregunta era si algo de lo que quedó
colgado —React, la base de shadcn/ui— sirve para lo que viene, y si no, borrarlo.

### Lo que viene, según el cliente, y con qué se hace

Registrado aquí porque es la entrada del próximo plan: **fotos de los expositores en las
fichas**, **programa como línea de tiempo vertical** que se recorre y va revelando las
exposiciones con animación y enlace a la ficha del expositor, **hero con más
animaciones** y **transiciones más dinámicas**.

Se verificó contra documentación antes de borrar, no de memoria:

| Lo que viene | Con qué se hace | Fuente |
| ------------ | --------------- | ------ |
| Fotos de expositores | `<Image />` de `astro:assets` con `layout="constrained"`: genera `srcset` y `sizes` solo. Núcleo de Astro | Documentación de Astro (Context7) |
| Línea de tiempo que revela al recorrer | `animation-timeline: view()`, CSS puro. Chrome/Edge 115+, Firefox 132+, Safari 18+, ~84 % global, **no Baseline** → detrás de `@supports` y degradando a estático | MDN, caniuse |
| Hero con más movimiento | `@keyframes` con `prefers-reduced-motion`, como ya hacen `PropagationFigure` y `CollaborationNetwork` | El repositorio |
| Transiciones al cambiar de idioma | `@view-transition { navigation: auto; }` (Chromium 126+, Safari 18.2+, Firefox en curso) a 0 kB, o `<ClientRouter />` de `astro:transitions`, que **no requiere integración de framework** | MDN, documentación de Astro |
| Enlace de sesión a expositor | Un ancla | — |

**Ninguna necesita React.** Así que salió: `@astrojs/react`, `react`, `react-dom`,
`clsx`, `tailwind-merge`, `components.json`, `src/lib/utils.ts` y el alias `@ → ./src`
—que además estaba escrito con `new URL(...).pathname`, la forma que se rompe en
Windows—. Resultado medido: **`dist` ya no emite ningún archivo huérfano**; antes
emitía 59,5 kB comprimidos de runtime de cliente que ningún navegador pedía.
`astro check` sigue en 0/0/0 y los siete verificadores en verde.

Reinstalarlo es un comando. El candidato natural sigue siendo RF-3, el registro de
asistentes.

### El hallazgo grave: la primera carga estaba subestimada 11,8 kB

Investigando el «CSS huérfano» apareció que **no era huérfano**: `dist/index.html` lleva
su `<link rel="stylesheet">`. El defecto estaba en `verify.mjs`, que comparaba la ruta
del sistema (`_astro\hoja.css` en Windows) contra la del HTML (`_astro/hoja.css`). Nunca
coincidían, así que **todo `.js` o `.css` en subcarpeta se declaraba huérfano y se
descontaba del peso**.

| Cifra | Publicada | Real |
| ----- | --------- | ---- |
| Primera carga comprimida | 140,7 kB | **152,5 kB** |
| CSS en hojas enlazadas | 0,0 kB | **11,8 kB** |
| Archivos huérfanos | 2 (71,3 kB) | **0** |

El techo nunca se incumplió —152,5 contra 260 kB—, pero **el error favorecía al
proyecto**, que es la dirección que menos se nota. Y hubo algo peor que la cifra: una
sesión anterior explicó el «CSS 0,0 kB» afirmando que el CSS iba en línea dentro del
HTML, sin abrir `dist/index.html` a comprobarlo. La explicación era más cómoda que el
dato.

**Prueba de sensibilidad, en los dos sentidos**, porque un medidor que ahora cuente todo
como referenciado sería igual de inútil: un `.js` puesto a mano en `dist/_astro/` y que
nadie enlaza **sí sale** como huérfano (56 B), y al retirarlo el informe vuelve a decir
«Ninguno».

Dos ambigüedades del mismo origen, corregidas a la vez: la cobertura escribía la página
inglesa como `` `/en\` ``, y **el peso se medía solo en la primera página de la lista**
—que tras ordenar es `/en/`— sin declararlo. Ahora se miden las dos, el presupuesto se
juzga contra la más pesada y el informe imprime ambas. Hoy coinciden.

## 5j. Reseñas de expositores y programa de ejemplo

### Las reseñas son datos verificables, no relleno

Cada expositor tiene reseña y línea de investigación en los dos idiomas,
redactadas a partir de **perfiles institucionales y académicos públicos**: páginas
de facultad, Nokia Bell Labs, ANID, CISTER, Google Scholar, IEEE Xplore. La ficha
enlaza el perfil que sirvió de fuente, así que cualquier dato es comprobable.

Las reseñas viven en `es.ts` y `en.ts` porque son texto. La clave de cada una está
**tipada** en `ContenidoIdioma`, de modo que **añadir un expositor sin su reseña en
ambos idiomas no compila**: una ficha vacía en un sitio institucional es peor que
no tener ficha.

Dos hallazgos que salieron de buscar y merecen quedar registrados:

- **Reinaldo A. Valenzuela estudió ingeniería en la Universidad de Chile** antes
  de doctorarse en el Imperial College. Es miembro de la Academia Nacional de
  Ingeniería de EE. UU. y Fellow del IEEE. Para un seminario en Chile, el dato no
  es anecdótico.
- **Rodolfo Feick ha coautorado mediciones a 28 GHz en el área del banco de
  pruebas COSMOS**, que es el mismo proyecto del que Gil Zussman es investigador
  principal por Columbia. Hay colaboración previa real entre dos de los
  expositores, y eso respalda lo que la sección «Red de colaboración» afirma.

**La afiliación de Feick sigue marcada como pendiente**, a propósito. Las fuentes
públicas lo sitúan al frente del Wireless Communications Research Group de la
**Universidad Técnica Federico Santa María**, pero eso es `[probable]` hasta que la
organización lo confirme, y este proyecto no publica datos institucionales sin
confirmar. Basta cambiar dos líneas de `comun.ts` cuando Daniel lo confirme.

### La ficha usa `<details>`, no un diálogo de Radix

Tres razones, en orden de peso:

1. **RF-6.2 exige que el contenido siga accesible sin JavaScript.** `<details>` se
   despliega sin una línea de script. Un `<dialog>` no se abre sin él, y con Radix
   el contenido ni siquiera existiría hasta hidratar.
2. Cuesta **0 kB**. Radix `Dialog` traería del orden de 36 kB con React.
3. Es el patrón que el proyecto ya usa para el menú móvil.

Lo que se pierde frente a un modal: no atrapa el foco ni oscurece el fondo. Para
una reseña de tres líneas que no exige ninguna decisión, no hace falta.

### El programa de ejemplo está APAGADO por defecto

`src/data/programa-demo.ts` tiene dos jornadas completas, con temas elegidos según
la línea de investigación real de cada expositor para que la demostración sea
verosímil. **Los títulos, los horarios y la existencia misma de las sesiones son
invención.**

Está detrás de `PROGRAMA_DEMOSTRATIVO` en `comun.ts`, en `false`, y con dos
salvaguardas más:

- Solo se activa **si el programa real está vacío**: dejar la bandera puesta por
  descuido no puede sobrescribir un programa ya publicado.
- Cuando está activo, la sección muestra un **aviso visible** —con `role="note"`,
  para que un lector de pantalla lo anuncie antes que el programa— diciendo que
  las sesiones son ficticias. El aviso no es opcional.

El motivo es el mismo por el que este proyecto prohíbe generar los logos
institucionales: un programa apócrifo en el sitio de un evento real, con fechas y
sede reales, es información falsa con la que alguien podría organizar un viaje.

Se verificó **con la bandera encendida**: los siete verificadores siguen en verde
y el aviso aparece donde debe.

## 5i. T9 · Cierre: línea base contra resultado

Medido el 2026-07-31 con `npm run build && npm run verify:todo`, sobre **2
páginas y 8 corridas** (2 anchos × 2 temas × 2 idiomas). `[medido]`

| Requisito | Línea base | Ahora | Límite | |
| --------- | ---------- | ----- | ------ | - |
| RNF-1.1 · Hallazgos axe WCAG 2.1 AA | 16 | **0** | 0 | cumple |
| RNF-1.3 · Nodos con contraste indeterminado | 28 | **0** | 0 | cumple |
| RNF-1.4 · Secciones sin nombre accesible | 7 de 7 | **0 de 7** | 0 | cumple |
| RNF-1.5 · Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 · JavaScript comprimido | 109,3 kB | **1,4 kB** | 115 kB | cumple |
| RNF-2.2 · Primera carga comprimida | 241,2 kB | **139,0 kB** | 260 kB | cumple |
| RNF-2.6 · Tipografías | 110,9 kB | 122,6 kB | 125 kB | cumple |

`astro check`: **0 errores, 0 advertencias, 0 sugerencias.**

Dos cifras merecen una nota, porque leídas solas engañan:

- **RNF-2.1 no bajó de 109,3 kB a 1,4 kB midiendo lo mismo.** La línea base
  contaba archivos `.js`, y desde T8 la métrica incluye además el JavaScript que
  Astro inlinea en el HTML, que antes no se contaba en ninguna parte. La mejora
  real existe —se quitaron React hidratado y Motion— pero la cifra actual es más
  exigente que la de partida, no menos. Ver §5c.
- **Las tipografías subieron** de 110,9 a 122,6 kB, y fue deliberado: T4 cambió a
  Crimson Pro y Atkinson Hyperlegible Next, esta última diseñada para baja
  visión. Se gastaron 11,7 kB en legibilidad, con 2,4 kB de margen.

Los siete verificadores en verde:

| Verificador | Criterios al cerrar T9 | Hoy (2026-07-31, `8f4bdfc`) |
| ----------- | --------------------- | --------------------------- |
| `verify` · accesibilidad y peso | 7 presupuestos, 8 corridas | igual |
| `verify:tema` · RF-4 | 17 | 17 |
| `verify:red` · T3 | 7 | 7 |
| `verify:teclado` · T6 | 12 | 12 |
| `verify:idioma` · RF-1 | 17 | **19** |
| `verify:seo` · RNF-3 | 20 | **22** |
| `verify:interaccion` · RF-6 | 8 | **9** |

Los tres que crecieron lo hicieron en `3fe4c74`, `00e00f4` y `8f4bdfc`, después de
cerrarse su tarea. Se añade la columna porque las cifras del cierre se citaban como si
siguieran vigentes `[medido: conteo de líneas de criterio en la corrida del 2026-07-31]`.

### Lo que sigue abierto, y no es código

1. **Logos institucionales oficiales.** Los de `public/logos/` son marcadores
   deliberados. Está prohibido generarlos o aproximarlos.
2. **Programa.** `program.days` vacío. Poblarlo desbloquea además tres
   interacciones de RF-6 (§5h).
3. **Afiliación de Rodolfo Feick** y **correo institucional definitivo**.
4. **Dominio.** Al fijarlo, regenerar las imágenes con `npm run og`.
5. **Validar los datos estructurados** y la previsualización del enlace: ambas
   necesitan el sitio publicado (§5g).

## 5h. T10: qué se hizo, y qué espera contenido

**Las 5 interacciones de RF-6 están resueltas, y ninguna con Radix.**

| Interacción | Primitiva propuesta | Cómo se resolvió |
| ----------- | ------------------- | ---------------- |
| Programa por jornada en pestañas | `Tabs` | **Mejora progresiva** sobre el patrón ARIA de la W3C. Sin JavaScript: jornadas apiladas |
| Resumen de sesión desplegable | `Accordion` | `<details>` nativo |
| Ficha de expositor | `Dialog` | `<details>` nativo. Ver §5j |
| Selector de tema de tres estados | `ToggleGroup` | Radios nativos: 0 kB, flechas del navegador, RF-4 verificado 17/17 |
| Sección activa en la navegación | Ninguna | `IntersectionObserver` propio |

**El denominador común es RF-6.2**, que exige que el contenido siga accesible sin
JavaScript. Eso descarta de entrada cualquier componente que solo exista al
hidratar, y con él todo el catálogo de React.

Se buscó igualmente en 21st.dev antes de decidir, el 2026-07-31 (`search`, gratis):
los ocho resultados de pestañas eran `react-aria-components`, Headless UI o
shadcn, y **ninguno funciona sin hidratar**. La comprobación importaba aunque el
resultado fuera el esperado: la sesión anterior había afirmado que T10 era «donde
21st.dev rinde de verdad» sin haberlo verificado.

Lo que sí se tomó de fuera: el **patrón ARIA de la guía de la W3C** —roles
`tablist`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`,
`tabindex` móvil, flechas con Home y End—, que es la referencia de la que copian
esos ocho componentes.

`verify:interaccion` comprueba que no haya ninguna `@radix-ui/*` instalada sin uso,
y que las pestañas cumplan el patrón. Si `program.days` está vacío, esos criterios
se informan como **OMITIDO** en vez de darse por buenos.

**Por qué el selector de tema no se pasa a `ToggleGroup`:** sería un retroceso.
Los radios nativos ya dan agrupación, estado programático y recorrido con flechas
sin una línea de manejo de teclado, y cuestan 0 kB. Cambiarlos por Radix añadiría
JavaScript para obtener lo que el navegador ya hace. Está razonado en el propio
`ThemeSelector.astro` desde T2.

### La sección activa

`IntersectionObserver` propio, unas líneas, sin primitiva. Marca el enlace con
**`aria-current="location"`** —el valor que ARIA define para la ubicación dentro
de un flujo— y no solo con color, así que la información también llega a un lector
de pantalla. Las dos instancias de la navegación, barra y menú móvil, se marcan a
la vez, igual que hacen las dos instancias del selector de tema en RF-4.6.

Sin JavaScript no pasa nada: los enlaces siguen llevando a su sección. Se pierde
saber en cuál se está, que es una ayuda, no el contenido.

### Qué falta para que se vean en producción

Solo el contenido real. La maquinaria está montada y verificada:

1. **Programa:** poblar `program.days` en `es.ts` y `en.ts`. La estructura
   `DiaPrograma` ya admite `summary` por sesión, y las pestañas aparecen solas en
   cuanto hay dos jornadas.
2. **Reseñas de expositores:** ya están, desde fuentes públicas (§5j).

Mientras tanto, `PROGRAMA_DEMOSTRATIVO` permite verlo funcionando con datos de
ejemplo, marcados como tales.

## 5g. T8, imágenes para compartir

Una imagen por idioma, 1200×630, en `public/og/es.png` y `en.png`. Se generan con
`npm run og` y **se versionan**: forman parte del sitio, no son un subproducto del
build.

### Cómo se generan, y por qué así

El lienzo es una página real del proyecto —`src/pages/og/<idioma>.astro`, sobre
`CartelOg.astro`—, así que usa las mismas tipografías, tokens y figura que el
sitio. `scripts/generar-og.mjs` la abre con Playwright y la captura.

| Alternativa | Por qué no |
| ----------- | ---------- |
| `satori` + `sharp`, la vía que documenta Astro | Dos dependencias nuevas, y obliga a describir el cartel otra vez en otro lenguaje y mantener las dos versiones sincronizadas a mano |
| `web-asset-generator`, que la tarea mandaba evaluar | Es un skill de Claude Code que exige Python y Pillow. `AGENTS.md` establece que el proyecto no depende de Claude Code, y no usaría las tipografías del sitio |
| **Playwright** ✅ | Ya está instalado para los verificadores: cero dependencias nuevas, y el cartel es el sitio |

**No se generan en cada build a propósito.** Son activos estables que solo cambian
si cambia el título o la fecha, y hacer que `npm run build` dependa de arrancar un
navegador es frágil justo donde más caro sale.

Los lienzos quedan fuera del sitemap (`filter` en la configuración) y fuera de la
auditoría de accesibilidad (`verify` los excluye): no son páginas para visitar,
miden 1200×630 fijos y no llevan navegación. Contarlos ensuciaría las cifras.

### Un fallo que solo se ve mirando

La primera captura salió con la tipografía de reserva: el titular en sans en vez
de Crimson Pro. Faltaba el componente `<Font>`, que es quien emite las reglas
`@font-face` con las rutas reales de los `woff2`. Importar `global.css` no basta,
porque las variables de fuente las define `astro:assets`. **`verify:seo` no lo
habría detectado** —la imagen existía y medía 1200×630—: hizo falta abrir el PNG.

### Lo que queda para Daniel

`verify:seo` comprueba la **estructura** de `schema.org/Event` contra los campos
que exige, en ambos idiomas. Lo que no puede hacer es pasarla por el validador de
Google, que necesita una URL pública o que se pegue el código a mano. Pendiente,
con dos formas de cerrarlo:

1. Pegar el bloque `application/ld+json` de cada página en
   <https://validator.schema.org>.
2. Cuando el sitio esté publicado, pasar ambas URLs por la prueba de resultados
   enriquecidos de Google.

Lo mismo con la previsualización del enlace, que la tarea pide revisar «de verdad,
no supuesta»: hasta que el sitio tenga URL pública, las plataformas no pueden leer
el `og:image`. **Las imágenes sí están revisadas visualmente**, abriendo los PNG.

## 5f. T7, y qué pasa cuando lleguen cambios de texto

Español en `/`, inglés en `/en/`, con el i18n nativo de Astro
(`prefixDefaultLocale: false`). `npm run verify` audita **2 páginas y 8 corridas**;
`npm run verify:idioma` cubre los 15 criterios de RF-1.

### Cómo está partido el contenido

| Archivo | Qué lleva |
| ------- | --------- |
| `src/data/comun.ts` | Lo que **no** se traduce: título oficial, nombres institucionales, nombres de personas, dirección postal, fechas ISO, código FOVI |
| `src/data/tipos.ts` | La interfaz que ambos idiomas deben satisfacer |
| `src/data/es.ts` · `en.ts` | El contenido traducible, `satisfies ContenidoIdioma` |
| `src/data/contenido.ts` | Los compone y resuelve los códigos de país |

La regla para decidir dónde va algo: **si traducirlo produce un dato falso o un
nombre que nadie usa, no se traduce.** Los nombres institucionales entran ahí —una
traducción inventada de una universidad es el mismo tipo de error que un logo
inventado, que este proyecto ya tiene prohibido—.

Ningún componente importa `es` ni `en`: reciben `c: Contenido` por props. Así un
componente no puede quedarse atado a un idioma sin que se note.

### Las dos garantías, y lo que cada una NO cubre

1. **Falta una clave** → error de compilación. `satisfies ContenidoIdioma` hace que
   `astro check` falle. **Probado**, no supuesto: al quitar `cargarMapa` de `en.ts`,
   `astro check` respondió `Property 'cargarMapa' is missing`. `[verificado]`
2. **Una clave existe pero con el texto sin traducir** → TypeScript **no lo ve**: la
   clave está y su tipo es `string`. Por eso `verify:idioma` compara las dos
   páginas ya generadas, texto a texto por posición, y avisa de cualquier
   coincidencia que no esté justificada. La lista de coincidencias legítimas
   —título oficial, instituciones, personas, dirección, cifras— vive en el propio
   verificador y debe mantenerse corta: si crece sin control, deja de detectar nada.

Esa segunda garantía es la que importa **cuando lleguen los cambios de texto tras
la revisión**: editar solo el español y olvidar el inglés no rompe la compilación,
pero sí rompe `verify:idioma`.

### Lo que T7 NO obliga a rehacer

Una tarea posterior que añada componentes —T10— **no rehace T7**. El coste de un
componente nuevo bilingüe es: recibir `c` por props y añadir sus cadenas a
`tipos.ts`, `es.ts` y `en.ts`. Los dos últimos son obligatorios porque el primero
lo exige el compilador. Lo que sí hay que respetar es no escribir cadenas en el
marcado: `verify:idioma` lo comprueba estáticamente sobre todos los `.astro`.

### El cambio de idioma: un solo control, y por qué

**Enmienda de RF-1.5 decidida por Daniel el 2026-07-31**, registrada en
`requirements.md`. La primera implementación mostraba los dos idiomas con el
activo marcado por `aria-current`. Cumplía el requisito literal y estaba mal.

Lo que dice la evidencia, buscada a petición de Daniel:

- El **U.S. Web Design System** define un patrón para sitios de exactamente dos
  idiomas —«Select a language · Two languages»— y es **un único control que
  muestra el idioma de destino**: en la página en español, dice «English». El
  idioma actual no se marca porque lo declara `<html lang>`. `[verificado]`
- **Nada de banderas.** Una bandera es un país, no un idioma: el español de este
  sitio no es el de España ni el inglés el de EE. UU.
- **Nada de desplegable.** Es lo más común en la web, pero cuesta dos
  interacciones donde aquí basta una, y esconde que existe otra versión. Se
  justifica a partir de unos cinco idiomas.

El defecto concreto que arregló: en la barra quedaban **dos píldoras segmentadas
idénticas y contiguas** —idioma y tema— que se confundían entre sí.

Dos apartes deliberados de la guía del USWDS, ambos anotados en el componente:

1. **No se pone `role="button"`** en el enlace, que su guía sugiere. Este control
   navega a otra URL; anunciarlo como botón le diría al lector de pantalla que la
   acción ocurre en esta página.
2. **`xml:lang` se incluye pero no hace nada.** En un documento HTML5 servido como
   `text/html` es herencia de XHTML y la especificación solo lo admite si coincide
   con `lang`. Se conserva por seguir el patrón; el que trabaja es `lang`.

El enlace se construye con `getRelativeLocaleUrl()` de `astro:i18n` en vez de
componer la ruta a mano: sigue la configuración de `astro.config.mjs`, así que un
cambio de estrategia de rutas no lo deja apuntando a un sitio que ya no existe.

### Un falso positivo que costó tres intentos

`verify:teclado` empezó a fallar al añadir el selector de idioma: el anillo de foco
daba 1,05:1 contra un umbral de 3:1. No era un fallo del sitio. **`transition-colors`
de Tailwind incluye `outline-color` entre las propiedades que anima**, así que medir
justo después del `Tab` captura el color *de partida* de la transición y no el
final. Con las transiciones anuladas: 10,99:1 y 8,96:1.

Es exactamente la regla que `specs/fuentes.md` ya tenía registrada desde T2 —«toda
medición de contraste anula antes las transiciones»—, aprendida entonces con la
opacidad de `.reveal`. El verificador nuevo no la aplicaba. Ahora sí.

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
  (`9a978d8`, el sitio inicial). **No contiene T1 ni T2.** Está `MERGED`, no
  simplemente cerrado: esta sección decía «cerrado» y se corrigió el 2026-07-31.
- La rama de trabajo tiene **39 commits sin fusionar** por delante de ese punto:
  es todo el trabajo SDD, de T1 a T10. Subida a `origin` el 2026-07-31 (`cf7fffc`).
- El contenido de la rama es un **superconjunto** de `main`: `main` no tiene nada
  que la rama no tenga. No hay que fusionar nada hacia atrás.
- El trabajo posterior necesitaba un **PR nuevo**. No reabrir ni reutilizar el #1.
- **El PR #2 ya se fusionó** (`df22be4`, 2026-07-31): `main` contiene todo el
  trabajo de T1 a T10, y su árbol es **idéntico** al de la rama de trabajo, que se
  conserva porque hay clones en el móvil, en el PC y en Antigravity.
- Se fusionó con **merge commit, no con squash**: los mensajes de los 46 commits
  son el registro de qué se descartó y por qué, y este proyecto se apoya en ese
  registro para cambiar de entorno sin perder el hilo.
- **Ya se puede conectar Cloudflare a `main`** sin publicar una versión vieja, que
  era el riesgo mientras el PR estuviera abierto.
- **El PR #3 también se fusionó** (`b84b38d`, 2026-07-31), con el cierre de 001, y
  su anotación en `main` con el **PR #4**.
- **La anotación de una fusión viaja siempre en el PR siguiente**, porque no se
  puede registrar dentro del PR que se está fusionando. Así que ver uno o dos
  commits de registro por delante de `main` es lo normal y no significa que haya
  trabajo sin fusionar. Lo que importa es que no haya **código** por delante.

### PR #3, fusionado el 2026-07-31

<https://github.com/Daniel990310/Seminario-Wireless-Lab/pull/3> · `MERGED`
(`b84b38d`), con merge commit y sin squash, igual que el #2 y por el mismo motivo.

Contenido: los cuatro commits que quedaban fuera de `main` —el `noindex` cuando
nadie declara la URL (`8f4bdfc`), la sincronización de las especificaciones
(`f9f2e79`) y el cierre de 001 (`e53f013`)—. **`main` vuelve a tener el mismo árbol
que la rama de trabajo**, que se conserva porque hay clones en el móvil, en el PC y
en Antigravity.

### PR #2, abierto el 2026-07-31

<https://github.com/Daniel990310/Seminario-Wireless-Lab/pull/2> · `OPEN` y
`MERGEABLE` · 43 commits, 299 archivos.

**Trampa de credenciales, por si reaparece:** `gh` estaba autenticado como
`danielcaignet-dataseed`, con permiso `READ` sobre el repositorio, y
`gh pr create` fallaba con `must be a collaborator`. El `git push` sí funcionaba,
porque va por SSH con otra credencial —de ahí que el problema no se note hasta
intentar abrir el PR—. Se resolvió con `gh auth login` usando la cuenta
`Daniel990310`.

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

## 6c. El sitio está publicado — 2026-07-31

**<https://seminario-wireless-lab.danielcaignet99.workers.dev>** ·
Cloudflare Workers con activos estáticos, cuenta `danielcaignet99@gmail.com`.

Comprobado en vivo tras el despliegue: `/` y `/en/` responden 200, las imágenes
para compartir sirven como PNG, el sitemap responde, y en `/en/` el documento
declara `lang="en"` con canónico propio, `hreflang` recíproco, `x-default` y
`og:image` absoluto. `[medido]`

**Es un despliegue provisional y lleva `noindex`,** que es lo correcto: la URL
`workers.dev` no debe competir en buscadores con el dominio institucional
definitivo. El `noindex` desaparece solo cuando el host coincida con
`PRODUCTION_SITE`.

### La trampa que costó un despliegue de más

`SITE_URL` es una variable de **compilación**, no del Worker. `astro.config.mjs`
la lee mientras corre `npm run build`; ponerla en las variables del Worker no
sirve, porque esas son de ejecución y para entonces el HTML ya está escrito.

El primer despliegue salió con el canónico apuntando a
`https://seminario-wireless.pucv.cl` —un dominio que aún no existe— y, peor, **sin
`noindex`**, porque el código creyó estar ya en producción. Se corrigió
reconstruyendo con la variable en el entorno del build:

```bash
SITE_URL="https://…" npm run build && npx wrangler deploy
```

Se comprueba en un vistazo, y conviene hacerlo siempre después de desplegar:

```bash
grep -o '<link rel="canonical"[^>]*' dist/index.html
grep -o '<meta name="robots"[^>]*' dist/index.html
```

### Salvaguarda: no indexar si nadie declaró la URL

Añadida el 2026-07-31, después de que el primer despliegue saliera indexable por
error. `astro.config.mjs` exporta `SITE_ES_RESPALDO`, que dice si la URL vino del
entorno o del respaldo, y `BaseLayout` fuerza `noindex` cuando vino del respaldo
**aunque el host coincida con el de producción**.

Los tres casos, comprobados: `[medido]`

| `SITE_URL` | Resultado |
| ---------- | --------- |
| Sin declarar | `noindex` — la salvaguarda actúa |
| `https://seminario-wireless.pucv.cl` | Indexable |
| `https://…workers.dev` | `noindex` |

`verify:seo` fija el comportamiento: comprueba que haya `noindex` cuando la URL es
provisional **y** que no lo haya cuando es la definitiva. Preferimos no ser
indexados por error antes que ser indexados con enlaces rotos.

### Conectar Git a `main`: se hace en el panel, no por API

`[verificado]` en la documentación de Cloudflare: conectar un Worker existente a
un repositorio es un flujo interactivo del dashboard y exige autorizar la
aplicación de GitHub. No hay forma de automatizarlo desde aquí.

Como el Worker **ya existe**, hay que usar «conectar un Worker existente» y no el
asistente de creación, que es donde se atascó el primer intento:

1. **Workers & Pages** → `seminario-wireless-lab` → **Settings** → **Builds** →
   **Connect**.
2. Repositorio `Daniel990310/Seminario-Wireless-Lab`, rama de producción `main`.
3. Ajustes de compilación:

   | Campo | Valor |
   | ----- | ----- |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` — **no** `/dist` |

4. **Variable de entorno de compilación** (no del Worker):
   `SITE_URL = https://seminario-wireless-lab.danielcaignet99.workers.dev`

**El nombre del Worker debe coincidir con el `name` de `wrangler.jsonc`** o la
compilación falla. Hoy coinciden: `seminario-wireless-lab`.

Si no se define `SITE_URL`, la salvaguarda de arriba evita el daño grave —el
sitio no se indexará— pero el canónico y las imágenes para compartir seguirán
apuntando a un dominio que aún no existe.

### Qué falta para el despliegue definitivo

1. **Decidir Workers o Pages.** Hoy está en Workers, que exige `SITE_URL` a mano.
   Pages la deduce sola con `CF_PAGES_URL`. Para un sitio estático puro, Pages es
   menos configuración; Workers es lo que Cloudflare recomienda para proyectos
   nuevos. Las dos sirven: está comparado en el README.
2. **Conectar Git** para que cada rama tenga su previsualización. La advertencia
   que había aquí —«`main` va 43 commits por detrás, conectarlo publicaría la
   versión vieja»— **ya no aplica**: el PR #2 se fusionó el 2026-07-31 (`df22be4`)
   y `main` tiene el mismo árbol que la rama de trabajo. Se corrige el 2026-07-31,
   al detectarse que contradecía al encabezado de este mismo archivo.
3. **Dominio definitivo** y, después, `npm run og`.

### Lo que la URL pública desbloqueó, y qué se hizo con ello

Los dos pendientes de T8 que necesitaban un sitio accesible: el primero **está
cerrado** (§6d), el segundo sigue exigiendo mirar.

- ✅ Validar los datos estructurados de `/` y `/en/` en <https://validator.schema.org>.
- ⏳ Ver la previsualización real del enlace compartiéndolo.

## 6d. T13 · Comprobar el sitio publicado

`npm run verify:publicado -- https://…` — **20 criterios, todos en verde** contra la URL
provisional el 2026-07-31 `[medido]`. Queda **fuera de `verify:todo`** a propósito
(RNF-7.5): depende de la red y de `validator.schema.org`, y la autoridad sobre el
cumplimiento no puede depender de que haya conexión.

Lo que cierra, y que `dist/` no puede responder:

| Criterio | Medición |
| -------- | -------- |
| RNF-3.1 · validador oficial | **0 errores y 0 avisos** en ambos idiomas; reconoce `Event`, `Place`, `PostalAddress`, `Country`, `Organization`, `Person` |
| RNF-3.2 · la imagen se sirve | HTTP 200, 1200×630, 123 kB (es) y 121 kB (en) |
| RNF-7.3 · el dominio provisional no se indexa | `noindex, nofollow` en `/` y `/en/` |
| RNF-3.3 · el canónico apunta al host servido | coincide en las dos rutas |

**No lleva ningún dominio escrito.** La URL se pasa por argumento o por
`SITIO_PUBLICADO`, y sin ella informa **OMITIDO** y sale en 0: no hay incumplimiento que
declarar, pero tampoco se calla. Un verificador que pasa en silencio sin comprobar nada
es peor que uno que falla.

### La prueba de sensibilidad destapó dos defectos del propio verificador

Se apuntó el guion a una copia de `dist/` servida en `127.0.0.1`, donde varios criterios
deben fallar. Falla: **6 incumplimientos y código 1**. Y el motivo es real —ese build se
compiló sin `SITE_URL`, así que canoniza a `seminario-wireless.pucv.cl`, que todavía no
resuelve—, lo que es de paso una demostración en vivo de la trampa de §6c.

1. **Un fallo de red abortaba el proceso** con un rastro de pila en vez de reportar el
   criterio. Ahora toda petición va envuelta y un dominio que no resuelve sale como `✗`
   con su código de error.
2. **«Sin errores» pasaba en verde habiendo validado nada.** Si el validador no alcanza
   la URL responde sin nodos: cero errores sobre cero datos. Se añadió un criterio
   previo que exige que reconozca el `Event`. Es el mismo falso positivo de T2, cuando
   axe daba 0 hallazgos con el selector de tema sin ninguna opción marcada.

Los dos salieron de romper deliberadamente lo que el guion vigila, no de un despliegue
real. Es exactamente para lo que `AGENTS.md` exige la prueba.

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
