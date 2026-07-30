# Habilidades y fuentes

Qué skills usar en este proyecto, cuándo y **con qué precauciones**. La última
columna es la que importa: una habilidad aplicada fuera de su alcance produce
trabajo que hay que deshacer.

Ver también [`fuentes.md`](fuentes.md) para la procedencia de las cifras y
[`../AGENTS.md`](../AGENTS.md) para las reglas de trabajo.

## 1. Skills instalados en el repositorio

El paquete completo de
[`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
está instalado en `.claude/skills/` (8,4 MB, licencia MIT). El commit de origen y
la fecha quedan en `.claude/skills/PROCEDENCIA.txt`.

Son **siete** skills, y no todos aplican a este proyecto. La tabla dice cuáles sí:

| Skill | ¿Aplica aquí? | Por qué |
| ----- | ------------- | ------- |
| `ui-ux-pro-max` | **Sí, es el central** | Decisiones de color, tipografía, composición y UX |
| `design-system` | **Sí** | Tokens en tres capas: base de RF-4 (T2) |
| `banner-design` | **Sí, para T8** | El `og:image` de 1200×630 es exactamente esto |
| `ui-styling` | **Sí, completo** (D6) | shadcn/ui sobre Radix, Tailwind, modo oscuro y patrones accesibles |
| `brand` | No | La identidad visual ya está decidida (D4) y la institucional pertenece a la PUCV y ANID |
| `design` | No | Ver la advertencia sobre generación de logos |
| `slides` | No | Es para presentaciones, no para el sitio |

### Advertencias

**Corregido el 30 de julio.** Este skill recomienda shadcn/ui sobre Radix, y
durante un tiempo esta sección decía que estaba descartado «por aritmética». Era
un argumento defectuoso: el presupuesto de 40 kB que lo hacía imposible **lo
propuse yo, no el cliente**. Con D6 el cliente pide un sitio interactivo y el
skill **aplica completo**. Trae además `scripts/shadcn_add.py`, útil para agregar
componentes.

Lo que aporta aparte de eso: `ui-styling/canvas-fonts/` trae 54
tipografías `.ttf` bajo licencia SIL Open Font, con sus archivos de licencia
incluidos, **entre ellas Crimson Pro**. Sirven para generar el `og:image` de T8,
donde hacen falta archivos de tipografía reales para renderizar en canvas. Es la
razón por la que se conservan esos 5,5 MB en lugar de recortarlos.

**`design` y `banner-design` pueden generar logos.** Aquí eso sería un error: los
logos de PUCV, ANID, Columbia University, Nokia Bell Labs, PUC y USACH son marcas
institucionales de terceros. **No se generan ni se aproximan: se solicitan a las
respectivas direcciones de comunicaciones.** Los archivos de `public/logos/` son
marcadores de posición deliberados, no algo a completar con una imagen inventada.
Ver `public/logos/README.md`.

### `ui-ux-pro-max`

Base consultable de decisiones de diseño. Contenido real, contado sobre los CSV
`[medido]`: 192 paletas, 84 estilos, 74 pares tipográficos, 192 tipos de producto,
99 guías de UX y 53 reglas específicas de Astro.

**Usar cuando:** se elija color, tipografía, espaciado o composición; se revise
una pantalla; o se decida un patrón de interacción.

```bash
S=.claude/skills/ui-ux-pro-max/scripts/search.py

# Decisiones de diseño
python3 $S "<consulta>" --domain {style|color|typography|product|ux|landing|charts|icons|gsap}

# Reglas específicas de Astro
python3 $S "<consulta>" --stack astro
```

> **`--domain` y `--stack` no se combinan.** Al pasar los dos, `--stack` gana y la
> búsqueda va contra `stacks/astro.csv`, devolviendo 0 resultados con una consulta
> de diseño. Verificado: `--domain product --stack astro` no encuentra nada,
> mientras que `--domain product` a secas sí. Usar uno **o** el otro.

Consultas ya hechas para este proyecto, con su resultado en
[`001-mejora-calidad/design.md`](001-mejora-calidad/design.md):

| Consulta | Resultado adoptado |
| -------- | ------------------ |
| `--domain product` «conference symposium academic» | Swiss Modernism 2.0 + Minimalismo; patrón «Hero + Agenda + CFP» |
| `--domain style` «Swiss Modernism» | Retícula de 12 columnas, unidad base de 8 px, un solo acento |
| `--domain typography` «academic conference editorial serif» | Crimson Pro + Atkinson Hyperlegible |
| `--domain color` tipos de producto académicos | Navy `#1E3A5F`, acento `#A16207` |
| `--stack astro` | 53 reglas, entre ellas «Minimize client directives» (severidad alta) |

> **Precaución obligatoria.** Todo lo que sale de aquí es `[dataset]`: **la
> opinión del skill, no un hecho**. Su propia paleta académica declara
> `Muted Foreground #64748B` sobre `#E9EEF5`, que da **4,08:1** y **no cumple**
> WCAG AA. Y califica Swiss Modernism como «WCAG AAA», que es una etiqueta suya
> sin verificar.
>
> **Regla: ninguna pareja de color se adopta sin medirla.** El árbitro es
> `npm run verify`, nunca una columna de un CSV.

### `design-system`

Arquitectura de tokens en tres capas: primitivo → semántico → componente.

**Usar cuando:** se toquen tokens, se agregue un tema o se defina la escala de
espaciado o tipografía.

Es la base de RF-4: el tema cambia sustituyendo **solo** la capa semántica, y
ningún componente referencia un primitivo.

## 2. Skills de Claude que aplican

No se instalan: vienen con el entorno.

| Skill | Usar cuando | Precaución |
| ----- | ----------- | ---------- |
| `artifact-design` | Se publique una previsualización navegable para revisión con la contraparte | El sistema de diseño de este repo **manda** sobre las sugerencias del skill. Aquí solo aplica su parte de fundamentos |
| `dataviz` | Solo si aparece algún gráfico | Hoy no hay ninguno. No inventar uno para «enriquecer» la página |
| `skill-creator` | Si se decide empaquetar el verificador como skill reutilizable | No es necesario: `npm run verify` ya es un comando del proyecto (RNF-6.1) |
| `update-config` | Se configure un hook o permisos en `settings.json` | — |

## 3. Repositorios de referencia

Salvo shadcn/ui, que con D6 pasó a ser dependencia, los demás solo se consultan.

| Repositorio | Para qué sirve aquí | Qué **no** tomar |
| ----------- | ------------------- | ---------------- |
| [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui) | **Adoptado con D6.** Tokens, helper `cn` y componentes sobre Radix. Verificado línea a línea: su vocabulario coincide con el del proyecto | Instalar primitivas «por si acaso»: cada una se justifica por el componente que habilita |
| [`aniftyco/awesome-tailwindcss`](https://github.com/aniftyco/awesome-tailwindcss) | Dos ítems: [Inclusive Colors](https://www.inclusivecolors.com/) para generar paletas verificadas WCAG, y [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) si crece el texto largo | Headless UI y Catalyst: React |
| [`saadeghi/daisyui`](https://github.com/saadeghi/daisyui) | Su **patrón de temas**: bloque plano de propiedades semánticas, `color-scheme` declarado por tema, y tokens de forma además de color | La librería. 388 kB de CSS y tokens incompatibles |
| [`travisvn/awesome-claude-skills`](https://github.com/travisvn/awesome-claude-skills) | Directorio. Dio [`web-asset-generator`](https://github.com/alonw0/web-asset-generator) para el `og:image` de T8 | No es integrable como tal |
| [`Prat011/awesome-llm-skills`](https://github.com/Prat011/awesome-llm-skills) | Directorio. Dio `Webapp Testing` (Playwright, útil para RNF-6) y [`Blueprint`](https://github.com/JuliusBrussee/blueprint) para comparar contra este flujo | Ídem |
| [`tailkits/tailkits-ui`](https://github.com/tailkits/tailkits-ui) | **Nada.** Evaluado y descartado | Todo: 0 de 30 archivos con `dark:`, sin `sr-only`, `alt="Logo"` genérico, degradados sobre títulos y categorías de landing de producto |

## 4. Herramientas de verificación

| Herramienta | Versión | Rol |
| ----------- | ------- | --- |
| `axe-core` | 4.12.1 | Autoridad sobre WCAG 2.1 AA (RNF-1) |
| `playwright` | 1.62.0 | Navegador para la auditoría |
| `astro check` | — | Tipos (RNF-5.4) |
| `scripts/verify.mjs` | — | Presupuestos y semántica (RNF-6) |

Las dos primeras son `devDependencies`: no llegan al sitio publicado.

## 5. Cómo decidir si una habilidad aplica

En orden:

1. **¿Sirve a un requisito escrito?** Si no, no se usa. La utilidad en abstracto
   no basta.
2. **¿Su resultado es `[medido]` o `[dataset]`?** Si es lo segundo, se verifica
   antes de adoptarlo.
3. **¿Cuánto pesa?** Toda dependencia se mide contra RNF-2 antes de instalarse.
4. **¿Encaja en el registro del proyecto?** Es una conferencia académica: sobria,
   institucional. Un efecto que quedaría bien en una landing de producto está
   fuera de tono aquí, aunque esté impecablemente implementado.

Este último punto ya se aprendió por la vía costosa: se implementaron seis
componentes decorativos y hubo que retirarlos.

## 6. Servidor MCP de 21st.dev: funciona en el PC, bloqueado en el entorno remoto

**Estado: utilizable desde el PC de Windows, no desde el entorno remoto de Claude
Code.** `[medido]` 2026-07-30, las dos mitades.

Desde el PC, `get_usage` responde autenticado —`tier: free`, 2 recuperaciones de
código por día— y una búsqueda del catálogo devuelve resultados. Cómo aprovecharlo
está en §6bis. Lo que sigue es el bloqueo del entorno remoto, que continúa vigente.

`.mcp.json` está versionado y correcto: declara el servidor y referencia la clave
como `${API_KEY_21ST}`, sin guardar el valor. El obstáculo no es la configuración ni
la clave, es la **política de egreso del entorno**, que deniega el host:

```
$ curl -sS "$HTTPS_PROXY/__agentproxy/status"
"recentRelayFailures": [
  { "kind": "connect_rejected",
    "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
    "host": "21st.dev:443" }
]
```

Contraste, en la misma corrida: `registry.npmjs.org` responde 200 y
`api.github.com` responde 200. La denegación es específica de ese host, no una
avería general del proxy.

El manual del propio proxy (`/root/.ccr/README.md`) es explícito sobre qué hacer:

> The destination host is not allowed by your organization's egress policy for this
> session. **Do not retry or route around it** — report the blocked host.

Así que **no se busca una vía alternativa**. Para habilitarlo hay que permitir
`21st.dev` en la política de red del entorno —se elige al crearlo, y se documenta en
<https://code.claude.com/docs/en/claude-code-on-the-web>— y después reiniciar la
sesión con `API_KEY_21ST` exportada, porque la expansión de `${...}` en `.mcp.json`
lee el entorno del proceso al arrancar.

Aparte de la red, el servidor pide autorización interactiva, que no se puede
completar en una sesión no interactiva: eso se resuelve con `/mcp` en una sesión
interactiva o desde los ajustes de conectores de claude.ai.

**Ninguna tarea del plan depende de esto.** 21st.dev genera componentes de interfaz,
y eso solo aparece en T10, que además está bloqueada porque RF-6 es una propuesta del
agente y no un requisito del cliente. T4, T5 y T6 no lo necesitan.

**Nunca pegar la clave en el chat ni en un archivo del repositorio.** Va en el
entorno del proceso de Claude Code, y hay exactamente dos vías que funcionan:
variable de entorno de usuario de Windows, o el bloque `env` de
`.claude/settings.local.json` (que Claude Code inyecta antes de expandir
`.mcp.json`). Las dos están documentadas en `.env.example`.

**Un `.env` no sirve para esto.** Claude Code no carga archivos `.env`, así que la
clave puesta ahí nunca llega a `${API_KEY_21ST}`. Hasta el 2026-07-30 estos archivos
afirmaban lo contrario —`.gitignore`, `.env.example` y este párrafo— y costó tiempo
averiguarlo. `.gitignore` sigue cubriendo `.env` y `.env.*` como red de seguridad, no
como mecanismo, y también cubre `.claude/settings.local.json` porque ese sí puede
llevar la clave.

## 6bis. Cómo sacarle provecho a 21st.dev en ESTE proyecto

**La configuración ya es la correcta: no migrarla.** `.mcp.json` apunta a
`https://21st.dev/api/mcp` con cabecera `x-api-key`, que es el **21st MCP unificado**.
El paquete viejo `@21st-dev/magic` quedó como proxy de compatibilidad y ya no es el
camino recomendado. `[verificado]` en el README oficial
(<https://github.com/21st-dev/magic-mcp>). `npx @21st-dev/cli@latest init --client
claude` haría un patch del config, pero no hace falta: sobra y desversiona.

### Qué cuesta y qué no

`[verificado]` en la descripción de las propias herramientas, y `[medido]` con
`get_usage` el 2026-07-30 (`tier: free`).

| Gratis e ilimitado | Medido en el plan gratuito |
| ------------------ | -------------------------- |
| `search`, `search_picker`, `get_inspiration`, todos los `list_*` | `get_component` — **2 por día** |
| `search_logo` (SVGs de svgl.app) | `generate` — generaciones diarias |
| `get_theme` (CSS completo), `get_take` (HTML de una take) | |

Comprobar la cuota con `get_usage` **antes** de gastar. Un `get_component` agotado no
devuelve un error claro: devuelve `locked: true` o `found: false`, que es fácil
confundir con "no existe".

### La vía que no gasta cuota

Cada resultado de `search` —que es gratis— ya trae el `installCommand`:

```
npx shadcn@latest add "https://21st.dev/r/<autor>/<slug>?api_key=$API_KEY_21ST"
```

`components.json` de este repo está configurado (`new-york`, `tsx`, alias
`@/components/ui`), así que ese comando escribe el componente directo en el árbol sin
pasar por `get_component`. `[supuesto]` que el registro no consume la cuota de
recuperaciones: no se ha ejecutado todavía. Verificar con `get_usage` antes y después
la primera vez.

### El riesgo real: el catálogo es React y el presupuesto es de RNF-2

Todo el catálogo es React + Tailwind. Este repo ya tiene `@astrojs/react`,
`react` y `react-dom`, así que un componente **entra** sin cambios de stack. El
problema es el peso:

- Presupuestos vigentes en `scripts/verify.mjs`: JavaScript ≤ **115 kB** gz, primera
  carga ≤ **260 kB**, tipografías ≤ **125 kB**. `[verificado]`
- `react` + `react-dom` ya cuestan **60,0 kB** gz. `[medido]`, es la base de D6.
- Los componentes más atractivos del catálogo son interactivos (tablas TanStack,
  menús, diálogos). Interactivo significa directiva `client:*`, y eso arrastra el
  runtime al bundle. Cinco primitivas de Radix midieron **36,2 kB**. `[medido]`

O sea: el margen es de unas decenas de kB, no ilimitado. **Regla: ningún componente de
21st.dev se considera incorporado hasta que `npm run build && npm run verify` termine
en verde.** Si el presupuesto se pasa, el componente sale; el presupuesto no se sube
(cambiarlo exige cambiar `requirements.md` primero).

Lo que es de riesgo bajo o nulo:

- **`get_theme`** — devuelve CSS `:root` / `.dark` para Tailwind/shadcn. Cero JS.
- **`search_logo`** — SVG inline desde svgl.app. Cero JS, y sin límite de uso.
- Componentes **sin estado**, renderizados en el servidor sin directiva `client:*`.
  Es exactamente el patrón que ya usa `src/components/ui` con Magic UI.

### Flujo recomendado

1. `search` o `search_picker` (este último dibuja una galería para que Daniel elija;
   usarlo cuando la decisión es suya y no del agente).
2. Si nada encaja, `generate`. Devuelve una **URL para abrir en el navegador**, no
   código: hay que compartir el enlace. `mode: 'code'` da un componente React con
   sandbox; `mode: 'sketch'` da borradores HTML/Tailwind autocontenidos, más baratos de
   evaluar. `variantCount` y `directions` (nombre + rationale por variante) sirven para
   pedir alternativas de verdad distintas en una sola generación.
3. De una take de sketch, `get_take` devuelve el HTML **y** un `copyPrompt`: una
   especificación para que un agente lo reimplemente en el stack del proyecto. Para un
   sitio Astro con presupuesto de peso, ese camino es preferible a pegar React.
4. Instalar por `installCommand`, y recién entonces `npm run build && npm run verify`.

`get_inspiration` y `generate` aceptan un objeto `context` (`.21st/design.json`) que
reordena los resultados según el stack y las restricciones del proyecto. `[medido]` que
su formato **no está documentado públicamente**: la búsqueda web del 2026-07-30 no
encontró especificación, solo la mención en el esquema de las herramientas. No inventar
el archivo; si se quiere, generarlo con la CLI y verificar qué escribe.

**Nada de esto desbloquea el plan.** Sigue valiendo lo de §6: los componentes de
interfaz solo aparecen en T10, y T10 está detenida porque RF-6 es propuesta del agente,
no requisito del cliente.
