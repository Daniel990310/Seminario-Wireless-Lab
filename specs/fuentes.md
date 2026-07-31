# Registro de procedencia

De dónde sale cada cifra que aparece en las especificaciones. Ver la regla de
procedencia en [`README.md`](README.md).

Última revisión: **29 de julio de 2026**, commit `e2344db`.

## Mediciones del proyecto `[medido]`

Reproducibles. Todas parten de `npm run build`.

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| Contraste insuficiente | 16 nodos, 7 grupos | axe-core 4.12.1 sobre el build, transiciones anuladas y `prefers-reduced-motion: reduce` emulado |
| Contraste indeterminado | 28 nodos | Misma corrida, categoría `incomplete` |
| `mist-500` como texto | 3,29 – 3,60:1 | Ratios reportados por axe según fondo y tamaño |
| Botón principal | 3,73:1 | `#eef2f9` sobre `#0b87a3`, 14 px |
| Secciones sin nombre accesible | 0 de 7 | Recuento de `<section>` sin `aria-label` ni `aria-labelledby` |
| Encabezados | 24, sin saltos de nivel | Recorrido de `h1`–`h6` en orden de documento |
| JavaScript comprimido | 109,3 kB | `gzip -9` sobre los tres `.js` de `dist/_astro` |
| Primera carga comprimida | 241 kB | JS + CSS + HTML con `gzip -9`, más las tipografías woff2 ya comprimidas |
| Tipografías actuales | 108,3 kB | Suma de los tres woff2 en `dist/_astro/fonts` |

**Advertencia metodológica.** La primera medición de contraste dio **67 nodos**.
Era un artefacto: axe mezcla el color del texto con el fondo cuando lo mide
durante la transición de opacidad de las secciones. Con las transiciones anuladas
la cifra real es 16. **Toda medición de contraste debe anular las transiciones
antes de evaluar.**

### Después de T2

Las cifras de arriba son la línea base, del commit `75e844b`. Estas son las del
cierre de T2. Se obtienen con `npm run build && npm run verify` y
`npm run verify:tema`.

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| Contraste insuficiente | **0 nodos** en las 4 corridas | `npm run verify`; escritorio y móvil × claro y oscuro |
| Contraste indeterminado | 104 nodos (30/30/22/22) | Misma corrida, categoría `incomplete`. Sigue abierto: RNF-1.3 → T5 |
| Secciones sin nombre accesible | 0 de 7 | Sin cambio. Sigue abierto: RNF-1.4 → T6 |
| JavaScript comprimido | 109,6 kB | `zlib` de Node sobre los `.js` de `dist/_astro`. La diferencia con los 109,3 kB de la línea base es la implementación de gzip, no un cambio real |
| Primera carga comprimida | 247,0 kB | JS + CSS + HTML + tipografías. Excluye los logos, que llevan `loading="lazy"` |
| Tipografías | 110,9 kB | Suma de los woff2 en `dist/_astro/fonts` |
| Criterios de RF-4 | 16 de 16 | `npm run verify:tema` |

### Después de T5

Mismo comando: `npm run build && npm run verify`, 2 anchos × 2 temas.

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| Contraste insuficiente | **0 nodos** en las 4 corridas | Sin cambio respecto de T2 |
| Contraste indeterminado | **0 nodos** en las 4 corridas, eran 104 | Categoría `incomplete`. RNF-1.3 cerrado |
| Secciones sin nombre accesible | **0 de 7**, eran 7 de 7 | `aria-labelledby` en cada `<section>` apuntando a su encabezado. RNF-1.4 cerrado |
| Criterios de T6 | **12 de 12** | `npm run verify:teclado`, 2 temas × 2 anchos |
| Criterios de RF-1 | **17 de 17** | `npm run verify:idioma` |
| Criterios de RNF-3 | **20 de 20** | `npm run verify:seo` |
| Imágenes para compartir | 2, de 1200×630 | `npm run og`. Las dimensiones se leen de la cabecera IHDR del PNG, sin librería de imágenes |
| Páginas auditadas por `verify` | **2** (`/` y `/en/`), 8 corridas | Desde T7 |
| Traducción faltante detectada al compilar | sí | Comprobado quitando `cargarMapa` de `en.ts`: `astro check` responde `Property 'cargarMapa' is missing`. `[verificado]` |
| Foco visible en el recorrido | **39 paradas, todas con anillo** | Recorriendo con `Tab` real, no con `el.focus()`: el foco programático no siempre activa `:focus-visible` y daba fallos inexistentes |
| Contraste del anillo de foco | 7,24:1 claro · 7,96:1 oscuro | Fórmula de WCAG sobre `outlineColor` contra el fondo. Umbral de 1.4.11: 3:1 |
| Desbordamiento con texto al 200 % | **0 elementos** | Se mide el borde derecho de cada elemento con texto, no `scrollWidth`: `body { overflow-x: hidden }` enmascararía el desbordamiento |
| JavaScript comprimido | **1,1 kB** | Archivos `.js` referenciados (0,0 kB) **más** los scripts en línea del HTML (1,1 kB), medidos por diferencia de gzip. La métrica se corrigió el 2026-07-30: antes solo contaba archivos e informaba 0,0 kB en una página que sí ejecuta JavaScript. Ver `ESTADO.md` §5c |
| Primera carga comprimida | 137,0 kB | JS + CSS + HTML + tipografías |
| Tipografías | 122,6 kB | Sin cambio respecto de T4 |

**Cómo se localizaron los 104 nodos.** No se dedujeron: se corrió axe sobre `dist/`
con `.reveal { opacity: 1 !important }` —sin eso axe omite el contenido oculto y
cuenta 66 en vez de 104— y se agruparon los nodos `incomplete` por selector y por
`messageKey`. Para la cola final se llamó a `axe.commons.dom.getTextElementStack()`
en el navegador, previa `axe.setup()` —`axe.run()` desmonta su árbol virtual al
terminar, y sin `setup()` la llamada falla con `_grid` nulo—, que devuelve la pila
de elementos que axe ve en cada línea de texto. Eso identificó a los culpables por
nombre: `div.animate-ripple` y `path.fig-wave`.

**Regla que se desprende, y que vale para cualquier medición futura:** axe razona
con `clientRects`, y `overflow: hidden` recorta el dibujo pero **no** encoge los
rects de los descendientes. Un elemento decorativo grande y absolutamente
posicionado sigue «tapando» texto para axe aunque no se vea. El mecanismo completo
y las tres hipótesis descartadas por medición están en `ESTADO.md` §5b.

### Reseñas de los expositores `[verificado]` el 2026-07-31

Redactadas a partir de perfiles públicos, no de conocimiento previo. Cada ficha
del sitio enlaza su fuente para que el dato sea comprobable por quien lo lea.

| Expositor | Fuente |
| --------- | ------ |
| Gil Zussman | <https://www.ee.columbia.edu/gil-zussman> y el WiMNet Lab de Columbia |
| Jinfeng Du | Perfil de investigador de Nokia Bell Labs e IEEE Xplore |
| Reinaldo A. Valenzuela | <https://www.nokia.com/people/reinaldo-valenzuela/> |
| Rodolfo Feick | Wireless Communications Group, UTFSM, y dblp |
| Miguel Gutiérrez Gaitán | Ingeniería UC, CISTER Oporto y el portal de investigadores de ANID |
| Karel Toledo de la Garza | Portal de investigadores de ANID y USACH |

**Dos datos que conviene no perder:**

- Valenzuela **estudió ingeniería en la Universidad de Chile** antes de doctorarse
  en el Imperial College. `[verificado]`
- Feick **coautoró mediciones a 28 GHz en el área del banco de pruebas COSMOS**,
  el mismo proyecto del que Zussman es investigador principal por Columbia:
  hay colaboración previa real entre dos expositores. `[verificado]` en dblp.

**La afiliación de Feick sigue sin confirmar en el sitio.** Las fuentes públicas
lo sitúan en la **Universidad Técnica Federico Santa María**, pero es `[probable]`
hasta que la organización lo confirme.

**Ratios de contraste que fijaron los tokens.** Medidos pareja por pareja antes de
escribir el valor en `global.css`, no estimados. El umbral es 4,5:1 para texto
normal y 3:1 para texto grande y para límites de controles (WCAG 1.4.11).

| Pareja | Claro | Oscuro |
| ------ | ----- | ------ |
| `--foreground` sobre `--background` | 17,06:1 | 16,12:1 |
| `--muted-foreground` sobre `--background` | 7,24:1 | 7,96:1 |
| `--primary` sobre `--background` | 10,99:1 | 8,96:1 |
| `--accent` sobre `--background` | 6,10:1 | 8,98:1 |
| `--border-control` sobre `--background` | 4,08:1 | 4,01:1 |

`--border` no aparece en la tabla a propósito: es decorativo y WCAG no le fija
umbral. Aplicarle el 3:1 de 1.4.11 fue un error mío de especificación; ese umbral
rige para los límites de **controles**, y por eso existe `--border-control` aparte.

**Corrección de una estimación anterior.** En una revisión previa afirmé que el
botón principal daba «~4,9:1 y cumple». Medido da **3,73:1 y no cumple**. La cifra
de la tabla de línea base es la medida.

### Después de T3

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| JavaScript comprimido | **0,0 kB** | `npm run verify`. La página no referencia ningún `.js`; solo scripts en línea, que van dentro del HTML |
| Primera carga comprimida | **136,4 kB** | Baja 110,6 kB (−45 %) respecto de T2 |
| Peticiones de script del navegador | 0 | `npm run verify:red`, escuchando `resourceType === 'script'` |
| Islas hidratadas | 0 | Recuento de `astro-island` en el DOM |
| JavaScript huérfano generado | ~55 kB | `client.*.js` de `@astrojs/react`. Se emite aunque no haya islas y **ningún archivo de `dist` lo referencia**. Se informa aparte, no se suma |
| Haz de Motion, comportamiento | ventana del 10 % de −10 % a 110 % en 7 s | Muestreo de `x1`/`x2` del `linearGradient` cada 500 ms, antes de retirar Motion |
| `stroke-dasharray` con `non-scaling-stroke` | «16px, 84px» | `getComputedStyle`. Sale en **píxeles**: `pathLength="100"` no lo normaliza |
| Largo del trayecto en pantalla | 173 px escritorio, 470 px móvil | Recorrido del trayecto transformado con `getScreenCTM`, 200 muestras |

**Cómo se confirmó que `pathLength` no normaliza.** Se plantearon dos hipótesis y se
midió cuál predecía lo observado. Hipótesis A, guion en unidades de usuario
normalizadas: 1 guion visible. Hipótesis B, guion en píxeles de pantalla:
`largoPantalla / 100` guiones, o ~4,7 en el eje móvil. Lo observado fueron ~5. Gana
B. Es la razón por la que el pulso se diseñó en espacio de pantalla.

### Repositorios evaluados

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| daisyUI: temas | 35 | Recuento de `src/themes/*.css` |
| daisyUI: componentes | 61 | Recuento de `src/components/*.css` |
| daisyUI: CSS de componentes | 388 kB | `du -ch src/components/*.css` |
| tailkits-ui: archivos con `dark:` | 0 de 30 | `grep -l "dark:" components/*.html` |
| tailkits-ui: `sr-only` | 0 apariciones | `grep -o sr-only components/*.html` |
| shadcn: vocabulario de tokens | Idéntico al del proyecto | Lectura del bloque `:root` en su CSS de referencia |

### React y Radix (para D6)

Medido con esbuild en modo producción, minificado y con `gzip -9`:

| Bundle | sin comprimir | gzip |
| ------ | ------------- | ---- |
| `react` + `react-dom` | 193.294 B | **60.044 B** |
| Lo anterior + 5 primitivas de Radix | 304.725 B | **96.209 B** |

Las cinco primitivas medidas: `react-tabs`, `react-accordion`, `react-dialog`,
`react-dropdown-menu` y `react-toggle-group`. Radix aporta **36,2 kB** sobre la
base de React.

### Tipografías candidatas

Instaladas desde npm y medidos los archivos del subconjunto latino:

| Paquete | Archivos latinos | Peso | Nota |
| ------- | ---------------- | ---- | ---- |
| `@fontsource-variable/crimson-pro` | 1 variable | 48.200 B | Existe versión variable |
| `@fontsource/atkinson-hyperlegible` | 2 estáticos (400, 700) | 34.732 B | **No tiene versión variable** |
| `@fontsource-variable/atkinson-hyperlegible-next` | 1 variable | 33.996 B | Menos peso y todos los pesos |

Conclusión: **Atkinson Hyperlegible Next variable** gana por las tres vías —menos
peso, un archivo en lugar de dos y rango completo de pesos.

Proyección de primera carga con la tipografía nueva y D6: **~247 kB**, contra un
presupuesto de 260 kB (RNF-2.2). Reparto: ~103 kB de JavaScript y 119,7 kB de
tipografías.

## Afirmaciones del dataset `[dataset]`

Provienen del skill `ui-ux-pro-max` instalado en `.claude/skills/`. **Son la
opinión del dataset**, y varias se verificaron por separado.

| Afirmación | Estado de verificación |
| ---------- | ---------------------- |
| Estilo recomendado para conferencia académica: Swiss Modernism 2.0 + Minimalismo | Sin verificar de forma independiente. Es una recomendación, no un hecho medible |
| Tipografía recomendada: Crimson Pro + Atkinson Hyperlegible | Adoptada, con Atkinson en su versión *Next* por lo medido arriba |
| Swiss Modernism califica «WCAG AAA» | **No verificado.** Es una calificación del propio dataset; el cumplimiento lo determina `npm run verify` |
| Paleta académica: fondo `#F8FAFC`, texto `#0F172A`, primario `#1E3A5F`, acento `#A16207` | Contrastes recalculados: 17,06:1, 11,5:1 y 4,92:1 `[medido]` |
| Paleta académica: `Muted Foreground #64748B` sobre `#E9EEF5` | **4,08:1 `[medido]` — NO cumple WCAG AA.** Se descarta y se sustituye |

### Conteos reales del dataset instalado

Verificados contra los CSV, porque las cifras que circulan no coinciden:

| Dato | En los CSV `[medido]` | Descripción recibida | Descripción del propio skill |
| ---- | --------------------- | -------------------- | ---------------------------- |
| Estilos | **84** | 67 | 84 |
| Paletas | **192** | 161 | 192 |
| Pares tipográficos | **74** | — | 74 |
| Tipos de producto | **192** | — | 192 |
| Guías de UX | **99** | 99 | 98 |
| Reglas de Astro | **53** | — | — |

Dos discrepancias que conviene tener presentes:

1. La descripción con la que llegó el repositorio (67 estilos, 161 paletas)
   corresponde a una versión anterior. El 161 es además el número de *reglas de
   razonamiento* que declara su insignia, no de paletas.
2. El propio skill declara **98** guías de UX y su CSV tiene **99**. Las
   especificaciones usan 99, que es lo que hay en los datos.

## Hechos externos `[verificado]`

| Afirmación | Fuente | Fecha |
| ---------- | ------ | ----- |
| Atkinson Hyperlegible la creó el Braille Institute para lectores con baja visión, diferenciando formas de caracteres que suelen confundirse (`l` con cola, `1` con gancho) | [Braille Institute](https://www.brailleinstitute.org/freefont/), [googlefonts/atkinson-hyperlegible](https://github.com/googlefonts/atkinson-hyperlegible) | 2026-07-29 |
| Atkinson Hyperlegible se distribuye bajo SIL Open Font License | Misma fuente | 2026-07-29 |
| Cloudflare Pages: ancho de banda ilimitado y uso comercial permitido en el plan gratuito | [Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/), [foro de Cloudflare](https://community.cloudflare.com/t/is-cloudflare-pages-workers-free-plan-free-for-commercial-use/291741) | 2026-07-29 |
| El plan Hobby de Vercel prohíbe el uso comercial, incluido el trabajo pagado para clientes | [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby), [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) | 2026-07-29 |
| Netlify permite proyectos comerciales en el plan gratuito, sin revender el hosting | [Netlify Support](https://answers.netlify.com/t/can-we-use-netlify-free-plan-for-commercial-purposes/41545) | 2026-07-29 |
| Cloudflare Pages: para un subdominio con DNS externo basta un CNAME; el dominio raíz exige mover los nameservers | [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) | 2026-07-29 |
| Un dominio `.cl` en NIC Chile cuesta del orden de $9.990 CLP + IVA al año | [NIC Chile — tarifas](https://www.nic.cl/dominios/tarifas.html) | 2026-07-29 |

### Observación de estilo, no medición

La afirmación de que **Space Grotesk con Inter es el par por defecto del diseño
generado por IA** proviene de la guía de diseño de artefactos de este entorno,
que lo lista explícitamente entre los recursos «seguros» que conviene evitar. Es
una observación estilística citada, **no un dato medido**, y así se trata: sirve
como argumento para cambiar de tipografía, no como prueba.

## Supuestos pendientes `[supuesto]`

No pueden sustentar una decisión cerrada. Cada uno tiene tarea asociada.

| Supuesto | Riesgo si es falso | Se resuelve en |
| -------- | ------------------ | -------------- |
| El efecto de `AnimatedBeam` se puede replicar con SVG y `stroke-dashoffset` con calidad equivalente | No se alcanza el presupuesto de JavaScript sin perder calidad visual | T3, que exige comparar contra el actual **antes** de desinstalar React |
| Crimson Pro y Atkinson Hyperlegible Next combinan bien en la práctica | Hay que volver atrás tras rehacer la tipografía | T4, con la alternativa «Academic/Archival» ya identificada |
| Mover la figura a columnas propias resuelve los 28 nodos indeterminados | El contraste sobre fondo no uniforme sigue sin poder determinarse | T5, cuya comprobación es que `verify` reporte cero indeterminados |
| El presupuesto de 260 kB alcanza con tres familias tipográficas más React y Radix | Habría que renunciar a JetBrains Mono o a alguna primitiva de Radix | T4 y T10: proyección de ~247 kB `[medido]`, con solo 13 kB de margen |
