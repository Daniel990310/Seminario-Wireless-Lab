/**
 * Mide qué fracción de píxeles cambió entre dos PNG del mismo tamaño.
 *
 * `abrir-flyer.ps1` lo usa para comprobar que ordenar el .ai en capas no movió nada: compara
 * el lienzo recién importado con el ya ordenado, los dos exportados por Illustrator. Un
 * píxel cuenta como cambiado si algún canal difiere en más de 48 de 255; por debajo es
 * suavizado de bordes. Usa `sharp`, que el sitio ya necesita para sus imágenes.
 *
 * Uso: node scripts/illustrator/comparar-png.mjs antes.png despues.png
 * Imprime `cambio=<porcentaje>%`.
 */
import sharp from 'sharp';

const [a, b] = await Promise.all(
  process.argv.slice(2, 4).map((ruta) => sharp(ruta).removeAlpha().raw().toBuffer({ resolveWithObject: true })),
);
if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
  console.log(`cambio=100% (tamaños ${a.info.width}×${a.info.height} y ${b.info.width}×${b.info.height})`);
  process.exit(0);
}
let cambiados = 0;
for (let i = 0; i < a.data.length; i += 3) {
  if (Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2])) > 48) {
    cambiados++;
  }
}
console.log(`cambio=${((cambiados / (a.data.length / 3)) * 100).toFixed(2)}%`);
