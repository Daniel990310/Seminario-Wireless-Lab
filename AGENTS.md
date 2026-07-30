# Instrucciones para agentes

Sitio web del seminario internacional **Beyond Connectivity: Wireless Sensing in
mmWave and Sub-THz Bands** (PUCV, 21–22 de octubre de 2026).

Este archivo es la entrada obligatoria antes de tocar el repositorio. Si algo de
aquí contradice lo que parezca razonable a primera vista, gana este archivo: cada
regla existe porque su ausencia ya causó un problema concreto.

## Lo primero

```bash
npm install
npm run build     # genera dist/
npm run verify    # accesibilidad y presupuestos de peso
npm run check     # tipos
```

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

## Decisiones cerradas: no reabrir sin acuerdo

| # | Decisión |
| - | -------- |
| D1 | Una sola página con anclas. No se fragmenta en páginas por sección |
| D2 | Bilingüe español e inglés, con selector. **El título oficial nunca se traduce** |
| D3 | Registro de asistentes: previsto en la especificación, no implementado |
| D4 | Swiss Modernism 2.0 más minimalismo; Crimson Pro y Atkinson Hyperlegible Next |
| D5 | Dos temas con selector: claro por omisión, oscuro y «según el sistema» |

## Ya evaluado y descartado

No volver a proponer esto sin un argumento nuevo. El detalle está en
[`design.md` §1](specs/001-mejora-calidad/design.md).

| Propuesta | Por qué no |
| --------- | ---------- |
| **daisyUI** | 388 kB de CSS y vocabulario de tokens incompatible con el que ya se usa. Su patrón de temas sí se adoptó |
| **Componentes de shadcn/ui, Radix, Headless UI** | Exigen React. El presupuesto es 40 kB de JavaScript y hoy React cuesta 109 kB. Incompatible por aritmética |
| **tailkits-ui** | Cero soporte de modo oscuro en 30 archivos, sin `sr-only`, `alt="Logo"` genérico, y categorías de landing de producto |
| **Componentes decorativos de Magic UI** | `MagicCard`, `BorderBeam`, `AuroraText`, `Marquee`, `Particles`: efectos de interfaz, no del tema del seminario |
| **Subir un presupuesto para que quepa el código** | El presupuesto disciplina al código, no al revés. Si no alcanza, se replantea la solución |

**Sobre los logos institucionales:** los de PUCV, ANID, Columbia University, Nokia
Bell Labs, PUC y USACH son marcas de terceros. **No se generan ni se aproximan con
ninguna herramienta**, aunque los skills instalados sean capaces de hacerlo. Los
archivos de `public/logos/` son marcadores de posición deliberados hasta que las
instituciones entreguen los oficiales.

## Convenciones de código

- **Contenido en archivos de datos.** Nada de texto escrito en componentes: todo
  sale de `src/data/`. La organización del seminario debe poder actualizar el
  sitio sin tocar marcado ni estilos (RNF-5).
- **Comentarios en español, y explican el *por qué*.** Un comentario que repite lo
  que hace el código no aporta. Si una decisión no es evidente, el comentario
  debe decir qué alternativa se descartó y por qué.
- **Ningún componente referencia un token primitivo**, solo la capa semántica.
  Así cambiar de tema es sustituir un bloque de valores (RF-4.7).
- **Antes de agregar una dependencia**, medir su costo contra RNF-2. El cuello de
  botella actual son las tipografías, no el JavaScript.
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
