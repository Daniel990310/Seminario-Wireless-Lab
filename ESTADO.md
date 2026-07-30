# Estado y continuidad

Este archivo existe para que el trabajo pueda **cambiar de entorno sin perder el
hilo**. El proyecto se desarrolla desde varios sitios —Claude Code en el navegador,
en el móvil, en el PC, y Antigravity— y ninguno de ellos ve el historial de
conversación de los otros. Lo único compartido es el repositorio. Por lo tanto:

> **Si no está escrito en el repositorio, no ocurrió.**

Actualizado: **2026-07-30 noche** · Rama de trabajo: `claude/framework-app-profesional-n4wa0t`
· Último commit de tarea: `9089258` (T3); después hay commits de documentación y de flujo SDD

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

**Pendiente para Daniel** (3 preguntas):

- ¿Agregar T4b (refinamiento visual con componentes estáticos de 21st.dev)?
- ¿Confirmar RF-6 / T10 (componentes interactivos: Tabs, Accordion, Dialog)?
- ¿Rotar la API key de 21st.dev? La que se compartió en el chat está comprometida.

**Siguiente tarea sin bloqueo: sigue siendo T4 (tipografía).** Nada de lo hecho en esta
sesión cambia el orden de las tareas; solo enriquece el flujo para cuando se llegue a
componentes.

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
| T4 · Tipografía | Pendiente |
| T5 · Retícula de 12 columnas (RNF-1.3) | Pendiente. Cierra los nodos indeterminados |
| T6 · Nombres accesibles y teclado (RNF-1.4) | Pendiente |
| T7 · Sitio bilingüe (RF-1) | Pendiente |
| T8 · `og:image` por idioma | Pendiente |
| T9 · Verificación final | Pendiente |
| T10 · Componentes interactivos (RF-6) | **Bloqueada: RF-6 es una propuesta del agente, no un requisito del cliente.** No implementar sin que Daniel lo confirme |

### Lo que mide el verificador ahora mismo

Con `npm run build && npm run verify` al cerrar T3:

| Comprobación | Valor | Límite | |
| ------------ | ----- | ------ | - |
| RNF-1.1 Hallazgos axe WCAG 2.1 AA | 0 | 0 | cumple |
| RNF-1.3 Nodos con contraste indeterminado | 104 | 0 | **abierto → T5** |
| RNF-1.4 Secciones sin nombre accesible | 7 | 0 | **abierto → T6** |
| RNF-1.5 Saltos de nivel en encabezados | 0 | 0 | cumple |
| RNF-2.1 JavaScript comprimido | **0,0 kB** | 115 kB → informativo | cumple |
| RNF-2.2 Primera carga comprimida | **136,4 kB** | 260 kB → informativo | cumple |
| RNF-2.6 Tipografías | 110,9 kB | 125 kB → informativo | cumple |

Los tres techos de peso siguen impresos porque siguen siendo la referencia con la que
se compara, pero desde la enmienda del 2026-07-30 no bloquean (§0). El código de
`scripts/verify.mjs` **no se cambió**: si algún día un peso supera su techo, `verify`
va a terminar en 1 por eso. En ese momento hay dos salidas honestas —declarar el
exceso en el commit y seguir, o pedirle a Daniel una cifra nueva— y ninguna es
inventarle un techo.

Los dos incumplimientos abiertos **no son regresiones**: están en la línea base y
su corrección pertenece a T5 y T6. `npm run verify` termina con código 1 por ellos,
y eso es correcto.

Hay tres verificadores, y `npm run verify:todo` los corre en cadena:

| Comando | Qué cubre |
| ------- | --------- |
| `npm run verify` | **La autoridad.** axe-core en 2 anchos × 2 temas, y los presupuestos de peso |
| `npm run verify:tema` | Los 16 criterios de RF-4 que axe no puede evaluar: destello al cargar, sin JavaScript, teclado, persistencia sin cookies, sincronía entre las dos instancias del selector |
| `npm run verify:red` | Los 7 criterios de T3: que el pulso recorra, que se detenga con movimiento reducido, y que el navegador no pida ningún `.js` |

Todos requieren un `npm run build` previo.

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

**FUNCIONA desde el PC de Daniel (verificado el 2026-07-30).** `mcp__21st__get_usage`
respondió autenticado: `tier: free`, 2 recuperaciones de código por día, y una búsqueda
real devolvió resultados del catálogo. La clave está definida como variable de entorno
de **usuario** en Windows, que es una de las dos vías válidas. Las shells que abre esta
sesión no la ven (`$env:API_KEY_21ST` sale vacía), pero el proceso de Claude Code sí la
tenía al arrancar, que es el único momento en que importa.

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
Claude Code inyecta antes de expandir `.mcp.json`, y que está en `.gitignore`).

**Un `.env` NO alimenta esto.** Claude Code no carga archivos `.env`. Hasta el
2026-07-30, `.gitignore`, `.env.example` y `specs/habilidades.md` afirmaban que la
clave podía "vivir en el entorno o en un `.env` local"; la segunda mitad era falsa y
hacía perder tiempo. Los tres archivos quedaron corregidos.

**La clave que se compartió en el chat el 2026-07-30 está comprometida** (quedó en
la transcripción) y debe rotarse en 21st.dev antes de usarse. No se guardó en
ningún archivo versionado del repositorio.

**Pendiente para Daniel:** el 2026-07-30 había un `.env` sin versionar en el PC con un
valor de `API_KEY_21ST` dentro, inerte por lo anterior y posiblemente la clave
comprometida. Daniel se encarga de borrarlo; queda anotado por si el archivo reaparece
en otro clon.

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
