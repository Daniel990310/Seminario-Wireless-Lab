# Especificaciones

Este proyecto se desarrolla con **spec-driven development**: antes de escribir
código se acuerda qué debe cumplirse y cómo se verificará. El objetivo no es
burocracia: es que «mejorar la calidad» deje de ser una opinión y pase a ser una
condición medible.

## Índice

| Documento | Contenido |
| --------- | --------- |
| [`001-mejora-calidad/requirements.md`](001-mejora-calidad/requirements.md) | Qué debe cumplirse, con criterios verificables |
| [`001-mejora-calidad/design.md`](001-mejora-calidad/design.md) | Cómo se construye y por qué, frente a alternativas |
| [`001-mejora-calidad/tasks.md`](001-mejora-calidad/tasks.md) | Orden de ejecución y comprobación de cada tarea |
| [`baseline/auditoria-2026-07-29.md`](baseline/auditoria-2026-07-29.md) | Medición previa: la referencia contra la que se compara |
| [`fuentes.md`](fuentes.md) | **Registro de procedencia**: de dónde sale cada cifra |
| [`habilidades.md`](habilidades.md) | Qué skills usar, cuándo y con qué precauciones |
| [`001-mejora-calidad/verification.md`](001-mejora-calidad/verification.md) | Última medición. **Generado por `npm run verify`, no editar** |
| [`../AGENTS.md`](../AGENTS.md) | Reglas de trabajo para agentes y personas |

## Regla de procedencia

En un flujo asistido por IA el riesgo principal no es equivocarse: es que **una
cifra sin fuente se propague por los documentos y termine tratada como hecho**.
Para evitarlo, toda afirmación con dato lleva una marca de procedencia:

| Marca | Significa | Cómo se trata |
| ----- | --------- | ------------- |
| `[medido]` | Se obtuvo ejecutando algo en este proyecto | Reproducible: el comando está en [`fuentes.md`](fuentes.md) |
| `[dataset]` | Lo afirma el skill `ui-ux-pro-max` | **Es la opinión del dataset, no un hecho.** Se verifica antes de adoptarse |
| `[verificado]` | Hecho externo confirmado con fuente citada | Fuente y fecha en [`fuentes.md`](fuentes.md) |
| `[supuesto]` | Todavía no comprobado | **No puede sustentar una decisión cerrada.** Lleva tarea que lo resuelva |

Ejemplo de por qué importa: el dataset propone una paleta académica cuyo
`Muted Foreground` da **4,08:1 `[medido]`** y por lo tanto no cumple WCAG AA,
aunque el dataset la presente como válida. Si se hubiera copiado por venir de una
fuente con autoridad aparente, se habría introducido el mismo defecto que la
auditoría encontró en el tema oscuro.

## Reglas de trabajo

1. **No se implementa lo que no está en los requisitos.** Si aparece algo nuevo
   a mitad de camino, primero se agrega al documento.
2. **Un requisito sin criterio verificable no es un requisito**, es un deseo.
   «Que se vea profesional» no sirve; «contraste mínimo 4,5:1 medido con
   axe-core» sí.
3. **La línea base se mide antes de tocar código.** Sin medición previa no se
   puede afirmar que algo mejoró.
4. **Las decisiones abiertas se declaran**, distinguiendo las que bloquean el
   avance de las que no.
5. **Los errores se corrigen dejando registro**, no reescribiendo el veredicto.
   El criterio con que se falló importa tanto como la conclusión corregida.

## Nomenclatura

| Prefijo | Significa | Ejemplo |
| ------- | --------- | ------- |
| `D` | Decisión cerrada | D5: dos temas con selector |
| `RF` | Requisito funcional | RF-1: sitio bilingüe |
| `RNF` | Requisito no funcional | RNF-2: rendimiento |
| `A` | Decisión abierta | A3: afiliación por confirmar |
| `T` | Tarea | T1: comando de verificación |

Las referencias usan punto para el criterio: **RNF-2.1** es el primer criterio de
aceptación de RNF-2.

## Cómo verificar el estado

```bash
npm run build              # el sitio debe compilar
npm run check              # tipos, sin errores ni advertencias
npm run verify             # accesibilidad y presupuestos de peso
npm run verify:tema        # los criterios de RF-4 que axe no puede evaluar
npm run verify:red         # los criterios de T3 sobre el haz de la red
npm run verify:teclado     # los criterios de T6: jerarquía, foco, teclado y zoom
npm run verify:idioma      # los criterios de RF-1, incluidos textos sin traducir
npm run verify:seo         # los criterios de RNF-3
npm run verify:interaccion # los criterios de RF-6
npm run verify:todo        # los siete en cadena
```

`npm run verify` es la autoridad sobre el cumplimiento (implementado en T1).
Requiere un `build` previo y termina con código distinto de cero si algo incumple.

**Hay siete verificadores**, y los seis restantes cubren lo que axe no alcanza. Todos
requieren un `build` previo, y `verify:todo` los lanza como procesos separados —no con
`&&`— para que un fallo temprano no oculte a los demás.

| Comando | Criterios | Qué comprueba |
| ------- | --------- | ------------- |
| `verify` | 7 presupuestos, 8 corridas | axe-core en 2 anchos × 2 temas × 2 idiomas, y el peso |
| `verify:tema` | 17 | RF-4: destello al cargar, sin JavaScript, teclado, persistencia sin cookies, sincronía entre las dos instancias del selector |
| `verify:red` | 7 | T3: que el pulso recorra el trayecto, que se detenga con `prefers-reduced-motion` y que el navegador no pida ningún `.js` |
| `verify:teclado` | 12 | T6: jerarquía de encabezados, foco visible y su contraste, menú móvil por teclado, zoom de texto al 200 % sin desbordar |
| `verify:idioma` | 19 | RF-1: ambas rutas, `lang`, `hreflang` recíproco, título sin traducir, conservación de la sección, sitemap y **textos sin traducir** |
| `verify:seo` | 22 | RNF-3: imágenes de 1200×630 por idioma, metadatos absolutos, canónico, `noindex` provisional y `schema.org/Event` |
| `verify:interaccion` | 9 | RF-6: contenido entero sin JavaScript, `aria-current` en la sección activa, patrón ARIA de las pestañas y ninguna primitiva de Radix instalada sin uso |

Los conteos son los de la corrida del **2026-07-31 sobre `8f4bdfc`** `[medido]`, y van
fechados porque crecen: `verify:idioma`, `verify:seo` y `verify:interaccion` sumaron
criterios después de cerrarse su tarea, y los documentos quedaron citando el número
viejo (17, 20 y 8). Al añadir una comprobación, actualizar esta tabla.

**Lo que ningún verificador cubre:** RNF-2.3 (ninguna petición a dominios de terceros
en la carga inicial) y RNF-2.4 (sin desplazamiento de diseño por las tipografías). Hoy
se cumplen por construcción —tipografías auto-hospedadas, sin analítica— pero eso es
una propiedad del código, no una medición, y nada falla si alguien la rompe.

## Estado

| Especificación | Estado |
| -------------- | ------ |
| [001 — Mejora de calidad](001-mejora-calidad/) | **Implementada y verificada: T1 a T10.** Los siete verificadores en verde. Sin decisiones bloqueantes. Falta el cierre formal (ver abajo). |

Últimas cifras, medidas el 2026-07-31 sobre el commit `8f4bdfc` con
`npm run build && npm run verify:todo` `[medido]`:

| Requisito | Línea base | Ahora | Límite | |
| --------- | ---------- | ----- | ------ | - |
| RNF-1.1 Hallazgos axe WCAG 2.1 AA | 16 | **0** | 0 | cumple |
| RNF-1.3 Nodos con contraste indeterminado | 28 | **0** | 0 | cumple |
| RNF-1.4 Secciones sin nombre accesible | 7 de 7 | **0 de 7** | 0 | cumple |
| RNF-1.5 Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 JavaScript comprimido | 109,3 kB | **1,4 kB** | 115 kB | cumple |
| RNF-2.2 Primera carga comprimida | 241,2 kB | **140,7 kB** | 260 kB | cumple |
| RNF-2.6 Tipografías | 110,9 kB | 122,6 kB | 125 kB | cumple |

Los dos incumplimientos que quedaban abiertos —RNF-1.3 y RNF-1.4— se cerraron en T5 y
T6. Dos cifras llevan nota porque leídas solas engañan: RNF-2.1 no bajó de 109,3 a
1,4 kB midiendo lo mismo (desde T8 la métrica incluye el JavaScript que Astro inlinea
en el HTML, que antes no se contaba), y las tipografías subieron a propósito al pasar
a Atkinson Hyperlegible Next. Detalle en `ESTADO.md` §5c y §5i.

**Lo que falta para cerrar 001, y no es código:**

1. **Enmendar RF-6** en `requirements.md`: su tabla declara `Tabs`, `Accordion`,
   `Dialog` y `ToggleGroup`, y ninguna se usó. La razón —RF-6.2, el contenido tiene
   que existir sin JavaScript— está registrada en `ESTADO.md` §5h, no en el requisito.
2. **Dar requisito y tarea a lo implementado fuera de la especificación**: el programa
   de ejemplo apagado por omisión (`src/data/programa-demo.ts`), las reseñas de
   expositores, y el despliegue en Cloudflare Workers. Los tres están razonados en
   `ESTADO.md`, pero ninguno pasó por `requirements.md`, que es la regla 1 de este
   documento.
3. **Cerrar las dos comprobaciones de T8** que ya no están bloqueadas: validar los
   datos estructurados y ver la previsualización real del enlace, ahora que hay URL
   pública.
4. **`design.md` está congelado en D6**: no registra `<details>` en lugar de `Dialog`,
   el `IntersectionObserver` de la sección activa, la mejora progresiva de las
   pestañas ni el control único de idioma. El «cómo y por qué» de T5 a T10 vive hoy en
   `ESTADO.md`, que es un diario de continuidad y no la especificación.
