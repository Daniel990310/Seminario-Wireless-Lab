// Lee y cambia los nameservers de un dominio en Hostinger.
//
// Existe por dos motivos que un `curl` suelto no cubre:
//
//   1. El token NO viaja por la línea de comandos ni por el chat. Se lee de
//      `.env.local`, que está en `.gitignore`. Un token en `argv` queda en el
//      historial del shell y en la lista de procesos.
//   2. La REVERSIÓN queda a un comando de distancia. Cambiar los nameservers es
//      la única operación de este despliegue que puede dejar el dominio sin
//      resolver, y el remedio hay que tenerlo escrito ANTES, no improvisado.
//
// El token de Hostinger hereda TODOS los permisos del usuario que lo crea —el VPS
// de Demeter incluido—. Se rota el mismo día. Ver `CLAUDE.md`.
//
// Uso:
//   node scripts/hostinger-nameservers.mjs leer bcsensing.org
//   node scripts/hostinger-nameservers.mjs poner bcsensing.org <ns1> <ns2> --confirmo
//
// Nameservers de reversión de bcsensing.org (parking de Hostinger, medidos el
// 2026-09-21 antes de tocar nada):
//   orbit.dns-parking.com  horizon.dns-parking.com

import { readFileSync } from 'node:fs';

const BASE = 'https://developers.hostinger.com';

function token() {
  let texto;
  try {
    texto = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  } catch {
    salir('No existe `.env.local`. Crear con: HOSTINGER_API_TOKEN=<token>');
  }
  const m = texto.match(/^\s*HOSTINGER_API_TOKEN\s*=\s*(.+)$/m);
  if (!m) salir('`.env.local` no define HOSTINGER_API_TOKEN.');
  const v = m[1].trim().replace(/^["']|["']$/g, '');
  if (!v) salir('HOSTINGER_API_TOKEN está vacío.');
  return v;
}

function salir(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

async function pedir(metodo, ruta, cuerpo) {
  const r = await fetch(BASE + ruta, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const texto = await r.text();
  let datos;
  try { datos = JSON.parse(texto); } catch { datos = texto; }
  // Nunca se imprime la cabecera de autorización, ni siquiera al fallar.
  if (!r.ok) salir(`HTTP ${r.status} en ${metodo} ${ruta}\n${JSON.stringify(datos, null, 2)}`);
  return datos;
}

const [accion, dominio, ...resto] = process.argv.slice(2);

if (!accion || !dominio) {
  salir('Uso: leer <dominio> | poner <dominio> <ns1> <ns2> --confirmo');
}

if (accion === 'leer') {
  const d = await pedir('GET', `/api/domains/v1/portfolio/${dominio}`);
  console.log(JSON.stringify(d, null, 2));
} else if (accion === 'poner') {
  const [ns1, ns2] = resto;
  if (!ns1 || !ns2) salir('Faltan ns1 y ns2.');
  if (!resto.includes('--confirmo')) {
    salir(
      `Operación destructiva sin confirmar.\n` +
      `  Dominio: ${dominio}\n` +
      `  Nuevos:  ${ns1} · ${ns2}\n` +
      `  Efecto:  el DNS actual deja de ser autoritativo. Si la zona destino no\n` +
      `           está lista, el dominio queda sin resolver hasta revertir.\n` +
      `Repetir con --confirmo.`
    );
  }
  const antes = await pedir('GET', `/api/domains/v1/portfolio/${dominio}`);
  console.log('Nameservers ANTES:', JSON.stringify(antes?.name_servers ?? antes?.nameservers ?? '(no informado)'));
  await pedir('PUT', `/api/domains/v1/portfolio/${dominio}/nameservers`, { ns1, ns2 });
  const despues = await pedir('GET', `/api/domains/v1/portfolio/${dominio}`);
  console.log('Nameservers DESPUÉS:', JSON.stringify(despues?.name_servers ?? despues?.nameservers ?? '(no informado)'));
  console.log('\nLa propagación no es inmediata. Comprobar con:');
  console.log(`  nslookup -type=NS ${dominio} 8.8.8.8`);
} else {
  salir(`Acción desconocida: ${accion}`);
}
