# Instrucciones para agentes

Sitio web del seminario internacional **Beyond Connectivity: Wireless Sensing in
mmWave and Sub-THz Bands** (PUCV, 21–22 de octubre de 2026).

Este archivo es la entrada obligatoria antes de tocar el repositorio. Si algo de
aquí contradice lo que parezca razonable a primera vista, gana este archivo: cada
regla existe porque su ausencia ya causó un problema concreto.

## Lo primero

**Leer [`ESTADO.md`](ESTADO.md).** Dice en qué punto quedó el trabajo, qué tarea
está en curso y con qué reglas conviven los distintos entornos desde los que se
desarrolla este proyecto (Claude Code en navegador, móvil y PC, y Antigravity).
Ninguno de ellos ve la conversación de los otros: lo único compartido es el
repositorio, así que **si no está escrito aquí, no ocurrió**.

```bash
git fetch origin && git status -sb   # ¿parto del estado que creo?
npm install
npm run build        # genera dist/
npm run verify       # accesibilidad y presupuestos de peso
npm run verify:tema  # los criterios de RF-4 que axe no puede evaluar
npm run check        # tipos
```

**Nunca reescribir historia ya publicada en la rama de trabajo** (`push --force`,
rebase de commits empujados). Hay clones en varios entornos y se rompen todos.
Para deshacer algo, un commit que revierte.

**`npm run verify` es la autoridad.** Ninguna afirmación de mejora vale sin él.
Requiere un `build` previo y termina con código 1 si algo incumple.

## El proyecto se desarrolla con spec-driven development

Todo vive en [`specs/`](specs/). Leer [`specs/README.md`](specs/README.md) antes
de escribir código.

| Documento | Para qué |
| --------- | -------- |
| [`specs/README.md`](specs/README.md) | Flujo, regla de procedencia, nomenclatura |
| [`specs/001-mejora-calidad/requirements.md`](specs/001-mejora-calidad/requirements.md) | Qué debe cumplirse |
| [`specs/001-mejora-calidad/design.md`](specs/001-mejora-calidad/design.md) | Cómo y por qué |
| [`specs/001-mejora-calidad/tasks.md`](specs/001-mejora-calidad/tasks.md) | Qué hacer y en qué orden |
| [`specs/001-mejora-calidad/verification.md`](specs/001-mejora-calidad/verification.md) | Última medición. **Generado, no editar** |
| [`specs/baseline/auditoria-2026-07-29.md`](specs/baseline/auditoria-2026-07-29.md) | Línea base contra la que se compara |
| [`specs/fuentes.md`](specs/fuentes.md) | De dónde sale cada cifra |
| [`specs/habilidades.md`](specs/habilidades.md) | Qué skills usar, cuándo y con qué precauciones |

### Reglas que no se negocian

1. **No se implementa lo que no está en los requisitos.** Si aparece algo nuevo,
   primero se agrega al documento y después se escribe el código.
2. **Un requisito sin criterio verificable no es un requisito.** «Que se vea
   profesional» no sirve; «contraste ≥ 4,5:1 medido con axe-core» sí.
3. **Toda cifra lleva marca de procedencia**: `[medido]`, `[dataset]`,
   `[verificado]` o `[supuesto]`. Ver `specs/README.md`. Una cifra sin fuente
   termina tratada como hecho, y eso ya pasó en este proyecto.
4. **Los errores se corrigen dejando registro**, no reescribiendo la conclusión.
   El criterio con que se falló importa tanto como la corrección.

## Trampas de medición ya descubiertas

No volver a caer en estas. Cada una produjo un número falso que llegó a un
documento.

**Anular las transiciones antes de medir contraste.** axe mezcla el color del
texto con el fondo si lo evalúa a media transición de opacidad. Sin anularlas, 16
nodos reales aparecen como 67. Ya está resuelto dentro de `scripts/verify.mjs`;
si se mide por otra vía, hay que replicarlo.

**kB decimal, 1 kB = 1000 bytes.** No binario. Mezclar convenciones hizo que el
mismo archivo apareciera como 109,3 kB y 106,8 kB.

**Los nodos `incomplete` de axe no son aprobaciones.** Significan que no se pudo
determinar el contraste, normalmente porque el texto va sobre un fondo no
uniforme. RNF-1.3 exige resolverlos.

**Las imágenes diferidas no son primera carga.** Los logos llevan
`loading="lazy"`: contarlos infla el peso con bytes que la mayoría de las visitas
nunca descarga.

**`gzip -9` de GNU y `zlib` de Node difieren ~0,3 %.** Una variación de ese orden
no indica un cambio real.

**Un verificador en verde no es una página revisada.** En T2 axe daba 0 hallazgos
mientras el selector de la barra no mostraba ninguna opción resaltada: las dos
instancias compartían `name`, y para axe un radio desmarcado es perfectamente
válido. Lo destapó mirar la captura. **Revisar visualmente en ambos temas antes de
declarar una tarea completada**, y convertir en comprobación lo que se encuentre.

**El ámbito de un grupo de radios es el documento, no el `fieldset`.** Dos
instancias del mismo control con el mismo `name` forman un grupo: inicializar la
segunda desmarca la primera. Cada instancia necesita su propio `name` y hay que
sincronizarlas al cambiar.

**`overflow-hidden` recorta en silencio.** No hay barra de desplazamiento ni
desborde visible que avise; el contenido simplemente desaparece. En el menú móvil
de 15rem «Sistema» se perdía 8 px. Se mide comparando la caja del elemento contra
la del ancestro que recorta, no a ojo.

**Toda comprobación nueva se somete a prueba de sensibilidad.** Antes de confiar en
que una comprobación protege algo, hay que romper deliberadamente lo que vigila y
verla fallar. Una comprobación que nunca ha fallado no se ha probado.

**Solo cuenta como peso lo que la página referencia.** `@astrojs/react` emite su
runtime de cliente aunque no quede ninguna isla que hidratar. Tras T3 no queda
ninguna, así que `client.*.js` se genera pero **ningún archivo de `dist` lo
menciona**: son ~55 kB comprimidos que ningún navegador pide. Contarlos habría
castigado justamente el cambio que eliminó el JavaScript. `scripts/verify.mjs` lee
las referencias del HTML y mide los huérfanos aparte, sin ocultarlos.

**`pathLength` no normaliza el guion si hay `vector-effect="non-scaling-stroke"`.**
Con ese `vector-effect` el `stroke-dasharray` se mide en **píxeles de pantalla**: el
valor computado sale como «16px, 84px» y el patrón se repite a lo largo del trazo.
En un eje de 470 px aparecían ~4,7 guiones donde se esperaba uno. Si se anima un
pulso con guiones sobre un SVG estirado, diseñar en espacio de pantalla y desplazar
**un período exacto** por ciclo, que es lo único que empalma el bucle a cualquier
escala. Comprobado midiendo, no leyendo la especificación.

**Un elemento en `display: none` no ejecuta animaciones.** Al contar animaciones hay
que filtrar por elementos representados (`getClientRects().length`). Sin filtrar,
una vista alternativa oculta por punto de quiebre cuenta como animación que falta:
daba «4/5 animando» y parecía un fallo donde no lo había.

**`new URL('..', import.meta.url).pathname` se rompe en Windows.** Da
`/C:/Users/...`, con una barra inicial que `readdir`/`readFile` no resuelven:
`npm run verify` fallaba con «No existe dist/» aunque `dist/` existiera. Usar
`fileURLToPath(new URL(...))` de `node:url`, que normaliza por plataforma. Este
proyecto se desarrolla desde varios sistemas operativos (ver [`ESTADO.md`](ESTADO.md)),
así que toda ruta derivada de `import.meta.url` tiene que pasar por `fileURLToPath`,
no por `.pathname`. También aplica a la ruta fija de Chromium del sandbox de origen
(`/opt/pw-browsers/chromium`): se usa solo si `existsSync` la encuentra, y fuera de
ese entorno Playwright resuelve el suyo.

## Decisiones cerradas: no reabrir sin acuerdo

| # | Decisión |
| - | -------- |
| D1 | Una sola página con anclas. No se fragmenta en páginas por sección |
| D2 | Bilingüe español e inglés, con selector. **El título oficial nunca se traduce** |
| D3 | Registro de asistentes: previsto en la especificación, no implementado |
| D4 | Swiss Modernism 2.0 más minimalismo; Crimson Pro y Atkinson Hyperlegible Next |
| D5 | Dos temas con selector: claro por omisión, oscuro y «según el sistema» |
| D6 | **Se adopta shadcn/ui sobre Radix.** El cliente busca un sitio interactivo |

## Ya evaluado y descartado

No volver a proponer esto sin un argumento nuevo. El detalle está en
[`design.md` §1](specs/001-mejora-calidad/design.md).

| Propuesta | Por qué no |
| --------- | ---------- |
| **daisyUI** | 388 kB de CSS y vocabulario de tokens incompatible con el que ya se usa. Su patrón de temas sí se adoptó |
| **tailkits-ui** | Cero soporte de modo oscuro en 30 archivos, sin `sr-only`, `alt="Logo"` genérico, y categorías de landing de producto |
| **Componentes decorativos de Magic UI** | `MagicCard`, `BorderBeam`, `AuroraText`, `Marquee`, `Particles`: efectos de interfaz, no del tema del seminario |
| **Motion (`motion/react`)** | 35 kB por un único efecto que CSS resuelve con `stroke-dashoffset` |
| **Subir un presupuesto sin acuerdo del cliente** | El presupuesto disciplina al código. Cambiarlo es una decisión del cliente, registrada como decisión cerrada (así se hizo con D6) |

**Sobre los logos institucionales:** los de PUCV, ANID, Columbia University, Nokia
Bell Labs, PUC y USACH son marcas de terceros. **No se generan ni se aproximan con
ninguna herramienta**, aunque los skills instalados sean capaces de hacerlo. Los
archivos de `public/logos/` son marcadores de posición deliberados hasta que las
instituciones entreguen los oficiales.

## Servidores MCP: cuál sirve para qué

Detalle completo, con cuotas y lecciones medidas, en
[`specs/habilidades.md`](specs/habilidades.md) §6bis, §7 y §8. Lo esencial:

- **Antes de programar contra la API de una librería, consultar la fuente.** En
  este orden: `node_modules` si está instalada —es el código exacto que corre—,
  luego **Context7**, y la búsqueda web al final. Saltarse esto costó una métrica
  equivocada durante semanas: RNF-2.1 informaba «0,0 kB de JavaScript» en una
  página que sí lo ejecuta, por un cambio de comportamiento de Astro v5.
- **Context7** responde «¿cómo se comporta esta herramienta?»: configuración,
  migraciones, API pública. Un concepto por consulta, máximo tres por pregunta.
- **21st.dev** responde «¿qué componente interactivo pongo aquí?». Su único caso
  natural en el plan es T10. Se le pide **una pieza acotada por llamada**, nunca
  una sección entera. `search` es gratis; `get_component` son 2 al día y
  `generate` se agota sin previo aviso.
- Casi todas las tareas que quedan son del primer tipo, no del segundo.
- **Ninguna decisión de diseño se declara terminada sin mirar capturas** de los
  dos temas y los dos anchos. Leer el código y suponer no cuenta.

## Convenciones de código

- **Contenido en archivos de datos.** Nada de texto escrito en componentes: todo
  sale de `src/data/`. La organización del seminario debe poder actualizar el
  sitio sin tocar marcado ni estilos (RNF-5).
- **Comentarios en español, y explican el *por qué*.** Un comentario que repite lo
  que hace el código no aporta. Si una decisión no es evidente, el comentario
  debe decir qué alternativa se descartó y por qué.
- **Ningún componente referencia un token primitivo**, solo la capa semántica.
  Así cambiar de tema es sustituir un bloque de valores (RF-4.7).
- **Antes de agregar una dependencia**, medir su costo contra RNF-2 y preguntarse
  **qué se obtiene por ese peso**. Radix cuesta 36 kB y entrega comportamiento
  accesible resuelto: se adopta. Motion cuesta 35 kB y compra un solo efecto que
  CSS hace gratis: se descarta. El criterio no es el tamaño en abstracto.
- **Un presupuesto propuesto por quien implementa no es un requisito del cliente.**
  Si una decisión se apoya en un número que uno mismo fijó, hay que decirlo en esos
  términos y no presentarla como aritmética inevitable. Ya pasó con el techo de
  40 kB de JavaScript, que llevó a rechazar shadcn/ui por un motivo que no era del
  cliente.
- **Sin peticiones a terceros en la carga inicial** (RNF-4). El mapa se carga solo
  si la persona lo pide.
- `astro check` sin errores ni advertencias.

## Estructura

```
AGENTS.md              este archivo
CLAUDE.md              puntero a este archivo
specs/                 especificaciones (leer primero)
scripts/verify.mjs     verificador de accesibilidad y peso
.claude/skills/        skills instalados (ver specs/habilidades.md)
src/
├── data/              todo el contenido editable
├── layouts/           <head>, SEO, datos estructurados
├── pages/             composición
├── components/        secciones y piezas
├── styles/global.css  sistema de diseño
└── assets/fonts/      tipografías auto-hospedadas
public/logos/          logos institucionales (hoy marcadores de posición)
```

## Git

Rama de trabajo: `claude/framework-app-profesional-n4wa0t`.

Los mensajes de commit explican **por qué** se hizo el cambio y qué se descartó,
no solo qué archivos se tocaron. Si una medición cambió, el mensaje incluye el
número antes y después.

## Pendientes que dependen de terceros

No son tareas de implementación. Están registrados como decisiones abiertas no
bloqueantes (A3–A7) en `requirements.md`:

- Afiliación de Rodolfo Feick, hoy «por confirmar»
- Correo institucional real (`seminario.wireless@pucv.cl` es un ejemplo)
- Logos oficiales: los 7 de `public/logos/` son marcadores de posición
- Subdominio definitivo, a confirmar con la DTI de la PUCV
- Traducción al inglés de los textos largos
