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

### Repositorios evaluados

| Cifra | Valor | Cómo se obtuvo |
| ----- | ----- | -------------- |
| daisyUI: temas | 35 | Recuento de `src/themes/*.css` |
| daisyUI: componentes | 61 | Recuento de `src/components/*.css` |
| daisyUI: CSS de componentes | 388 kB | `du -ch src/components/*.css` |
| tailkits-ui: archivos con `dark:` | 0 de 30 | `grep -l "dark:" components/*.html` |
| tailkits-ui: `sr-only` | 0 apariciones | `grep -o sr-only components/*.html` |
| shadcn: vocabulario de tokens | Idéntico al del proyecto | Lectura del bloque `:root` en su CSS de referencia |

### Tipografías candidatas

Instaladas desde npm y medidos los archivos del subconjunto latino:

| Paquete | Archivos latinos | Peso | Nota |
| ------- | ---------------- | ---- | ---- |
| `@fontsource-variable/crimson-pro` | 1 variable | 48.200 B | Existe versión variable |
| `@fontsource/atkinson-hyperlegible` | 2 estáticos (400, 700) | 34.732 B | **No tiene versión variable** |
| `@fontsource-variable/atkinson-hyperlegible-next` | 1 variable | 33.996 B | Menos peso y todos los pesos |

Conclusión: **Atkinson Hyperlegible Next variable** gana por las tres vías —menos
peso, un archivo en lugar de dos y rango completo de pesos.

Proyección de primera carga con la tipografía nueva: **145 kB**, contra un
presupuesto de 180 kB (RNF-2.2). Las tipografías serían el **83 %** de ese peso.

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
| El presupuesto de 180 kB es alcanzable con tres familias tipográficas | Habría que renunciar a JetBrains Mono | T4: proyección de 145 kB `[medido]`, con 105,6 kB si se quita la monoespaciada |
