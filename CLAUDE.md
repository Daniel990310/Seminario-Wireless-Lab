# CLAUDE.md

Las instrucciones de este proyecto viven en **[`AGENTS.md`](AGENTS.md)**, para que
sirvan a cualquier herramienta y no solo a Claude Code.

**Leer `AGENTS.md` antes de tocar el repositorio.**

¿Primera vez aquí? Empezar por **[`ONBOARDING.md`](ONBOARDING.md)**: dice qué leer, en
qué orden, cómo montar el entorno y qué no hacer. No repite las reglas, las ubica.

Resumen de lo esencial:

- El proyecto se desarrolla con spec-driven development. Todo está en [`specs/`](specs/).
- No se implementa lo que no está en `requirements.md`.
- `npm run verify` es la autoridad sobre accesibilidad y peso. Sin él en verde,
  ninguna afirmación de mejora está respaldada.
- Toda cifra lleva marca de procedencia: `[medido]`, `[dataset]`, `[verificado]`
  o `[supuesto]`.
- Qué skills usar y con qué precauciones: [`specs/habilidades.md`](specs/habilidades.md).
- Dos personas trabajan en paralelo desde el 2026-09-22. Reparto de archivos, ramas y
  quién despliega: `AGENTS.md` → «Dos personas a la vez». **Nadie despliega salvo
  Daniel.**
