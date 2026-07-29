# 001 — Diseño

Resuelve la decisión bloqueante A1. Cada opción técnica se justifica frente a una
alternativa, según la regla del flujo.

**Requisitos:** [`requirements.md`](requirements.md)
**Línea base:** [`../baseline/auditoria-2026-07-29.md`](../baseline/auditoria-2026-07-29.md)

## 1. Evaluación de los repositorios propuestos

Los siete se revisaron clonando el código. El criterio es uno solo: **si sirve a
un requisito**. Varios son excelentes en abstracto y no aplican a este proyecto.

> **Segunda revisión, 29 de julio de 2026.** La primera pasada de dos
> repositorios fue superficial y llegó a conclusiones equivocadas. Las
> correcciones se marcan abajo. Se mantiene el registro del error en lugar de
> reescribir el veredicto, porque el criterio con que se equivocó importa: se
> descartaron listas de enlaces sin haberlas leído completas.

| Repositorio | Veredicto | Razón |
| ----------- | --------- | ----- |
| `nextlevelbuilder/ui-ux-pro-max-skill` | **Adoptar** | Datos verificables para requisitos concretos. Instalado, junto con su skill `design-system`. |
| `shadcn-ui/ui` | **Referencia, no dependencia** | Su vocabulario de tokens ya está adoptado, verificado línea a línea. Los componentes exigen React + Radix. |
| `saadeghi/daisyui` | **Descartar la librería, adoptar su patrón de temas** | Corregido: el aporte real es la arquitectura de temas, no los componentes. |
| `travisvn/awesome-claude-skills` | **Usar como directorio** | Corregido: contiene dos ítems que sirven a requisitos abiertos. |
| `Prat011/awesome-llm-skills` | **Usar como directorio** | Corregido: contiene dos ítems relevantes. |
| `aniftyco/awesome-tailwindcss` | **Extraer dos ítems** | *Inclusive Colors* y `@tailwindcss/typography`. |
| `tailkits/tailkits-ui` | **Descartar** | Corregido a la baja: ver justificación. |

### Por qué se adopta ui-ux-pro-max

No es una colección de estilos para elegir a gusto: es una base consultable con
datos que se cruzan con nuestros requisitos.

Contenido real del paquete instalado, contado sobre los CSV `[medido]`:

| Dato | Cantidad |
| ---- | -------- |
| Paletas, con el mismo vocabulario de tokens que ya usa `global.css` | **192** |
| Estilos visuales | **84** |
| Pares tipográficos | **74** |
| Tipos de producto con reglas de razonamiento | **192** |
| Guías de UX (11 de accesibilidad) | **99** |
| Reglas específicas de Astro, con severidad | **53** |

**Las cifras con que llegó el repositorio no coinciden** con la versión
instalada: se mencionaban 67 estilos y 161 paletas, que corresponden a una
versión anterior —161 es además el número de reglas de razonamiento de su
insignia, no de paletas—. El propio skill declara 98 guías de UX y su CSV tiene
99. Las especificaciones usan lo que hay en los datos. Detalle en
[`../fuentes.md`](../fuentes.md).

Lo que lo hace útil aquí, y no genéricamente:

- **Tres tipos de producto exactamente sobre el caso**: «Conference / Symposium
  Landing Page», «Research Lab / University Department» y «Academic Journal /
  Scholarly Publishing».
- Una regla de Astro valida directamente RNF-2: *«Minimize client directives»*,
  severidad alta.
- Su regla de UX «Contrast Readability», severidad alta, coincide con RNF-1 y
  dice explícitamente «nada de texto gris sobre fondo gris», que es el defecto
  exacto de la línea base con `mist-500`.

Instalado en `.claude/skills/` junto con su skill `design-system` (2,2 MB en
total: datos, scripts y referencias; se omiten el CLI, las capturas y las
plantillas de otras plataformas). Licencia MIT.

**Advertencia sobre el dataset.** Su paleta académica declara
`Muted Foreground #64748B` sobre `Muted #E9EEF5`, que da **4,08:1 `[medido]`** y
por lo tanto **no cumple** WCAG AA para texto normal, aunque el dataset la
presente como válida. El dataset es un punto de partida informado, no una
autoridad: **la verificación con axe es el árbitro** (RNF-6). Toda pareja de
color se mide antes de adoptarse.

Por el mismo criterio, su calificación «WCAG AAA» para Swiss Modernism queda
como `[dataset]` sin verificar: es una etiqueta suya, y el cumplimiento lo
determina `npm run verify`.

### daisyUI: se descarta la librería y se adopta su patrón de temas

**Medido en el repositorio:** 35 temas y 61 componentes, con **388 kB de CSS de
componentes**. Los temas se declaran como un bloque plano de propiedades
personalizadas en `oklch()`, con nombres propios: `--color-base-100/200/300`,
`--color-base-content`, `--color-primary-content`, más `info/success/warning/error`.
Incluye tokens de forma —`--radius-selector`, `--radius-field`, `--radius-box`,
`--border`, `--depth`— y declara `color-scheme` en cada tema.

**Se descarta la librería** por tres razones, en orden de peso:

1. **Colisión de vocabulario, ahora confirmada.** Sus nombres de token no se
   parecen a los de shadcn que el proyecto ya usa. Adoptarla obliga a renombrar
   toda la capa de tokens o a mantener dos en paralelo. Es un problema de
   mantenibilidad (RNF-5), no estético.
2. **Peso.** 388 kB de CSS de componentes, cuando RNF-2 exige bajar de 241 kB a
   180 kB en total.
3. **Registro visual.** Su valor es entregar componentes uniformes y
   reconocibles, lo contrario de una identidad propia.

**Se adopta su patrón**, que es el aporte real y no cuesta nada:

- Un tema es **un bloque plano de propiedades semánticas** que se sustituye
  completo, en lugar de condicionales dispersos por los componentes.
- **`color-scheme` se declara en cada tema**, de modo que los controles nativos
  del navegador —barras de desplazamiento, campos de formulario— acompañen al
  tema en lugar de quedar desfasados. Es un detalle que se suele omitir.
- **Parametrizar la forma y no solo el color.** Tokens de radio y borde permiten
  que Swiss Modernism fije un radio bajo en un solo lugar.

El argumento original de «clases semánticas limpias sin saturar el HTML» es
válido y se resuelve sin dependencia, con `@layer components` en `global.css`,
que ya se usa (`.eyebrow`, `.surface`, `.hairline`).

### tailkits-ui: corregido a la baja

La primera pasada lo dejó como «referencia compatible» por ser Tailwind puro. Al
revisar los 30 archivos:

| Medición | Resultado |
| -------- | --------- |
| Archivos con variantes `dark:` | **0 de 30** |
| Apariciones de `sr-only` | **0** |
| Texto alternativo | Genérico: `alt="Logo"` |
| Títulos | Con degradado recortado sobre el texto (`bg-clip-text text-transparent`) |

Sus categorías son de landing de producto: precios, testimonios, boletín,
llamados a la acción, equipo. **Ninguna corresponde a un seminario académico**,
salvo la banda de logos y el pie. Además, no aporta nada al requisito de tema
claro/oscuro, que era la razón principal para mirarlo de nuevo, y el degradado
sobre los títulos es justamente lo que se quitó por no ser sobrio.

Aporte para este proyecto: **nulo**.

### Las dos listas de skills: corregido, sí sirven

La primera pasada las descartó tras buscar solo «accesibilidad» y «auditoría».
Leídas completas, aportan cuatro ítems concretos contra requisitos abiertos:

| Ítem | Sirve a |
| ---- | ------- |
| [`web-asset-generator`](https://github.com/alonw0/web-asset-generator) | **RNF-3.2**: genera favicons e imágenes para redes sociales, justo el `og:image` que falta |
| [`Blueprint`](https://github.com/JuliusBrussee/blueprint) | Plugin de desarrollo guiado por especificación: comparar contra el flujo propio de `specs/` |
| [`get-shit-done`](https://github.com/gsd-build/get-shit-done) | Otro sistema de desarrollo guiado por especificación, misma comparación |
| [Webapp Testing](https://github.com/anthropics/skills) | **RNF-6**: verificación de front-end con Playwright |

No son integrables como tales —son índices—, pero descartarlas fue un error de
método: se concluyó sobre una búsqueda por dos palabras en lugar de sobre el
contenido.

### ui-ux-pro-max, segunda pasada

Trae seis skills, no uno. El relevante además del principal es **`design-system`**,
que documenta **tokens en tres capas: primitivo → semántico → componente**. Esa
arquitectura es la respuesta al requisito de selector de tema y es mejor que la
capa plana actual del proyecto. Queda instalado.

Su regla de UX «Contrast Readability» tiene severidad alta y coincide con RNF-1:
mínimo 4,5:1 para texto normal, y explícitamente «nada de texto gris sobre fondo
gris» — que es exactamente el defecto de la línea base con `mist-500`.

### Por qué shadcn/ui queda como referencia

Su convención de tokens y el helper `cn` ya están adoptados. Incorporar los
componentes implica React y Radix, y la línea base muestra que React + Motion
cuestan **109,3 kB comprimidos, el 45 % del peso que viaja**. RNF-2 fija el techo
en 40 kB. Es incompatible por aritmética, no por criterio.

Si en el futuro se aprueba el registro de asistentes (RF-3) y aparece un
formulario complejo, la decisión se reevalúa: ahí Radix sí justificaría su costo.

## 2. Dirección de diseño

Derivada de la consulta al skill para nuestro tipo de producto.

**Estilo: Swiss Modernism 2.0 + Minimalismo.** Secundarios: «Trust & Authority»,
«Accessible & Ethical». El dataset lo califica con accesibilidad WCAG AAA,
rendimiento excelente, complejidad baja y compatibilidad 10/10 con Tailwind.
Concretamente: retícula estricta de 12 columnas, espaciado sobre una unidad base
de 8 px, jerarquía tipográfica marcada, equilibrio asimétrico, un único color de
acento y ausencia de ornamento.

Encaja con lo pedido —sobrio, académico, profesional— y evita el problema de la
propuesta anterior: la distinción venía de efectos, no de composición.

**Tipografía: Crimson Pro (títulos) + Atkinson Hyperlegible Next (texto).**
Dos motivos, y el segundo pesa más:

1. La actual, Space Grotesk + Inter, es el par por defecto del diseño generado
   por IA y no comunica nada sobre el seminario. Es una observación de estilo
   citada, no un dato medido (ver [`../fuentes.md`](../fuentes.md)).
2. **Atkinson Hyperlegible la creó el Braille Institute para lectores con baja
   visión `[verificado]`**, diferenciando formas que suelen confundirse: la `l`
   lleva cola y el `1` lleva gancho. Elegirla hace que la tipografía trabaje a
   favor de RNF-1 en lugar de ser neutral. Licencia SIL Open Font.

**Se usa la variante *Next*, no la original.** Medido sobre los paquetes de npm:

| Paquete | Archivos latinos | Peso |
| ------- | ---------------- | ---- |
| `@fontsource/atkinson-hyperlegible` | 2 estáticos (400 y 700) | 34.732 B |
| `@fontsource-variable/atkinson-hyperlegible-next` | 1 variable | **33.996 B** |

La original **no tiene versión variable**. *Next* gana por las tres vías: menos
peso, un archivo en lugar de dos y rango completo de pesos en lugar de dos
fijos.

Se mantiene JetBrains Mono para metadatos técnicos (frecuencias, horarios, código
de proyecto), coherente con la materia. Su costo está cuantificado abajo.

**Patrón de página: «Hero + Agenda + CFP».** Confirma D1 (una sola página) y
sugiere elevar el programa a segundo bloque, por sobre la presentación.

## 3. Temas claro y oscuro con selector

**Decisión (D5):** dos temas, **claro por omisión**, con selector explícito. El
oscuro se conserva como alternativa, no se descarta.

Base del tema claro, tomada de las paletas académicas del dataset y **verificada**
antes de adoptarse:

| Rol | Valor | Contraste | Uso |
| --- | ----- | --------- | --- |
| Fondo | `#F8FAFC` | — | Lienzo |
| Texto | `#0F172A` | 17,06:1 | Cuerpo y títulos |
| Primario | `#1E3A5F` | 11,5:1 sobre blanco | Navy institucional |
| Acento | `#A16207` | 4,92:1 sobre blanco | Dorado, un solo acento |

**No se copia el `Muted Foreground` del dataset** (`#64748B` sobre `#E9EEF5`,
4,08:1): incumple. Se sustituye por un valor propio verificado, y ese es
precisamente el defecto que la línea base encontró en el tema oscuro con
`mist-500`. El mismo error, en las dos paletas, por la misma causa: usar un gris
de apoyo como color de texto.

### Arquitectura: tokens en tres capas

Del skill `design-system`. Resuelve el selector de tema sin condicionales
repartidos por los componentes.

```
Primitivo   →  valores crudos de la paleta, iguales en ambos temas
                --navy-800, --gold-700, --slate-50, --slate-950
       ↓
Semántico   →  ÚNICA capa que cambia por tema
                --background, --foreground, --muted-foreground, --border, --ring
       ↓
Componente  →  derivados de la capa semántica
                --card-bg, --header-bg
```

Regla de oro: **ningún componente referencia un token primitivo**. Todos leen la
capa semántica. Cambiar de tema es sustituir un bloque plano de propiedades, tal
como hace daisyUI.

También se declara **`color-scheme` en cada tema**, para que barras de
desplazamiento y controles nativos acompañen al tema.

### Mecanismo del selector

- Atributo `data-theme` en `<html>`, con la variante `dark` por clase que ya está
  configurada en `global.css` (`@custom-variant dark`) — la misma convención de
  shadcn, ya verificada en su código.
- Tres estados: claro, oscuro y «según el sistema». La opción de sistema importa
  porque una persona que configuró su equipo en oscuro por sensibilidad a la luz
  no debería recibir un fondo claro por omisión.
- La preferencia se guarda en `localStorage`, no en cookies (RNF-4.1).
- Se aplica en un script en línea **antes de pintar**, para que no haya un
  destello del tema equivocado al cargar.
- Sin JavaScript, queda el tema claro por omisión y el sitio funciona igual.

La figura de propagación se reinterpreta con `currentColor` y tokens semánticos,
de modo que funcione en ambos temas sin duplicar el SVG.

## 4. Diseño técnico por requisito

### RF-1 · Bilingüe

Enrutamiento i18n nativo de Astro, con `defaultLocale: 'es'` y
`prefixDefaultLocale: false`: el español queda en `/` y el inglés en `/en/`.

*Alternativa descartada:* prefijar ambos idiomas (`/es/`, `/en/`). Obliga a
redirigir desde la raíz, lo que en un sitio estático significa una página puente
o una regla de servidor, y ensucia la URL que se comparte por correo.

El contenido se separa en `src/data/es.ts` e `src/data/en.ts` sobre una interfaz
común, de modo que TypeScript detecte una traducción faltante en tiempo de
compilación en lugar de dejar un hueco en producción. El título oficial vive en
un módulo compartido, para que no pueda traducirse por accidente (RF-1.2).

### RNF-2 · Presupuesto de JavaScript

**Se elimina React, Motion y `@astrojs/react` del proyecto.** El único
componente que los requería es `AnimatedBeam`, y su efecto —un pulso recorriendo
un trayecto— se reimplementa en SVG con `stroke-dasharray` y `stroke-dashoffset`
animados por CSS.

Justificación: 109,3 kB comprimidos por una sección son insostenibles frente a un
techo de 40 kB, y la regla de Astro «Minimize client directives» (severidad alta)
apunta en la misma dirección. Los trayectos se pueden calcular en tiempo de
compilación porque las posiciones de los nodos las define nuestra propia
retícula; medir el DOM era una necesidad de la implementación de Magic UI, no del
problema.

*Alternativa descartada:* conservar la isla y subir el presupuesto. Se rechaza
porque haría que el presupuesto se acomode al código en lugar de disciplinarlo.

Queda entonces sin dependencias de framework: solo los scripts propios de
navegación, aparición al hacer scroll, carga del mapa, selector de idioma y
selector de tema.

### El cuello de botella se traslada a las tipografías

Consecuencia que conviene explicitar, porque cambia dónde hay que poner
atención. Proyección de la primera carga tras eliminar React `[medido]`:

| Recurso | Peso | Del total |
| ------- | ---- | --------- |
| Tipografías (3 familias) | 119,7 kB | **83 %** |
| HTML | 13,3 kB | 9 % |
| CSS | ~9 kB | 6 % |
| JavaScript | ~3 kB | 2 % |
| **Total** | **145 kB** | frente a 180 kB de presupuesto |

Es decir: **el presupuesto de 40 kB de JavaScript pasa a cumplirse con enorme
holgura (~3 kB), y la restricción real son las tipografías.** La tipografía nueva
suma 11,4 kB respecto de la actual, lo que sigue cabiendo.

Si en algún momento hace falta margen, la palanca es **JetBrains Mono: 40,4 kB
por etiquetas y horarios.** Quitarla deja la primera carga en 105,6 kB. No se
quita ahora porque los metadatos técnicos son parte del lenguaje del seminario,
pero queda identificada como la primera concesión disponible y no como un
descubrimiento futuro.

### RNF-1 · Accesibilidad

1. **Contraste**: se elimina el uso de `mist-500` como color de texto. Cada
   pareja del sistema se verifica antes de adoptarse, incluidas las que vengan
   del dataset.
2. **Los 28 nodos indeterminados**: el texto del hero deja de superponerse a la
   figura. Con la retícula de 12 columnas, la figura ocupa columnas propias en
   lugar de estar detrás del texto. Elimina la causa en vez de medir el síntoma.
3. **Regiones**: cada `<section>` recibe `aria-labelledby` apuntando a su propio
   encabezado.
4. **Jerarquía**: el rótulo de grupo de expositores pasa a `h3` y los nombres a
   `h4`.
5. **Movimiento reducido**: al no quedar animación en JavaScript, la regla CSS
   global vuelve a ser suficiente.

### RNF-6 · Verificación

Un comando del proyecto, `npm run verify`, que sobre el build:

1. Ejecuta axe-core en ambos idiomas y en dos anchos, **anulando las
   transiciones** antes de medir (ver la nota metodológica de la línea base).
2. Comprueba los presupuestos de peso comprimido.
3. Termina con código distinto de cero al incumplirse cualquiera, de modo que
   sirva en integración continua.
4. Escribe `verification.md` con fecha, commit y números medidos.

## 5. Riesgos

| Riesgo | Mitigación |
| ------ | ---------- |
| El cambio a fondo claro no convence una vez visto | Se implementa el sistema con tokens: invertir el tema es cambiar valores, no componentes |
| Falta la traducción al inglés de los textos largos | La estructura bilingüe queda lista y el inglés puede completarse después (A7) |
| Reimplementar el haz en SVG puede quedar peor que el original | Se compara contra el actual antes de eliminar React; si no alcanza calidad, se replantea con el presupuesto sobre la mesa |
| Atkinson Hyperlegible y Crimson Pro no combinan bien en la práctica | Se verifica con el sitio real antes de descartar la alternativa «Academic/Archival» (EB Garamond + Crimson Text) |
