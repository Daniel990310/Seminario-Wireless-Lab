# Estado y continuidad

Este archivo existe para que el trabajo pueda **cambiar de entorno sin perder el
hilo**. El proyecto se desarrolla desde varios sitios —Claude Code en el navegador,
en el móvil, en el PC, y Antigravity— y ninguno de ellos ve el historial de
conversación de los otros. Lo único compartido es el repositorio. Por lo tanto:

> **Si no está escrito en el repositorio, no ocurrió.**

Actualizado: **2026-07-30** · Rama de trabajo: `claude/framework-app-profesional-n4wa0t`
· Último commit: `c29d21b` (T2)

---

## 1. Antes de tocar nada, en cualquier entorno

```bash
git fetch origin
git status -sb                       # ¿hay divergencia con el remoto?
git log --oneline -5                 # ¿coincide con el «último commit» de arriba?
npm ci                               # dependencias exactas del lockfile
npm run build && npm run verify      # ¿de qué estado real parto?
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
   autoridad del proyecto sobre accesibilidad y peso (RNF-6). Sin él, «mejoré la
   accesibilidad» es una opinión.

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
| T3 · Quitar Motion y montar la base de shadcn/ui | **En curso.** Ver §5 |
| T4 · Tipografía | Pendiente |
| T5 · Retícula de 12 columnas (RNF-1.3) | Pendiente. Cierra los nodos indeterminados |
| T6 · Nombres accesibles y teclado (RNF-1.4) | Pendiente |
| T7 · Sitio bilingüe (RF-1) | Pendiente |
| T8 · `og:image` por idioma | Pendiente |
| T9 · Verificación final | Pendiente |
| T10 · Componentes interactivos (RF-6) | **Bloqueada: RF-6 es una propuesta del agente, no un requisito del cliente.** No implementar sin que Daniel lo confirme |

### Lo que mide el verificador ahora mismo

Con `npm run build && npm run verify` sobre `c29d21b`:

| Comprobación | Valor | Límite | |
| ------------ | ----- | ------ | - |
| RNF-1.1 Hallazgos axe WCAG 2.1 AA | 0 | 0 | cumple |
| RNF-1.3 Nodos con contraste indeterminado | 104 | 0 | **abierto → T5** |
| RNF-1.4 Secciones sin nombre accesible | 7 | 0 | **abierto → T6** |
| RNF-1.5 Saltos de nivel en encabezados | 0 | 0 | cumple |
| RNF-2.1 JavaScript comprimido | 109,6 kB | 115 kB | cumple |
| RNF-2.2 Primera carga comprimida | 247,0 kB | 260 kB | cumple |
| RNF-2.6 Tipografías | 110,9 kB | 125 kB | cumple |

Los dos incumplimientos abiertos **no son regresiones**: están en la línea base y
su corrección pertenece a T5 y T6. `npm run verify` termina con código 1 por ellos,
y eso es correcto.

Además hay `npm run verify:tema`, que cubre los criterios de RF-4 que axe no puede
evaluar: destello al cargar, comportamiento sin JavaScript, teclado, persistencia
sin cookies y sincronía entre las dos instancias del selector. 16 comprobaciones.

## 5. T3, exactamente dónde quedó

**Objetivo:** quitar Motion, reimplementar el haz con SVG y `stroke-dashoffset`
animado por CSS, y montar la base de shadcn/ui. React se queda (D6).

**Hecho:**

- Medido el comportamiento de partida, como exige la tarea. El haz de Motion mueve
  una ventana de gradiente del 10 % sobre el **recuadro** del trayecto, de −10 % a
  110 %, en 7 s. Comprobado muestreando `x1`/`x2` del `linearGradient`.
- Añadido el bloque `network` a `src/data/seminar.ts` (RNF-5.1: el contenido no
  vive en el componente).
- Escrito `src/components/CollaborationNetwork.astro`: Astro puro, sin React ni
  JavaScript de cliente. La geometría se fija por construcción en vez de medir el
  DOM —columnas de dos filas iguales sin separación, así los extremos caen al 25 %
  y 75 %— y el pulso usa `pathLength="100"` para poder expresar el guion en
  porcentaje del recorrido.

**Falta:**

1. Conectar el componente nuevo: `src/pages/index.astro` todavía importa
   `~/components/CollaborationNetwork` con `client:visible` y resuelve al `.tsx`.
2. Borrar `src/components/CollaborationNetwork.tsx` y
   `src/components/ui/animated-beam.tsx`.
3. `npm uninstall motion`.
4. Crear `components.json` para shadcn/ui. **Ninguna primitiva de Radix todavía:**
   cada una se justifica por el componente que habilita, no «por si acaso».
5. Comparar el resultado contra la medición de partida y verificar.

**Hallazgo importante para el presupuesto.** `CollaborationNetwork` es la **única
isla hidratada** del sitio. `Ripple` se importa en `ProgramPending.astro` y
`VenueLocator.astro` pero **sin** directiva `client:`, así que se renderiza en el
build y no envía JavaScript. Al convertir la red a Astro no debería quedar ninguna
isla React, y el JavaScript de cliente debería caer muy por debajo de los 109,6 kB
actuales. **Hay que medirlo, no darlo por hecho.**

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
