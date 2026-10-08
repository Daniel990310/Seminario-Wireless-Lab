# 003 · Piezas de difusión en redes

Qué tiene que cumplir cada pieza para Instagram, LinkedIn y WhatsApp **antes de declararla
lista**. Se escribió el 2026-10-01, después de un día de iteración en que cada ronda de
revisión de Daniel encontró un defecto que nadie había medido: texto a 5–7 pt en el
teléfono, un retrato pegado a la franja de marcas, franjas blancas el doble de altas en las
historias, una zona segura bajada sin fuente. Este documento convierte esos hallazgos, los
criterios del proyecto y las buenas prácticas externas en condiciones medibles.

**Cómo se usa:**

```bash
npm run build && npm run flyer
```

Genera las 12 piezas, mide los 21 criterios medibles y escribe
[`verification.md`](verification.md). **Si hay un criterio en rojo, las piezas no están
listas** y el comando termina con código 1. Con todo en verde falta RF-30, la revisión
humana, sobre las hojas de `difusion/revision/`. Las comprobaciones viven en
`scripts/generar-flyer.mjs` y `scripts/lib/criterios-flyer.mjs`.

El validador se probó contra defectos reales: en su primera corrida detectó la caja del logo
fuera del recorte 3:4 y 56 px de desborde en la historia de expositores, y en rondas
anteriores el retrato pegado a la franja, el texto bajo el piso y el desborde de la pieza
única `[medido: 2026-10-01]`.

## Alcance

Seis láminas por idioma, en español e inglés (`src/data/flyer.ts`):

| Pieza | Formato | Uso |
| --- | --- | --- |
| `carrusel-1` · `-2` · `-3` | 4:5 | Feed de Instagram (carrusel) y LinkedIn (documento PDF): portada, expositores, inscripción |
| `unica` | 4:5 | Respaldo de una sola imagen, para WhatsApp o para publicar sin carrusel |
| `historia-1` · `-2` | 9:16 | Historias y estado de WhatsApp: portada con hueco para el sticker de enlace, y expositores |

## RF-23 · Formato y zonas seguras

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-23.1 | 4:5 a **1080 × 1350** y 9:16 a **1080 × 1920**; el PNG mide exactamente eso | `[verificado]` guías de tamaños 2026 | generador, cabecera del PNG |
| RF-23.2 | En 9:16 ningún texto ni imagen cae en los **250 px de arriba ni en los 250 de abajo**, que cubren el nombre de la cuenta y la barra de respuesta | `[verificado]` | generador, por elemento |
| RF-23.3 | En 4:5 todo texto e imagen queda dentro del **recorte 3:4 central** (1012 × 1350) con que la grilla del perfil de Instagram muestra la pieza desde enero de 2025 | `[verificado]` | generador, por elemento |

> Corregido 2026-10-01: la franja inferior de las historias estuvo en 340, 220 y 80 px. Los
> tres valores se eligieron por cómo se veía la franja de marcas, sin fuente. Las guías dicen
> 250, y RF-23.2 se escribe con ese valor.

**Qué ocupa esa franja.** Contenido, nunca: lo tapa la interfaz. Vacía, se leía como un
hueco, primero en azul y después en blanco (Daniel, 2026-10-01 y 2026-10-02). Del
2026-10-02 al 2026-10-08 la ocupó la fotografía de la sede; **Daniel la descartó** al
rehacer los flyers. Queda el fondo oscuro cruzado por los arcos de la figura.

## RF-24 · Legibilidad en el teléfono

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-24.1 | Ningún texto bajo **31 px de lienzo**: el lienzo de 1080 px se ve a unos 390 pt (escala 0,361), y 11 pt es el mínimo de texto de iOS. **Excepción desde el 2026-10-08:** la franja de marcas, que solo lleva la mención de financiamiento, tiene piso de **24 px** (8,7 pt): es letra legal, no el mensaje | `[verificado]` Apple HIG; escala `[medido]`; la excepción, Mauricio por Daniel: menos blanco abajo y financiamiento más pequeño | generador |
| RF-24.2 | Contraste del texto contra su fondo **4,5:1**, o **3:1** si es texto grande (24 px, o 18,66 px en negrita, en el teléfono) | WCAG 2.1 AA, RNF-1 del proyecto | generador, sobre el fondo opaco más cercano |
| RF-24.3 | Nada desborda su caja ni se corta, tanto con las fuentes del sitio (PNG) como con las del PDF | `[medido]`: las métricas cambian entre las dos | generador |
| RF-24.4 | Al menos **32 px** entre el último contenido y la franja de marcas, donde la hay. Desde el 2026-10-08 las historias no llevan la foto de la sede abajo (Daniel la descartó) | Daniel, 2026-10-01: retrato pegado a la franja | generador |

**Límite de RF-24.2:** mide el par texto/fondo de los tokens, no la figura de fondo. La
figura son trazos finos al 65 %; su efecto sobre la lectura lo juzga RF-30.1.

## RF-25 · Jerarquía y mensaje

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-25.1 | Como mucho **tres familias**: las del sitio | buena práctica de piezas impresas y digitales (≤ 2–3 familias) `[verificado]`; tokens del sitio | generador |
| RF-25.2 | Toda pieza dice el **dominio** y la **fecha**, para que una lámina suelta —una captura, un reenvío— lleve a la inscripción. Portada, historia 1 y pieza única nombran además al **organizador** (Daniel, 2026-10-01) | buena práctica: qué, cuándo, dónde y la acción en cada pieza `[verificado]` | generador |
| RF-25.3 | **Un solo llamado a la acción**, el de inscribirse, en la lámina donde está | buena práctica `[verificado]` | RF-30.1 (no hay forma determinista de contar intenciones) |

## RF-26 · Marca

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-26.1 | Cada pieza lleva **un** logo del seminario, del kit de marca 5.2, en variante `-blanco` sobre el fondo oscuro y por encima del mínimo del manual: **400 px** el principal, **420** el horizontal | `specs/marca-beyond-connectivity.md` | generador |
| RF-26.2 | Ninguna imagen se estira: proporción dibujada = proporción del archivo ± 2 % (los retratos, recortados en círculo, quedan fuera) | manual 5.2; RF-10.4 | generador |
| RF-26.3 | En la franja van **solo PUCV, EIE, CYTED y ANID**, y ninguna otra imagen. **Desde el 2026-10-08** (Mauricio, por Daniel) las instituciones participantes del sitio más IEEE AP-S van **fuera de la franja**, sobre el fondo oscuro, en su variante oscura y con tamaño por área (`Participantes.astro`); primero en la pieza única. CYTED con su marca de 40 años **sobre fondo blanco**: variante del original de `comun.ts` que cambia solo el fondo negro, con la tinta intacta (ver `Marcas.astro`) | decisión de Daniel, 2026-10-01 y 2026-10-02 | generador, por `data-marca` |
| RF-26.4 | **ANID a la derecha** de las marcas no gubernamentales | manual ANID §1.1, `specs/gestion/anid-normas-2026.md` | generador |
| RF-26.5 | Peso visual igualado: el área de cada marca entre **0,72× y 1,7×** la de ANID | RF-18.2 del proyecto; manual ANID §1.1 | generador |
| RF-26.6 | **Toda lámina con franja de marcas lleva la mención de financiamiento**: la fórmula de ANID completa (RNF-8.1). **Desde el 2026-10-08, con los tres proyectos y su folio**, de corrido: FOVI250222, Fondecyt Regular 1250951 y CYTED 525RT0175 · DISeCom. ANID no exige el folio («Cómo mencionar a ANID en productos 2026»); Mauricio lo pidió. Sin rótulos «Organiza»/«Financian» en la franja: repetían lo que dicen el organizador de arriba y la mención. Las de expositores no llevan franja: son interiores | RNF-8.1; Daniel, 2026-10-02: estaba en unas láminas y en otras no | generador |

## RF-27 · Personas

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-27.1 | Solo retratos con autorización registrada en `comun.ts`; sin foto, monograma. Nada generado | RF-11 del proyecto; manual ANID §1.5 | los retratos salen de los datos del sitio: no hay otra vía de entrada |

## RF-28 · Enlaces

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-28.1 | El QR lleva al **formulario de inscripción** y se lee a tamaño real y a la mitad | pedido de Daniel; `[medido]` con `jsqr` | generador |
| RF-28.2 | Las historias **no** llevan QR: se ven en el mismo teléfono | buena práctica: una sola instrucción que se pueda seguir | estructura de la lámina |
| RF-28.3 | La historia de portada deja libre un hueco de **600 × 170 px** para el sticker de enlace | Instagram no admite enlaces en la imagen; el sticker sí | generador |

## RF-29 · Entregables

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-29.1 | Cada pieza trae su **texto alternativo**, entre 1 y 1000 caracteres | `[verificado]` límite de la API de Instagram; las historias no admiten alt | generador |
| RF-29.2 | El PDF trae texto vivo: **sin Type3** y con las tres familias incrustadas | `[medido]`: con Type3, Illustrator abría 0 marcos | generador |
| RF-29.3 | El PDF mide lo mismo que el lienzo y pesa **menos de 100 MB**, el máximo de un documento de LinkedIn | `[verificado]` | generador |
| RF-29.4 | Todas las imágenes cargaron | — | generador |
| RF-29.5 | El `.ai` se edita sin bucear en grupos: capas Texto, Logos, QR, Fotos y Fondo; cada logo, retrato, QR y la figura en **un grupo con nombre**; sin máscaras que no recortan nada; los párrafos de varios renglones como **texto de área** cuando Illustrator los corta igual que el cartel; y una capa **«Logos para colocar»**, que no imprime, con todos los logos del proyecto incrustados. Ordenar no cambia el lienzo: **menos de 0,5 %** de píxeles distintos entre el PDF importado y el `.ai` ordenado | `[medido]` el 2026-10-07: importado del PDF, `es-unica` traía 15 grupos, 14 con máscara, y cada logo en trazados sueltos. Con el orden, 0,00–0,28 %, que es el corrimiento subpíxel del interlineado en los párrafos de área | `abrir-flyer.ps1` |

## RF-30 · Revisión humana, antes de publicar

Lo que ningún criterio automático cubre. Se hace sobre `difusion/revision/telefono-es.png`
y `telefono-en.png`, a tamaño de teléfono, **pieza por pieza y en los dos idiomas**, no
sobre una sola.

| # | Qué se mira |
| - | --- |
| RF-30.1 | Que la figura de fondo no estorbe la lectura de ningún texto (límite de RF-24.2), que haya un solo llamado a la acción (RF-25.3) y que nada se vea a medio hacer: huecos, alineaciones rotas, retratos cortados |
| RF-30.2 | En Illustrator: las tres familias instaladas **para todo el sistema**, condición que `scripts/illustrator/abrir-flyer.ps1` comprueba antes de abrir nada |

## Decisiones abiertas

| # | Decisión | Bloquea |
| - | --- | --- |
| A-003.1 | Si ANID exige su fórmula también en las láminas interiores (expositores). Hoy va en toda lámina con franja de marcas | No: se consulta con ANID junto con A11 |

> Corregido 2026-10-02: A-003.2 (CYTED sin logo) se cerró. La marca de 40 años llegó en la
> rama `ajustes/logo-eie-organizacion` (commit `3fedccb`) y se aplicó igual que allí.
