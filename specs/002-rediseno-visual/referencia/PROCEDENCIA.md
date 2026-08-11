# Procedencia de esta referencia, y qué de ella NO se sigue

Los dos archivos de esta carpeta llegaron el **2026-08-03** dentro de un
`Revisión de home en español.zip` **sin versionar** en la raíz del repositorio, sin
mención en ningún documento. Se versionan aquí porque, según la regla del proyecto,
lo que no está escrito en el repositorio no ocurrió: en el clon del móvil y en
Antigravity ese rediseño no existía.

| Archivo | Qué es |
| ------- | ------ |
| `home-es.dc.html` | El prototipo completo: markup, lógica y datos. Formato «Design Component» (`<x-dc>` + clase `Component extends DCLogic`) |
| `README-original.md` | El documento de traspaso tal como llegó. **No se edita**: se corrige aquí |

**No se versionó `support.js`** —el runtime del formato— por dos razones: su propio
traspaso dice que no se porta, y descarga React 18, ReactDOM y Babel standalone desde
`unpkg.com` en tiempo de ejecución (`support.js:1143-1147`), además de un
`fetch(location.href)` (`:159`). Sin él, el `.dc.html` no se puede abrir en un
navegador; se lee como fuente de valores, que es para lo que sirve aquí. **El prototipo
no se ejecutó** en ningún entorno de este proyecto. `[verificado: lectura de la fuente]`

## Lo que el prototipo confirma

Usa **los mismos tokens del sitio**: los 15 primitivos de `global.css`, la capa
semántica completa con sus mismos valores, Crimson Pro / Atkinson Hyperlegible Next /
JetBrains Mono, `--radius-surface: 2px`, `--radius-control: 4px` y `--ease-out-soft`.
`[verificado: comparación línea a línea contra src/styles/global.css]`

Es decir: **no propone una identidad visual nueva.** D4 y D5 siguen en pie y no hay
nada que reabrir ahí.

## Tres afirmaciones del traspaso que son falsas en este repositorio

Se dejan escritas porque seguirlas causa daño, y porque el archivo original se conserva
sin editar.

1. **«Los datos del seminario (bloques, charlas, ponentes) son el contenido real y
   deben migrarse tal cual».** No lo son. El array `DIAS` del prototipo son las
   **sesiones ficticias** de `src/data/programa-demo.ts` —el propio prototipo lo
   declara en su aviso `role="note"`—. Migrarlas «tal cual» publicaría un programa
   apócrifo en un evento con fecha y sede reales, que es exactamente lo que prohíbe
   `ESTADO.md` §5j y por el mismo motivo que están prohibidos los logos inventados.
   `[verificado: comparación del array DIAS contra src/data/programa-demo.ts]`
2. **«`/logos` son los archivos originales del proyecto y deben usarse tal cual».** Son
   **marcadores de posición** que dicen «logo pendiente» (A5). Que no haya que
   rehacerlos es correcto; que sean los oficiales, no.
3. **«Alta fidelidad, se espera recreación pixel-perfect».** No aplica: aquí la
   autoridad sobre el resultado es `npm run verify`, no la fidelidad al prototipo.
   Donde choquen, gana el verificador.

## Y una omisión que importa

**El hero del prototipo es el hero que ya existe.** No es parecido: coinciden el
`viewBox` 820×640, la posición del emisor (148, 322), los cuatro anillos de rango
(110/250/390/530), las 13 radiales, el contorno del objeto dispersor, los 14
dispersores con sus radios y opacidades, y las tres animaciones con sus duraciones
exactas —`fig-breathe` 11 s, `fig-sweep` 17 s, `fig-echo` 4,8 s— y sus retardos.
`[verificado: comparación contra src/components/PropagationFigure.astro y Hero.astro]`

Por lo tanto el prototipo **no responde** al «hero con más animaciones» que pidió el
cliente (`ESTADO.md` §5k). Tampoco a las fotos de expositores —las sustituye por
monogramas de iniciales—, ni al enlace de sesión a ficha de expositor —el ponente es
texto plano—, ni a las transiciones al cambiar de idioma. De los cinco pedidos cubre
uno y medio: la línea de tiempo vertical del programa, con la estructura que se
descartó (ver `../requirements.md`, D7).
