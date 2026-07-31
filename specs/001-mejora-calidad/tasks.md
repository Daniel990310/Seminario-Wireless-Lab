# 001 — Tareas

Orden de ejecución con la comprobación de cada una. Toda tarea referencia los
requisitos que satisface; ningún requisito queda sin tarea.

**Requisitos:** [`requirements.md`](requirements.md) · **Diseño:** [`design.md`](design.md)

## Orden y por qué

Las tareas están ordenadas por dependencia, no por importancia:

1. **La verificación va primero.** Sin el comando que mide, no hay forma de
   afirmar que lo demás mejoró. Construirlo al final invita a acomodar el
   presupuesto al resultado.
2. **Los tokens antes que los componentes**, porque los componentes leen tokens.
3. **Quitar Motion y montar la base de shadcn antes de rediseñar**, para no
   rehacer dos veces los componentes.
4. **El bilingüe antes del contenido final**, porque reestructura las rutas.

---

## T1 · Comando de verificación — COMPLETADA

**Satisface:** RNF-6 · **Depende de:** nada
**Resultado:** `scripts/verify.mjs`, ejecutable con `npm run verify`. Informe en [`verification.md`](verification.md).

Crear `npm run verify`, que sobre el build:

- Ejecuta axe-core (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) en ambos idiomas,
  ambos temas y dos anchos (1440×900, 390×844).
- **Anula las transiciones antes de medir contraste** — sin esto la medición da
  falsos positivos, como quedó documentado en la línea base.
- Reporta los nodos `incomplete` por separado: no son aprobaciones.
- Comprueba los presupuestos de peso comprimido. Los valores viven en
  `PRESUPUESTOS` dentro del script y se actualizaron con D6 a 115 kB de
  JavaScript y 260 kB de primera carga.
- Termina con código distinto de cero al incumplirse cualquiera.
- Escribe `verification.md` con fecha, commit y números.

**Comprobación — verificada:**

| Medición | Línea base | Verificador | |
| -------- | ---------- | ----------- | - |
| Hallazgos (escritorio) | 16 | 16 | exacto |
| Indeterminados (escritorio) | 28 | 28 | exacto |
| Causas raíz y ratios | 7 grupos, 3,29–3,73:1 | idénticos | exacto |
| Secciones sin nombre | 7 | 7 | exacto |
| Tipografías | 110,9 kB | 110,9 kB | exacto |
| JavaScript | 109,3 kB | 109,6 kB | +0,3 % por la implementación de gzip |
| Código de salida | — | 1 | falla como se espera |

**Prueba de sensibilidad.** Además de reproducir la línea base, se comprobó que el
instrumento detecta una mejora real: al subir solo el token `mist-500` a un valor
que cumple, los hallazgos bajaron de 16 a 1 por pantalla, y el único restante fue
exactamente el botón principal. Un verificador que solo reporta fallos constantes
no sirve; este responde al cambio.

**Tres defectos propios que la prueba destapó**, corregidos:

1. **Unidades mezcladas.** Las especificaciones usaban kB decimal (1000 B) y el
   script binario (1024 B): el mismo archivo aparecía como 109,3 kB y 106,8 kB.
   Se fijó el decimal de forma explícita.
2. **Primera carga inflada.** Contaba los logos, que llevan `loading="lazy"` y
   están bajo el pliegue. Se excluyen: no son parte de la primera carga.
3. **Totales ambiguos.** Sumaba las corridas y mostraba «32» frente a una línea
   base de 16 medida solo en escritorio. Se agregó el desglose por corrida.

---

## T2 · Tokens en tres capas y selector de tema — COMPLETADA

**Satisface:** RF-4, RNF-1.1, RNF-1.6 · **Depende de:** T1
**Resultado:** `src/styles/global.css` reescrito, `src/components/ThemeSelector.astro`
nuevo, los 9 componentes migrados a tokens semánticos.

- Reescribir `global.css` con las tres capas: primitivo → semántico →
  componente. Ningún componente referencia un primitivo.
- Tema claro: fondo `#F8FAFC`, texto `#0F172A`, primario `#1E3A5F`, acento
  `#A16207`. **Verificar cada pareja antes de fijarla**; no copiar el
  `Muted Foreground` del dataset, que da 4,08:1.
- Tema oscuro: reconstruir la escala corrigiendo el uso de `mist-500` como texto.
- Declarar `color-scheme` en cada tema.
- Tokens de forma (radio, borde) para que Swiss Modernism fije el radio en un
  solo lugar.
- Selector de tres estados, con el tema aplicado antes del primer pintado y la
  preferencia en `localStorage`.

**Comprobación:** `npm run verify` da cero hallazgos de contraste en ambos temas.
Sin JavaScript queda el tema claro. Al recargar con tema oscuro elegido no hay
destello claro. El selector se opera solo con teclado.

**Comprobación — verificada.** `npm run verify` da **0 hallazgos en las cuatro
corridas** (escritorio y móvil × claro y oscuro), frente a 16 en escritorio en la
línea base. `npx astro check`: 0 errores. Presupuestos: JavaScript 109,6 / 115 kB,
primera carga 247,0 / 260 kB, tipografías 110,9 / 125 kB.

Los criterios de RF-4 que axe no puede evaluar se comprobaron con un guion propio
de Playwright, 16 comprobaciones, todas en verde:

| Criterio | Medición |
| -------- | -------- |
| RF-4.1 claro por omisión | `data-theme=light`, fondo `rgb(248,250,252)` |
| RF-4.1 tres estados por instancia | `tema-barra:3`, `tema-menu:3` |
| RF-4.1 «sistema» resuelve | SO oscuro → `dark`; SO claro → `light` |
| RF-4.2 sin destello | con `waitUntil:'commit'` ya se lee `dark`, y sigue en `dark` tras cargar |
| RF-4.3 persistencia | `localStorage=dark`, **0 cookies**, sobrevive a la recarga |
| RF-4.4 sin JavaScript | queda claro, 7 secciones y 22 anclas presentes |
| RF-4.5 teclado | foco en `light`, `ArrowRight` → `dark`, tema cambia |
| RF-4.6 instancias sincronizadas | cambiar en la barra marca también el menú móvil |
| RF-4.7 el selector cabe | ninguna opción recortada en 390 px |
| RF-4.8 `color-scheme` | declarado por tema |
| RF-4.9 figura única | 1 SVG; `--primary` `#1e3a5f` → `#8fb6df` |

**Ratios medidos** (los que fijaron los tokens, no estimaciones):

| Pareja | Claro | Oscuro |
| ------ | ----- | ------ |
| Texto sobre fondo | 17,06:1 | 16,12:1 |
| Metadatos sobre fondo | 7,24:1 | 7,96:1 |
| Primario sobre fondo | 10,99:1 | 8,96:1 |
| Acento sobre fondo | 6,10:1 | 8,98:1 |
| Borde de control | 4,08:1 | 4,01:1 |

**Tres defectos propios que la comprobación destapó**, corregidos:

1. **Un criterio mal especificado.** Mi prueba de contraste aplicaba el 3:1 de
   WCAG 1.4.11 a las líneas decorativas de las tarjetas. Ese umbral rige para los
   **límites de controles**, no para el ornamento. Se separó `--border`
   (decorativo, sin umbral) de `--border-control` (≥ 3:1).
2. **Botón principal ilegible.** Al migrar, el botón del hero quedó
   `text-foreground` sobre `bg-primary`: 1,55:1 en claro y 1,79:1 en oscuro. Con
   `text-primary-foreground` los hallazgos pasaron de 4 a 0.
3. **Un solo grupo de radios para dos selectores.** Las dos instancias
   compartían `name="tema"`. El ámbito de un grupo de radios es el documento, no
   el `fieldset`, así que formaban un grupo: al inicializar la del menú móvil se
   desmarcaba la de la barra, que quedaba **sin ninguna opción resaltada**. Se dio
   un `name` distinto por instancia y se sincronizan al cambiar. Lo destapó la
   revisión visual, no axe: para axe un radio desmarcado es válido.

Un cuarto defecto, de maquetación: en el panel de 15rem del menú móvil el rótulo
y el control en la misma fila no caben, y «Sistema» se recortaba 8 px contra el
`overflow-hidden`. Se apiló el rótulo sobre el control. La comprobación RF-4.7 se
sometió a prueba de sensibilidad: al restaurar la fila falla con
`Sistema (378 > 370)`.

---

## T3 · Quitar Motion y montar la base de shadcn/ui — COMPLETADA

**Satisface:** RNF-2.1, RNF-2.5, D6 · **Depende de:** T1
**Resultado:** `src/components/CollaborationNetwork.astro` sustituye a la isla de
React; `motion`, `CollaborationNetwork.tsx` y `ui/animated-beam.tsx` fuera;
`components.json` creado; `npm run verify:red` añadido.

**React se queda** (D6). Lo que sale es Motion.

- Reimplementar el efecto de `AnimatedBeam` con SVG y `stroke-dashoffset` animado
  por CSS, calculando los trayectos al compilar. **Comparar contra el actual antes
  de desinstalar Motion.**
- Desinstalar `motion` y retirar `src/components/ui/motion-safe.tsx`.
- Configurar la base de shadcn/ui: `components.json`, el helper `cn` ya existe en
  `src/lib/utils.ts`, y los tokens semánticos que llegan con T2.
- Instalar solo las primitivas de Radix que se usen. Cada una se justifica por el
  componente que habilita, no «por si acaso».
- Toda isla se hidrata con `client:visible`, salvo que haya un motivo escrito para
  otra directiva. Es la regla «Minimize client directives» del skill de Astro,
  severidad alta.

**Comprobación:** JavaScript ≤ 115 kB comprimidos y primera carga ≤ 260 kB. Sin
`motion` en `package.json`. La animación del haz se detiene con
`prefers-reduced-motion` usando solo la regla CSS.

**Comprobación — verificada.**

| Medición | Antes (T2) | Después (T3) | Presupuesto |
| -------- | ---------- | ------------ | ----------- |
| JavaScript comprimido | 109,6 kB | **0,0 kB** | 115 kB |
| Primera carga comprimida | 247,0 kB | **136,4 kB** | 260 kB |
| Hallazgos axe (4 corridas) | 0 | 0 | 0 |
| `motion` en `package.json` | sí | no | — |
| Peticiones de script del navegador | 1 isla | **0** | — |

La primera carga baja **110,6 kB, un 45 %**, y el JavaScript desaparece por
completo. `npx astro check`: 0 errores, 0 advertencias, 0 hints.

**Por qué el JavaScript llega a cero.** `CollaborationNetwork` era la única isla
hidratada del sitio. `Ripple` se importa en `ProgramPending.astro` y
`VenueLocator.astro` **sin** directiva `client:`, así que Astro lo renderiza en el
build y no envía nada. Al pasar la red a Astro no queda ninguna isla, y la página
no referencia ningún `.js`: solo scripts en línea, que van dentro del HTML.

**Comparación con el comportamiento anterior**, como exigía la tarea. Motion movía
`x1`/`x2` de un `linearGradient` de −10 % a 110 % en 7 s: el brillo era una banda
vertical barriendo el **recuadro** del trayecto. Medido muestreando los atributos.
La versión nueva desplaza un guion **sobre la curva misma**, así que el pulso sigue
el trayecto en vez de aproximarlo.

`npm run verify:red` comprueba los 7 criterios que `npm run verify` no cubre:

| Criterio | Medición |
| -------- | -------- |
| El pulso se detiene con movimiento reducido | 4 pulsos, 0 animando, 0 visibles |
| La topología sigue visible sin animación | 4/4 líneas base visibles |
| El pulso recorre con movimiento permitido | 4/4 animando |
| En móvil el eje vertical recorre | 1/1 animando |
| El pulso avanza de verdad | `stroke-dashoffset` 225,6 → 196,4 px |
| El navegador no pide ningún `.js` | 0 peticiones de script |
| Ninguna isla que hidratar | 0 `astro-island` |

**Cómo se sustituyó la medición del DOM.** `AnimatedBeam` medía la posición real de
cada nodo para trazar la curva. Aquí la geometría se fija por construcción: las
columnas laterales son retículas de dos filas iguales **sin separación**, y la
tarjeta se centra dentro de su fila, así que los extremos caen siempre al 25 % y al
75 % del alto sea cual sea el largo del texto. La separación visual se hace con
relleno dentro de la fila, que no mueve el centro. Los trayectos son entonces
constantes y se calculan al compilar.

**Tres defectos propios que la comprobación destapó**, corregidos:

1. **El medidor contaba bytes que nadie descarga.** `@astrojs/react` emite su
   runtime de cliente aunque no quede ninguna isla. `client.*.js` se genera pero
   ningún archivo de `dist` lo menciona. Sumarlo habría castigado justamente el
   cambio que eliminó el JavaScript, igual que contar los logos diferidos.
   `scripts/verify.mjs` ahora mide solo lo referenciado por el HTML y **lista los
   huérfanos aparte** en vez de ignorarlos.
2. **`pathLength` no normalizaba nada.** El pulso usaba `pathLength="100"` para
   expresar el guion en porcentaje del recorrido. Con
   `vector-effect="non-scaling-stroke"` el guion se mide en **píxeles de pantalla**:
   el valor computado sale «16px, 84px» y el patrón se repite. En el eje de móvil,
   de 470 px, salían ~4,7 guiones en vez de uno. Se rediseñó en espacio de pantalla
   desplazando un período exacto por ciclo, que empalma el bucle a cualquier escala.
   Se confirmó midiendo el `stroke-dasharray` computado y el largo del trayecto en
   pantalla, no leyendo la especificación.
3. **Un comentario afirmaba un atributo que no estaba.** Decía que la retícula de
   escritorio llevaba `aria-hidden` para evitar duplicar contenido. No lo llevaba, y
   además no hace falta: `display: none` ya saca del árbol de accesibilidad la vista
   que el punto de quiebre oculta, y ponerlo habría ocultado la retícula en
   escritorio, donde es la única versión visible.

Un cuarto defecto, en la comprobación y no en el código: contaba los cinco pulsos
del marcado, incluido el del eje móvil, que a 1440 px está en `display: none` y por
eso no anima. Daba «4/5 animando» y parecía un fallo. Ahora filtra por elementos
representados y se comprueba cada ancho por separado.

**shadcn/ui: base montada, sin primitivas.** `components.json` queda configurado
(`tailwind.config` vacío, que es lo que corresponde en Tailwind 4 sin archivo de
configuración; `cssVariables: true` para enganchar con los tokens semánticos de T2).
**No se instaló ninguna primitiva de Radix**: ningún componente la justifica
todavía. Las que hagan falta llegan con T10, cada una con su motivo escrito.

---

## T4 · Tipografía

**Satisface:** D4, RNF-1, RNF-2.2, RNF-2.4 · **Depende de:** T2

Paquetes exactos, ya verificados en npm:

| Rol | Paquete | Peso latino |
| --- | ------- | ----------- |
| Títulos | `@fontsource-variable/crimson-pro` | 48.200 B |
| Texto | `@fontsource-variable/atkinson-hyperlegible-next` | 33.996 B |
| Metadatos | `@fontsource-variable/jetbrains-mono` (ya instalado) | 40.404 B |

- Usar **Atkinson Hyperlegible Next**, no la original: esta última no tiene
  versión variable y pesa más en dos archivos.
- Auto-hospedadas con el proveedor `local` de Astro, subconjunto latino
  únicamente. `latin-ext` no aporta a español ni inglés.
- Retirar Space Grotesk e Inter, y sus archivos de `src/assets/fonts`.
- Si el par no funciona en la práctica, evaluar «Academic/Archival» (EB Garamond
  y Crimson Text) antes de volver atrás.

**Comprobación:** primera carga ≤ 260 kB comprimidos; la proyección es 247 kB.
Sin peticiones a dominios externos. Sin desplazamiento de diseño al cargar.
Revisión visual del par en el sitio real, no en una muestra.

**Si el presupuesto no alcanza**, la primera concesión es quitar JetBrains Mono
(−40,4 kB). Está identificada de antemano para que no se decida a la carrera.

---

## T4b · Refinamiento visual con componentes estáticos de 21st.dev

**Satisface:** D4, 21st.dev MCP Integration · **Depende de:** T4 y **T5**
**Acordado con el cliente el 30 de julio de 2026.**

La dependencia de T5 se añadió el 2026-07-30: T5 rehace la retícula, mueve la
figura de propagación a columnas propias y reordena los bloques. Refinar
visualmente las secciones antes de eso es trabajo que T5 deshace.

- Exploración de componentes estáticos (sin JS) en el catálogo de 21st.dev (`search`, `get_inspiration`).
- Prototipado con `generate` (modo `sketch`) y reimplementación nativa en Astro puro para no agregar JavaScript.
- Aplicar a secciones clave manteniendo el registro visual de conferencia académica.

**Comprobación:** cero JavaScript agregado (mantiene 0,0 kB), 0 hallazgos de axe.

**Cumplida el 2026-07-30, sin usar el catálogo.** `generate` estaba agotado y lo que
devuelve `search` no pasa el filtro de registro visual de `habilidades.md` §5. El
refinamiento salió de auditar la composición existente: alineación, ritmo y una
quita. Detalle en `ESTADO.md` §5d. JavaScript sigue en 0,0 kB y axe en 0 hallazgos.

---

## T5 · Retícula de 12 columnas y composición

**Satisface:** D4, RNF-1.3 · **Depende de:** T2, T4

- Retícula estricta de 12 columnas con unidad base de 8 px.
- **La figura de propagación pasa a ocupar columnas propias**, dejando de estar
  detrás del texto. Esto elimina la causa de los 28 nodos indeterminados en vez
  de medir el síntoma.
- Orden según el patrón «Hero + Agenda + CFP»: el programa sube a segundo bloque.
- Un solo acento; sin degradados sobre texto.

**Comprobación:** `npm run verify` reporta **cero** nodos indeterminados. El
resultado se registra en `verification.md`.

**Cumplida el 2026-07-30:** 104 → 0. Lo que costó no fue la retícula sino la cola
final: axe razona con `clientRects` y `overflow: hidden` no los encoge, así que
`Ripple` y los `path` del SVG seguían tapando texto para la herramienta sin taparlo
a la vista. Mecanismo y descartes en `ESTADO.md` §5b.

---

## T6 · Semántica y accesibilidad restante

**Satisface:** RNF-1.4, RNF-1.5, RNF-1.7, RNF-1.9 · **Depende de:** T5

- `aria-labelledby` en cada `<section>`, apuntando a su encabezado.
- Rótulo de grupo de expositores a `h3`, nombres a `h4`.
- Foco visible con contraste suficiente en ambos temas.
- Recorrido completo por teclado, incluidos menú móvil y selector de tema.
- Zoom de texto al 200 % sin desbordamiento horizontal.

**Comprobación:** las 7 secciones se anuncian como regiones. Recorrido por
teclado verificado en ambos temas. Cero hallazgos de axe.

**Cumplida el 2026-07-30.** El recorrido por teclado no se verificó «manualmente»
como decía este enunciado: se automatizó en `npm run verify:teclado`, 12 criterios,
porque una comprobación manual que no se automatiza se deja de hacer. Aparecieron
dos incumplimientos reales de WCAG 1.4.4 al ampliar solo la tipografía —la barra de
navegación y la sección Sede desbordaban—, ambos corregidos. Detalle en
`ESTADO.md` §5e.

---

## T7 · Estructura bilingüe

**Satisface:** RF-1, RNF-3.3, RNF-3.4 · **Depende de:** T5

- i18n nativo de Astro: español en `/`, inglés en `/en/`.
- Separar el contenido en `src/data/es.ts` e `src/data/en.ts` sobre una interfaz
  común, para que TypeScript detecte traducciones faltantes al compilar.
- Título oficial en un módulo compartido, para que no pueda traducirse.
- `hreflang` recíproco más `x-default`; sitemap con ambas versiones.
- Selector de idioma que conserva la sección actual.

**Comprobación:** `astro check` sin errores. Ambas rutas responden. Cambiar de
idioma desde `#programa` llega a `#programa`. Cero cadenas escritas en
componentes.

**Cumplida el 2026-07-31.** Los cuatro puntos se comprueban en
`npm run verify:idioma`, 15 criterios. Se añadió uno que el enunciado no pedía y
que hace falta igual: detectar **textos sin traducir**. La interfaz de `tipos.ts`
obliga a que ninguna clave falte —probado quitando una: `astro check` falla— pero
no puede saber si el inglés quedó con el español copiado. Eso solo se ve comparando
las dos páginas generadas. Detalle en `ESTADO.md` §5f.

---

## T8 · Imagen para compartir y metadatos

**Satisface:** RNF-3.1, RNF-3.2 · **Depende de:** T4, T7

- Generar `og:image` de 1200×630 por idioma, con título y fechas legibles.
  Evaluar [`web-asset-generator`](https://github.com/alonw0/web-asset-generator)
  para esto.
- Validar los datos estructurados `schema.org/Event` en ambos idiomas.

**Comprobación:** validador de Google sin errores. Previsualización del enlace
revisada de verdad, no supuesta.

**Cumplida el 2026-07-31**, con dos matices declarados. `npm run verify:seo`
comprueba 20 criterios, incluida la estructura de `schema.org/Event` en ambos
idiomas. Lo que **no** se ha hecho, porque no se puede sin URL pública: pasar los
datos por la herramienta de Google y ver la previsualización real del enlace en
una plataforma. Queda anotado en `ESTADO.md` §5g con las dos formas de cerrarlo.
Las imágenes sí están revisadas abriendo los PNG, que fue como se descubrió que la
primera tanda salió con la tipografía de reserva.

`web-asset-generator` se evaluó y se descartó: es un skill de Claude Code que
exige Python y Pillow, y `AGENTS.md` establece que el proyecto no depende de
Claude Code. Se usa Playwright, ya instalado para los verificadores.

---

## T10 · Componentes interactivos con shadcn/ui

**Satisface:** D6, RNF-1.7 · **Depende de:** T3, T5, T7

La interacción que se implementa está en RF-6 y se acordó con el cliente. Cada
primitiva de Radix se justifica por el componente que habilita.

- Instalar solo las primitivas acordadas. Ninguna «por si acaso».
- Cada componente hereda los tokens semánticos de T2, de modo que funcione en
  ambos temas sin código adicional.
- Los textos salen de los archivos de datos por idioma (RNF-5.1), no del
  componente.
- Hidratación con `client:visible`, salvo motivo escrito.

**Comprobación:** `npm run verify` sigue en cero hallazgos con los componentes
montados. Recorrido por teclado completo en cada uno. JavaScript ≤ 115 kB.

**Parcial el 2026-07-31: 1 de 5 interacciones.** No es una renuncia técnica.
Tres esperan contenido que no existe —`program.days` está vacío y los expositores
no tienen reseña— y el selector de tema ya está resuelto mejor con radios
nativos a 0 kB. Instalar `Tabs`, `Accordion` o `Dialog` ahora incumpliría el
punto 4 de esta misma tarea: «ninguna primitiva sin un componente que la use».

Implementada la sección activa en la navegación, que no necesita primitiva.
Verificada en `npm run verify:interaccion`. Qué datos hacen falta para
desbloquear el resto: `ESTADO.md` §5h.

---

## T9 · Verificación final y registro

**Satisface:** RNF-6.3, RNF-5.4 · **Depende de:** todas

- `npm run verify` en verde: cero hallazgos, cero indeterminados, presupuestos
  cumplidos.
- `astro check` sin errores ni advertencias.
- `verification.md` con la comparación contra la línea base.
- Actualizar `README.md` y los pendientes de contenido.

**Comprobación:** tabla línea base contra resultado, con los números medidos.

---

## Trazabilidad

| Requisito | Tareas |
| --------- | ------ |
| RF-1 Bilingüe | T7 |
| RF-2 Una página | T5 |
| RF-3 Registro previsto | — (solo documentado, `design.md`) |
| RF-4 Selector de tema | T2 |
| RNF-1 Accesibilidad | T2, T5, T6 |
| RNF-2 Rendimiento | T3, T4 |
| D6 shadcn/ui sobre Radix | T3, T10 |
| RNF-3 SEO | T7, T8 |
| RNF-4 Privacidad | T2 (`localStorage`, sin cookies) |
| RNF-5 Mantenibilidad | T7, T9 |
| RNF-6 Verificación | T1, T9 |
| RF-6 Interacción | T10 |

## Fuera de estas tareas

Los pendientes de contenido (logos oficiales, afiliación de Rodolfo Feick, correo
institucional, subdominio) no son tareas de implementación: dependen de terceros
y están registrados como decisiones abiertas no bloqueantes A3 a A7.
