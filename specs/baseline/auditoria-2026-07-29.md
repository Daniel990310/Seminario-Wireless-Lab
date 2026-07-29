# Línea base — 29 de julio de 2026

Medición del sitio antes de la etapa de mejora de calidad. Es la referencia
contra la que se comparan los cambios posteriores.

**Commit medido:** `75e844b`
**Herramientas:** axe-core 4.12.1 sobre Chromium 1194 (Playwright), `gzip -9`.

## Método

Las mediciones se hicieron sobre el build de producción (`npm run build` +
`astro preview`), en 1440×900 y 390×844.

Una nota metodológica que importa: la primera pasada reportó **67 nodos** con
contraste insuficiente. Era un artefacto. Las secciones aparecen con una
transición de opacidad de 0,9 s, y axe mezcla el color del texto con el fondo
cuando lo mide a media transición, lo que hunde artificialmente el ratio. Con
las transiciones anuladas y `prefers-reduced-motion: reduce` emulado, la cifra
real es **16 nodos**. Cualquier medición futura debe anular las transiciones
antes de evaluar contraste.

## Accesibilidad (WCAG 2.1 AA + buenas prácticas)

Sin hallazgos fuera de contraste: ni imágenes sin texto alternativo, ni
etiquetas de formulario, ni atributos ARIA inválidos, ni problemas de idioma.

### Contraste insuficiente — 16 nodos, 2 causas raíz

| Color de texto     | Fondo     | Tamaño | Ratio | Requerido | Nodos |
| ------------------ | --------- | ------ | ----- | --------- | ----- |
| `#5c6883` mist-500 | `#0d1424` | 9,6 px | 3,29  | 4,5:1     | 4     |
| `#5c6883` mist-500 | `#0c1220` | 11 px  | 3,35  | 4,5:1     | 5     |
| `#5c6883` mist-500 | `#0c1220` | 14 px  | 3,35  | 4,5:1     | 1     |
| `#5c6883` mist-500 | `#080c18` | 11 px  | 3,49  | 4,5:1     | 1     |
| `#5c6883` mist-500 | `#080c18` | 12 px  | 3,49  | 4,5:1     | 2     |
| `#5c6883` mist-500 | `#05070f` | 11 px  | 3,60  | 4,5:1     | 2     |
| `#eef2f9` mist-100 | `#0b87a3` | 14 px  | 3,73  | 4,5:1     | 1     |

**Causa 1 — `mist-500` como color de texto (15 nodos).** El token se definió
como gris de apoyo y se usó para etiquetas `.eyebrow` y metadatos pequeños. En
ningún fondo del sitio alcanza 4,5:1. Afecta sobre todo a texto de 9,6–12 px,
donde el problema es más grave.

**Causa 2 — el botón principal (1 nodo).** Blanco sobre `signal-600` da 3,73:1.
Este valor se había estimado a ojo en ~4,9:1 al elegir el color; la estimación
era incorrecta.

### Contraste indeterminado — 28 nodos

axe no puede calcular el ratio cuando el texto se superpone a un fondo no
uniforme. Corresponde al texto del hero sobre la figura de radar y sus
degradados. **Requiere verificación manual**: no está confirmado que falle, pero
tampoco que cumpla.

### Semántica

| Aspecto                             | Estado                                                     |
| ----------------------------------- | ---------------------------------------------------------- |
| Jerarquía de encabezados            | 24 encabezados, sin saltos de nivel                         |
| `<section>` con nombre accesible    | **0 de 7** — no se anuncian como regiones navegables        |
| Nivel duplicado grupo/ítem          | «Expositores internacionales» y los nombres son ambos `h3`  |
| Elementos enfocables visibles       | 30                                                          |

El nivel duplicado importa: para un lector de pantalla, el rótulo del grupo y
los expositores que contiene están al mismo nivel, así que la agrupación se
pierde.

## Rendimiento

Peso transferido de la página completa:

| Recurso              | Sin comprimir | gzip      | Notas                                  |
| -------------------- | ------------- | --------- | -------------------------------------- |
| JavaScript (3)       | 346,1 kB      | 109,3 kB  | React + Motion + la isla de la red     |
| Tipografías (3)      | 110,9 kB      | 110,9 kB  | woff2, ya comprimido                    |
| HTML                 | 60,2 kB       | 13,3 kB   | Incluye la figura SVG en línea          |
| CSS                  | 38,9 kB       | 7,6 kB    |                                        |
| Logos SVG (7)        | 5,8 kB        | —         | Marcadores de posición                  |
| **Total aproximado** | **562 kB**    | **241 kB** |                                        |

**El JavaScript es el 45 % del peso que viaja.** Los 109 kB comprimidos existen
para una sola sección: el diagrama de la red de colaboración, que necesita React
y Motion porque `AnimatedBeam` mide la posición de los nodos en el DOM. El resto
del sitio no usa JavaScript de framework.

## Contenido pendiente

No son defectos de implementación, pero bloquean la publicación:

| Pendiente                       | Estado                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Logos institucionales           | 7 marcadores de posición con la leyenda «LOGO PENDIENTE»       |
| Afiliación de Rodolfo Feick     | «Afiliación por confirmar»                                     |
| Correo de contacto              | `seminario.wireless@pucv.cl` es un valor de ejemplo            |
| Imagen para compartir           | Sin `og:image`; el enlace se previsualiza solo como texto      |
| Dominio                         | Sin confirmar con la DTI de la PUCV                            |
| Programa                        | En preparación, con aviso provisional en su lugar              |

## Resumen

La base técnica es sana: build y verificación de tipos limpios, estructura de
encabezados correcta, sin errores de consola, y el único tipo de hallazgo de
accesibilidad es el contraste. Los dos frentes reales son **contraste y
semántica de regiones** por un lado, y **el costo en JavaScript de una sola
sección** por el otro.
