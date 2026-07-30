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
| `ui-styling` | **Solo en parte** | Ver la advertencia abajo |
| `brand` | No | La identidad visual ya está decidida (D4) y la institucional pertenece a la PUCV y ANID |
| `design` | No | Ver la advertencia sobre generación de logos |
| `slides` | No | Es para presentaciones, no para el sitio |

### Advertencia: dos skills empujan hacia lo ya descartado

**`ui-styling` recomienda shadcn/ui sobre Radix.** Su descripción lo dice
explícitamente. En este proyecto **eso está descartado** por aritmética: React
cuesta 109 kB y el presupuesto es 40 kB (ver `design.md` §1). De este skill sirve
su parte de Tailwind, modo oscuro y patrones accesibles; **no** su recomendación
de componentes.

Lo que sí aporta de forma concreta: `ui-styling/canvas-fonts/` trae 54
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

## 3. Repositorios usados como fuente, no como dependencia

Ninguno se instala. Se consultan.

| Repositorio | Para qué sirve aquí | Qué **no** tomar |
| ----------- | ------------------- | ---------------- |
| [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui) | Referencia del vocabulario de tokens (`--background`, `--foreground`, `--muted-foreground`, `--border`, `--ring`), `.dark` por clase, `oklch()`. Verificado línea a línea: coincide con el de este proyecto | Sus componentes. Exigen React y Radix, incompatibles con el presupuesto de 40 kB |
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
