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

**Ninguna tarea del plan queda bloqueada por esto**, ni siquiera ahora que 21st.dev
aparece en T4b y T10: T4, T5 y T6 no lo necesitan, y T4b se puede resolver sin el
catálogo. Desde el 2026-07-30 el servidor **funciona desde el PC de Daniel**, así que
lo de arriba solo aplica al entorno remoto.

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

### Qué cambió con la enmienda del 2026-07-30

Todo el catálogo es React + Tailwind. Este repo ya tiene `@astrojs/react`,
`react` y `react-dom`, así que un componente **entra** sin cambios de stack.

Antes de la enmienda, el peso era la objeción principal: `react` + `react-dom` cuestan
**60,0 kB** gz `[medido]`, y cinco primitivas de Radix **36,2 kB** `[medido]`. Con los
techos de RNF-2.1/2.2/2.6 relajados a tripwire informativo, **el peso ya no es motivo
para descartar un componente**. Se mide y se reporta, pero no bloquea.

**El filtro que sigue vigente es el de registro visual (§5):** es una conferencia
académica de propagación inalámbrica, no una landing de producto. Un componente con
gradientes neón, partículas o glassmorphism no encaja, por más que quepa en el
presupuesto. Esto ya se aprendió por la vía costosa: se implementaron seis componentes
decorativos y hubo que retirarlos. `search` devuelve mucho de eso; la evaluación del
punto 2 del flujo es la que filtra.

**Regla:** ningún componente de 21st.dev se considera incorporado hasta que
`npm run build && npm run verify` termine con **0 hallazgos de axe**. Accesibilidad
(RNF-1) sigue siendo bloqueante sin cambio alguno.

Lo que es de riesgo bajo o nulo:

- **`get_theme`** — devuelve CSS `:root` / `.dark` para Tailwind/shadcn. Cero JS.
- **`search_logo`** — SVG inline desde svgl.app. Cero JS, y sin límite de uso.
  **Solo para logos de tecnologías** (WiFi, 5G, mmWave, etc.), **nunca para logos
  institucionales** (PUCV, ANID, Columbia, etc.), que siguen siendo marcadores de
  posición hasta que las instituciones entreguen los oficiales.
- Componentes **sin estado**, renderizados en el servidor sin directiva `client:*`.
  Es exactamente el patrón que ya usa `src/components/ui`.

### Flujo de integración en el SDD (6 fases)

Cada componente del catálogo pasa por el mismo flujo que cualquier otra dependencia.
El orden importa: explorar es gratis, gastar cuota es caro.

La fase 0 se añadió el 2026-07-30 después de perder tiempo real por saltársela.

#### 0. CONSULTAR LA FUENTE (antes de escribir una sola línea)

Antes de programar contra la API de cualquier librería —Astro, Tailwind, axe-core,
shadcn—, mirar la documentación **de la versión instalada**, no la de la memoria.
El orden de preferencia está en §7 y no es negociable: `node_modules` primero,
Context7 después, la web al final.

Ejemplo de por qué: RNF-2.1 informó «0,0 kB de JavaScript» durante semanas en una
página que sí ejecuta JavaScript. La causa era un cambio de comportamiento de Astro
v5 —cada `<script>` se renderiza tal como se declara, sin agruparlo ni sacarlo a un
archivo— que una consulta a la documentación habría revelado en un minuto.

#### 1. EXPLORAR (gratis, ilimitado)

Usar `search`, `search_picker` y `get_inspiration` para descubrir candidatos. Usar
`search_logo` para SVGs de tecnologías. Usar `get_theme` para explorar paletas.
**No gastar cuota aquí.**

`search_picker` dibuja una galería visual: usarlo cuando la decisión es de Daniel y
no del agente.

#### 2. EVALUAR (el filtro SDD)

Para cada candidato, responder estas cuatro preguntas en orden:

1. **¿A qué requisito de `requirements.md` sirve?** Si no sirve a ninguno, no se usa.
2. **¿Encaja en el registro visual?** Conferencia académica, sobria, institucional.
   Si el componente quedaría mejor en una landing de SaaS, descartarlo con motivo.
3. **¿Es interactivo o estático?** Si es estático (sin `client:*`), no agrega JS.
   Si es interactivo, anotar qué primitiva de Radix arrastra.
4. **¿Pasa accesibilidad?** Solo sabremos al verificar, pero componentes sin
   `aria-*` adecuados o sin soporte de teclado son candidatos a fallar.

#### 3. PROTOTIPAR

**Antes de elegir camino: reducir el encargo a una sola pieza.** El servidor rinde
con un componente acotado y falla con composiciones de página. Si lo que se quiere
es una sección entera, descomponerla y pedir la pieza más pequeña que resuelva el
problema. Ver «Cómo se pide bien» más abajo, con el caso en que se incumplió.

Dos caminos según el caso:

- **Componente estático (sin JS):** Usar `generate` con `mode: 'sketch'` →
  `get_take` para obtener HTML/Tailwind + `copyPrompt`. El `copyPrompt` es una
  especificación para reimplementar en el stack del proyecto: para un sitio Astro,
  ese camino es preferible a pegar React. `variantCount` (1–3) y `directions`
  (nombre + rationale por variante) permiten pedir alternativas distintas en una
  sola generación.
- **Componente interactivo:** Usar el `installCommand` que trae `search` para
  instalar vía shadcn CLI, o `get_component` si se necesita inspeccionar el código
  antes (gasta cuota: 2/día).

`generate` con `mode: 'code'` da un componente React con sandbox — compartir el
enlace cuando la decisión sea de Daniel.

#### 4. IMPLEMENTAR

- Si el componente es React interactivo: hidratarlo con `client:visible`
  (regla «Minimize client directives», severidad alta del skill de Astro).
- Todo texto sale de `src/data/`, nunca del componente (RNF-5).
- Tokens semánticos solamente, nunca primitivos (RF-4.7).
- Comentario en español explicando por qué se eligió este componente y no otro.

#### 5. VERIFICAR

- `npm run build && npm run verify`
- Reportar las mediciones de peso en el commit (son informativas desde la enmienda).
- **Accesibilidad: 0 hallazgos de axe, bloqueante.** Si falla, corregir o retirar.
- **Revisión visual con capturas, no de memoria.** «Revisar en ambos temas» no es
  mirar el código y suponer. Levantar `dist/` con Playwright, forzar
  `.reveal { opacity: 1 !important }`, capturar los dos temas × los dos anchos y
  **mirar las imágenes**. En esta sesión eso detectó tres cosas que la lectura del
  código no daba: un bloque centrado que rompía el eje de la página, un filete que
  no separaba nada y una retícula de fondo que competía con la del propio radar.
  Hay guiones reutilizables en el registro de la sesión; son ~40 líneas.

#### 6. DIAGNOSTICAR CUANDO FALLA (medir, no teorizar)

Si un verificador falla y la causa no es obvia, **prohibido arreglar a ciegas**. El
orden que funcionó:

1. Volcar el detalle crudo que da la herramienta, no solo el recuento. En axe eso
   es `messageKey` y `data` por nodo, no el total.
2. Leer la fuente de la herramienta instalada para saber qué significa ese código.
3. Interrogar a la herramienta en el navegador con sus propias funciones internas.
4. Formular una hipótesis y **descartarla midiendo**, no razonando.

En la cola final de T5 se descartaron así tres hipótesis plausibles y falsas, cada
una con un experimento de un minuto. Cada intento de arreglar sin medir costó un
ciclo completo de build y verificación.

### Contexto para generaciones: `.21st/design.json`

`get_inspiration` y `generate` aceptan un objeto `context` que reordena los
resultados según el stack y las restricciones del proyecto. `[verificado]` el formato
en la investigación del 2026-07-30 — se documenta a continuación para que cualquier
entorno lo use sin inventarlo:

```json
{
  "version": "1.0",
  "name": "Seminario Wireless Lab",
  "tokens": {
    "colors": {
      "primary": "#1E3A5F",
      "secondary": "#475569",
      "background": "#F8FAFC",
      "surface": "#EFF3F8",
      "accent": "#A16207"
    },
    "typography": {
      "fontFamily": "Atkinson Hyperlegible Next, sans-serif",
      "headingFont": "Crimson Pro, serif"
    },
    "border": {
      "radius": "2px"
    }
  },
  "rules": {
    "iconLibrary": "lucide-react",
    "allowInlineStyles": false
  }
}
```

Este archivo vive en `.21st/design.json` en la raíz del repositorio y **está
versionado**: no lleva secretos y es útil que viaje al clon de cada entorno para que
las generaciones respeten la identidad visual del proyecto sin recrearlo.
Crearlo solo si se va a usar `generate`; para `search` no hace falta.

### Uso desde Antigravity u otro agente sin MCP nativo

Si el entorno no soporta MCP directamente, el `installCommand` de shadcn funciona
como comando de terminal sin MCP:

```powershell
$env:API_KEY_21ST = "la-clave-rotada"
npx shadcn@latest add "https://21st.dev/r/<autor>/<slug>?api_key=$env:API_KEY_21ST"
```

Y `search` se puede sustituir por navegar directamente el catálogo en
<https://21st.dev> desde el navegador.

### Qué desbloquea y qué no

Con la enmienda de peso, la objeción principal contra los componentes React del
catálogo desaparece. **T10 ya no está bloqueada:** Daniel confirmó RF-6 el
2026-07-30, que era lo único que faltaba. Queda registrado en `ESTADO.md` §4.

Usar 21st.dev para **componentes estáticos** (sin JS) en cualquier tarea que toque
la composición visual del sitio (T4b, T5, T7, T8) sigue siendo la vía preferente,
siempre que pasen el filtro de §5 y sirvan a un requisito escrito.

### Lo que la cuota deja hacer de verdad `[medido]` el 2026-07-30

- **`generate` devolvió `{"locked": true, "reason": "generation_limit_reached"}`**
  en el primer intento del día, con `mode: 'sketch'` y 3 variantes. El plan
  gratuito trae generaciones diarias y `get_usage` **no las expone**: solo informa
  las recuperaciones de código. No hay forma de comprobar la cuota antes de
  gastarla; hay que intentar y leer la respuesta.
- `get_usage` sí informó `tier: free`, `freeRetrievalsPerDay: 2`. Las búsquedas no
  tienen límite diario (`freeSearchesPerDay: null`).
- **`get_inspiration` devolvió `contextApplied: false`** aun pasándole el objeto de
  `.21st/design.json`. El reordenamiento por contexto de proyecto no se aplicó, así
  que los resultados vienen del ranking genérico.
- Consecuencia práctica: para el registro visual de este proyecto el catálogo rinde
  poco. Una búsqueda de hero editorial para conferencia académica devolvió
  mayoritariamente retículas de puntos con WebGL, degradados y heros de lista de
  espera. **El filtro de §5 descarta casi todo lo que devuelve `search`.** Conviene
  contar con eso antes de planificar una tarea que dependa del catálogo.

### Cómo se pide bien, según la propia documentación del servidor

`[verificado]` en el repositorio oficial `21st-dev/magic-mcp` y en las guías de uso
con Claude Code, contrastado el 2026-07-30.

- **Un componente acotado por llamada.** La herramienta rinde con **una** pieza
  delimitada y se atraganta con páginas enteras de varios componentes. La
  descomposición la hace quien pide, no el servidor.

  Esto explica un error propio del 2026-07-30: se le pidió a `generate` un hero
  completo —retícula de 12 columnas, titular, bloque de datos, figura técnica
  lateral y tres direcciones de diseño— en una sola llamada. Aunque la cuota no
  hubiera estado agotada, ese encargo estaba fuera de lo que la herramienta hace
  bien. Lo correcto habría sido pedir **el bloque de datos de fecha y sede**, y
  nada más.

- **Clave nueva, no reutilizada.** La documentación pide expresamente generar una
  clave nueva de 21st.dev y no reaprovechar las anteriores a la migración de Magic.
  Refuerza el pendiente de rotación que sigue abierto (`ESTADO.md` §6b).

- **Lo que se envía sale del equipo.** El prompt y el contexto que se le pasa
  —incluido `.21st/design.json`— viajan a la API de 21st.dev. Para este proyecto no
  es un problema: es un sitio público de un seminario y los tokens de diseño ya
  están versionados. Queda anotado porque la regla no es «no importa», sino «aquí
  no importa».

- **Los metadatos se cachean, no se vuelven a pedir.** Los identificadores y
  comandos de instalación que devuelve `search` se anotan en el SDD en lugar de
  repetir la búsqueda en cada sesión.

## 7. Context7: la documentación de la versión que corre

Servidor MCP conectado por la cuenta de claude.ai. Dos herramientas:
`resolve-library-id` (nombre → identificador) y `query-docs` (identificador +
pregunta → fragmentos de documentación con ejemplos).

### La regla que ordena las tres fuentes

Cuando hace falta saber cómo se comporta una librería, **el orden no es indistinto**:

| Orden | Fuente | Cuándo | Por qué |
| ----- | ------ | ------ | ------- |
| 1.º | **`node_modules`** | La librería está instalada y la pregunta es sobre su comportamiento real | Es el código **exacto** que corre. No hay desfase de versión posible |
| 2.º | **Context7** | Comportamiento del framework, configuración, migraciones, API pública | Documentación al día, con versión. Evita responder de memoria |
| 3.º | **Búsqueda web** | Nada de lo anterior alcanza, o hace falta contexto de producto (precios, cuotas, estado del servicio) | Es la menos precisa y la que más ruido trae |

Esta jerarquía no es teórica. El 2026-07-30, para averiguar por qué axe marcaba
nodos como indeterminados:

- La búsqueda web y el `raw.githubusercontent` de la rama `develop` **dieron una
  respuesta incompleta**: el archivo de `develop` ni siquiera contenía el código
  que emite `bgOverlap`.
- `node_modules/axe-core/axe.js` —la versión 4.12.1, la que corre el verificador—
  lo tenía en la línea 24432, con el mecanismo entero alrededor.

**Si la librería está en `node_modules`, empezar por ahí.** Context7 es para lo que
no se puede leer localmente: decisiones de diseño del framework, cambios entre
versiones mayores, configuración recomendada.

### Cómo consultarlo bien `[verificado]` en la guía oficial

- **Pasar el identificador directo cuando ya se conoce** (`/org/proyecto`): ahorra
  el paso de resolución.
- **Un concepto por consulta.** Preguntas que mezclan temas devuelven fragmentos
  peores. Si la duda abarca dos cosas, son dos llamadas, salvo que la pregunta sea
  precisamente cómo interactúan.
- **Mencionar la versión en la pregunta** si importa: la selecciona sola.
- **Máximo 3 llamadas por pregunta.** Si a la tercera no aparece, cambiar de fuente.
- Preguntar por casos de uso concretos —configuración, llamada de API, paso de
  instalación—, no por conceptos sueltos («auth», «hooks»).

### Identificadores ya resueltos para este proyecto

Anotados para no volver a gastar una llamada en resolverlos:

| Librería | Identificador | Reputación / calidad |
| -------- | ------------- | -------------------- |
| Astro | `/withastro/docs` | Alta · 84,8 · 6.587 fragmentos |
| Astro (alternativa) | `/websites/astro_build_en` | Alta · 78,9 |

Consulta ya hecha y aprovechable: **Astro v5 renderiza cada `<script>` tal como se
declara**, sin agruparlo ni moverlo al `<head>`; `build.inlineStylesheets: 'never'`
controla el CSS, no los scripts; `vite.build.assetsInlineLimit` controla activos.
De ahí salió la corrección de RNF-2.1.

### Cuándo NO usarlo

No es para refactorizar, escribir guiones desde cero, depurar la lógica del
proyecto ni resolver conceptos generales de programación. Para eso no aporta y solo
gasta contexto.

## 8. Qué herramienta aplica a cada tarea que queda

Decidido con el filtro de §5 y con lo medido el 2026-07-30. Sirve para no volver a
plantear una tarea contando con una herramienta que no la va a resolver.

| Tarea | Herramienta que sí aporta | Qué no usar, y por qué |
| ----- | ------------------------- | ---------------------- |
| **T6** · Foco, teclado y zoom al 200 % | `verify:tema` y recorrido manual con Playwright. Context7 si hay dudas sobre el foco en componentes de shadcn | 21st.dev: no hay componente que resuelva un recorrido de foco |
| **T7** · Sitio bilingüe | **Context7 sobre `/withastro/docs`**: el enrutado i18n de Astro es configuración de framework, justo lo que Context7 resuelve bien. Consultar **antes** de diseñar la estructura de rutas | 21st.dev: un selector de idioma son 10 líneas; traer React para eso no se sostiene |
| **T8** · `og:image` por idioma | Context7 para la generación de imágenes en tiempo de compilación con Astro | 21st.dev: no aplica |
| **T9** · Verificación final | `npm run verify:todo` más la revisión visual con capturas de la fase 5 | — |
| **T10** · Componentes interactivos (RF-6) | **21st.dev es aquí donde de verdad rinde**: es su único caso natural en el plan. Explorar con `search` (gratis) y pedir **una pieza acotada por llamada**, nunca una sección entera. Gastar `get_component` solo tras pasar el filtro de §5. Context7 sobre shadcn/Radix para el comportamiento accesible | `generate`: cuota agotable sin previo aviso; no planificar contando con él |

**Regla general que se desprende:** 21st.dev sirve cuando el problema es *«qué
componente interactivo pongo aquí»*. Context7 sirve cuando el problema es *«cómo se
comporta esta herramienta»*. Casi todas las tareas que quedan son del segundo tipo.
