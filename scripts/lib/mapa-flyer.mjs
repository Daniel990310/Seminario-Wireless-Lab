/**
 * Mapa de lo que hay en un cartel, para que el .ai salga ordenado en capas y grupos.
 *
 * El PDF de Chromium no dice qué es cada cosa: Illustrator lo abre como trazados sueltos
 * dentro de grupos con máscara, sin nombres. Este mapa, medido sobre el mismo DOM y con las
 * mismas fuentes que el PDF, le dice a `scripts/illustrator/estructurar.jsx` qué caja ocupa
 * cada logo, retrato, QR, figura y párrafo. Se evalúa en la página (`page.evaluate`).
 *
 * Cajas en puntos PDF desde la esquina superior izquierda: `[x, y, ancho, alto]`. El PDF
 * mide 0,75 pt por píxel CSS (RF-29.3).
 */
export function mapaLienzo() {
  const PT = 0.75;
  const caja = (el) => {
    const r = el.getBoundingClientRect();
    return [r.left * PT, r.top * PT, r.width * PT, r.height * PT];
  };
  const recortar = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  const objetos = [];

  for (const el of document.querySelectorAll('[data-marca]')) {
    objetos.push({ tipo: 'logo', nombre: `Logo ${el.dataset.marca.toUpperCase()}`, caja: caja(el) });
  }
  for (const el of document.querySelectorAll('[data-logo-seminario]')) {
    objetos.push({ tipo: 'logo', nombre: 'Logo del seminario', caja: caja(el) });
  }
  for (const el of document.querySelectorAll('[data-flyer-qr]')) {
    objetos.push({ tipo: 'qr', nombre: 'QR de inscripción', caja: caja(el.querySelector('div') ?? el) });
  }
  const propio = '[data-marca],[data-logo-seminario],[data-flyer-qr]';
  for (const img of document.querySelectorAll('img')) {
    if (img.closest(propio)) continue;
    const ficha = img.closest('li') ?? img.parentElement;
    const nombre = img.hasAttribute('data-flyer-foto-sede')
      ? 'Foto de la sede'
      : `Retrato · ${(ficha?.innerText ?? '').trim().split('\n')[0] || 'sin nombre'}`;
    objetos.push({ tipo: 'foto', nombre: recortar(nombre, 48), caja: caja(img) });
  }
  for (const svg of document.querySelectorAll('svg')) {
    if (svg.closest(propio) || svg.parentElement?.closest('svg')) continue;
    const r = svg.getBoundingClientRect();
    if (r.width < 24 && r.height < 24) continue; // íconos: van con su texto
    objetos.push({ tipo: 'figura', nombre: svg.getAttribute('aria-label') || 'Figura', caja: caja(svg) });
  }

  /* Párrafos: el bloque más cercano de cada nodo de texto, con sus renglones contados. */
  const bloques = new Set();
  const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) {
    if (!n.textContent.trim() || n.parentElement.closest('svg')) continue;
    let el = n.parentElement;
    while (el.parentElement && getComputedStyle(el).display === 'inline') el = el.parentElement;
    bloques.add(el);
  }
  const textos = [...bloques].map((el) => {
    /*
     * Rectángulos de los nodos de texto, uno por renglón y nodo. Los del rango sobre el
     * elemento no sirven: incluyen la caja entera de cada hijo y con un `<br>` daban 1.
     * Un renglón es un tramo vertical: dos cuerpos distintos en la misma línea no lo duplican.
     */
    const rects = [];
    const hojas = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = hojas.nextNode(); t; t = hojas.nextNode()) {
      if (!t.textContent.trim()) continue;
      const rango = document.createRange();
      rango.selectNodeContents(t);
      rects.push(...[...rango.getClientRects()].filter((r) => r.width > 0));
    }
    rects.sort((a, b) => a.top - b.top);
    /*
     * El centro y no el borde: la caja de la letra puede ser más alta que el interlineado y
     * solaparse con la del renglón anterior (la mención de ANID, 1,25, contaba uno de cuatro).
     */
    let renglones = 0;
    let fondo = -Infinity;
    for (const r of rects) {
      if ((r.top + r.bottom) / 2 > fondo) {
        renglones++;
        fondo = r.bottom;
      } else fondo = Math.max(fondo, r.bottom);
    }
    const alinear = getComputedStyle(el).textAlign;
    return {
      tipo: 'texto',
      nombre: recortar(el.innerText.replace(/\s+/g, ' ').trim(), 40),
      caja: caja(el),
      /* Con `\n` donde hay un `<br>`: ahí el texto de área lleva fin de párrafo. */
      texto: el.innerText.trim(),
      renglones,
      alinear: alinear === 'center' ? 'centro' : alinear === 'right' || alinear === 'end' ? 'derecha' : 'izquierda',
    };
  });

  return [...objetos, ...textos];
}

/**
 * El mapa como TSV, una fila por objeto: `tipo nombre x y ancho alto renglones alinear
 * texto`. No JSON: ExtendScript es ES3, no trae `JSON` y leerlo exigiría `eval`. En
 * `texto`, `\n` es el corte forzado de un `<br>`.
 */
export function mapaATsv(mapa) {
  const campo = (v) => String(v ?? '').replace(/\t/g, ' ').replace(/\n/g, '\\n');
  return mapa
    .map((o) =>
      [o.tipo, o.nombre, ...o.caja.map((v) => v.toFixed(2)), o.renglones ?? 0, o.alinear ?? '', o.texto ?? '']
        .map(campo)
        .join('\t'),
    )
    .join('\n');
}
