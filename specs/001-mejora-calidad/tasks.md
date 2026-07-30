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

## T2 · Tokens en tres capas y selector de tema

**Satisface:** RF-4, RNF-1.1, RNF-1.6 · **Depende de:** T1

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

---

## T3 · Quitar Motion y montar la base de shadcn/ui

**Satisface:** RNF-2.1, RNF-2.5, D6 · **Depende de:** T1

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

---

## T6 · Semántica y accesibilidad restante

**Satisface:** RNF-1.4, RNF-1.5, RNF-1.7, RNF-1.9 · **Depende de:** T5

- `aria-labelledby` en cada `<section>`, apuntando a su encabezado.
- Rótulo de grupo de expositores a `h3`, nombres a `h4`.
- Foco visible con contraste suficiente en ambos temas.
- Recorrido completo por teclado, incluidos menú móvil y selector de tema.
- Zoom de texto al 200 % sin desbordamiento horizontal.

**Comprobación:** las 7 secciones se anuncian como regiones. Recorrido por
teclado verificado manualmente en ambos temas. Cero hallazgos de axe.

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

---

## T8 · Imagen para compartir y metadatos

**Satisface:** RNF-3.1, RNF-3.2 · **Depende de:** T4, T7

- Generar `og:image` de 1200×630 por idioma, con título y fechas legibles.
  Evaluar [`web-asset-generator`](https://github.com/alonw0/web-asset-generator)
  para esto.
- Validar los datos estructurados `schema.org/Event` en ambos idiomas.

**Comprobación:** validador de Google sin errores. Previsualización del enlace
revisada de verdad, no supuesta.

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
