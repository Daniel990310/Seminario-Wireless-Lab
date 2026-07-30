# Especificaciones

Este proyecto se desarrolla con **spec-driven development**: antes de escribir
código se acuerda qué debe cumplirse y cómo se verificará. El objetivo no es
burocracia: es que «mejorar la calidad» deje de ser una opinión y pase a ser una
condición medible.

## Índice

| Documento | Contenido |
| --------- | --------- |
| [`001-mejora-calidad/requirements.md`](001-mejora-calidad/requirements.md) | Qué debe cumplirse, con criterios verificables |
| [`001-mejora-calidad/design.md`](001-mejora-calidad/design.md) | Cómo se construye y por qué, frente a alternativas |
| [`001-mejora-calidad/tasks.md`](001-mejora-calidad/tasks.md) | Orden de ejecución y comprobación de cada tarea |
| [`baseline/auditoria-2026-07-29.md`](baseline/auditoria-2026-07-29.md) | Medición previa: la referencia contra la que se compara |
| [`fuentes.md`](fuentes.md) | **Registro de procedencia**: de dónde sale cada cifra |
| [`habilidades.md`](habilidades.md) | Qué skills usar, cuándo y con qué precauciones |
| [`001-mejora-calidad/verification.md`](001-mejora-calidad/verification.md) | Última medición. **Generado por `npm run verify`, no editar** |
| [`../AGENTS.md`](../AGENTS.md) | Reglas de trabajo para agentes y personas |

## Regla de procedencia

En un flujo asistido por IA el riesgo principal no es equivocarse: es que **una
cifra sin fuente se propague por los documentos y termine tratada como hecho**.
Para evitarlo, toda afirmación con dato lleva una marca de procedencia:

| Marca | Significa | Cómo se trata |
| ----- | --------- | ------------- |
| `[medido]` | Se obtuvo ejecutando algo en este proyecto | Reproducible: el comando está en [`fuentes.md`](fuentes.md) |
| `[dataset]` | Lo afirma el skill `ui-ux-pro-max` | **Es la opinión del dataset, no un hecho.** Se verifica antes de adoptarse |
| `[verificado]` | Hecho externo confirmado con fuente citada | Fuente y fecha en [`fuentes.md`](fuentes.md) |
| `[supuesto]` | Todavía no comprobado | **No puede sustentar una decisión cerrada.** Lleva tarea que lo resuelva |

Ejemplo de por qué importa: el dataset propone una paleta académica cuyo
`Muted Foreground` da **4,08:1 `[medido]`** y por lo tanto no cumple WCAG AA,
aunque el dataset la presente como válida. Si se hubiera copiado por venir de una
fuente con autoridad aparente, se habría introducido el mismo defecto que la
auditoría encontró en el tema oscuro.

## Reglas de trabajo

1. **No se implementa lo que no está en los requisitos.** Si aparece algo nuevo
   a mitad de camino, primero se agrega al documento.
2. **Un requisito sin criterio verificable no es un requisito**, es un deseo.
   «Que se vea profesional» no sirve; «contraste mínimo 4,5:1 medido con
   axe-core» sí.
3. **La línea base se mide antes de tocar código.** Sin medición previa no se
   puede afirmar que algo mejoró.
4. **Las decisiones abiertas se declaran**, distinguiendo las que bloquean el
   avance de las que no.
5. **Los errores se corrigen dejando registro**, no reescribiendo el veredicto.
   El criterio con que se falló importa tanto como la conclusión corregida.

## Nomenclatura

| Prefijo | Significa | Ejemplo |
| ------- | --------- | ------- |
| `D` | Decisión cerrada | D5: dos temas con selector |
| `RF` | Requisito funcional | RF-1: sitio bilingüe |
| `RNF` | Requisito no funcional | RNF-2: rendimiento |
| `A` | Decisión abierta | A3: afiliación por confirmar |
| `T` | Tarea | T1: comando de verificación |

Las referencias usan punto para el criterio: **RNF-2.1** es el primer criterio de
aceptación de RNF-2.

## Cómo verificar el estado

```bash
npm run build        # el sitio debe compilar
npm run check        # tipos, sin errores ni advertencias
npm run verify       # accesibilidad y presupuestos de peso
npm run verify:tema  # los criterios de RF-4 que axe no puede evaluar
```

`npm run verify` es la autoridad sobre el cumplimiento (implementado en T1).
Requiere un `build` previo y termina con código distinto de cero si algo incumple.

`npm run verify:tema` lo complementa en lo que axe no alcanza: destello al cargar,
comportamiento sin JavaScript, teclado, persistencia sin cookies y sincronía entre
las dos instancias del selector. También requiere un `build` previo.

## Estado

| Especificación | Estado |
| -------------- | ------ |
| [001 — Mejora de calidad](001-mejora-calidad/) | En implementación. T1 y T2 completadas y verificadas. Sin decisiones bloqueantes. |

Al cerrar T2, `npm run verify` da **0 hallazgos de contraste** en las cuatro
corridas (línea base: 16 en escritorio). Quedan abiertos dos incumplimientos, y
ambos tienen tarea asignada: los nodos con contraste indeterminado (RNF-1.3 → T5)
y las secciones sin nombre accesible (RNF-1.4 → T6).
