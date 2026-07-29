# Especificaciones

Este proyecto se desarrolla con **spec-driven development**: antes de escribir
código se acuerda qué debe cumplirse y cómo se va a verificar. El objetivo no es
burocracia, es que «mejorar la calidad» deje de ser una opinión y pase a ser una
condición medible.

## El flujo

Cada cambio significativo pasa por cuatro documentos, en orden:

| Documento         | Responde                                  | Regla                                                                 |
| ----------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `requirements.md` | Qué debe cumplirse y por qué              | Todo requisito lleva un criterio de aceptación **verificable**         |
| `design.md`       | Cómo se va a construir                    | Cada decisión técnica se justifica frente a al menos una alternativa   |
| `tasks.md`        | En qué orden y con qué se comprueba       | Cada tarea apunta a los requisitos que satisface                       |
| `verification.md` | Qué se midió y con qué resultado          | Números medidos, no estimaciones                                       |

Reglas de trabajo:

1. **No se implementa lo que no está en los requisitos.** Si aparece algo nuevo
   a mitad de camino, primero se agrega al documento.
2. **Un requisito sin criterio verificable no es un requisito**, es un deseo.
   «Que se vea profesional» no sirve; «contraste mínimo 4,5:1 medido con
   axe-core» sí.
3. **La línea base se mide antes de tocar código.** Sin medición previa no se
   puede afirmar que algo mejoró.
4. **Las decisiones abiertas se declaran.** Se distingue entre las que bloquean
   el avance y las que no.

## Estado

| Especificación                                       | Estado                                    |
| ---------------------------------------------------- | ----------------------------------------- |
| [001 — Mejora de calidad](001-mejora-calidad/) | Requisitos, diseño y tareas escritos. Implementación pendiente, sin bloqueos |

## Línea base

La medición del sitio antes de esta etapa está en
[`baseline/auditoria-2026-07-29.md`](baseline/auditoria-2026-07-29.md). Es la
referencia contra la que se comparan las mejoras.
