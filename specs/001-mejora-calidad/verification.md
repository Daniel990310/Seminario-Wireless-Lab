# Verificación

Generado por `npm run verify`. **No editar a mano**: se sobrescribe en cada corrida.

**Fecha:** 2026-07-30 · **Commit:** `250200a`
**Resultado:** **presupuestos incumplidos**

Método: axe-core sobre el build servido localmente, en 1440×900 y 390×844,
con `prefers-reduced-motion: reduce` y **transiciones anuladas antes de medir**
(ver la nota metodológica de [la línea base](../baseline/auditoria-2026-07-29.md)).
Peso medido con gzip nivel 9 sobre `dist/` en **kB decimal (1 kB = 1000 bytes)**;
los woff2 se cuentan tal cual porque ya vienen comprimidos. La primera carga
excluye los logos, que son diferidos, y el mapa, que se pide a petición.

Nota: este script comprime con `zlib` de Node y la línea base usó `gzip -9` de
GNU. Las dos implementaciones difieren en torno al 0,3 %, así que una variación
de ese orden respecto de la línea base no indica un cambio real.

## Presupuestos

| Requisito | Comprobación | Línea base | Actual | Límite | Estado |
| --------- | ------------ | ---------- | ------ | ------ | ------ |
| RNF-1.1 | Hallazgos axe WCAG 2.1 AA | 16 | 32 | 0 | **incumple** |
| RNF-1.3 | Nodos con contraste indeterminado | 28 | 50 | 0 | **incumple** |
| RNF-1.4 | Secciones sin nombre accesible | 7 | 7 | 0 | **incumple** |
| RNF-1.5 | Saltos de nivel en encabezados | 0 | 0 | 0 | cumple |
| RNF-2.1 | JavaScript comprimido | 109.3 kB | 109.6 kB | 40.0 kB | **incumple** |
| RNF-2.2 | Primera carga comprimida | 241.2 kB | 243.4 kB | 180.0 kB | **incumple** |
| RNF-2.6 | Tipografías | 110.9 kB | 110.9 kB | 125.0 kB | cumple |

En RNF-1.1 y RNF-1.3 la columna «Actual» **suma todas las corridas**, mientras que
la línea base se midió solo en escritorio. Para compararlas de igual a igual, ver
el desglose por corrida más abajo.

## Desglose de peso

| Recurso | Comprimido |
| ------- | ---------- |
| JavaScript | 109.6 kB |
| Tipografías | 110.9 kB |
| HTML | 13.3 kB |
| CSS | 9.4 kB |
| Imágenes SVG | 3.3 kB |
| **Primera carga** | **243.4 kB** |

## Por corrida

Los totales de la tabla anterior suman todas las corridas. Este desglose evita
leer un total como si fuera un valor por pantalla.

| Pantalla / tema | Hallazgos | Indeterminados |
| --------------- | --------- | -------------- |
| escritorio / light | 16 | 28 |
| movil / light | 16 | 22 |

## Cobertura

| Dato | Valor |
| ---- | ----- |
| Páginas auditadas | `/` |
| Corridas | 2 |
| Temas distinguibles | no — RF-4 pendiente |
| Secciones | 7 |
| Encabezados | 24 |
| Idioma declarado | `es` |

## Nodos indeterminados

axe no pudo calcular el contraste en **50** nodos. Ocurre
cuando el texto se superpone a un fondo no uniforme. **No son aprobaciones**:
RNF-1.3 exige resolverlos, midiendo un ratio que cumpla o eliminando la
superposición.
