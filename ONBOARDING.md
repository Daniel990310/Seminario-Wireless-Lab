# Empezar a trabajar en este repositorio

Para quien se incorpora a hacer **ajustes visuales y de texto** mientras Daniel lleva los
temas de fondo (formulario de inscripción, envío de correo, infraestructura).

Este archivo es solo el camino de entrada. **Las reglas no están aquí**: están en
[`AGENTS.md`](AGENTS.md), y si algo de aquí lo contradice, gana `AGENTS.md`.

---

## 1. Qué leer, en este orden

| # | Documento | Qué sacas |
| - | --------- | --------- |
| 1 | [`ESTADO.md`](ESTADO.md) → **solo el bloque «EMPIEZA AQUÍ»** | Qué está a medias y qué no se toca. El resto del archivo es historia: no lo leas entero |
| 2 | [`AGENTS.md`](AGENTS.md) → **completo** | Las reglas. Es largo y vale la hora que cuesta |
| 3 | [`specs/README.md`](specs/README.md) | Cómo funciona el flujo dirigido por especificación |
| 4 | [`specs/habilidades.md`](specs/habilidades.md) | Qué skills usar y cuáles **no** |

Los skills ya están en el repositorio, en `.claude/skills/`. No instales nada.

## 2. Montar el entorno

```bash
gh auth login                      # con tu cuenta; Daniel te invita como colaborador
git clone https://github.com/Daniel990310/Seminario-Wireless-Lab.git
cd Seminario-Wireless-Lab
npm install
npm run build
npm run verify:todo                # tiene que terminar en verde ANTES de tocar nada
```

Si `verify:todo` falla en un clon recién hecho, **no empieces**: avisa. Significa que el
tronco está roto y cualquier cosa que hagas encima hereda el problema.

## 3. Tu rama

```bash
git fetch origin
git switch -c ajustes/<asunto-corto> origin/main
```

Una rama por asunto. Nunca trabajes sobre `main`. El reparto de archivos —quién toca qué
y dónde os pisaríais— está en `AGENTS.md`, sección «Dos personas a la vez».

## 4. La herramienta para ajustar sin adivinar

```bash
npm run dev      # luego abre http://localhost:4321/ajustar
```

Muestra la página **real** con perillas: encuadre y zoom de la fotografía de la banda,
velo, degradado, fondos de sección, encuadre de los retratos y edición de textos en
sitio. No escribe en el repositorio: el borrador vive en el navegador y el botón
**Copiar informe** emite los valores exactos con el archivo donde va cada uno.

Úsalo para **decidir** el número, y luego escribe ese número en el código. Es la
diferencia entre «muévelo un poco más abajo» y `encuadre="50% 62%"`.

La ruta solo existe en `npm run dev`; no se construye ni se publica. El detalle, en
`AGENTS.md` → «El panel de ajuste visual».

## 5. Antes de pedir que se fusione

```bash
npm run check          # tipos
npm run build
npm run verify:todo    # la autoridad
```

Abre un **pull request** contra `main` y pega en la descripción el resultado de
`verify:todo`. Sin ese número, la afirmación de que no rompiste nada no está respaldada.

Revisa además **a ojo, en los dos temas y a 390 px de ancho**. Un verificador en verde no
es una página revisada; en `AGENTS.md` está el caso que costó aprenderlo.

## 6. Lo que no se hace

- **No despliegas.** `npx wrangler deploy` toca el sitio en vivo sin revisión. Eso es de
  Daniel. Tu trabajo llega a producción cuando tu rama se fusiona.
- **No empujas a `main`** ni reescribes historia ya publicada (`push --force`, rebase de
  commits empujados).
- **No implementas lo que no está en `specs/`.** Si tu ajuste crea una capacidad nueva,
  primero se escribe el requisito.
- **No tocas** `astro.config.mjs`, `wrangler.jsonc`, DNS ni nada de Cloudflare.
- **No generas ni aproximas logos institucionales con ninguna herramienta.** Esa regla
  tiene tres partes y una historia en `AGENTS.md`; léela antes de tocar `public/logos/`.
- **No escribes una cifra sin su marca de procedencia** (`[medido]`, `[verificado]`,
  `[supuesto]`).

## 7. Si trabajas con Claude Code

Al abrir el proyecto, Claude lee `CLAUDE.md`, que apunta a `AGENTS.md`. Pídele
explícitamente que lea `AGENTS.md` entero y el bloque «EMPIEZA AQUÍ» de `ESTADO.md` antes
de proponer cambios: sin eso propondrá cosas razonables que aquí ya se descartaron con
motivo, y están documentadas en «Ya evaluado y descartado».
