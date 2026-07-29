# 001 — Diseño

Resuelve la decisión bloqueante A1. Cada opción técnica se justifica frente a una
alternativa, según la regla del flujo.

**Requisitos:** [`requirements.md`](requirements.md)
**Línea base:** [`../baseline/auditoria-2026-07-29.md`](../baseline/auditoria-2026-07-29.md)

## 1. Evaluación de los repositorios propuestos

Los siete se revisaron sobre el código, no sobre su descripción. El criterio es
uno solo: **si sirve a un requisito**. Varios son excelentes en abstracto y no
aplican a este proyecto.

| Repositorio | Veredicto | Razón |
| ----------- | --------- | ----- |
| `nextlevelbuilder/ui-ux-pro-max-skill` | **Adoptar** | Aporta datos verificables para requisitos concretos. Instalado. |
| `tailkits/tailkits-ui` | **Referencia** | Tailwind puro sin dependencias: compatible con el presupuesto de peso. |
| `shadcn-ui/ui` | **Referencia, no dependencia** | Su vocabulario de tokens ya está adoptado. Los componentes exigen React + Radix. |
| `aniftyco/awesome-tailwindcss` | **Extraer dos ítems** | *Inclusive Colors* y `@tailwindcss/typography`. El resto no aplica. |
| `travisvn/awesome-claude-skills` | **Descartar para este proyecto** | Lista de enlaces. Sin skill de accesibilidad que sirva a RNF-1. |
| `Prat011/awesome-llm-skills` | **Descartar para este proyecto** | Misma naturaleza. |
| `saadeghi/daisyui` | **Descartar** | Ver justificación abajo. |

### Por qué se adopta ui-ux-pro-max

No es una colección de estilos para elegir a gusto: es una base consultable con
datos que se cruzan con nuestros requisitos.

- **192 paletas** con el mismo vocabulario de tokens que ya usa
  `src/styles/global.css` (`Background`/`Foreground`, `Muted`/`Muted Foreground`,
  `Primary`/`On Primary`, `Border`, `Ring`), y una columna de notas que registra
  ajustes hechos por WCAG.
- **Tres tipos de producto exactamente sobre el caso**: «Conference / Symposium
  Landing Page», «Research Lab / University Department» y «Academic Journal /
  Scholarly Publishing».
- **53 reglas específicas de Astro** con severidad. Una valida directamente
  RNF-2: *«Minimize client directives»*, severidad alta.
- **99 reglas de UX**, 11 de accesibilidad, con ejemplos de código correcto e
  incorrecto.

Instalado en `.claude/skills/ui-ux-pro-max/` (1,8 MB: datos, scripts y
referencias; se omiten el CLI, las capturas y las plantillas de otras
plataformas). Licencia MIT.

**Advertencia sobre el dataset.** La paleta académica declara
`Muted Foreground #64748B` sobre `Muted #E9EEF5`, que da **4,08:1** y por lo
tanto **no cumple** WCAG AA para texto normal. El dataset es un punto de partida
informado, no una autoridad: **la verificación con axe sigue siendo el árbitro**
(RNF-6). Toda pareja de color se mide antes de adoptarse.

### Por qué se descarta daisyUI

Tres razones, en orden de peso:

1. **Colisión de sistemas de diseño.** daisyUI trae su propio sistema de temas y
   sus propios nombres de token (`primary`, `base-100`, `base-content`) junto a
   clases semánticas (`btn`, `card`, `badge`). Conviviría con el sistema
   declarado en `@theme`, y quedarían dos sistemas compitiendo por el mismo
   propósito. El problema no es estético, es de mantenibilidad (RNF-5).
2. **Peso.** 2,7 MB sin empaquetar. Aunque Tailwind elimine lo no usado, el
   presupuesto de RNF-2 exige bajar de 241 kB a 180 kB; sumar un kit de
   componentes empuja en la dirección contraria.
3. **Registro visual.** Su valor es entregar componentes reconocibles y
   uniformes. Eso es exactamente lo contrario del encargo: una identidad propia
   para un seminario académico.

El argumento de «clases semánticas limpias sin saturar el HTML» es válido, pero
se resuelve sin dependencia: con `@layer components` en `global.css`, que ya se
usa (`.eyebrow`, `.surface`, `.hairline`).

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

**Tipografía: Crimson Pro (títulos, serif) + Atkinson Hyperlegible (texto).**
Dos motivos, y el segundo pesa más:

1. La actual, Space Grotesk + Inter, es el pairing por defecto del diseño
   generado por IA. No comunica nada sobre el seminario.
2. **Atkinson Hyperlegible fue diseñada por el Braille Institute para baja
   visión**, diferenciando formas de caracteres que suelen confundirse. Elegirla
   hace que la tipografía trabaje a favor de RNF-1 en lugar de ser neutral.

Se mantiene JetBrains Mono para metadatos técnicos (frecuencias, horarios,
código de proyecto), coherente con la materia.

**Patrón de página: «Hero + Agenda + CFP».** Confirma D1 (una sola página) y
sugiere elevar el programa a segundo bloque, por sobre la presentación.

## 3. Decisión abierta: fondo claro u oscuro

Es la única decisión que queda antes de implementar, y es sustantiva.

Las tres paletas académicas del dataset convergen en **fondo claro**: `#F8FAFC`
de fondo, `#0F172A` de texto (17,06:1), navy `#1E3A5F` como primario (11,5:1
sobre blanco) y dorado `#A16207` como acento (4,92:1). Es el registro
convencional de congresos y departamentos universitarios.

El sitio actual es oscuro, con acento cian, y lee más «instrumento de
laboratorio» que «congreso académico».

| | Claro institucional | Oscuro instrumento (actual) |
| --- | --- | --- |
| Registro | Congreso académico convencional | Laboratorio, producto técnico |
| Accesibilidad | Resuelve el contraste de raíz: 17:1 en texto | Exige rediseñar la escala de grises |
| Imprimible | Sí, sin ajustes | Requiere hoja de estilos aparte |
| Riesgo | Menos memorable | Puede leerse como fuera de tono |

Swiss Modernism admite ambos modos según el dataset, así que el estilo no obliga
a elegir. **Recomendación: claro institucional**, porque resuelve
estructuralmente la mayor parte de RNF-1 y porque el público es académico. La
figura de propagación se conserva, reinterpretada en trazo oscuro sobre fondo
claro.

**Esta decisión bloquea la escritura de `tasks.md`.**

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
navegación, aparición al hacer scroll, carga del mapa y selector de idioma.

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
