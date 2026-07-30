/**
 * Comprobación de la red de colaboración (T3).
 *
 * `npm run verify` cubre accesibilidad y peso, pero no puede decir si el pulso del
 * haz realmente recorre el trayecto, si se detiene con `prefers-reduced-motion`, ni
 * si el navegador acabó pidiendo JavaScript. Eso se comprueba aquí.
 *
 * Uso: `npm run build && npm run verify:red`.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIST=fileURLToPath(new URL('../dist', import.meta.url));
const T={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const s=createServer(async(q,r)=>{let p=new URL(q.url,'http://x').pathname;if(p.endsWith('/'))p+='index.html';
 try{const b=await readFile(join(DIST,p));r.writeHead(200,{'content-type':T[extname(p)]??'text/plain'});r.end(b);}catch{r.writeHead(404).end();}});
await new Promise(ok=>s.listen(0,'127.0.0.1',ok));
const U=`http://127.0.0.1:${s.address().port}/`;
const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const res=[];
const chk=(n,ok,d='')=>res.push({n,ok,d});

/*
 * Movimiento reducido: el pulso no debe animarse, y la línea base debe seguir ahí.
 *
 * Solo se cuentan los pulsos REPRESENTADOS. El marcado lleva cinco —cuatro en la
 * retícula de escritorio y uno en el eje vertical de móvil— pero en cada ancho una
 * de las dos vistas está en `display: none`, y un elemento oculto no ejecuta
 * animaciones. Contar los cinco daba 4/5 y parecía un fallo donde no lo había.
 */
for (const modo of ['reduce','no-preference']) {
  const ctx=await br.newContext({viewport:{width:1440,height:900},reducedMotion:modo==='reduce'?'reduce':'no-preference'});
  const p=await ctx.newPage();
  await p.goto(U,{waitUntil:'load'});
  await p.locator('#red').scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  const d=await p.evaluate(()=>{
    const pulsos=[...document.querySelectorAll('#red .pulso')]
      .filter(x=>x.getClientRects().length);
    const base=[...document.querySelectorAll('#red path:not(.pulso)')]
      .filter(x=>x.getClientRects().length);
    return {
      pulsos:pulsos.length,
      animando:pulsos.filter(x=>x.getAnimations().length>0).length,
      pulsoVisible:pulsos.filter(x=>+getComputedStyle(x).opacity>0.01).length,
      lineasBase:base.length,
      baseVisible:base.filter(x=>+getComputedStyle(x).opacity>0.01).length,
    };
  });
  if(modo==='reduce'){
    chk('T3 · con movimiento reducido el pulso se detiene', d.animando===0 && d.pulsoVisible===0,
      `${d.pulsos} pulsos, ${d.animando} animando, ${d.pulsoVisible} visibles`);
    chk('T3 · la topología sigue visible sin animación', d.lineasBase>0 && d.baseVisible===d.lineasBase,
      `${d.baseVisible}/${d.lineasBase} líneas base visibles`);
  } else {
    chk('T3 · con movimiento permitido el pulso recorre', d.animando===d.pulsos && d.pulsos>0,
      `${d.animando}/${d.pulsos} pulsos animando`);
  }
  await ctx.close();
}

// En móvil manda el eje vertical, y también debe recorrer.
{
  const ctx=await br.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage();
  await p.goto(U,{waitUntil:'load'});
  await p.locator('#red').scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  const d=await p.evaluate(()=>{
    const v=[...document.querySelectorAll('#red .pulso')].filter(x=>x.getClientRects().length);
    return {vistos:v.length, animando:v.filter(x=>x.getAnimations().length>0).length};
  });
  chk('T3 · en movil el eje vertical recorre', d.vistos===1 && d.animando===1,
    `${d.animando}/${d.vistos} pulsos representados animando`);
  await ctx.close();
}

// El pulso avanza de verdad: se muestrea stroke-dashoffset.
{
  const ctx=await br.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  await p.goto(U,{waitUntil:'load'});
  await p.locator('#red').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  const leer=()=>p.evaluate(()=>getComputedStyle(document.querySelector('#red .pulso')).strokeDashoffset);
  const a=await leer(); await p.waitForTimeout(1200); const b=await leer();
  chk('T3 · el pulso avanza por el trayecto', a!==b, `dashoffset ${a} → ${b}`);
  await ctx.close();
}

// Cero JavaScript externo y ninguna isla hidratada.
{
  const ctx=await br.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const pedidos=[];
  p.on('request',r=>{ if(r.resourceType()==='script') pedidos.push(r.url()); });
  await p.goto(U,{waitUntil:'load'});
  await p.waitForTimeout(600);
  chk('T3 · el navegador no pide ningún .js', pedidos.length===0,
    pedidos.length?pedidos.join(', '):'0 peticiones de script');
  const islas=await p.evaluate(()=>document.querySelectorAll('astro-island').length);
  chk('T3 · ninguna isla que hidratar', islas===0, `${islas} astro-island`);
  await ctx.close();
}

await br.close(); s.close();
console.log('\nComprobación de T3\n');
let f=0;
for(const r of res){ if(!r.ok)f++; console.log(`  ${r.ok?'✓':'✗'} ${r.n.padEnd(48)} ${r.d}`); }
console.log(`\n${f===0?'TODOS LOS CRITERIOS CUMPLEN':`${f} CRITERIOS FALLAN`}\n`);
process.exit(f===0?0:1);
