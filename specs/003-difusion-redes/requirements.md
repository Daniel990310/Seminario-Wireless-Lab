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

Genera las 20 piezas —12 para redes, 4 del pendón impreso (RF-33) y 4 de las pantallas de la sede (RF-34)—, mide los criterios
medibles y escribe
[`verification.md`](verification.md). **Si hay un criterio en rojo, las piezas no están
listas** y el comando termina con código 1. Con todo en verde falta RF-30, la revisión
humana, sobre las hojas de `difusion/revision/`. Las comprobaciones viven en
`scripts/generar-flyer.mjs` y `scripts/lib/criterios-flyer.mjs`.

El validador se probó contra defectos reales: en su primera corrida detectó la caja del logo
fuera del recorte 3:4 y 56 px de desborde en la historia de expositores, y en rondas
anteriores el retrato pegado a la franja, el texto bajo el piso y el desborde de la pieza
única `[medido: 2026-10-01]`.

## Alcance

Diez láminas por idioma, en español e inglés (`src/data/flyer.ts`):

| Pieza | Formato | Uso |
| --- | --- | --- |
| `carrusel-1` · `-2` · `-3` | 4:5 | Feed de Instagram (carrusel) y LinkedIn (documento PDF): portada, expositores, inscripción |
| `unica` | 4:5 | Respaldo de una sola imagen, para WhatsApp o para publicar sin carrusel |
| `historia-1` · `-2` | 9:16 | Historias y estado de WhatsApp: portada con hueco para el sticker de enlace, y expositores |
| `pendon-80x200` · `-85x200` | 80 u 85 × 200 cm | **Impreso**: pendón roller reutilizable, con la identidad del seminario, el laboratorio que organiza y las instituciones en grande (RF-33) |
| `pantalla-acceso` · `-telon` | 1920 × 1080 | **Pantallas de la sede**: acceso y telón del auditorio, con las plantillas de la sede (RF-34) |
| `credencial/<id>` | 10 × 14 cm | **Credenciales** del evento, en inglés, por categoría; aparte de las láminas (RF-36) |

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
| RF-24.1 | Ningún texto bajo **31 px de lienzo**: el lienzo de 1080 px se ve a unos 390 pt (escala 0,361), y 11 pt es el mínimo de texto de iOS. **Excepción desde el 2026-10-08:** la mención de financiamiento tiene piso propio: **24 px** (8,7 pt) desde el 2026-10-08 y **20 px** (7,2 pt) desde el 2026-10-09, para que el agradecimiento de Mauricio quepa en tres renglones sin agrandar la franja. Es letra legal, no el mensaje | `[verificado]` Apple HIG; escala `[medido]`; la excepción, Mauricio por Daniel: menos blanco abajo y financiamiento más pequeño | generador |
| RF-24.2 | Contraste del texto contra su fondo **4,5:1**, o **3:1** si es texto grande (24 px, o 18,66 px en negrita, en el teléfono) | WCAG 2.1 AA, RNF-1 del proyecto | generador, sobre el fondo opaco más cercano |
| RF-24.3 | Nada desborda su caja, se corta ni se monta sobre el QR, tanto con las fuentes del sitio (PNG) como con las del PDF | `[medido]`: las métricas cambian entre las dos | generador |
| RF-24.4 | Al menos **32 px** entre el último contenido y el pie, donde lo hay: el pie empieza en la fila de participantes, encima de la franja de marcas. Desde el 2026-10-08 las historias no llevan la foto de la sede abajo (Daniel la descartó) | Daniel, 2026-10-01: retrato pegado a la franja | generador |

**Límite de RF-24.2:** mide el par texto/fondo de los tokens, no la figura de fondo. La
figura son trazos finos al 65 %; su efecto sobre la lectura lo juzga RF-30.1.

## RF-25 · Jerarquía y mensaje

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-25.1 | Como mucho **tres familias**: las del sitio. | buena práctica de piezas impresas y digitales (≤ 2–3 familias) `[verificado]`; tokens del sitio | generador |
| RF-25.2 | Toda pieza dice el **dominio** y la **fecha**, para que una lámina suelta —una captura, un reenvío— lleve a la inscripción. Portada, historia 1 y pieza única nombran además al **organizador** (Daniel, 2026-10-01). El pendón no dice la fecha: se reutiliza (RF-33.5) | buena práctica: qué, cuándo, dónde y la acción en cada pieza `[verificado]` | generador |
| RF-25.3 | **Un solo llamado a la acción**, el de inscribirse, en la lámina donde está | buena práctica `[verificado]` | RF-30.1 (no hay forma determinista de contar intenciones) |

## RF-26 · Marca

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-26.1 | Cada pieza lleva **un** logo del seminario, del kit de marca 5.2, en variante `-blanco` sobre el fondo oscuro y por encima del mínimo del manual: **400 px** el principal, **420** el horizontal | `specs/marca-beyond-connectivity.md` | generador |
| RF-26.2 | Ninguna imagen se estira: proporción dibujada = proporción del archivo ± 2 % (los retratos, recortados en círculo, quedan fuera) | manual 5.2; RF-10.4 | generador |
| RF-26.3 | En la franja van **PUCV, EIE, CYTED, IEEE AP-S y ANID**, y ninguna otra imagen. IEEE AP-S entra el 2026-10-09 entre CYTED y ANID (Mauricio: «al lado del logo de CYTED»), en color y a 52 px de alto, 1,3× el área de ANID; su logo es de `ieeeaps.org`, bajo la decisión de RF-22 de tomar de internet los logos que faltan. CYTED con su marca de 40 años **sobre fondo blanco**: variante del original de `comun.ts` que cambia solo el fondo negro, con la tinta intacta (ver `Marcas.astro`). Las instituciones participantes del sitio van **encima de la franja, fuera de ella**, en una fila sobre el fondo oscuro, en su variante oscura y con tamaño por área (`Participantes.astro`, base de 38 px), en las láminas que `LAMINAS` marca con `participantes`: todas salvo la de expositores | decisión de Daniel, 2026-10-01 y 2026-10-02; Mauricio por Daniel, 2026-10-08 y 2026-10-09 | generador, por `data-marca` y `data-participante` (exactamente los participantes esperados, por nombre: falta uno o sobra uno, falla) |
| RF-26.4 | **ANID a la derecha** de las marcas no gubernamentales | manual ANID §1.1, `specs/gestion/anid-normas-2026.md` | generador |
| RF-26.5 | Peso visual igualado: el área de cada marca entre **0,72× y 1,7×** la de ANID | RF-18.2 del proyecto; manual ANID §1.1 | generador |
| RF-26.6 | **Toda lámina lleva la mención de financiamiento** al pie de la franja. Desde el 2026-10-09 es el **agradecimiento que mandó Mauricio**, en el idioma de cada pieza: «This work was supported by ANID FONDECYT Regular 1250951, ANID FONDECYT Iniciación 11241221 and 11261397, ANID CCTVal CIA250027, ANID CPS-RTC CIA250016, ANID Vinculación Internacional FOVI250222 and Programa Iberoamericano de Ciencia y Tecnología para el Desarrollo - CYTED (525RT0175-DISeCom).» Así desde el 2026-10-13: Mauricio corrigió por WhatsApp que 11241221 y 11261397 son de Iniciación y sumó CPS-RTC CIA250016; «Regular» lo agregamos para distinguirlo. La versión en español es traducción nuestra, pedida por Daniel. ⚠️ **Excepción a RNF-8.1 en los flyers**: reemplaza a la fórmula de ANID («Financiado por la Agencia Nacional de Investigación y Desarrollo, ANID / Concurso…»), que «Cómo mencionar a ANID en productos 2026» pide con el nombre completo de la agencia; el agradecimiento dice solo «ANID». Decisión de Mauricio, responsable del proyecto ante ANID; el sitio sigue con la fórmula. Los folios son `[supuesto]`: dados por él, sin cotejar con ANID. Sin rótulos «Organiza»/«Financian» en la franja: repetían lo que dicen el organizador de arriba y la mención. **Desde el 2026-10-09 la de expositores también lleva franja y agradecimiento** (Daniel: una lámina reenviada sola sigue diciendo quién financia), sin la fila de participantes; sus retratos bajan de 192 a 164 px para que quepa, y a 150 el 2026-10-13, cuando el agradecimiento ganó un renglón | RNF-8.1; Daniel, 2026-10-02: estaba en unas láminas y en otras no; Mauricio, 2026-10-09 | generador: el agradecimiento completo, letra por letra |

**Contenido de las láminas, 2026-10-08** (Mauricio y Daniel, al rehacer los flyers pieza por pieza):

| Criterio | Qué | Procedencia | Quién lo mide |
| --- | --- | --- | --- |
| RF-26.7 | La portada del carrusel **no lleva «Desliza: expositores e inscripción»**: los puntos del carrusel ya dicen que hay más | Daniel, en su versión del `.ai` | estructura de la lámina |
| RF-26.8 | La fecha de la portada del carrusel va a **100 px**: es lo que quien pasa por el feed tiene que retener | buena práctica de jerarquía (fecha, lugar y llamado antes que logos) | estructura de la lámina |
| RF-26.9 | La lámina de inscripción lleva el **horario de cada jornada** junto al lugar, solo del programa real (no del demostrativo) | lo necesita quien se inscribe para saber si puede ir | estructura de la lámina |
| RF-26.10 | La pieza única dice la **institución de cada expositor** en gris, en el mismo renglón que su nombre; nombre y afiliación se separan por tamaño, peso, color y aire, no por un signo | Daniel | generador, RF-24.3: nada se monta sobre el QR |

## RF-27 · Personas

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-27.1 | Solo retratos con autorización registrada en `comun.ts`; sin foto, monograma. Nada generado | RF-11 del proyecto; manual ANID §1.5 | los retratos salen de los datos del sitio: no hay otra vía de entrada |

## RF-28 · Enlaces

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-28.1 | El QR lleva al **formulario de inscripción** —salvo en la pantalla de acceso, que lleva al programa (RF-34.1)— y se lee a tamaño real y a la mitad. Se compara con la URL que la lámina debe llevar (`POR_LAMINA.qr`), no con la que el QR declara: falla un QR cambiado de lámina, sobrante o que falta; un error en la URL misma no, porque lámina y criterio la toman del mismo dato | pedido de Daniel; `[medido]` con `jsqr` | generador |
| RF-28.2 | Las historias **no** llevan QR: se ven en el mismo teléfono | buena práctica: una sola instrucción que se pueda seguir | estructura de la lámina |
| RF-28.3 | La historia de portada deja libre un hueco de **600 × 170 px** para el sticker de enlace | Instagram no admite enlaces en la imagen; el sticker sí | generador |

## RF-29 · Entregables

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-29.1 | Cada pieza trae su **texto alternativo**, entre 1 y 1000 caracteres; sin tope en los impresos, que no se publican en ninguna red. El de la pieza única no repite la lista de instituciones participantes: cada expositor ya nombra la suya, y con ella pasaba de 1000 | `[verificado]` límite de la API de Instagram; las historias no admiten alt | generador |
| RF-29.2 | El PDF trae texto vivo: **sin Type3** y con las tres familias incrustadas | `[medido]`: con Type3, Illustrator abría 0 marcos | generador |
| RF-29.3 | El PDF mide lo mismo que el lienzo y pesa **menos de 100 MB**, el máximo de un documento de LinkedIn | `[verificado]` | generador |
| RF-29.4 | Todas las imágenes cargaron | — | generador |
| RF-29.5 | El `.ai` se edita sin bucear en grupos: capas Texto, Logos, QR, Fotos y Fondo; cada logo, retrato, QR y la figura en **un grupo con nombre**; sin máscaras que no recortan nada; los párrafos de varios renglones como **texto de área** cuando Illustrator los corta igual que el cartel; y una capa **«Logos para colocar»**, que no imprime, con todos los logos del proyecto incrustados. Ordenar no cambia el lienzo: **menos de 0,5 %** de píxeles distintos entre el PDF importado y el `.ai` ordenado | `[medido]` el 2026-10-07: importado del PDF, `es-unica` traía 15 grupos, 14 con máscara, y cada logo en trazados sueltos. Con el orden, 0,00–0,28 %, que es el corrimiento subpíxel del interlineado en los párrafos de área | `abrir-flyer.ps1` |
| RF-29.6 | Cada **publicación** —el carrusel, la pieza única— trae su **pie de publicación** (`<idioma>-carrusel.pie.txt`, `<idioma>-unica.pie.txt`): uno por publicación, no por imagen, hasta 2200 caracteres. Título, fecha y lugar, organizador, expositores con su afiliación, inscripción y agradecimiento de financiamiento, armados con los datos del sitio | Daniel, 2026-10-09: el texto alternativo no es el pie; límite de Instagram | generador |
| RF-29.7 | El carrusel sale además como **un PDF de tres páginas** (`<idioma>-carrusel.pdf`), para publicarlo en LinkedIn como documento —así se ve deslizable; las imágenes sueltas las muestra en cuadrícula—, uniendo los PDF vectoriales de las láminas, con texto vivo (sin Type3 y con las tres familias, como RF-29.2) y bajo 100 MB | Daniel, 2026-10-09; límite de documento de LinkedIn | generador |

## RF-30 · Revisión humana, antes de publicar

Lo que ningún criterio automático cubre. Se hace sobre `difusion/revision/telefono-es.png`
y `telefono-en.png`, a tamaño de teléfono, **pieza por pieza y en los dos idiomas**, no
sobre una sola.

| # | Qué se mira |
| - | --- |
| RF-30.1 | Que la figura de fondo no estorbe la lectura de ningún texto (límite de RF-24.2), que haya un solo llamado a la acción (RF-25.3) y que nada se vea a medio hacer: huecos, alineaciones rotas, retratos cortados |
| RF-30.2 | En Illustrator: las tres familias instaladas **para todo el sistema**, condición que `scripts/illustrator/abrir-flyer.ps1` comprueba antes de abrir nada |

## RF-33 · Pendón roller impreso

Pedido de Daniel el 2026-10-14: «el flyer que se va a imprimir», largo y de gran formato,
con **todo lo que tiene el carrusel en uno solo** —expositores con foto, todas las
organizaciones— y **la foto de Mauricio arriba como organizador**, como en el sitio. El
formato que corresponde a esa descripción es el **pendón roller** (*roll-up*): tela de 2 m
de alto que se enrolla en un cassette con pie. Un afiche A1 o A0 no es «largo» (1:√2) y un
volante no es gran formato.

Se dibuja con las láminas del carrusel y su escala de px: 1 px de lienzo = 0,741 mm, así
que los criterios de RF-23 a RF-26 se reutilizan tal cual (detalle en `src/data/flyer.ts`).

| # | Criterio | Procedencia | Quién lo mide |
| - | --- | --- | --- |
| RF-33.1 | Dos anchos, **80 × 200** y **85 × 200 cm** visibles: los de catálogo más comunes en Chile y en las guías de imprenta. El PDF va **a tamaño real** con **10 mm de sangrado** por lado y **150 mm de base** bajo lo visible, la que entra en el cassette; declara la caja de corte (`TrimBox`, ancho × 215 cm) y la de sangrado (`BleedBox`) | `[verificado]` 80 × 200 y 85 × 200 de catálogo; base de 100–150 mm y sangrado de 10 mm en las guías de *pull-up banner* (ver Fuentes) | generador: lee el PDF escrito en disco; la hoja (px del lienzo) contra el corte de catálogo más sangrado (± 3 px), la `TrimBox` a 10 mm de cada borde (± 2 px), la `BleedBox` en los bordes (± 2 px) y 20 mm (± 0,1) más ancha y alta que el corte. Antes de escribir, si Chromium no imprimió el lienzo a 0,75 pt por px, RF-33.1 queda en rojo y la pieza sin PDF |
| RF-33.2 | Nada legible en la base ni en los **30 mm de arriba** (la barra que cuelga la tela) ni en los **40 mm sobre el cassette**; la base y el sangrado inferior siguen el **blanco de la franja**, para que un enrollado distinto no deje ver una tira oscura | guías de *pull-up banner* `[verificado]`; los márgenes, `[supuesto]` sin la ficha de la imprenta | generador (RF-23.2 con `seguro`) |
| RF-33.3 | Piso tipográfico: el de RF-24.1, **31 px = 23 mm** de cuerpo, unos 16 mm de mayúscula: se lee a ~2 m por la regla de rotulación de 25 mm de altura de letra por cada 3 m. La mención de financiamiento, 20 px = 15 mm, se lee acercándose | regla de rotulación `[supuesto: regla práctica, sin norma citada]` | generador (RF-24.1) |
| RF-33.4 | Toda imagen ráster, impresa, a **90 ppi o más**: a 1 m el ojo separa 0,29 mm (un minuto de arco), 87 ppi. Retratos y marcas con su archivo original, no el reducido para pantalla. Las imprentas piden 150 ppi para mirar de cerca, y los retratos de 560 px no lo alcanzan al tamaño elegido | agudeza visual de 1′ `[verificado]`; 150 ppi en las guías | generador |
| RF-33.5 | **Reutilizable**: la identidad del seminario, no los datos de esta edición. Marca; **tesis** del seminario (el título de la sección «El seminario» del sitio) con una **frase técnica** (`ui.flyer.gancho`); **QR al sitio** con el dominio, entre 60 y 90 cm bajo el borde superior, a la altura de los ojos; **el laboratorio que organiza** («Organiza» y el logo del Wireless Communication Lab con el escudo PUCV, como en la plantilla del póster), en lugar del nombre de Mauricio; las **instituciones participantes en grande** (2,6 veces la fila de las láminas) y la franja de marcas a 1,2 con el agradecimiento. **Sin** expositores, fecha, sede, horario ni QR de inscripción | Daniel, 2026-10-14 (primera versión, con todo el carrusel); revisión de diseño reenviada por Daniel el 2026-10-15: «el pendón no cumple esa función [la de afiche]… es como una imagen, este soy yo», con los expositores «no te va a servir más», y que se vean bien los logos de las colaboraciones. Daniel eligió reutilizable; el mismo día quitó la foto de Mauricio, y Mauricio pidió cambiar su nombre por el logo de su laboratorio | generador: centro del QR entre 60 y 90 cm bajo el borde de arriba de lo visible; RF-28.1 contra el sitio; el resto, estructura de la lámina |
| RF-33.6 | QR de **15 cm de lado o más**: se lee hasta a unas diez veces su lado, 1,5 m | regla práctica de distancia ÷ 10 `[supuesto]` | generador |
| RF-33.7 | Además del PDF, un **JPG a 150 ppi** del lienzo entero, con la densidad escrita en la cabecera, para la imprenta que no recibe PDF | Chromium escribe densidad sin unidad `[medido]` | generador |
| RF-33.8 | Revisión humana sobre `difusion/revision/pendon-<idioma>.png` **y sobre el PDF abierto o rasterizado**, no solo el PNG: RF-29.3 mide la caja de la hoja y no el dibujo, y pasó en verde con el lienzo a un tercio dentro de la hoja `[medido: 2026-10-14]`. Antes de mandar a imprimir, **una prueba a tamaño real de un tramo** (por ejemplo, la fila de instituciones en A3 al 100 %) | lo que la pantalla no muestra: color y nitidez impresos | Daniel |

**Color.** El PDF sale en **RGB** (sRGB): Chromium no escribe CMYK. La imprenta lo
convierte; los azules oscuros del fondo pueden imprimir algo más apagados. Si la imprenta
exige CMYK, se convierte en Illustrator (*Archivo → Modo de color del documento*) con el
perfil que ella indique, y se revisa el azul en una prueba. `[supuesto]` hasta tener la
ficha técnica de la imprenta elegida.

**Fuentes del RF-33** `[verificado: 2026-10-14]`: ficha de pendón roller 85 × 200 de
transparencia activa USACH (sangrado 10 mm, área imprimible 85 × 215, 150 dpi, fuentes
incrustadas); guías de *pull-up banner* 850 × 2000 de imprentas del Reino Unido y Australia
(base de 100–150 mm en el cassette, 150 dpi a tamaño final, PDF). Detalle en
`specs/fuentes.md`.

## RF-34 · Pantallas de la sede

La Sede PUCV Santiago mandó a Mauricio el 2026-10-15 dos plantillas de 1920 × 1080 px: el
fondo de la pantalla de acceso y el del telón del auditorio («banner para fotos»). Daniel
las reenvió.

| ID | Criterio | Origen | Verificación |
| --- | --- | --- | --- |
| RF-34.1 | **Acceso**, 1920 × 1080 a lienzo completo: marca, fecha, sede y organizador como la portada, y un **QR al programa del sitio** (`/#programa`, `/en/#programa`), no al formulario: el día del evento se busca la hora de cada charla. Franja de marcas con participantes y agradecimiento | plantilla de la sede; Daniel, 2026-10-15 | generador (RF-23 a RF-29) |
| RF-34.2 | **Telón**, 1920 × 1080: la gráfica solo en la **banda de arriba, 403 px** `[medido sobre la plantilla: azul hasta y = 402]`, y el resto en **negro puro** (`#000`), como dice la plantilla («mantener esta área de color negro»). Logo horizontal, título, fecha y dominio; franja de marcas con agradecimiento, sin participantes (no caben) | plantilla de la sede | generador: RF-23.2 con `seguro.abajo` = 677 (nada fuera de la banda) |
| RF-34.3 | Ninguna de las dos va a la hoja de teléfono (RF-30.1): se ven en pantallas de la sede | — | `generar-flyer.mjs` |

## RF-36 · Credenciales del evento

El profesor las pidió por Daniel el 2026-10-15. Daniel eligió formato, nombres y categorías,
y que todas vayan en inglés. `npm run credenciales` (`scripts/generar-credenciales.mjs`) las
genera desde `/credencial/<id>/` (`src/components/credencial/`).

| ID | Criterio | Origen | Verificación |
| --- | --- | --- | --- |
| RF-36.1 | **10 × 14 cm vertical**, para porta-credencial con cordón, más 2 mm de sangrado: PDF de 104 × 144 mm con `TrimBox` de 100 × 140 a 2 mm, uno por página para la imprenta, y otro de **cuatro por hoja A4** sin sangrado y con marcas de corte, para la oficina. Carta no sirve: 2 × 140 mm no caben en 279 | Daniel, 2026-10-15; formato común de porta-credencial `[supuesto: sin ficha del proveedor]` | generador: lee el PDF escrito |
| RF-36.2 | **En inglés**, cuatro categorías con banda de color: *Speaker*, *Organizing committee* (el rótulo del pie del sitio), *Attendee* y *Staff*. El nombre en dos renglones o menos; uno largo baja de cuerpo hasta 6,5 mm y, si aun así no cabe, el criterio falla | Daniel, 2026-10-15 | generador, con las fuentes del sitio y con las del PDF |
| RF-36.3 | PDF sin Type3 y con las familias que usa incrustadas (Crimson Pro y Atkinson Hyperlegible Next; sin monoespaciada desde la segunda versión), como RF-29.2 | RF-29.2 | generador |
| RF-36.4 | Hojas A4 de 210 × 297, tantas como hagan falta para cuatro por hoja | — | generador |
| RF-36.5 | **Nombres impresos y un lote en blanco.** Expositores y comité salen del sitio, que ya los publica. Los inscritos son datos personales: `--inscritos <planilla.csv>` los escribe sobre la credencial en blanco en el navegador, al capturar, y los PDF quedan en `difusion/credenciales/privado/`, ignorada por git; **nunca pasan por el sitio ni por el repositorio** | Daniel, 2026-10-15; Ley 19.628 | generador: se niega a escribir si la carpeta no está ignorada |
| RF-36.6 | Revisión humana de `difusion/revision/credenciales.png` y **una prueba impresa** en el porta-credencial antes del tiraje | — | revisión humana |

## Decisiones abiertas

| # | Decisión | Bloquea |
| - | --- | --- |
| A-003.1 | Si ANID exige su fórmula también en las láminas interiores (expositores). Hoy va en toda lámina con franja de marcas | No: se consulta con ANID junto con A11 |

> Corregido 2026-10-02: A-003.2 (CYTED sin logo) se cerró. La marca de 40 años llegó en la
> rama `ajustes/logo-eie-organizacion` (commit `3fedccb`) y se aplicó igual que allí.
