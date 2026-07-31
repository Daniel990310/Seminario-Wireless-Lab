/**
 * Corre los siete verificadores y resume.
 *
 * No es un `&&` encadenado: si el primero falla, un `&&` nunca llegaría a los
 * demás y parecería que no existen. Además el encadenado depende del shell, y
 * este proyecto se desarrolla desde entornos distintos —incluido Windows— donde
 * `&&` y `;` no se comportan igual. Aquí no hay shell: se lanzan procesos y se
 * suman resultados.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = fileURLToPath(new URL('.', import.meta.url));

const VERIFICADORES = [
  { guion: 'verify.mjs', nombre: 'Accesibilidad y peso', autoridad: true },
  { guion: 'verify-tema.mjs', nombre: 'Selector de tema (RF-4)' },
  { guion: 'verify-red.mjs', nombre: 'Red de colaboración (T3)' },
  { guion: 'verify-teclado.mjs', nombre: 'Semántica, foco y teclado (T6)' },
  { guion: 'verify-idioma.mjs', nombre: 'Sitio bilingüe (RF-1)' },
  { guion: 'verify-seo.mjs', nombre: 'SEO y metadatos (RNF-3)' },
  { guion: 'verify-interaccion.mjs', nombre: 'Componentes interactivos (RF-6)' },
];

const correr = (guion) =>
  new Promise((listo) => {
    const p = spawn(process.execPath, [AQUI + guion], { stdio: 'inherit' });
    p.on('close', (codigo) => listo(codigo ?? 1));
  });

const resultados = [];
for (const v of VERIFICADORES) {
  resultados.push({ ...v, codigo: await correr(v.guion) });
}

console.log('\n──────────────────────────────────────────────');
console.log('Resumen');
for (const r of resultados) {
  console.log(`  ${r.codigo === 0 ? '✓' : '✗'} ${r.nombre}`);
}

const fallidos = resultados.filter((r) => r.codigo !== 0);
if (fallidos.length === 0) {
  console.log('\nTodo en verde.\n');
  process.exit(0);
}

/*
 * Desde el 2026-07-30 no hay incumplimientos esperados: `verify` quedó en verde
 * al cerrarse RNF-1.3 y RNF-1.4. Cualquier fallo a partir de aquí es una
 * regresión, no un pendiente conocido, y hay que tratarlo como tal.
 */
console.log(
  `\n${fallidos.length} verificador(es) con incumplimientos. Revisar el detalle de arriba.`,
);
console.log(
  'Ya no hay incumplimientos esperados: esto es una regresión, no un pendiente.\n',
);
process.exit(1);
