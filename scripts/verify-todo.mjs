/**
 * Corre los tres verificadores y resume.
 *
 * No es un `&&` encadenado por dos razones. La primera: `npm run verify` termina
 * con código 1 de forma legítima mientras RNF-1.3 y RNF-1.4 sigan abiertos (los
 * cierran T5 y T6), así que un `&&` nunca llegaría a los otros dos y parecería que
 * no existen. La segunda: el encadenado depende del shell, y este proyecto se
 * desarrolla desde entornos distintos —incluido Windows— donde `&&` y `;` no se
 * comportan igual. Aquí no hay shell: se lanzan procesos y se suman resultados.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = fileURLToPath(new URL('.', import.meta.url));

const VERIFICADORES = [
  { guion: 'verify.mjs', nombre: 'Accesibilidad y peso', autoridad: true },
  { guion: 'verify-tema.mjs', nombre: 'Selector de tema (RF-4)' },
  { guion: 'verify-red.mjs', nombre: 'Red de colaboración (T3)' },
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
 * Se distingue el verificador de autoridad de los complementarios: mientras T5 y
 * T6 estén abiertas, `verify` va a fallar y eso es lo esperado. Un fallo en los
 * otros dos, en cambio, sí es una regresión.
 */
console.log(
  `\n${fallidos.length} verificador(es) con incumplimientos. Revisar el detalle de arriba.`,
);
console.log(
  'Recordatorio: RNF-1.3 y RNF-1.4 siguen abiertos por diseño hasta T5 y T6.\n',
);
process.exit(1);
